const pool = require('../config/db');

exports.createDonation = async (req, res) => {
    try {
        const { name, email, phone, amount, bkashNumber, transactionId, purpose } = req.body;
        
        // Check if transaction ID already exists
        const [existingDonation] = await pool.execute(
            'SELECT id FROM donations WHERE transaction_id = ?',
            [transactionId]
        );
        
        if (existingDonation.length > 0) {
            return res.status(400).json({ success: false, message: 'Transaction ID already used' });
        }
        
        // Check if user exists, if not create a new user
        let userId = null;
        if (email) {
            const [existingUser] = await pool.execute(
                'SELECT id FROM users WHERE email = ? OR phone = ?',
                [email, phone]
            );
            
            if (existingUser.length > 0) {
                userId = existingUser[0].id;
            } else {
                // Create new user
                const bcrypt = require('bcrypt');
                const hashedPassword = await bcrypt.hash(Math.random().toString(36).substring(7), 10);
                
                const [result] = await pool.execute(
                    'INSERT INTO users (name, email, phone, password, user_type) VALUES (?, ?, ?, ?, ?)',
                    [name, email, phone, hashedPassword, 'donor']
                );
                userId = result.insertId;
            }
        }
        
        // Insert donation
        const [result] = await pool.execute(
            'INSERT INTO donations (donor_id, amount, bkash_number, transaction_id, donation_purpose) VALUES (?, ?, ?, ?, ?)',
            [userId, amount, bkashNumber, transactionId, purpose]
        );
        
        res.status(201).json({ 
            success: true, 
            message: 'Donation recorded successfully',
            donationId: result.insertId
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};