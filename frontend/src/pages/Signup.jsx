import { useState } from "react";
import client from "../api/axiosClient";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [username,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [msg,setMsg] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await client.post("/api/auth/signup", { username, email, password });
      nav("/login");
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="auth-page">
      <h2>Signup</h2>
      <form onSubmit={submit}>
        <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button>Create Account</button>
        <p style={{color:"salmon"}}>{msg}</p>
      </form>
      <p style={{textAlign:"center", marginTop:12}}>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
