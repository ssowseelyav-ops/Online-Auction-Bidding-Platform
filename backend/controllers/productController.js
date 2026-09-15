const db = require("../config/database");


// ========================================
// CREATE PRODUCT
// ========================================

const createProduct = (req, res) => {

    const {
        seller_id,
        name,
        category,
        description,
        product_condition,
        image_url
    } = req.body;


    // Check required fields
    if (!seller_id || !name) {

        return res.status(400).json({
            message: "Seller ID and product name are required"
        });

    }


    const query = `
        INSERT INTO products
        (
            seller_id,
            name,
            category,
            description,
            product_condition,
            image_url
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;


    db.query(
        query,
        [
            seller_id,
            name,
            category || null,
            description || null,
            product_condition || null,
            image_url || null
        ],
        (err, result) => {

            if (err) {

                console.error(
                    "Product creation error:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to create product"
                });

            }


            return res.status(201).json({

                message: "Product created successfully",

                productId: result.insertId

            });

        }
    );
};


// ========================================
// GET ALL PRODUCTS
// ========================================

const getProducts = (req, res) => {

    const query = `
        SELECT
            p.product_id,
            p.seller_id,
            p.name,
            p.category,
            p.description,
            p.product_condition,
            p.image_url,
            p.created_at,
            u.name AS seller_name
        FROM products p
        JOIN users u
            ON p.seller_id = u.user_id
        ORDER BY p.created_at DESC
    `;


    db.query(
        query,
        (err, results) => {

            if (err) {

                console.error(
                    "Get products error:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to fetch products"
                });

            }


            return res.status(200).json({
                products: results
            });

        }
    );
};


module.exports = {
    createProduct,
    getProducts
};