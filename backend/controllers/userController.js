const bcrypt = require("bcrypt");
const db = require("../config/database");


// ========================================
// REGISTER USER
// ========================================

const registerUser = async (req, res) => {
    try {

        const {
            name,
            email,
            password,
            phone,
            role
        } = req.body;


        // Check required fields
        if (!name || !email || !password || !role) {

            return res.status(400).json({
                message: "Please fill all required fields"
            });

        }


        // Check if email already exists
        const checkQuery =
            "SELECT * FROM users WHERE email = ?";


        db.query(
            checkQuery,
            [email],
            async (err, results) => {

                if (err) {

                    console.error(
                        "Database error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Database error"
                    });

                }


                // Email already registered
                if (results.length > 0) {

                    return res.status(409).json({
                        message:
                            "Email already registered"
                    });

                }


                // Hash password
                const hashedPassword =
                    await bcrypt.hash(password, 10);


                // Insert user
                const insertQuery = `
                    INSERT INTO users
                    (name, email, password, phone, role)
                    VALUES (?, ?, ?, ?, ?)
                `;


                db.query(
                    insertQuery,
                    [
                        name,
                        email,
                        hashedPassword,
                        phone || null,
                        role
                    ],
                    (err, result) => {

                        if (err) {

                            console.error(
                                "Insert error:",
                                err
                            );

                            return res.status(500).json({
                                message:
                                    "Failed to create account"
                            });

                        }


                        return res.status(201).json({

                            message:
                                "Account created successfully",

                            userId:
                                result.insertId

                        });

                    }
                );

            }
        );

    }
    catch (error) {

        console.error(
            "Register error:",
            error
        );

        return res.status(500).json({
            message: "Server error"
        });

    }
};



// ========================================
// LOGIN USER
// ========================================

const loginUser = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // Check required fields
        if (!email || !password) {

            return res.status(400).json({
                message:
                    "Email and password are required"
            });

        }


        // Find user
        const query =
            "SELECT * FROM users WHERE email = ?";


        db.query(
            query,
            [email],
            async (err, results) => {

                if (err) {

                    console.error(
                        "Database error:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Database error"
                    });

                }


                // User not found
                if (results.length === 0) {

                    return res.status(401).json({
                        message:
                            "Invalid email or password"
                    });

                }


                const user = results[0];


                // Compare password
                const passwordMatch =
                    await bcrypt.compare(
                        password,
                        user.password
                    );


                if (!passwordMatch) {

                    return res.status(401).json({
                        message:
                            "Invalid email or password"
                    });

                }


                // Login successful
                return res.status(200).json({

                    message:
                        "Login successful",

                    user: {

                        userId:
                            user.user_id,

                        name:
                            user.name,

                        email:
                            user.email,

                        role:
                            user.role

                    }

                });

            }
        );

    }
    catch (error) {

        console.error(
            "Login error:",
            error
        );

        return res.status(500).json({
            message: "Server error"
        });

    }

};



// ========================================
// EXPORT FUNCTIONS
// ========================================

module.exports = {
    registerUser,
    loginUser
};