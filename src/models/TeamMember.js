const pool = require('../config/db');

class TeamMember {
  static async getAll() {
    const [rows] = await pool.execute(
      `SELECT u.id, u.name, tm.position, tm.facebook_url, tm.linkedin_url 
       FROM team_members tm 
       JOIN users u ON tm.user_id = u.id 
       ORDER BY tm.id`
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT u.id, u.name, u.email, u.phone, tm.position, tm.facebook_url, tm.linkedin_url 
       FROM team_members tm 
       JOIN users u ON tm.user_id = u.id 
       WHERE u.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async create(teamMemberData) {
    const { userId, position, facebookUrl, linkedinUrl } = teamMemberData;
    const [result] = await pool.execute(
      'INSERT INTO team_members (user_id, position, facebook_url, linkedin_url) VALUES (?, ?, ?, ?)',
      [userId, position, facebookUrl, linkedinUrl]
    );
    return result.insertId;
  }

  static async update(id, teamMemberData) {
    const { position, facebookUrl, linkedinUrl } = teamMemberData;
    await pool.execute(
      'UPDATE team_members SET position = ?, facebook_url = ?, linkedin_url = ? WHERE user_id = ?',
      [position, facebookUrl, linkedinUrl, id]
    );
  }

  static async delete(id) {
    await pool.execute('DELETE FROM team_members WHERE user_id = ?', [id]);
  }
}

module.exports = TeamMember;