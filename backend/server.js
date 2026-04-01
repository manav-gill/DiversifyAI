const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const healthRoutes = require("./routes/healthRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { startDailyPriceUpdate } = require("./jobs/cronJobs");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api", healthRoutes);

const startServer = async () => {
  try {
    await connectDB();
    
    // Start cron jobs
    startDailyPriceUpdate();

    app.listen(PORT, '0.0.0.0', () => {
      console.log("Server running on port " + PORT + " (Network: 0.0.0.0)");
    });
  } catch (error) {
    console.error("Server startup error: " + error.message);
    process.exit(1);
  }
};

startServer();
