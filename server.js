const express = require("express");
const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const Url = require("./models/Url");

const app = express();

app.use(express.json());
app.use(express.static("public"));

/* MongoDB connection */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err.message));

/* Generate short URL */
app.post("/api/generate", async (req, res) => {
  try {
    const { longUrl, custom } = req.body;
    if (!longUrl) {
      return res.status(400).json({ error: "Long URL required" });
    }

    const shortId = custom && custom.trim() !== ""
      ? custom.trim()
      : nanoid(6);

    const exists = await Url.findOne({ shortId });
    if (exists) {
      return res.status(400).json({ error: "Short URL already exists" });
    }

    const url = await Url.create({ longUrl, shortId });

    res.json({
      shortUrl: `${req.protocol}://${req.get("host")}/${url.shortId}`
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* Redirect */
app.get("/:id", async (req, res) => {
  try {
    const url = await Url.findOne({ shortId: req.params.id });
    if (!url) return res.status(404).send("URL not found");

    url.clicks++;
    await url.save();

    res.redirect(url.longUrl);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
