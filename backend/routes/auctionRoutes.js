const express = require("express");

const router = express.Router();


// Import auction controller functions
const {
    createAuction,
    getAuctions,
    getAuctionById
} = require("../controllers/auctionController");


// ========================================
// CREATE AUCTION
// ========================================

router.post(
    "/",
    createAuction
);


// ========================================
// GET ALL AUCTIONS
// ========================================

router.get(
    "/",
    getAuctions
);


// ========================================
// GET SINGLE AUCTION
// ========================================

router.get(
    "/:id",
    getAuctionById
);


module.exports = router;