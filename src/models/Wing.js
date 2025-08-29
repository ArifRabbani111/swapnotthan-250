const pool = require('../config/db');

class Wing {
  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM wings');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM wings WHERE id = ?', [id]);
    return rows[0];
  }

  static async getWingMembers(wingId) {
    const [rows] = await pool.execute(
      `SELECT u.id, u.name, u.email, wm.role, tm.image_url, tm.facebook_url, tm.linkedin_url 
       FROM wing_members wm 
       JOIN users u ON wm.user_id = u.id 
       LEFT JOIN team_members tm ON u.id = tm.user_id 
       WHERE wm.wing_id = ?`,
      [wingId]
    );
    return rows;
  }
}

module.exports = Wing;