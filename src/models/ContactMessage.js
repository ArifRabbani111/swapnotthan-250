const pool = require('../config/db');

class ContactMessage {
  static async create(messageData) {
    const { name, email, phone, subject, message } = messageData;
    const [result] = await pool.execute(
      'INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)',
      [name, email, phone, message]
    );
    return result.insertId;
  }

  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM contact_messages ORDER BY created_at DESC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM contact_messages WHERE id = ?', [id]);
    return rows[0];
  }
}

module.exports = ContactMessage;