// controllers/profileController.js

const EntrepreneurProfile = require("../models/EntrepreneurProfile");
const InvestorProfile = require("../models/InvestorProfile");

const getProfile = async (req, res) => {
  const { userId, role } = req.params;

  try {
    const profile =
      role === "entrepreneur"
        ? await EntrepreneurProfile.findOne({ where: { userId } })
        : await InvestorProfile.findOne({ where: { userId } });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to retrieve profile" });
  }
};

const updateProfile = async (req, res) => {
  const { userId, role } = req.params;
  const updateData = req.body;

  try {
    const model =
      role === "entrepreneur" ? EntrepreneurProfile : InvestorProfile;

    const [updated] = await model.update(updateData, {
      where: { userId },
    });

    if (!updated) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const updatedProfile = await model.findOne({ where: { userId } });
    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
