const db = require("../config/database");

// PLACE A BID
const placeBid = (req, res) => {
    const {
        auction_id,
        bidder_id,
        bid_amount
    } = req.body;

    // Validate input
    if (!auction_id || !bidder_id || !bid_amount) {
        return res.status(400).json({
            message: "Please provide auction_id, bidder_id and bid_amount"
        });
    }

    // Get auction details
    const auctionQuery = `
        SELECT
            auction_id,
            current_price,
            starting_price,
            start_time,
            end_time,
            status
        FROM auctions
        WHERE auction_id = ?
    `;

    db.query(auctionQuery, [auction_id], (err, results) => {

        if (err) {
            console.error("Auction lookup error:", err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Auction not found"
            });
        }

        const auction = results[0];

        // Check auction status
        if (auction.status !== "active") {
            return res.status(400).json({
                message: "Auction is not active"
            });
        }

        // Check bid amount
        if (Number(bid_amount) <= Number(auction.current_price)) {
            return res.status(400).json({
                message: "Bid must be higher than current price"
            });
        }

        // Store bid
        const insertBidQuery = `
            INSERT INTO bids
            (
                auction_id,
                bidder_id,
                bid_amount
            )
            VALUES (?, ?, ?)
        `;

        db.query(
            insertBidQuery,
            [auction_id, bidder_id, bid_amount],
            (err, result) => {

                if (err) {
                    console.error("Bid creation error:", err);
                    return res.status(500).json({
                        message: "Failed to place bid"
                    });
                }

                // Update auction current price
                const updateAuctionQuery = `
                    UPDATE auctions
                    SET current_price = ?
                    WHERE auction_id = ?
                `;

                db.query(
                    updateAuctionQuery,
                    [bid_amount, auction_id],
                    (err) => {

                        if (err) {
                            console.error("Auction price update error:", err);
                            return res.status(500).json({
                                message: "Bid saved but price update failed"
                            });
                        }

                        return res.status(201).json({
                            message: "Bid placed successfully",
                            bidId: result.insertId,
                            currentPrice: bid_amount
                        });
                    }
                );
            }
        );
    });
};


// GET BIDS FOR AN AUCTION
const getBidsByAuction = (req, res) => {

    const auctionId = req.params.auctionId;

    const query = `
        SELECT
            b.bid_id,
            b.auction_id,
            b.bidder_id,
            u.name AS bidder_name,
            b.bid_amount,
            b.bid_time
        FROM bids b
        JOIN users u
            ON b.bidder_id = u.user_id
        WHERE b.auction_id = ?
        ORDER BY b.bid_amount DESC
    `;

    db.query(query, [auctionId], (err, results) => {

        if (err) {
            console.error("Get bids error:", err);
            return res.status(500).json({
                message: "Failed to fetch bids"
            });
        }

        return res.status(200).json({
            bids: results
        });
    });
};


module.exports = {
    placeBid,
    getBidsByAuction
};