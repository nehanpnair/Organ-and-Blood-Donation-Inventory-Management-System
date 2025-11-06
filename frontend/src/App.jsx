import React, { useState, useEffect } from 'react';
import RBCCanvas from './components/RBCCanvas';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

function showMessage(setMsg, text, type) {
  setMsg({ text, type, fadeOut: false });
  setTimeout(() => setMsg((prev) => ({ ...prev, fadeOut: true })), 2000);
  setTimeout(() => setMsg({ text: "", type: "", fadeOut: false }), 2800);
}


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function useApi(path, opts) {
  const base = '/api';
  return fetch(base + path, opts)
    .then(async (r) => {
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        const errorMsg =
          data.error ||
          data.message ||
          `Request failed: ${r.status} ${r.statusText}`;
        throw new Error(errorMsg);
      }

      return data;
    })
    .catch((err) => {return { error: `Unable to connect to the server. ${err.message || ''}` };});
}


function Banner() {
  return (
    <header className="app-banner">
      <div className="banner-content">
        <i className="fa-solid fa-heart-pulse"></i>
        <span>Blood and Organ Donation Inventory Management System</span>
      </div>
    </header>
  );
}


function Nav({ setView, activeView }) {
  const tabs = [
    { name: 'Dashboard', icon: 'fa-solid fa-house' },
    { name: 'Add Donor', icon: 'fa-solid fa-user-plus' },
    { name: 'View Donors', icon: 'fa-solid fa-users' },
    { name: 'Add Recipient', icon: 'fa-solid fa-hospital-user' },
    { name: 'Add Donation', icon: 'fa-solid fa-droplet' },
    { name: 'Pending Requests', icon: 'fa-solid fa-clipboard-list' },
    { name: 'Inventory', icon: 'fa-solid fa-box-archive' },
    { name: 'Fulfill Request', icon: 'fa-solid fa-check-circle' },
    { name: 'Add Staff', icon: 'fa-solid fa-user-tie' },
    { name: 'View Staff', icon: 'fa-solid fa-id-card' },
  ];

  return (
    <nav className="nav-glass">
      {tabs.map((t) => (
        <button
          key={t.name}
          onClick={() => setView(t.name)}
          className={`nav-btn ${activeView === t.name ? 'active' : ''}`}
        >
          <i className={t.icon}></i>
          <span>{t.name}</span>
        </button>
      ))}
    </nav>
  );
}


function Dashboard({ onLogin, user, setView }) {
  const [form, setForm] = React.useState({ username: '', password: '' });
  const [error, setError] = React.useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    const res = await useApi('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.error) {
      setError(res.error);
    } else if (res.user) {
      onLogin(res.user);
    } else {
      setError('Unexpected response from server.');
    }
  }

  return (
    <div className="dashboard-bg">
      <RBCCanvas className="rbc-bg" width="100vw" height="100vh" density={25} />

      {!user ? (
        <div className="login-card">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <i className="fa-solid fa-user icon"></i>
              <input
                name="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="Username"
                required
              />
            </div>

            <div className="input-group">
              <i className="fa-solid fa-lock icon"></i>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Password"
                required
              />
            </div>

            {error && <p className="error">{error}</p>}
            <button type="submit" className="login-btn">Login</button>
          </form>
        </div>
      ) : (
        <div className="welcome-card">
          <h1>Welcome back, {user.Full_Name}!</h1>
          <p className="subtitle">Here’s what you can do next:</p>

          <div className="quick-actions">
            <button className="quick-btn" onClick={() => setView('Add Donor')}>
              <i className="fa-solid fa-user-plus"></i>
              <span>Add Donor</span>
            </button>

            <button className="quick-btn" onClick={() => setView('View Donors')}>
              <i className="fa-solid fa-users"></i>
              <span>View Donors</span>
            </button>

            <button className="quick-btn" onClick={() => setView('Add Donation')}>
              <i className="fa-solid fa-droplet"></i>
              <span>Add Donation</span>
            </button>

            <button className="quick-btn" onClick={() => setView('Inventory')}>
              <i className="fa-solid fa-box-archive"></i>
              <span>Inventory</span>
            </button>

            <button className="quick-btn" onClick={() => setView('Add Staff')}>
            <i className="fa-solid fa-user-tie"></i>
            <span>Add Staff</span>
          </button>

          </div>

          <p className="motivation">
            Every drop counts — your work saves lives.
          </p>
        </div>
      )}
    </div>
  );
}

