const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  }),
);
app.use(express.json());

/* -----------------------------
MongoDB Connection
----------------------------- */

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

mongoose.connection.on("connected", () => {
  console.log("MongoDB Connected successfully");
});

/* -----------------------------
Schema
----------------------------- */

const slotSchema = new mongoose.Schema({
  slotId: Number,
  status: String,
  updatedAt: Date,
});

const Slot = mongoose.model("Slot", slotSchema);

app.get("/", (req, res) => {
  res.send("Parking Server Running");
});

/* -----------------------------
Update Slot (ESP32 sends here)
----------------------------- */

app.post("/update-slot", async (req, res) => {
  try {
    const { slotId, status } = req.body;

    if (slotId === undefined || !status) {
      return res.status(400).json({ error: "Invalid data" });
    }

    await Slot.findOneAndUpdate(
      { slotId },
      {
        status,
        updatedAt: new Date(),
      },
      { upsert: true },
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* -----------------------------
Get Slots (React dashboard)
----------------------------- */

app.get("/slots", async (req, res) => {
  const slots = (await Slot.find()).sort({ slotId: 1 });
  res.json(slots);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
