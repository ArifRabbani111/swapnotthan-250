const pool = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  static async create(userData) {
    try {
      const { name, email, phone, password, userType } = userData;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const [result] = await pool.execute(
        'INSERT INTO users (name, email, phone, password, user_type) VALUES (?, ?, ?, ?, ?)',
        [name, email, phone, hashedPassword, userType]
      );
      
      return result.insertId;
    } catch (error) {
      console.error('Error in User.create:', error);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      console.error('Error in User.findByEmail:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Error in User.findById:', error);
      throw error;
    }
  }

  static async comparePassword(password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      console.error('Error in User.comparePassword:', error);
      throw error;
    }
  }
}

module.exports = User;