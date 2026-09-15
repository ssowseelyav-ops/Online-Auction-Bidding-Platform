const express = require("express");
const cors = require("cors");

const db = require("./config/database");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");


const app = express();

const PORT = 5000;


// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());

app.use(express.json());


// ========================================
// HOME ROUTE
// ========================================

app.get("/", (req, res) => {

    res.send(
        "BIDVAULT Backend is running 🚀"
    );

});


// ========================================
// USER ROUTES
// ========================================

app.use(
    "/api/users",
    userRoutes
);


// ========================================
// PRODUCT ROUTES
// ========================================

app.use(
    "/api/products",
    productRoutes
);


// ========================================
// DATABASE TEST ROUTE
// ========================================

app.get("/test-db", (req, res) => {

    db.query(
        "SELECT 1 AS result",
        (err, results) => {

            if (err) {

                console.error(
                    "Database test failed:",
                    err.message
                );

                return res.status(500).json({

                    message:
                        "Database connection failed"

                });

            }


            res.json({

                message:
                    "Database connected successfully!",

                data:
                    results

            });

        }
    );

});


// ========================================
// START SERVER
// ========================================

app.listen(
    PORT,
    () => {

        console.log(
            `Server running at http://localhost:${PORT}`
        );

    }
);