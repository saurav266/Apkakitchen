import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/reverse", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ message: "Latitude & Longitude required" });
  }

  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          lat,
          lon,
          format: "json",
          addressdetails: 1,
        },
        headers: {
          // REQUIRED by OpenStreetMap
          "User-Agent": "CheckoutApp/1.0 (support@yourdomain.com)",
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Reverse geocode error:", err.message);
    res.status(500).json({ message: "Failed to fetch address" });
  }
});

export default router;
