```javascript
const API_BASE_URL = "http://localhost:5000";

function normalizeRole(role) {
    return String(role || "").trim().toUpperCase();
}

function getStoredUser() {
    try {
        var raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        console.error("Failed to read stored user:", error);
        return null;
    }
}

function saveStoredUser(userPayload) {
    var user = userPayload && userPayload.user ? userPayload.user : userPayload || {};
    var normalizedUser = {
        userId: user.userId || user.user_id || user.id || null,
        name: user.name || "",
        email: user.email || "",
        role: normalizeRole(user.role),
        phone: user.phone || ""
    };

    localStorage.setItem("user", JSON.stringify(normalizedUser));

    if (normalizedUser.userId) {
        localStorage.setItem("userId", normalizedUser.userId);
    }
    if (normalizedUser.name) {
        localStorage.setItem("userName", normalizedUser.name);
    }
    if (normalizedUser.email) {
        localStorage.setItem("userEmail", normalizedUser.email);
    }
    if (normalizedUser.role) {
        localStorage.setItem("userRole", normalizedUser.role);
    }

    return normalizedUser;
}

function showMessage(element, type, text) {
    if (!element) return;
    element.className = "message" + (type ? " " + type : "");
    element.textContent = text;
}

function setButtonLoading(button, loading, label) {
    if (!button) return;
    button.disabled = loading;
    button.textContent = loading ? label : button.dataset.defaultLabel || label;
}

function updateTimer() {
    var timer = document.getElementById("heroTimer");
    if (!timer) return;

    var targetSeconds = 2 * 60 * 60 + 34 * 60 + 15;
    var remaining = Number(timer.dataset.remaining || targetSeconds);

    if (remaining <= 0) {
        timer.textContent = "00:00:00";
        return;
    }

    remaining -= 1;
    timer.dataset.remaining = String(remaining);

    var hours = Math.floor(remaining / 3600);
    var minutes = Math.floor((remaining % 3600) / 60);
    var seconds = remaining % 60;

    timer.textContent = [hours, minutes, seconds].map(function (value) {
        return String(value).padStart(2, "0");
    }).join(":");
}

async function fetchAuctions(limit) {
    var response = await fetch(API_BASE_URL + "/api/auctions");
    var data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch auctions");
    }

    var auctions = Array.isArray(data.auctions) ? data.auctions : [];
    return typeof limit === "number" ? auctions.slice(0, limit) : auctions;
}

function renderAuctionCards(auctions, containerId) {
    var container = document.getElementById(containerId || "auctionGrid");
    if (!container) return;

    container.innerHTML = "";

    if (!auctions.length) {
        container.innerHTML = '<div class="empty-state">No live auctions available right now.</div>';
        return;
    }

    auctions.forEach(function (auction) {
        var card = document.createElement("div");
        card.className = "auction-card";
        card.innerHTML = '<div class="card-image"><span class="live-badge"><span class="live-dot"></span> LIVE</span><div class="product-emoji">📦</div></div>' +
            '<div class="card-content"><span class="category">' + ((auction.category || "OTHER").toUpperCase()) + '</span>' +
            '<h3>' + (auction.product_name || "Auction Item") + '</h3>' +
            '<div class="card-bottom"><div><small>Current Bid</small><strong>₹' + Number(auction.current_price || auction.starting_price || 0).toLocaleString("en-IN") + '</strong></div>' +
            '<div class="time">Live</div></div>' +
            '<a href="auction-details.html?id=' + auction.auction_id + '" class="card-btn">View Auction →</a></div>';
        container.appendChild(card);
    });
}

if (document.getElementById("heroTimer")) {
    setInterval(updateTimer, 1000);
}

if (document.querySelector("#auctionGrid") && !window.__auctionsLoaded) {
    window.__auctionsLoaded = true;
    fetchAuctions(3)
        .then(function (auctions) {
            renderAuctionCards(auctions, "auctionGrid");
        })
        .catch(function (error) {
            console.error("Featured auctions failed:", error);
        });
}

if (window.location.pathname.indexOf("login.html") !== -1) {
    var loginForm = document.getElementById("loginForm");
    var message = document.getElementById("message");
    var loginButton = document.getElementById("loginButton");

    if (loginForm && message && loginButton) {
        loginButton.dataset.defaultLabel = "Login";
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            var email = document.getElementById("email").value.trim();
            var password = document.getElementById("password").value;

            if (!email || !password) {
                showMessage(message, "error", "Please enter both email and password.");
                return;
            }

            showMessage(message, "", "");
            setButtonLoading(loginButton, true, "Logging in...");

            try {
                var response = await fetch(API_BASE_URL + "/api/users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: email, password: password })
                });

                var data = await response.json();

                if (!response.ok) {
                    showMessage(message, "error", data.message || "Login failed.");
                    setButtonLoading(loginButton, false, "Login");
                    return;
                }

                var user = saveStoredUser(data.user || data);
                showMessage(message, "success", "Login successful!");

                setTimeout(function () {
                    var role = normalizeRole(user.role);
                    window.location.href = role === "SELLER" ? "seller-dashboard.html" : "buyer-dashboard.html";
                }, 700);
            } catch (error) {
                console.error("Login error:", error);
                showMessage(message, "error", "Cannot connect to the backend. Please make sure the server is running.");
                setButtonLoading(loginButton, false, "Login");
            }
        });
    }
}

if (window.location.pathname.indexOf("register.html") !== -1) {
    var registerForm = document.getElementById("registerForm");
    var registerButton = document.getElementById("registerButton");

    if (registerForm && registerButton) {
        registerButton.dataset.defaultLabel = "Create BIDVAULT Account →";
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            var name = document.getElementById("name").value.trim();
            var email = document.getElementById("email").value.trim();
            var phone = document.getElementById("phone").value.trim();
            var password = document.getElementById("password").value;
            var confirmPassword = document.getElementById("confirmPassword").value;
            var role = document.querySelector('input[name="role"]:checked') ? document.querySelector('input[name="role"]:checked').value : "BUYER";
            var terms = document.getElementById("terms");

            if (!name || !email || !password || !phone) {
                alert("Please fill in all required fields.");
                return;
            }
            if (password.length < 6) {
                alert("Password must be at least 6 characters long.");
                return;
            }
            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }
            if (!terms.checked) {
                alert("Please accept the terms and conditions.");
                return;
            }

            setButtonLoading(registerButton, true, "Creating Account...");

            try {
                var response = await fetch(API_BASE_URL + "/api/users/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: name, email: email, password: password, phone: phone, role: role })
                });

                var data = await response.json();
                if (!response.ok) {
                    alert(data.message || "Registration failed.");
                    setButtonLoading(registerButton, false, "Create BIDVAULT Account →");
                    return;
                }

                saveStoredUser({
                    userId: data.userId,
                    name: name,
                    email: email,
                    phone: phone,
                    role: role
                });

                alert("Account created successfully! 🎉");
                var redirectRole = normalizeRole(role);
                window.location.href = redirectRole === "SELLER" ? "seller-dashboard.html" : "buyer-dashboard.html";
            } catch (error) {
                console.error("Registration error:", error);
                alert("Cannot connect to the backend. Please make sure the server is running.");
                setButtonLoading(registerButton, false, "Create BIDVAULT Account →");
            }
        });
    }
}

if (window.location.pathname.indexOf("add-product.html") !== -1) {
    var storedUser = getStoredUser();
    var userRole = normalizeRole(storedUser && storedUser.role ? storedUser.role : localStorage.getItem("userRole"));
    var sellerId = storedUser && storedUser.userId ? storedUser.userId : localStorage.getItem("userId");

    if (!sellerId || userRole !== "SELLER") {
        alert("Please login as a seller first.");
        window.location.href = "login.html";
    }
}

if (window.location.pathname.indexOf("seller-dashboard.html") !== -1) {
    var dashboardUser = getStoredUser();
    var savedName = dashboardUser && dashboardUser.name ? dashboardUser.name : localStorage.getItem("userName") || "User";
    var savedRole = normalizeRole(dashboardUser && dashboardUser.role ? dashboardUser.role : localStorage.getItem("userRole"));
    var savedUserId = dashboardUser && dashboardUser.userId ? dashboardUser.userId : localStorage.getItem("userId");

    if (!savedUserId || savedRole !== "SELLER") {
        window.location.href = "login.html";
    }

    var userNameElement = document.getElementById("userName");
    var navUserNameElement = document.getElementById("navUserName");
    var navAvatarElement = document.getElementById("navAvatar");

    if (userNameElement) userNameElement.textContent = savedName;
    if (navUserNameElement) navUserNameElement.textContent = savedName;
    if (navAvatarElement) navAvatarElement.textContent = savedName.charAt(0).toUpperCase();

    var logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (event) {
            event.preventDefault();
            localStorage.removeItem("user");
            localStorage.removeItem("userId");
            localStorage.removeItem("userName");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userRole");
            window.location.href = "login.html";
        });
    }
}

if (window.location.pathname.indexOf("buyer-dashboard.html") !== -1) {
    var storedBuyer = getStoredUser();
    var buyerName = storedBuyer && storedBuyer.name ? storedBuyer.name : localStorage.getItem("userName") || "User";
    var buyerNameElement = document.getElementById("userName");
    var buyerNavNameElement = document.getElementById("navUserName");
    var buyerAvatarElement = document.getElementById("navAvatar");

    if (buyerNameElement) buyerNameElement.textContent = buyerName;
    if (buyerNavNameElement) buyerNavNameElement.textContent = buyerName;
    if (buyerAvatarElement) buyerAvatarElement.textContent = buyerName.charAt(0).toUpperCase();
}
```