function Carousel() {
  const slides = [
    { icon: 'fa-solid fa-droplet', text: 'Every 2 seconds, someone needs blood.' },
    { icon: 'fa-solid fa-heart-pulse', text: 'Organ donation can save up to 8 lives.' },
    { icon: 'fa-solid fa-people-group', text: 'Over 1,000 donors registered this month.' },
    { icon: 'fa-solid fa-hand-holding-medical', text: 'Your donation makes a difference.' },
    { icon: 'fa-solid fa-globe', text: 'Join a global community of donors.' },
    { icon: 'fa-solid fa-award', text: 'Become a hero — donate today!' },
    { icon: 'fa-solid fa-seedling', text: 'Your organ donation can give someone a second chance at life.' },
  ];
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel">
      <i className={slides[index].icon}></i>
      <p>{slides[index].text}</p>
    </div>
  );
}


function AddDonor() {
  const [form, setForm] = useState({
    full_name: "",
    gender: "",
    dob: "",
    contact: "",
    email: "",
    medical: "",
    organ: false,
    blood_group: "",
    address: "",
  });

  const [msg, setMsg] = useState({ text: "", type: "" }); 
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const clearForm = () => {
    setForm({
      full_name: "",
      gender: "",
      dob: "",
      contact: "",
      email: "",
      medical: "",
      organ: false,
      blood_group: "",
      address: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: "", type: "" });
    setLoading(true);

    try {
      const res = await fetch("/api/donors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: data.message || "Donor added successfully!", type: "success" });
        clearForm();
        setTimeout(() => setMsg((prev) => ({ ...prev, fadeOut: true })), 2500);
        setTimeout(() => setMsg({ text: "", type: "", fadeOut: false }), 3100);

      } else {
        setMsg({ text: data.error || "Failed to add donor.", type: "error" });
        setTimeout(() => setMsg((prev) => ({ ...prev, fadeOut: true })), 2500);
        setTimeout(() => setMsg({ text: "", type: "", fadeOut: false }), 3100);
      }
    } catch (err) {
      setMsg({ text: "Server error. Please try again.", type: "error" });
      setTimeout(() => setMsg((prev) => ({ ...prev, fadeOut: true })), 2500);
      setTimeout(() => setMsg({ text: "", type: "", fadeOut: false }), 3100);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content form-container">
      <div className="carousel-section">
        <Carousel />
      </div>

      <div className="form-section">
        <h2 className="form-title">
          <i className="fa-solid fa-user-plus"></i> Add Donor
        </h2>

        <form className="donor-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />

          <div className="inline-inputs">
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
            />
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="">Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <select
            name="blood_group"
            value={form.blood_group}
            onChange={handleChange}
            required
          >
            <option value="">Blood Group</option>
            <option>A+</option><option>A-</option>
            <option>B+</option><option>B-</option>
            <option>AB+</option><option>AB-</option>
            <option>O+</option><option>O-</option>
          </select>

          <input
            type="text"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="Contact Number"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
          />

          <textarea
            name="medical"
            value={form.medical}
            onChange={handleChange}
            placeholder="Medical History"
          ></textarea>

          <div className="checkbox-row">
            <label>
              <input
                type="checkbox"
                name="organ"
                checked={form.organ}
                onChange={handleChange}
              />
              Eligible for Organ Donation
            </label>
          </div>

          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
          ></textarea>

          {msg.text && (
            <div className={`msg-box ${msg.type} ${msg.fadeOut ? "hidden" : ""}`}>
              {msg.text}
            </div>
          )}

          <div className="form-buttons">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Adding..." : "Add Donor"}
            </button>
            <button
              type="button"
              className="clear-btn"
              onClick={clearForm}
              disabled={loading}
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


function ViewDonors() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const res = await useApi("/donors");
    setRows(res.data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page-content">
      <div className="section-header">
        <h2 className="section-title">
          <i className="fa-solid fa-users"></i> Donors
        </h2>
        <button
          onClick={load}
          className="reload-btn"
          disabled={loading}
          title="Reload donor list"
        >
          <i className="fa-solid fa-rotate"></i>
          <span>{loading ? "Reloading..." : "Reload"}</span>
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-text">Loading...</div>
        ) : rows.length === 0 ? (
          <div className="table-empty">No donors found.</div>
        ) : (
          <table className="table-glass min-w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Blood</th>
                <th>Gender</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Status</th>
                <th>Total</th>
                <th>Last Donation</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.Donor_ID}>
                  <td>{r.Donor_ID}</td>
                  <td>{r.Full_Name}</td>
                  <td>{r.Blood_Group}</td>
                  <td>{r.Gender}</td>
                  <td>{r.Contact_No}</td>
                  <td>{r.Email}</td>
                  <td>{r.Donation_Status}</td>
                  <td>{r.Total_Donations}</td>
                  <td>{r.Last_Donation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}


function AddRecipient() {
  const [form, setForm] = useState({
    full_name: "",
    gender: "",
    dob: "",
    contact: "",
    email: "",
    required_blood: "",
    required_organ: "",
    address: "",
    medical: "",
    quantity: 1,
  });

  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const clearForm = () => {
    setForm({
      full_name: "",
      gender: "",
      dob: "",
      contact: "",
      email: "",
      required_blood: "",
      required_organ: "",
      address: "",
      medical: "",
      quantity: 1,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });

    try {
      const res = await fetch("/api/recipients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        showMessage(setMsg, "Recipient added successfully!", "success");
      } else {
        setMsg({ text: data.error || "Failed to add recipient.", type: "error", fadeOut: false });
        showMessage(setMsg, "Failed to add recipient.", "error");
      }
    } catch (err) {
      showMessage(setMsg, "Failed to add recipient.", "error");    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content flex justify-center items-center min-h-[calc(100vh-140px)]">
      <div className="recipient-form-card">
        <h2 className="form-title">
          <i className="fa-solid fa-hospital-user"></i> Add Recipient
        </h2>

        <form className="recipient-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={onChange}
            placeholder="Full Name"
            required
          />

          <div className="inline-inputs">
            <select name="gender" value={form.gender} onChange={onChange}>
              <option value="">Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={onChange}
            />
          </div>

          <input
            name="contact"
            value={form.contact}
            onChange={onChange}
            placeholder="Contact Number"
          />

          <input
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="Email"
            type="email"
          />

          <select
            name="required_blood"
            value={form.required_blood}
            onChange={onChange}
          >
            <option value="">Required Blood Type</option>
            <option>A+</option><option>A-</option>
            <option>B+</option><option>B-</option>
            <option>AB+</option><option>AB-</option>
            <option>O+</option><option>O-</option>
          </select>

          <input
            name="required_organ"
            value={form.required_organ}
            onChange={onChange}
            placeholder="Required Organ"
          />

          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={onChange}
            min="1"
            placeholder="Quantity Required"
          />

          <textarea
            name="medical"
            value={form.medical}
            onChange={onChange}
            placeholder="Medical Condition"
          ></textarea>

          <textarea
            name="address"
            value={form.address}
            onChange={onChange}
            placeholder="Address"
          ></textarea>

          {msg.text && (
            <div className={`msg-box ${msg.type} ${msg.fadeOut ? "hidden" : ""}`}>
              {msg.text}
            </div>
          )}

          <div className="form-buttons horizontal">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Adding..." : "Add Recipient"}
            </button>
            <button type="button" className="clear-btn" onClick={clearForm} disabled={loading}>
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddDonation() {
  const [form, setForm] = useState({
    donor_id: "",
    date: "",
    type: "Blood",
    organ_type: "",
    qty: 1,
    verified: "",
  });

  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [dailyData, setDailyData] = useState(null);
  const [organData, setOrganData] = useState(null);
  const [chartVersion, setChartVersion] = useState(0); // ⬅️ version key for chart refresh

  // ---- fetchStats ----
  async function fetchStats() {
    try {
      const res = await fetch("/api/donations/stats");
      const data = await res.json();

      if (res.ok) {
        // Line chart data
        const lineLabels = data.daily_counts.map(d => d.date);
        const lineValues = data.daily_counts.map(d => d.count);

        setDailyData({
          labels: lineLabels,
          datasets: [
            {
              label: "Donations per Day",
              data: lineValues,
              borderColor: "#ef4444",
              backgroundColor: "rgba(239,68,68,0.2)",
              tension: 0.3,
              fill: true,
            },
          ],
        });

        // Pie chart data
        const pieLabels = data.type_distribution.map(d => d.type);
        const pieValues = data.type_distribution.map(d => d.count);

        setOrganData({
          labels: pieLabels,
          datasets: [
            {
              data: pieValues,
              backgroundColor: [
                "#820719ff", "#D83527", "#F9633B",
                "#FD9E50", "#FEC97D", "#FFF3B0",
              ],
              borderWidth: 0,
              hoverOffset: 8,
            },
          ],
        });

        setChartVersion(v => v + 1);
      } else {
        console.error("Error fetching stats:", data.error);
      }
    } catch (err) {
      console.error("Server error fetching stats:", err);
    }
  }

  // Initial load
  useEffect(() => {
    fetchStats();
  }, []);

  // ---- form logic ----
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const clearForm = () => {
    setForm({
      donor_id: "",
      date: "",
      type: "Blood",
      organ_type: "",
      qty: 1,
      verified: "",
    });
    setMsg({ text: "", type: "" });
  };

  // ---- submit donation ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });

    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { message: text };
      }

      if (res.status >= 200 && res.status < 300) {
        showMessage(setMsg, "Donation added successfully!", "success");
        clearForm();
        fetchStats();
      } else {
        showMessage(setMsg, "Failed to add donation.", "error");
      }
    } catch (err) {
      showMessage(setMsg, "Network or Server Error.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ---- render ----
  return (
    <div className="page-content add-donation-layout">
      {/* Left: Charts */}
      <div className="charts-compact">
        <div className="chart-card small">
          <h3>
            <i className="fa-solid fa-chart-line"></i> Daily Donations
          </h3>
          {dailyData ? (
            <Line
              key={`line-${chartVersion}`}
              data={dailyData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2.2,
                plugins: { legend: { display: false } },
                scales: {
                  x: { ticks: { color: "#ccc", callback: function (value, index, ticks) {
                                                          const label = this.getLabelForValue(value);
                                                          if (!label) return "";
                                                          const date = new Date(label);
                                                          if (isNaN(date)) return label;
                                                          return date.toLocaleDateString(undefined, {
                                                            month: "short",
                                                            day: "numeric",
                                                          }); }, },
                  grid: { color: "rgba(255,255,255,0.05)" } },
                  y: { ticks: { color: "#ccc", callback: function (value) {if (Number.isInteger(value)){return value;} return null;}, }, grid: { color: "rgba(255,255,255,0.05)" },  beginAtZero: true},
                },
              }}
            />
          ) : (
            <div className="chart-loading">Loading...</div>
          )}
        </div>

        <div className="chart-card small">
          <h3>
            <i className="fa-solid fa-chart-pie"></i> Donation Types
          </h3>
          {organData ? (
            <Pie
              key={`pie-${chartVersion}`} // ⬅️ ensures Chart.js refresh
              data={organData}
              options={{
                maintainAspectRatio: true,
                aspectRatio: 1.8,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: { color: "white", boxWidth: 14, padding: 10 },
                  },
                },
              }}
            />
          ) : (
            <div className="chart-loading">Loading...</div>
          )}
        </div>
      </div>

      {/* Right: Form */}
      <div className="form-section donation-form-card">
        <h2 className="form-title">
          <i className="fa-solid fa-droplet"></i> Add Donation
        </h2>

        <form className="donor-form" onSubmit={handleSubmit}>
          <input
            name="donor_id"
            value={form.donor_id}
            onChange={handleChange}
            placeholder="Donor ID"
            required
          />

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />

          <select name="type" value={form.type} onChange={handleChange}>
            <option>Donation Type</option>
            <option>Blood</option>
            <option>Organ</option>
          </select>

          <select
            name="organ_type"
            value={form.organ_type}
            onChange={handleChange}
            disabled={form.type !== "Organ"}
          >
            <option>Organ Type</option>
            <option>Heart</option>
            <option>Kidney</option>
            <option>Liver</option>
            <option>Lung</option>
            <option>Pancreas</option>
            <option>Other</option>
          </select>

          <input
            name="qty"
            type="number"
            value={form.qty}
            onChange={handleChange}
            min="1"
            disabled={form.type === "Organ"}
            placeholder="Quantity"
          />

          <input
            name="verified"
            value={form.verified}
            onChange={handleChange}
            placeholder="Verified Staff ID"
          />

          {msg.text && (
            <div className={`msg-box ${msg.type} ${msg.fadeOut ? "hidden" : ""}`}>
              {msg.text}
            </div>
          )}

          <div className="form-buttons horizontal">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Adding..." : "Add Donation"}
            </button>
            <button type="button" className="clear-btn" onClick={clearForm}>
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


function PendingRequests() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const res = await useApi("/requests/pending");
    setRows(res.data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page-content p-6">
      {/* Header Section */}
      <div className="pending-header">
        <div className="pending-title">
          <i className="fa-solid fa-clipboard-list"></i>
          <h2>Pending Requests</h2>
        </div>
        <button
          onClick={load}
          className={`reload-btn ${loading ? "loading" : ""}`}
          disabled={loading}
          title="Reload Pending Requests"
        >
          <i
            className={`fa-solid ${
              loading ? "fa-spinner fa-spin" : "fa-rotate"
            }`}
          ></i>
          <span>{loading ? "Reloading..." : "Reload"}</span>
        </button>
      </div>

      {/* Table Section */}
      {loading ? (
        <div className="pending-loading-msg">Loading data...</div>
      ) : (
        <div className="pending-table-wrapper">
          <table className="pending-table min-w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Requestor</th>
                <th>Type</th>
                <th>Blood Group</th>
                <th>Organ</th>
                <th>Quantity</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.Request_ID}>
                  <td>{r.Request_ID}</td>
                  <td>{r.Requestor_Name}</td>
                  <td>{r.Request_Type}</td>
                  <td>{r.Req_Blood_Group}</td>
                  <td>{r.Organ_Type}</td>
                  <td>{r.Quantity}</td>
                  <td>{r.Request_Date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Inventory() {
  const [type, setType] = useState("Blood_Inventory");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const res = await useApi("/inventory?type=" + type);
    setRows(res.data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [type]);

  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <div className="page-content p-6">
      {/* Header Section */}
      <div className="inventory-header">
        <div className="inventory-title">
          <i className="fa-solid fa-box-archive"></i>
          <h2>{type.replace("_", " ")}</h2>
        </div>

        <div className="inventory-actions">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="select"
            style={{
            marginRight: "1.5rem",
            transform: "translateY(0.5rem)", 
  }}
          >
            <option value = "Blood_Inventory">Blood Inventory</option>
            <option value = "Organ_Inventory">Organ Inventory</option>
          </select>

          <button
            onClick={load}
            className={`reload-btn ${loading ? "loading" : ""}`}
            disabled={loading}
            title="Reload Inventory"
          >
            <i
              className={`fa-solid ${
                loading ? "fa-spinner fa-spin" : "fa-rotate"
              }`}
            ></i>
            <span>{loading ? "Reloading..." : "Reload"}</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      {loading ? (
        <div className="inventory-loading-msg">Loading data...</div>
      ) : rows.length === 0 ? (
        <div className="inventory-empty-msg">No data available.</div>
      ) : (
        <div className="inventory-table-wrapper">
          <table className="inventory-table min-w-full">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col.replace(/_/g, " ")}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col}>{row[col] ?? "-"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function FulfillRequest() {
  const [rid, setRid] = useState("");
  const [sid, setSid] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  async function submit() {
  if (!rid || !sid) {
    setStatus({ type: "error", message: "Both Request ID and Staff ID are required." });
    return;
  }

  setLoading(true);
  setStatus({ type: "", message: "" });

  const res = await useApi("/requests/fulfill", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ request_id: rid, staff_id: sid }),
  });

  if (res.error) {
    setStatus({ type: "error", message: res.error });
  } else {
    setStatus({ type: "success", message: res.message || "Request fulfilled successfully!" });
    setRid("");
    setSid("");
  }

  setLoading(false);
}


  return (
    <div className="page-content fulfill-page">
      <div className="fulfill-card">
        <h2 className="form-title">
          <i className="fa-solid fa-check-circle"></i> Fulfill Request
        </h2>

        <input
          placeholder="Request ID"
          value={rid}
          onChange={(e) => setRid(e.target.value)}
          className="form-field"
        />
        <input
          placeholder="Staff ID"
          value={sid}
          onChange={(e) => setSid(e.target.value)}
          className="form-field"
        />

        <button
          onClick={submit}
          className="btn-confirm"
          disabled={loading}
        >
          {loading ? "Processing..." : "Fulfill"}
        </button>

        {status.message && (
          <div className={`form-status ${status.type}`}>
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
}

function AddStaff() {
  const [form, setForm] = useState({
    full_name: "",
    role: "",
    contact: "",
    email: "",
    username: "",
    password: "",
  });

  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const clearForm = () => {
    setForm({
      full_name: "",
      role: "",
      contact: "",
      email: "",
      username: "",
      password: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });

    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        showMessage(setMsg, "Staff member added successfully!", "success");
        clearForm();
      } else {
        showMessage(setMsg, data.error || "Failed to add staff.", "error");
      }
    } catch (err) {
      showMessage(setMsg, "Network or server error.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content flex justify-center items-center min-h-[calc(100vh-140px)]">
      <div className="recipient-form-card"> {/* same style class as AddRecipient */}
        <h2 className="form-title">
          <i className="fa-solid fa-user-tie"></i> Add Staff
        </h2>

        <form className="recipient-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />

          <input
            type="text"
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="Role"
            required
          />

          <input
            type="text"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="Contact Number"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
          />

          <div className="inline-inputs">
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>

          {msg.text && (
            <div className={`msg-box ${msg.type} ${msg.fadeOut ? "hidden" : ""}`}>
              {msg.text}
            </div>
          )}

          <div className="form-buttons horizontal">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Adding..." : "Add Staff"}
            </button>
            <button
              type="button"
              className="clear-btn"
              onClick={clearForm}
              disabled={loading}
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ViewStaff() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const res = await useApi("/staff");
    if (res.error) {
      console.error(res.error);
    } else {
      setRows(res.data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page-content">
      <div className="section-header">
        <h2 className="section-title">
          <i className="fa-solid fa-id-card"></i> Staff Members
        </h2>
        <button onClick={load} className="reload-btn" disabled={loading}>
          <i className="fa-solid fa-rotate"></i>
          <span>{loading ? "Reloading..." : "Reload"}</span>
        </button>
      </div>

      {loading ? (
        <div className="loading-text">Loading staff...</div>
      ) : rows.length === 0 ? (
        <div className="table-empty">No staff found.</div>
      ) : (
        <div className="table-container">
          <table className="table-glass min-w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.Staff_ID}>
                  <td>{r.Staff_ID}</td>
                  <td>{r.Full_Name}</td>
                  <td>{r.Role}</td>
                  <td>{r.Contact_No}</td>
                  <td>{r.Email}</td>
                  <td>{r.Username}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [view, setView] = React.useState('Dashboard');
  const [user, setUser] = React.useState(null);

  return (
    <div className="min-h-screen bg-gray-100">
      <Banner /> 
      {user && view !== 'Dashboard' && <Nav setView={setView} activeView={view} />}
      <main className={user ? "mt-24" : "mt-16"}>
        {view === 'Dashboard' && <Dashboard onLogin={setUser} user={user} setView={setView} />}
        {user && (
          <>
            {view === 'Add Donor' && <AddDonor />}
            {view === 'View Donors' && <ViewDonors />}
            {view === 'Add Recipient' && <AddRecipient />}
            {view === 'Add Donation' && <AddDonation />}
            {view === 'Pending Requests' && <PendingRequests />}
            {view === 'Inventory' && <Inventory />}
            {view === 'Fulfill Request' && <FulfillRequest />}
            {view === 'Add Staff' && <AddStaff />}
            {view === 'View Staff' && <ViewStaff />}
          </>
        )}
      </main>
    </div>
  );
}


