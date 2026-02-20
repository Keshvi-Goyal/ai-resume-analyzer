const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const atsScore = Math.min(
  Math.round((detectedSkills.length / skillDatabase.length) * 100),
  100
);
const skillDatabase = [
  "JavaScript",
  "React",
  "Node",
  "Python",
  "C++",
  "Java",
  "SQL",
  "MongoDB",
  "HTML",
  "CSS",
  "Machine Learning",
  "Data Structures",
  "Git",
  "Express"
];

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    console.log("REQ.FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "No file received" });
    }

    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);

    console.log("File read successfully");

    const pdfData = await pdfParse(dataBuffer);

    console.log("PDF parsed successfully");

    const resumeText = pdfData.text;
    const detectedSkills = skillDatabase.filter(skill =>
  resumeText.toLowerCase().includes(skill.toLowerCase())
   );

   res.json({
  success: true,
  message: "Resume analyzed successfully",
  atsScore,
  skills: detectedSkills,
  totalSkillsFound: detectedSkills.length
});
   

  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});