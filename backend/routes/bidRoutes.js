const express = require("express");

const router = express.Router();

const {
    placeBid,
    getBidsByAuction
} = require("../controllers/bidController");

// PLACE A BID
router.post(
    "/",
    placeBid
);

// GET ALL BIDS FOR AN AUCTION
router.get(
    "/auction/:auctionId",
    getBidsByAuction
);

module.exports = router;