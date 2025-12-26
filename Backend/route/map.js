import express from "express";
import axios from "axios";
import 'dotenv/config';

const router = express.Router();
console.log("Google Maps Key:", process.env.GOOGLE_MAPS_KEY);
router.get("/reverse-geocode", async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: "Lat/Lng required" });
  }

  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          latlng: `${lat},${lng}`,
          key: process.env.GOOGLE_MAPS_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Google Maps Error:", error.message);
    res.status(500).json({ message: "Failed to fetch address" });
  }
});

export default router;
