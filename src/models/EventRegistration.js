const pool = require('../config/db');

class EventRegistration {
  static async create(registrationData) {
    const { eventId, userId } = registrationData;
    const [result] = await pool.execute(
      'INSERT INTO event_registrations (event_id, user_id) VALUES (?, ?)',
      [eventId, userId]
    );
    return result.insertId;
  }

  static async findByEventAndUser(eventId, userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM event_registrations WHERE event_id = ? AND user_id = ?',
      [eventId, userId]
    );
    return rows[0];
  }

  static async findByEvent(eventId) {
    const [rows] = await pool.execute(
      'SELECT er.*, u.name, u.email, u.phone FROM event_registrations er JOIN users u ON er.user_id = u.id WHERE er.event_id = ?',
      [eventId]
    );
    return rows;
  }
}

module.exports = EventRegistration;