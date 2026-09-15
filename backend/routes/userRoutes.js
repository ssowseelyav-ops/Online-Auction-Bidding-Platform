const express = require("express");

const router = express.Router();


// Import controller functions
const {
    registerUser,
    loginUser
} = require("../controllers/userController");



// ========================================
// REGISTER ROUTE
// ========================================

router.post(
    "/register",
    registerUser
);



// ========================================
// LOGIN ROUTE
// ========================================

router.post(
    "/login",
    loginUser
);



// ========================================
// EXPORT ROUTER
// ========================================

module.exports = router;