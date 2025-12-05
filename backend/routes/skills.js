import express from "express";
import Skill from "../models/Skill.js";

const router = express.Router();

// Create skill
router.post("/", async (req, res) => {
  try {
    const { userId, skillName } = req.body;
    if (!userId || !skillName) return res.status(400).json({ message: "Missing fields" });
    const skill = await Skill.create({ userId, skillName });
    res.json(skill);
  } catch (err) {
    console.error("Create skill error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get skills for user
router.get("/:userId", async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(skills);
  } catch (err) {
    console.error("Get skills error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update skill progress + streak handling
router.put("/:id", async (req, res) => {
  try {
    const { progress, date } = req.body;
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    if (typeof progress === "number") skill.progress = progress;

    const now = date ? new Date(date) : new Date();
    if (!skill.lastPractice) {
      skill.streak = 1;
    } else {
      const last = new Date(skill.lastPractice);
      // compare dates by day
      const lastMid = new Date(last.getFullYear(), last.getMonth(), last.getDate());
      const nowMid = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const diffDays = Math.round((nowMid - lastMid) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) skill.streak = (skill.streak || 0) + 1;
      else if (diffDays === 0) { /* same day: do nothing */ }
      else skill.streak = 1;
    }
    skill.lastPractice = now;

    await skill.save();
    res.json(skill);
  } catch (err) {
    console.error("Update skill error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Stats for analytics
router.get("/stats/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const skills = await Skill.find({ userId });

    const totalSkills = skills.length;
    const avgProgress = skills.length ? Math.round(skills.reduce((s,k)=>s+k.progress,0)/skills.length) : 0;
    const topSkills = skills.sort((a,b)=>b.progress-a.progress).slice(0,5);

    const weekDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const weekly = {};
    skills.forEach(s => {
      if (s.lastPractice) {
        const d = new Date(s.lastPractice);
        const day = weekDays[d.getDay()];
        weekly[day] = (weekly[day] || 0) + 1;
      }
    });

    res.json({ totalSkills, avgProgress, topSkills, weekly });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
