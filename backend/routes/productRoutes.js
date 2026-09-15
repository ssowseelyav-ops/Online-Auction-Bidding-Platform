const express = require("express");

const router = express.Router();


// Import product controller functions
const {
    createProduct,
    getProducts
} = require("../controllers/productController");


// ========================================
// CREATE PRODUCT
// ========================================

router.post(
    "/",
    createProduct
);


// ========================================
// GET ALL PRODUCTS
// ========================================

router.get(
    "/",
    getProducts
);


// ========================================
// EXPORT ROUTER
// ========================================

module.exports = router;