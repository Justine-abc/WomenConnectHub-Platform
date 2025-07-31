// controllers/userController.js
const User = require("../models/User");

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const [updated] = await User.update(req.body, { where: { id: req.user.id } });
    if (!updated) return res.status(404).json({ error: "Update failed" });
    const user = await User.findByPk(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUserProfile, updateUserProfile };