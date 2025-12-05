import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../api/axiosClient";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function SkillDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem("sf_user"));
  const [skill, setSkill] = useState(null);
  const [progress, setProgress] = useState("");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await client.get(`/api/skills/${user.id}`);
        const thisSkill = res.data.find(s => s._id === id);
        if (!thisSkill) return nav("/");
        setSkill(thisSkill);
        setProgress(thisSkill.progress || 0);
      } catch (err) {
        console.error(err);
      }
    })();
    loadStats();
  }, [id]);

  const loadStats = async () => {
    try {
      const res = await client.get(`/api/skills/stats/${user.id}`);
      setStats(res.data);
    } catch (err) { console.error(err); }
  };

  const saveProgress = async (e) => {
    e.preventDefault();
    try {
      await client.put(`/api/skills/${id}`, {
        progress: Number(progress),
        date: new Date().toISOString()
      });
      const res = await client.get(`/api/skills/${user.id}`);
      setSkill(res.data.find(s => s._id === id));
      loadStats();
    } catch (err) {
      console.error(err);
    }
  };

  if (!skill) return <div style={{ padding: 20 }}>Loading...</div>;

  const labels = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const weeklyCounts = labels.map(l => (stats?.weekly?.[l] || 0));

  return (
    <div style={{ padding: 20 }}>
      <h2>{skill.skillName}</h2>
      <p>Progress: {skill.progress}%</p>
      <p>Streak: {skill.streak || 0} day(s)</p>

      <form onSubmit={saveProgress} style={{ maxWidth: 420 }}>
        <label>Update progress (0-100)</label>
        <input type="number" value={progress} min="0" max="100" onChange={e=>setProgress(e.target.value)} />
        <button type="submit">Save Practice</button>
      </form>

      <h3 style={{ marginTop: 24 }}>Weekly Activity</h3>
      <div style={{ maxWidth: 600 }}>
        <Bar data={{ labels, datasets: [{ label: "Practices per day", data: weeklyCounts, backgroundColor: "#6a5af9" }] }} />
      </div>
    </div>
  );
}
