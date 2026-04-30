import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Contoh endpoint untuk testing integrasi nanti
app.get("/api/status", (req, res) => {
  res.json({ message: "Backend Tech Hire Intelligence Siap!" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
