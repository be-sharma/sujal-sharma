
import { useCallback, useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const defaults = {
    heroRole: "Full-Stack Developer · Web Engineer",
    heroDescription:
        "I turn ideas into beautiful, responsive web experiences. From frontend interfaces to backend functionality, I enjoy building digital products that solve real problems.",
    about1:
        "I'm a developer who enjoys turning ideas into complete digital experiences. I work across responsive interfaces, reusable components, backend integrations and web design.",
    about2:
        "My portfolio showcases work around business websites, service marketplaces and creative digital projects. I believe in thoughtful design, clean code and continuous learning.",
};

export default function Admin() {
    const [token, setToken] = useState(
        () => sessionStorage.getItem("portfolio_admin_token") || ""
    );
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [content, setContent] = useState(defaults);
    const [stats, setStats] = useState(null);
    const [status, setStatus] = useState("");
    const [busy, setBusy] = useState(false);


    const [projectDraft, setProjectDraft] = useState({
        id: "",
        title: "",
        description: "",
        image: "",
        category: "web",
        type: "Web Project",
        live: "",
        repo: "",
        tagsText: "",
    });

    const [editingProjectId, setEditingProjectId] = useState("");
    const [projectList, setProjectList] = useState([]);

    const request = useCallback(async (path, options = {}) => {
        const response = await fetch(`${API}/api/admin${path}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...options.headers,
            },
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                sessionStorage.removeItem("portfolio_admin_token");
                setToken("");
            }
            throw new Error(data.message || "Request failed.");
        }

        return data;
    }, [token]);

    useEffect(() => {
        if (!token) return;

        let cancelled = false;

        async function load() {
            try {
                const [dashboard, saved] = await Promise.all([
                    request("/dashboard"),
                    request("/content"),
                ]);

                if (cancelled) return;

                setStats(dashboard.stats);
                setContent({ ...defaults, ...saved.content });
                setProjectList(
                    Array.isArray(saved.content?.projects)
                        ? saved.content.projects
                        : []
                );
                setStatus("Dashboard ready.");
            } catch (error) {
                if (!cancelled) setStatus(error.message);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [token, request]);

    async function login(event) {
        event.preventDefault();
        setBusy(true);
        setStatus("");

        try {
            const result = await request("/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });

            sessionStorage.setItem("portfolio_admin_token", result.token);
            setToken(result.token);
            setPassword("");
            setStatus("Login successful.");
        } catch (error) {
            setStatus(error.message);
        } finally {
            setBusy(false);
        }
    }

    async function save(event) {
        event.preventDefault();
        setBusy(true);
        setStatus("");

        try {
            const result = await request("/content", {
                method: "PUT",
                body: JSON.stringify(content),
            });

            setContent({ ...defaults, ...result.content });
            setStatus("Saved successfully. Refresh the portfolio to see changes.");
        } catch (error) {
            setStatus(error.message);
        } finally {
            setBusy(false);
        }
    }


    function resetProjectForm() {
        setEditingProjectId("");
        setProjectDraft({
            id: "",
            title: "",
            description: "",
            image: "",
            category: "web",
            type: "Web Project",
            live: "",
            repo: "",
            tagsText: "",
        });
    }

    async function saveProject(event) {
        event.preventDefault();

        const project = {
            ...projectDraft,
            id: editingProjectId || crypto.randomUUID(),
            tags: projectDraft.tagsText
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
            theme: "custom",
            icon: "✦",
        };

        const updatedProjects = editingProjectId
            ? projectList.map((item) =>
                item.id === editingProjectId ? project : item
            )
            : [...projectList, project];

        setBusy(true);
        setStatus("");

        try {
            const result = await request("/content", {
                method: "PUT",
                body: JSON.stringify({
                    ...content,
                    projects: updatedProjects,
                }),
            });

            setProjectList(result.content.projects || updatedProjects);
            setContent({ ...defaults, ...result.content });
            resetProjectForm();
            setStatus("Project saved successfully.");
        } catch (error) {
            setStatus(error.message);
        } finally {
            setBusy(false);
        }
    }

    async function deleteProject(id) {
        if (!window.confirm("Delete this project?")) return;

        const updatedProjects = projectList.filter(
            (project) => project.id !== id
        );

        setBusy(true);

        try {
            const result = await request("/content", {
                method: "PUT",
                body: JSON.stringify({
                    ...content,
                    projects: updatedProjects,
                }),
            });

            setProjectList(result.content.projects || updatedProjects);
            setContent({ ...defaults, ...result.content });
            setStatus("Project deleted.");
            if (editingProjectId === id) resetProjectForm();
        } catch (error) {
            setStatus(error.message);
        } finally {
            setBusy(false);
        }
    }

    function editProject(project) {
        setEditingProjectId(project.id);
        setProjectDraft({
            id: project.id,
            title: project.title || "",
            description: project.description || "",
            image: project.image || "",
            category: project.category || "web",
            type: project.type || "Web Project",
            live: project.live || "",
            repo: project.repo || "",
            tagsText: (project.tags || []).join(", "),
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function logout() {
        sessionStorage.removeItem("portfolio_admin_token");
        setToken("");
        setStats(null);
        setStatus("");
    }

    const page = {
        minHeight: "100vh",
        background: "#f4f1e8",
        color: "#25291d",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: "32px 18px",
    };

    const panel = {
        maxWidth: 780,
        margin: "0 auto",
        padding: 28,
        background: "#fffef9",
        border: "1px solid #e1dfd4",
        borderRadius: 18,
        boxShadow: "0 15px 50px #292b1710",
    };

    const field = {
        display: "block",
        width: "100%",
        boxSizing: "border-box",
        marginTop: 8,
        marginBottom: 20,
        padding: 12,
        border: "1px solid #d7d5c9",
        borderRadius: 9,
        background: "#fff",
        color: "#25291d",
        font: "inherit",
    };

    const button = {
        padding: "12px 18px",
        border: 0,
        borderRadius: 9,
        background: "#535d37",
        color: "#fff",
        font: "inherit",
        cursor: "pointer",
    };

    return (
        <main style={page}>
            <section style={panel}>
                <a href="/" style={{ color: "#535d37", textDecoration: "none" }}>
                    ← View portfolio
                </a>

                <h1 style={{ marginBottom: 6 }}>Sujal. Admin</h1>
                <p style={{ color: "#777767" }}>
                    Manage your portfolio content.
                </p>

                {!token ? (
                    <form onSubmit={login}>
                        <h2>Admin login</h2>

                        <label>
                            Email
                            <input
                                style={field}
                                type="email"
                                autoComplete="username"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>

                        <label>
                            Password
                            <input
                                style={field}
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>

                        <button style={button} disabled={busy}>
                            {busy ? "Signing in…" : "Login"}
                        </button>
                    </form>
                ) : (
                    <>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 12,
                                flexWrap: "wrap",
                            }}
                        >
                            <h2>Dashboard</h2>
                            <button type="button" style={button} onClick={logout}>
                                Logout
                            </button>
                        </div>

                        {stats && (
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                                    gap: 12,
                                    marginBottom: 28,
                                }}
                            >
                                {[
                                    ["Total enquiries", stats.totalMessages],
                                    ["Unread", stats.unreadMessages],
                                    ["Read", stats.readMessages],
                                ].map(([label, value]) => (
                                    <div
                                        key={label}
                                        style={{
                                            border: "1px solid #e1dfd4",
                                            padding: 16,
                                            borderRadius: 12,
                                        }}
                                    >
                                        <div style={{ color: "#777767" }}>{label}</div>
                                        <strong style={{ fontSize: 26 }}>{value}</strong>
                                    </div>
                                ))}
                            </div>
                        )}

                        <h2>Edit portfolio text</h2>
                        <p style={{ color: "#777767" }}>
                            Edit the fields below and save them to the database.
                        </p>

                        <form onSubmit={save}>
                            <label>
                                Professional role
                                <input
                                    style={field}
                                    maxLength={160}
                                    value={content.heroRole}
                                    onChange={(e) =>
                                        setContent({ ...content, heroRole: e.target.value })
                                    }
                                />
                            </label>

                            <label>
                                Hero description
                                <textarea
                                    style={{ ...field, minHeight: 120 }}
                                    value={content.heroDescription}
                                    onChange={(e) =>
                                        setContent({ ...content, heroDescription: e.target.value })
                                    }
                                />
                            </label>

                            <label>
                                About paragraph 1
                                <textarea
                                    style={{ ...field, minHeight: 110 }}
                                    value={content.about1}
                                    onChange={(e) =>
                                        setContent({ ...content, about1: e.target.value })
                                    }
                                />
                            </label>

                            <label>
                                About paragraph 2
                                <textarea
                                    style={{ ...field, minHeight: 110 }}
                                    value={content.about2}
                                    onChange={(e) =>
                                        setContent({ ...content, about2: e.target.value })
                                    }
                                />
                            </label>

                            <button style={button} disabled={busy}>
                                {busy ? "Saving…" : "Save changes"}
                            </button>
                        </form>
                    </>
                )}

                <hr style={{ margin: "36px 0", border: 0, borderTop: "1px solid #e1dfd4" }} />

                <h2>Projects Manager</h2>
                <p style={{ color: "#777767" }}>
                    Add projects with a title, description and image. Hover over
                    the project on your portfolio to preview its image.
                </p>

                <form onSubmit={saveProject}>
                    <label>
                        Project title
                        <input
                            style={field}
                            required
                            maxLength={120}
                            value={projectDraft.title}
                            onChange={(e) =>
                                setProjectDraft({ ...projectDraft, title: e.target.value })
                            }
                        />
                    </label>

                    <label>
                        Description
                        <textarea
                            style={{ ...field, minHeight: 100 }}
                            required
                            maxLength={2000}
                            value={projectDraft.description}
                            onChange={(e) =>
                                setProjectDraft({ ...projectDraft, description: e.target.value })
                            }
                        />
                    </label>

                    <label>
                        Image URL
                        <input
                            style={field}
                            type="url"
                            placeholder="https://example.com/project-image.jpg"
                            value={projectDraft.image}
                            onChange={(e) =>
                                setProjectDraft({ ...projectDraft, image: e.target.value })
                            }
                        />
                    </label>

                    {projectDraft.image && (
                        <img
                            src={projectDraft.image}
                            alt="Project preview"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                            onLoad={(e) => {
                                e.currentTarget.style.display = "block";
                            }}
                            style={{
                                width: "100%",
                                maxHeight: 240,
                                objectFit: "contain",
                                borderRadius: 12,
                                marginBottom: 20,
                                background: "#eeece3",
                            }}
                        />
                    )}

                    <label>
                        Category
                        <select
                            style={field}
                            value={projectDraft.category}
                            onChange={(e) =>
                                setProjectDraft({ ...projectDraft, category: e.target.value })
                            }
                        >
                            <option value="web">Web</option>
                            <option value="design">Design</option>
                        </select>
                    </label>

                    <label>
                        Project type
                        <input
                            style={field}
                            value={projectDraft.type}
                            onChange={(e) =>
                                setProjectDraft({ ...projectDraft, type: e.target.value })
                            }
                        />
                    </label>

                    <label>
                        Tags (comma separated)
                        <input
                            style={field}
                            placeholder="React, UI Design, Responsive"
                            value={projectDraft.tagsText}
                            onChange={(e) =>
                                setProjectDraft({ ...projectDraft, tagsText: e.target.value })
                            }
                        />
                    </label>

                    <label>
                        Live project URL
                        <input
                            style={field}
                            type="url"
                            placeholder="https://example.com"
                            value={projectDraft.live}
                            onChange={(e) =>
                                setProjectDraft({ ...projectDraft, live: e.target.value })
                            }
                        />
                    </label>

                    <label>
                        Repository URL (optional)
                        <input
                            style={field}
                            type="url"
                            placeholder="https://github.com/username/project"
                            value={projectDraft.repo}
                            onChange={(e) =>
                                setProjectDraft({ ...projectDraft, repo: e.target.value })
                            }
                        />
                    </label>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <button style={button} disabled={busy}>
                            {busy ? "Saving…" : editingProjectId ? "Update project" : "Add project"}
                        </button>

                        {editingProjectId && (
                            <button
                                type="button"
                                style={{ ...button, background: "#777767" }}
                                onClick={resetProjectForm}
                            >
                                Cancel edit
                            </button>
                        )}
                    </div>
                </form>

                <h3 style={{ marginTop: 32 }}>Your added projects ({projectList.length})</h3>

                {projectList.map((project) => (
                    <div
                        key={project.id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                            padding: 14,
                            marginBottom: 12,
                            border: "1px solid #e1dfd4",
                            borderRadius: 12,
                            flexWrap: "wrap",
                        }}
                    >
                        {project.image && (
                            <img
                                src={project.image}
                                alt=""
                                style={{
                                    width: 76,
                                    height: 60,
                                    objectFit: "cover",
                                    borderRadius: 8,
                                }}
                            />
                        )}

                        <div style={{ flex: 1, minWidth: 140 }}>
                            <strong>{project.title}</strong>
                            <p style={{ margin: "5px 0", color: "#777767" }}>
                                {project.description}
                            </p>
                        </div>

                        <button
                            type="button"
                            style={button}
                            onClick={() => editProject(project)}
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            style={{ ...button, background: "#9a3939" }}
                            disabled={busy}
                            onClick={() => deleteProject(project.id)}
                        >
                            Delete
                        </button>
                    </div>
                ))}

                {status && (
                    <p role="status" style={{ marginTop: 20, overflowWrap: "anywhere" }}>
                        {status}
                    </p>
                )}
            </section>
        </main>
    );
}
