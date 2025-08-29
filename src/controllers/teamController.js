const TeamMember = require('../models/TeamMember');
const User = require('../models/User');

exports.getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.getAll();
    res.json({ success: true, teamMembers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTeamMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const teamMember = await TeamMember.findById(id);
    
    if (!teamMember) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    
    res.json({ success: true, teamMember });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTeamMember = async (req, res) => {
  try {
    const { name, email, phone, position, facebookUrl, linkedinUrl } = req.body;
    
    // Create user first
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(Math.random().toString(36).substring(7), 10);
    
    const userId = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      userType: 'team_member'
    });
    
    // Then create team member
    const teamMemberId = await TeamMember.create({
      userId,
      position,
      facebookUrl,
      linkedinUrl
    });
    
    const teamMember = await TeamMember.findById(userId);
    res.status(201).json({ success: true, teamMember });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { position, facebookUrl, linkedinUrl, imageUrl } = req.body;
    
    const teamMember = await TeamMember.findById(id);
    if (!teamMember) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    
    await TeamMember.update(id, { position, facebookUrl, linkedinUrl, imageUrl });
    const updatedTeamMember = await TeamMember.findById(id);
    
    res.json({ success: true, teamMember: updatedTeamMember });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    
    const teamMember = await TeamMember.findById(id);
    if (!teamMember) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    
    await TeamMember.delete(id);
    res.json({ success: true, message: 'Team member deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};