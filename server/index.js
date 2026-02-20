const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

/* ===============================
   🎯 ROLE-BASED SKILL DATABASE
================================= */

const roleDatabase = {
  "Software Developer": {
    technical: [
      "JavaScript", "React", "Node", "MongoDB",
      "SQL", "Data Structures", "Algorithms",
      "Git", "API", "Express"
    ],
    soft: [
      "Problem Solving", "Communication",
      "Teamwork", "Leadership",
      "Adaptability", "Time Management"
    ]
  },

  "Data Scientist": {
    technical: [
      "Python", "Machine Learning",
      "Deep Learning", "Statistics",
      "Pandas", "NumPy", "SQL",
      "Data Analysis"
    ],
    soft: [
      "Critical Thinking",
      "Analytical Skills",
      "Communication",
      "Presentation",
      "Problem Solving"
    ]
  },

  "Management": {
    technical: [
      "Project Management",
      "Strategic Planning",
      "Budgeting",
      "Operations",
      "Business Analysis"
    ],
    soft: [
      "Leadership",
      "Decision Making",
      "Conflict Resolution",
      "Communication",
      "Team Management",
      "Negotiation"
    ]
  },

  "Teacher": {
    technical: [
      "Curriculum Planning",
      "Lesson Planning",
      "Classroom Management",
      "Assessment",
      "Educational Technology"
    ],
    soft: [
      "Patience",
      "Communication",
      "Empathy",
      "Creativity",
      "Adaptability",
      "Public Speaking"
    ]
  }
};

/* ===============================
   📌 UPLOAD ROUTE
================================= */

app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const role = req.body.role;

    if (!req.file) {
      return res.status(400).json({ error: "No file received" });
    }

    if (!role || !roleDatabase[role]) {
      return res.status(400).json({ error: "Invalid role selected" });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text.toLowerCase();

    const roleData = roleDatabase[role];

    /* ===============================
       🔍 SKILL DETECTION
    ================================= */

    const detectedTechnical = roleData.technical.filter(skill =>
      resumeText.includes(skill.toLowerCase())
    );

    const detectedSoft = roleData.soft.filter(skill =>
      resumeText.includes(skill.toLowerCase())
    );

    const missingTechnical = roleData.technical.filter(skill =>
      !detectedTechnical.includes(skill)
    );

    const missingSoft = roleData.soft.filter(skill =>
      !detectedSoft.includes(skill)
    );

    /* ===============================
       🧮 WEIGHTED ATS SCORING
    ================================= */

    const technicalWeight = 0.6;
    const softWeight = 0.3;
    const sectionWeight = 0.1;

    const technicalScore =
      (detectedTechnical.length / roleData.technical.length) * 100;

    const softScore =
      (detectedSoft.length / roleData.soft.length) * 100;

    const hasProjects = resumeText.includes("project");
    const hasExperience = resumeText.includes("experience");
    const hasEducation = resumeText.includes("education");

    const sectionScore =
      (hasProjects + hasExperience + hasEducation) / 3 * 100;

    const baseScore = Math.round(
      technicalScore * technicalWeight +
      softScore * softWeight +
      sectionScore * sectionWeight
    );

    /* ===============================
       🔎 ADVANCED INTELLIGENCE
    ================================= */

    // Achievement detection (numbers like 20%, 5x, etc.)
    const numberMatches = resumeText.match(/\d+%|\d+\+?|\d+x/gi);
    const achievementScore = numberMatches
      ? Math.min(numberMatches.length * 5, 15)
      : 0;

    // Experience detection (2 years, 3+ years, etc.)
    const experienceMatch = resumeText.match(/\d+\+?\s?(years|year)/gi);
    const experienceScore = experienceMatch ? 10 : 0;

    // Leadership detection
    const leadershipKeywords = [
      "led", "managed", "mentored",
      "supervised", "coordinated",
      "initiated", "directed"
    ];

    const detectedLeadership = leadershipKeywords.filter(word =>
      resumeText.includes(word)
    );

    const leadershipScore =
      detectedLeadership.length > 0 ? 10 : 0;

    // Action verb strength
    const strongVerbs = [
      "developed", "designed", "implemented",
      "optimized", "improved", "engineered",
      "analyzed", "created"
    ];

    const actionVerbMatches = strongVerbs.filter(word =>
      resumeText.includes(word)
    );

    const actionScore =
      actionVerbMatches.length > 3 ? 5 : 0;

    // Final Enhanced Score
    const enhancedScore = Math.min(
      baseScore +
        achievementScore +
        experienceScore +
        leadershipScore +
        actionScore,
      100
    );

    /* ===============================
       📈 SUGGESTIONS
    ================================= */

    let suggestions = [];

    if (technicalScore < 50)
      suggestions.push("Add more role-specific technical skills.");

    if (softScore < 50)
      suggestions.push("Highlight leadership and soft skills more clearly.");

    if (!hasProjects)
      suggestions.push("Include a strong Projects section.");

    if (!hasExperience)
      suggestions.push("Add measurable work experience.");

    if (!hasEducation)
      suggestions.push("Mention academic background clearly.");

    if (resumeText.length < 1500)
      suggestions.push("Resume content is short. Add more detailed achievements.");

    if (achievementScore === 0)
      suggestions.push("Include measurable achievements (%, numbers, impact).");

    if (leadershipScore === 0)
      suggestions.push("Highlight leadership or management experience.");

    /* ===============================
       🚀 RESPONSE
    ================================= */

    res.json({
      success: true,
      role,
      atsScore: enhancedScore,
      breakdown: {
        technicalScore: Math.round(technicalScore),
        softScore: Math.round(softScore),
        sectionScore: Math.round(sectionScore)
      },
      advancedMetrics: {
        achievementScore,
        experienceScore,
        leadershipScore,
        actionScore
      },
      detectedTechnical,
      detectedSoft,
      missingTechnical,
      missingSoft,
      suggestions
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});