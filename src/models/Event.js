const pool = require('../config/db');

class Event {
  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM events ORDER BY date ASC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM events WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(eventData) {
    const { title, description, date, time, venue, createdBy } = eventData;
    const [result] = await pool.execute(
      'INSERT INTO events (title, description, date, time, venue, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, date, time, venue, createdBy]
    );
    return result.insertId;
  }

  static async update(id, eventData) {
    const { title, description, date, time, venue } = eventData;
    await pool.execute(
      'UPDATE events SET title = ?, description = ?, date = ?, time = ?, venue = ? WHERE id = ?',
      [title, description, date, time, venue, id]
    );
  }

  static async delete(id) {
    await pool.execute('DELETE FROM events WHERE id = ?', [id]);
  }
}

module.exports = Event;