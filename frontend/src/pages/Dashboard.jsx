import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import client from "../api/axiosClient";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    (async () => {
      if (!user) return;
      try {
        const res = await client.get(`/api/skills/${user.id}`);
        setSkills(res.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [user]);

  if (!user) return (<div className="center-box"><p>Please login</p></div>);

  return (
    <div style={{ padding: 20 }}>
      <div className="topbar">
        <h2>Hello, {user.username}</h2>
        <div>
          <Link to="/skill-progress"><button style={{marginRight:8}}>Add Skill</button></Link>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        {skills.length === 0 ? <p>No skills yet — add one!</p> : (
          skills.map(s => (
            <div className="skill-card" key={s._id}>
              <h3>{s.skillName}</h3>
              <p>Progress: {s.progress}%</p>
              <p>Streak: {s.streak || 0} days</p>
              <Link to={`/skill/${s._id}`}><button>Open</button></Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
