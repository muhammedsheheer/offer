require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // 🔓 Allow all origins (for testing)
app.use(bodyParser.json());

// Route to receive location
app.post("/api/location", async (req, res) => {
	const { latitude, longitude } = req.body;
	const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	const mailOptions = {
		from: `"Location Tracker" <${process.env.EMAIL_USER}>`,
		to: process.env.RECEIVER_EMAIL,
		subject: "📍 New Location Captured",
		html: `
      <h2>New User Location</h2>
      <p><b>Latitude:</b> ${latitude}</p>
      <p><b>Longitude:</b> ${longitude}</p>
      <p><a href="${mapsLink}" target="_blank">🗺 View on Google Maps</a></p>
    `,
	};

	try {
		await transporter.sendMail(mailOptions);
		console.log("✅ Email sent");
		res.sendStatus(200);
	} catch (error) {
		console.error("❌ Failed to send email:", error);
		res.sendStatus(500);
	}
});

app.listen(PORT, () => {
	console.log(`🚀 Server running at http://localhost:${PORT}`);
});
