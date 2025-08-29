const Wing = require('../models/Wing');

exports.getAllWings = async (req, res) => {
  try {
    const wings = await Wing.getAll();
    res.json({ success: true, wings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getWingById = async (req, res) => {
  try {
    const { id } = req.params;
    const wing = await Wing.findById(id);
    
    if (!wing) {
      return res.status(404).json({ success: false, message: 'Wing not found' });
    }
    
    // Get wing members
    const members = await Wing.getWingMembers(id);
    
    // Add wing-specific activities
    let activities = [];
    if (wing.name === 'Blood Wing') {
      activities = [
        'Organizing blood donation camps',
        'Maintaining a database of voluntary donors',
        'Providing emergency blood supply to hospitals',
        'Raising awareness about blood donation'
      ];
    } else if (wing.name === 'Education Wing') {
      activities = [
        'Providing school supplies to underprivileged students',
        'Organizing after-school tutoring programs',
        'Offering scholarships to deserving students',
        'Setting up libraries in rural areas'
      ];
    } else if (wing.name === 'Charity Wing') {
      activities = [
        'Conducting clothing drives',
        'Providing relief during natural disasters',
        'Distributing food packages to families in need',
        'Organizing winter clothing distribution campaigns'
      ];
    }
    
    res.json({ success: true, wing: { ...wing, activities }, members });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};