import { useEffect, useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_BASE || "/api";

function App() {
  const [issues, setIssues] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "open",
  });
  const [loading, setLoading] = useState(false);

  async function fetchIssues() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/issues`);
      const data = await res.json();
      setIssues(data);
    } catch (err) {
      console.error("Failed to fetch issues", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchIssues();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.description) return;

    try {
      const res = await fetch(`${API_BASE}/issues`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const created = await res.json();
      setIssues((prev) => [created, ...prev]);
      setForm({ title: "", description: "", status: "open" });
    } catch (err) {
      console.error("Failed to create issue", err);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: "#f5f5f5",
        padding: "2rem 1rem",
        color: "#111",
      }}
    >
      <div style={{ width: "100%", maxWidth: 800 }}>
        <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>
          🐞 Issue Tracker - v2
        </h1>

        <section
          style={{
            background: "#ffffff",
            padding: "1rem",
            borderRadius: 8,
            marginBottom: "1.5rem",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            color: "#111",
          }}
        >
          <h2 style={{ textAlign: "center", marginTop: 0 }}>Create Issue</h2>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: ".75rem",
            }}
          >
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              style={{
                padding: ".5rem .75rem",
                borderRadius: 6,
                border: "1px solid #ccc",
                fontSize: "0.95rem",
              }}
            />
            <textarea
              placeholder="Description"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              style={{
                padding: ".5rem .75rem",
                borderRadius: 6,
                border: "1px solid #ccc",
                fontSize: "0.95rem",
                fontFamily: "sans-serif",
              }}
            />
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
              style={{
                padding: ".5rem .75rem",
                borderRadius: 6,
                border: "1px solid #ccc",
                fontSize: "0.95rem",
                maxWidth: 200,
              }}
            >
              <option value="open">Open</option>
              <option value="in-progress">In progress</option>
              <option value="closed">Closed</option>
            </select>
            <button
              type="submit"
              style={{
                padding: ".6rem .9rem",
                borderRadius: 6,
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
                alignSelf: "center",
                minWidth: 140,
              }}
            >
              Create
            </button>
          </form>
        </section>

        <section>
          <h2 style={{ textAlign: "center" }}>Issues</h2>
          {loading ? (
            <p style={{ textAlign: "center" }}>Loading...</p>
          ) : issues.length === 0 ? (
            <p style={{ textAlign: "center" }}>No issues yet.</p>
          ) : (
            issues.map((issue) => (
              <div
                key={issue._id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  padding: ".75rem",
                  marginBottom: ".75rem",
                  background: "#ffffff",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  color: "#111",
                }}
              >
                <h3 style={{ margin: "0 0 .25rem" }}>{issue.title}</h3>
                <p style={{ margin: "0 0 .5rem" }}>{issue.description}</p>
                <small
                  style={{
                    display: "inline-block",
                    padding: ".15rem .5rem",
                    borderRadius: 999,
                    background:
                      issue.status === "closed"
                        ? "#dcfce7"
                        : issue.status === "in-progress"
                        ? "#fef9c3"
                        : "#e0f2fe",
                    border:
                      issue.status === "closed"
                        ? "1px solid #16a34a"
                        : issue.status === "in-progress"
                        ? "1px solid #eab308"
                        : "1px solid #2563eb",
                    fontSize: "0.75rem",
                  }}
                >
                  Status: {issue.status}
                </small>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
