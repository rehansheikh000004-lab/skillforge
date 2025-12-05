import { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import client from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function SkillProgress() {
  const { user } = useContext(AuthContext);
  const [skillName,setSkillName] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await client.post("/api/skills", { skillName, userId: user.id });
      nav("/");
    } catch (err) {
      console.error(err);
      alert("Error adding skill");
    }
  };

  return (
    <div className="center-box">
      <h2>Add New Skill</h2>
      <form onSubmit={submit}>
        <input placeholder="Skill name" value={skillName} onChange={e=>setSkillName(e.target.value)} />
        <button>Add Skill</button>
      </form>
    </div>
  );
}
