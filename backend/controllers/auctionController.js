const db = require("../config/database");

// ========================================
// CREATE AUCTION
// ========================================

const createAuction = (req, res) => {

    const {
        product_id,
        seller_id,
        starting_price,
        start_time,
        end_time
    } = req.body;

    // Check required fields
    if (
        !product_id ||
        !seller_id ||
        !starting_price ||
        !start_time ||
        !end_time
    ) {
        return res.status(400).json({
            message: "Please fill all required fields"
        });
    }

    // Check that the product belongs to the seller
    const productQuery = `
        SELECT product_id
        FROM products
        WHERE product_id = ?
        AND seller_id = ?
    `;

    db.query(
        productQuery,
        [product_id, seller_id],
        (err, results) => {

            if (err) {
                console.error(
                    "Product verification error:",
                    err
                );

                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (results.length === 0) {
                return res.status(400).json({
                    message:
                        "Product does not belong to this seller"
                });
            }

            // Create auction
            const auctionQuery = `
                INSERT INTO auctions
                (
                    product_id,
                    seller_id,
                    starting_price,
                    current_price,
                    start_time,
                    end_time,
                    status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            db.query(
                auctionQuery,
                [
                    product_id,
                    seller_id,
                    starting_price,
                    starting_price,
                    start_time,
                    end_time,
                    "upcoming"
                ],
                (err, result) => {

                    if (err) {
                        console.error(
                            "Auction creation error:",
                            err
                        );

                        return res.status(500).json({
                            message:
                                "Failed to create auction"
                        });
                    }

                    return res.status(201).json({

                        message:
                            "Auction created successfully",

                        auctionId:
                            result.insertId

                    });

                }
            );

        }
    );
};


// ========================================
// GET ALL AUCTIONS
// ========================================

const getAuctions = (req, res) => {

    const query = `
        SELECT
            a.auction_id,
            a.product_id,
            a.seller_id,
            p.name AS product_name,
            p.category,
            p.description,
            p.image_url,
            a.starting_price,
            a.current_price,
            a.start_time,
            a.end_time,
            a.status,
            u.name AS seller_name
        FROM auctions a

        JOIN products p
            ON a.product_id = p.product_id

        JOIN users u
            ON a.seller_id = u.user_id

        ORDER BY a.created_at DESC
    `;

    db.query(
        query,
        (err, results) => {

            if (err) {
                console.error(
                    "Get auctions error:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Failed to fetch auctions"
                });
            }

            return res.status(200).json({
                auctions: results
            });

        }
    );
};


// ========================================
// GET SINGLE AUCTION
// ========================================

const getAuctionById = (req, res) => {

    const auctionId = req.params.id;

    const query = `
        SELECT
            a.auction_id,
            a.product_id,
            a.seller_id,
            p.name AS product_name,
            p.category,
            p.description,
            p.product_condition,
            p.image_url,
            a.starting_price,
            a.current_price,
            a.start_time,
            a.end_time,
            a.status,
            u.name AS seller_name
        FROM auctions a

        JOIN products p
            ON a.product_id = p.product_id

        JOIN users u
            ON a.seller_id = u.user_id

        WHERE a.auction_id = ?
    `;

    db.query(
        query,
        [auctionId],
        (err, results) => {

            if (err) {
                console.error(
                    "Get auction error:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Failed to fetch auction"
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message:
                        "Auction not found"
                });
            }

            return res.status(200).json({
                auction: results[0]
            });

        }
    );
};


// ========================================
// EXPORT
// ========================================

module.exports = {
    createAuction,
    getAuctions,
    getAuctionById
};