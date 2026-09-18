```javascript
/* =========================
   BIDVAULT FRONTEND SCRIPT
========================= */


// ========================================
// SIMPLE COUNTDOWN TIMER
// ========================================

let remainingTime = 2 * 60 * 60 + 34 * 60 + 15;

function updateTimer() {

    if (remainingTime <= 0) {
        return;
    }

    remainingTime--;

    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;

    const formatted =
        String(hours).padStart(2, "0") + ":" +
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");

    const timer = document.getElementById("heroTimer");

    if (timer) {
        timer.textContent = formatted;
    }
}


// ========================================
// LOGIN
// ========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const message = document.getElementById("message");
        const loginButton = document.getElementById("loginButton");

        message.className = "message";
        message.textContent = "";

        loginButton.disabled = true;
        loginButton.textContent = "Logging in...";

        try {

            const response = await fetch(
                "http://localhost:5000/api/users/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                message.className = "message error";
                message.textContent =
                    data.message || "Login failed.";

                return;
            }


            // Save logged-in user information
            localStorage.setItem(
                "user",
                JSON.stringify(data)
            );


            message.className = "message success";
            message.textContent = "Login successful!";


            // Redirect based on role
            setTimeout(function () {

                if (data.role === "seller") {

                    window.location.href = "seller-dashboard.html";

                } else {

                    window.location.href = "buyer-dashboard.html";

                }

            }, 800);


        } catch (error) {

            console.error("Login error:", error);

            message.className = "message error";
            message.textContent =
                "Cannot connect to backend. Make sure the backend is running.";

        } finally {

            loginButton.disabled = false;
            loginButton.textContent = "Login";
        }

    });

}
```
