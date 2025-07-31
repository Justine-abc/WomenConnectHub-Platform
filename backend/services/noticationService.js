// services/notificationService.js

const axios = require("axios");

const sendSMS = async (phoneNumber, message) => {
  try {
    // Replace with your actual SMS API provider logic (e.g., Twilio, Africa's Talking, etc.)
    const smsProviderUrl = process.env.SMS_API_URL;

    const response = await axios.post(smsProviderUrl, {
      to: phoneNumber,
      message,
      sender: "WomenConnect",
    }, {
      headers: {
        Authorization: `Bearer ${process.env.SMS_API_KEY}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("SMS send error:", error.response?.data || error.message);
    throw new Error("Failed to send SMS notification");
  }
};

const notifyProjectApproval = async (email, name) => {
  const subject = "Your Project is Approved!";
  const text = `Hi ${name},\n\nYour project has been approved and is now live on WomenConnect Hub.\n\nThank you for participating!`;
  return require("./gemailService").sendMail({ to: email, subject, text });
};

module.exports = {
  sendSMS,
  notifyProjectApproval,
};
