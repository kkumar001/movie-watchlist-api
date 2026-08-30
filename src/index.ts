import express from "express";
import "dotenv/config";
import movieRoutes from "./routes/movieRoutes"
import { disconnect } from "../prisma/db";

const app = express();
app.use(express.json());

app.use('/movies', movieRoutes);

app.get("/", (req, res) => {
  res.send("Express + TypeScript server is running!");
});

const port = process.env.PORT || 4000;
const server = app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`);
});

process.on("unhandledRejection", async (reason) => {
  console.error("Unhandled rejection:", reason);
  server.close(async () => {
    await disconnect();
    process.exit(1);
  });
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  server.close(async () => {
    await disconnect();
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received");
  server.close(async () => {
    await disconnect();
    process.exit(0);
  });
});