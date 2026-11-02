
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Admin from "./Admin";
import "./App.css";

gsap.registerPlugin(ScrollTrigger);

const LINKEDIN_URL = "https://www.linkedin.com/in/chota-kodar/";
const GITHUB_URL = "https://github.com/be-sharma";
const WHATSAPP_NUMBER = "916388917812";
const PROFILE_IMAGE_LIGHT = "/sujal.png";
const PROFILE_IMAGE_DARK = "/sujal-dark.png";
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const projects = [
  {
    title: "Bridal Studio",
    category: "web",
    type: "Business Website",
    icon: "✿",
    theme: "bridal",
    description:
      "A polished bridal beauty experience with service listings, appointment enquiries, testimonials, gallery and blog.",
    tags: ["React", "CSS", "Responsive UI"],
    live: "https://www.bridalstudio.me/#testimonials",
    repo: "https://github.com/be-sharma/PORTFOLIO",
  },
  {
    title: "WorkWaale",
    category: "design",
    type: "Service Marketplace",
    icon: "⚒",
    theme: "work",
    description:
      "A service marketplace design direction with category graphics and visual branding for everyday home services.",
    tags: ["UI/UX", "Branding", "Category Design"],
    live: "https://workwaale.in/home",
    repo: "https://github.com/be-sharma/PORTFOLIO",
  },
  {
    title: "DevelDart",
    category: "web",
    type: "Digital Agency",
    icon: "✧",
    theme: "devel",
    description:
      "A creative digital agency showcase focused on modern web experiences, development and marketing visuals.",
    tags: ["Web Design", "Frontend", "Creative"],
    live: "https://develdart.com/",
    repo: "https://github.com/be-sharma/PORTFOLIO",
  },
  {
    title: "E-commerce Creatives",
    category: "design",
    type: "Visual Branding",
    icon: "▣",
    theme: "shop",
    description:
      "Promotional banner concepts and visual design work for online retail and mobile accessory brands.",
    tags: ["E-commerce", "Banners", "Design"],
    live: "https://kashimobile.com/",
    repo: "https://sastaji.com/",
  },
];

const skills = [
  { icon: "⚛", name: "React", detail: "UI development" },
  { icon: "JS", name: "JavaScript", detail: "Application logic" },
  { icon: "🌐", name: "HTML5", detail: "Web structure" },
  { icon: "🎨", name: "CSS3", detail: "Responsive styling" },
  { icon: "⬢", name: "Node.js", detail: "Backend runtime" },
  { icon: "⌘", name: "REST APIs", detail: "Service integration" },
  { icon: "▤", name: "Databases", detail: "Data management" },
  { icon: "↗", name: "Git & Deploy", detail: "Version control" },
];

const socialLinks = [
  {
    name: "GitHub",
    label: "GH",
    url: GITHUB_URL,
    description: "Explore my GitHub profile",
  },
  {
    name: "LinkedIn",
    label: "in",
    url: LINKEDIN_URL,
    description: "Connect with me on LinkedIn",
  },
  {
    name: "WhatsApp",
    label: "WA",
    url: `https://wa.me/${WHATSAPP_NUMBER}`,
    description: "Message me on WhatsApp",
  },
];

const navigation = [
  ["Home", "#home"],
  ["About", "#about"],
  ["Skills", "#skills"],
  ["Projects", "#projects"],
  ["Contact", "#contact"],
];

const defaultContent = {
  heroRole: "Full-Stack Developer · Web Engineer",
  heroDescription:
    "I turn ideas into beautiful, responsive web experiences. From frontend interfaces to backend functionality, I enjoy building digital products that solve real problems.",
  about1:
    "I'm a developer who enjoys turning ideas into complete digital experiences. I work across responsive interfaces, reusable components, backend integrations and web design.",
  about2:
    "My portfolio showcases work around business websites, service marketplaces and creative digital projects. I believe in thoughtful design, clean code and continuous learning.",
};

function SocialLinks({ compact = false }) {
  return (
    <div
      className={`social-links ${compact ? "social-links-compact" : ""}`}
      aria-label="Social media links"
    >
      {socialLinks.map((social, index) => (
        <a
          key={social.name}
          className={`social-link social-${social.name.toLowerCase()}`}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.description}
          title={social.name}
          style={{ "--social-index": index }}
        >
          <span className="social-icon-label">{social.label}</span>
          <span className="social-tooltip" aria-hidden="true">
            {social.name}
          </span>
        </a>
      ))}
    </div>
  );
}


function ProjectPreview({ project, position }) {
  if (!project) return null;

  return (
    <div
      className={`project-hover-preview art-${project.theme || "custom"}`}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      aria-hidden="true"
    >
      {project.image ? (
        <img
          src={project.image}
          alt=""
          style={{
            display: "block",
            width: "100%",
            height: 190,
            objectFit: "cover",
            borderRadius: "10px 10px 0 0",
          }}
        />
      ) : (
        <div className="preview-browser-bar">
          <i />
          <i />
          <i />
          <span>{project.title.toLowerCase().replaceAll(" ", "")}.dev</span>
        </div>
      )}

      <div className="preview-browser-content">
        <span className="preview-icon">{project.icon || "✦"}</span>
        <div>
          <small>{project.type || "Web Project"}</small>
          <strong>{project.title}</strong>
          <p>{project.description}</p>
          <span className="preview-cta">Open project ↗</span>
        </div>
      </div>
    </div>
  );
}


function ProjectStrip({ project, index, onHover, onLeave }) {
  return (
    <a
      className={`project-strip reveal project-strip-${project.theme}`}
      href={project.live}
      target="_blank"
      rel="noopener noreferrer"
      style={{ "--delay": `${index * 90}ms` }}
      onMouseEnter={(event) => onHover(project, event)}
      onMouseMove={(event) => onHover(project, event)}
      onMouseLeave={onLeave}
      onFocus={(event) => onHover(project, event)}
      onBlur={onLeave}
      aria-label={`Open ${project.title} project in a new tab`}
    >
      <span className="strip-index">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="strip-main">
        <span className="strip-type">{project.type}</span>
        <strong className="strip-title">{project.title}</strong>
      </span>
      <span className="strip-description">{project.description}</span>
      <span className="strip-tags">
        {project.tags.slice(0, 2).map((tag) => (
          <i key={tag}>{tag}</i>
        ))}
      </span>
      <span className="strip-open" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}

function App() {
  // /admin route: leave the existing portfolio page untouched.
  if (window.location.pathname.replace(/\/+$/, "") === "/admin") {
    return <Admin />;
  }

  return <Portfolio />;
}

function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [formStatus, setFormStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  const [siteContent, setSiteContent] = useState(defaultContent);
  const projectsRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_BASE_URL}/api/admin/public-content`)
      .then((response) => {
        if (!response.ok) throw new Error("Content unavailable");
        return response.json();
      })
      .then((data) => {
        if (!cancelled && data.content) {
          setSiteContent({ ...defaultContent, ...data.content });
        }
      })
      .catch(() => {
        // Keep the built-in portfolio content if the API is unavailable.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".topbar",
        { y: -24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );

      gsap.fromTo(
        ".hero-copy > *",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.12,
        }
      );

      gsap.fromTo(
        ".hero-visual",
        { x: 35, opacity: 0, scale: 0.96 },
        {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          delay: 0.25,
        }
      );

      gsap.utils.toArray(".reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray(".project-strip").forEach((row) => {
        const title = row.querySelector(".strip-title");
        if (!title) return;

        row.addEventListener("mouseenter", () =>
          gsap.to(title, {
            scale: 1.1,
            x: 5,
            duration: 0.25,
            ease: "power2.out",
          })
        );

        row.addEventListener("mouseleave", () =>
          gsap.to(title, {
            scale: 1,
            x: 0,
            duration: 0.25,
            ease: "power2.out",
          })
        );
      });

      gsap.to(".photo-orbit-outer", {
        rotate: 360,
        duration: 28,
        repeat: -1,
        ease: "none",
      });

      gsap.to(".photo-orbit-inner", {
        rotate: -360,
        duration: 36,
        repeat: -1,
        ease: "none",
      });
    });

    return () => ctx.revert();
  }, [filter, siteContent]);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
  }, [darkMode]);

  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -35px 0px" }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [filter, siteContent]);


  const allProjects = useMemo(
    () => [
      ...projects,
      ...(siteContent.projects || []).map((project) => ({
        ...project,
        theme: "custom",
        icon: project.icon || "✦",
        type: project.type || "Web Project",
        tags: Array.isArray(project.tags) ? project.tags : [],
        live: project.live || "#projects",
        repo: project.repo || "",
      })),
    ],
    [siteContent.projects]
  );

  const filteredProjects = useMemo(
    () =>
      allProjects.filter(
        (project) => filter === "all" || project.category === filter
      ),
    [filter, allProjects]
  );

  const closeMenu = () => setMenuOpen(false);

  const handleProjectHover = (project, event) => {
    setHoveredProject(project);
    const bounds = projectsRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const previewWidth = 330;
    const previewHeight = 220;
    const x = Math.min(
      Math.max(event.clientX - bounds.left + 24, 12),
      Math.max(12, bounds.width - previewWidth - 12)
    );
    const y = Math.min(
      Math.max(event.clientY - bounds.top - previewHeight / 2, 8),
      Math.max(8, bounds.height - previewHeight - 8)
    );

    setPreviewPosition({ x, y });
  };

  const handleProjectLeave = () => setHoveredProject(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (sending) return;

    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("from_name") || "").trim();
    const contact = String(data.get("reply_to") || "").trim();
    const email = contact.includes("@")
      ? contact
      : "not-provided@example.com";
    const subject = String(
      data.get("subject") || "Website enquiry"
    ).trim();
    const message = String(data.get("message") || "").trim();

    const whatsappText =
      `Hello Sujal!\n\nName: ${name}\nEmail/contact: ${contact || "Not provided"}\nEnquiry: ${subject}\n\nMessage: ${message}`;

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`,
      "_blank",
      "noopener,noreferrer"
    );

    setSending(true);
    setFormStatus("Saving your enquiry...");

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to save enquiry.");
      }

      setFormStatus(
        "Enquiry saved! Review your message and press Send in WhatsApp."
      );
      form.reset();
    } catch (error) {
      console.error("Contact form error:", error);
      setFormStatus(
        "WhatsApp is open, but the enquiry could not be saved. Check that the backend is running."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className={`portfolio ${darkMode ? "portfolio-dark" : "portfolio-light"
        }`}
    >
      <header className="topbar">
        <nav className="nav-container" aria-label="Main navigation">
          <a className="brand" href="#home" onClick={closeMenu}>
            Sujal<span>.</span>
          </a>

          <div className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
            {navigation.map(([label, href]) => (
              <a key={href} href={href} onClick={closeMenu}>
                {label}
              </a>
            ))}
          </div>

          <div className="nav-actions">
            <button
              type="button"
              className="theme-toggle"
              onClick={() => setDarkMode((previous) => !previous)}
              aria-label="Toggle color theme"
              title="Toggle theme"
            >
              {darkMode ? "☼" : "☾"}
            </button>

            <a
              className="button button-small nav-cta"
              href="#contact"
              onClick={closeMenu}
            >
              Let’s Talk <span>↗</span>
            </a>

            <button
              type="button"
              className="menu-toggle"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((previous) => !previous)}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </nav>
      </header>

      <main>
        <section className="hero section-wrap" id="home">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="availability reveal">
                <span className="status-dot" />
                OPEN TO OPPORTUNITIES
              </div>

              <p className="eyebrow reveal">HELLO, WORLD! I'M SUJAL</p>

              <h1 className="reveal">
                I build digital
                <br />
                experiences that
                <br />
                <span className="gradient-text">make an impact.</span>
              </h1>

              <h2 className="hero-role reveal">{siteContent.heroRole}</h2>

              <p className="hero-description reveal">
                {siteContent.heroDescription}
              </p>

              <div className="hero-actions reveal">
                <a className="button button-primary" href="#projects">
                  Explore My Work <span>↗</span>
                </a>
                <a className="button button-outline" href="#contact">
                  Let's Connect <span>↗</span>
                </a>
              </div>

              <div className="hero-social-row reveal">
                <span className="social-caption">FIND ME ON</span>
                <SocialLinks />
              </div>
            </div>

            <div className="hero-visual hero-photo-visual reveal">
              <div className="visual-glow" />
              <div className="visual-grid" />
              <div className="photo-orbit photo-orbit-outer" />
              <div className="photo-orbit photo-orbit-inner" />

              <div className="profile-photo-frame">
                <img
                  className="profile-photo"
                  src={
                    darkMode
                      ? PROFILE_IMAGE_DARK
                      : PROFILE_IMAGE_LIGHT
                  }
                  alt="Sujal Sharma — Full-Stack Developer"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              </div>

              <div className="floating-badge badge-react">
                <span className="badge-pulse" />
                Available to connect
              </div>

              <a
                className="floating-badge badge-code"
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {"</>"} GitHub ↗
              </a>

              <a
                className="floating-badge badge-spark"
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                in LinkedIn ↗
              </a>
            </div>
          </div>

          <a className="scroll-cue" href="#about">
            <span className="scroll-line" />
            SCROLL TO EXPLORE
          </a>
        </section>

        <section className="section-wrap section-block" id="about">
          <div className="about-grid">
            <div className="about-heading reveal">
              <p className="eyebrow">01 / ABOUT ME</p>
              <h2>
                Developer by skill.
                <br />
                <span className="gradient-text">Creator by nature.</span>
              </h2>
            </div>

            <div className="about-copy reveal">
              <p>{siteContent.about1}</p>
              <p>{siteContent.about2}</p>

              <div className="about-facts">
                <div>
                  <span>⌖</span>
                  <p>
                    Based in<strong>India</strong>
                  </p>
                </div>
                <div>
                  <span>✳</span>
                  <p>
                    Focused on<strong>Web Development</strong>
                  </p>
                </div>
                <div>
                  <span>↗</span>
                  <p>
                    Open to<strong>Collaboration</strong>
                  </p>
                </div>
              </div>

              <a
                className="text-link"
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Connect on LinkedIn <span>↗</span>
              </a>
            </div>
          </div>
        </section>

        <section className="section-wrap section-block" id="skills">
          <div className="section-heading reveal">
            <div>
              <p className="eyebrow">02 / MY TOOLKIT</p>
              <h2>
                Tools I use to <span className="gradient-text">create.</span>
              </h2>
            </div>
            <p className="section-description">
              The technologies and tools I use to bring ideas to life.
            </p>
          </div>

          <div className="skills-grid">
            {skills.map((skill, index) => (
              <article
                className="skill-card reveal"
                key={skill.name}
                style={{ "--delay": `${index * 65}ms` }}
              >
                <span className="skill-icon">{skill.icon}</span>
                <h3>{skill.name}</h3>
                <p>{skill.detail}</p>
                <span className="skill-arrow">↗</span>
              </article>
            ))}
          </div>
        </section>

        <section
          className="section-wrap section-block projects-section"
          id="projects"
        >
          <div className="section-heading reveal">
            <div>
              <p className="eyebrow">03 / SELECTED WORK</p>
              <h2>
                Ideas made <span className="gradient-text">real.</span>
              </h2>
            </div>
            <p className="section-description">
              Hover over a project to preview it. Click a row to open the live
              website.
            </p>
          </div>

          <div className="project-toolbar reveal">
            <span>FEATURED PROJECTS</span>
            <div className="project-filters" aria-label="Filter projects">
              {[
                ["all", "All Work"],
                ["web", "Websites"],
                ["design", "Design"],
              ].map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  className={
                    filter === value
                      ? "filter-button active"
                      : "filter-button"
                  }
                  aria-pressed={filter === value}
                  onClick={() => {
                    setFilter(value);
                    setHoveredProject(null);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div
            className="project-strips-wrap"
            ref={projectsRef}
            onMouseLeave={handleProjectLeave}
          >
            <div className="project-strips">
              {filteredProjects.map((project, index) => (
                <ProjectStrip
                  key={project.title}
                  project={project}
                  index={index}
                  onHover={handleProjectHover}
                  onLeave={handleProjectLeave}
                />
              ))}
            </div>

            <ProjectPreview
              project={hoveredProject}
              position={previewPosition}
            />
          </div>
        </section>

        <section
          className="section-wrap stats-section"
          aria-label="Portfolio highlights"
        >
          <div className="stat-item reveal">
            <strong>04<span>+</span></strong>
            <p>Featured project areas</p>
          </div>
          <div className="stat-item reveal">
            <strong>08<span>+</span></strong>
            <p>Core tools and skills</p>
          </div>
          <div className="stat-item reveal">
            <strong>100<span>%</span></strong>
            <p>Responsive-first mindset</p>
          </div>
          <div className="stat-item reveal">
            <strong>∞</strong>
            <p>Ideas to keep building</p>
          </div>
        </section>

        <section className="section-wrap section-block opportunity-section">
          <div className="section-heading reveal">
            <div>
              <p className="eyebrow">04 / LET'S COLLABORATE</p>
              <h2>
                Good things start with
                <br />
                <span className="gradient-text">a conversation.</span>
              </h2>
            </div>
          </div>

          <div className="opportunity-grid">
            <article className="opportunity-card reveal">
              <span className="opportunity-number">01</span>
              <p className="eyebrow">FOR RECRUITERS</p>
              <h3>Let's build great products together.</h3>
              <p>
                Interested in a developer who thinks across the application
                and enjoys learning new technologies?
              </p>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Connect on LinkedIn <span>↗</span>
              </a>
            </article>

            <article className="opportunity-card opportunity-highlight reveal">
              <span className="opportunity-number">02</span>
              <p className="eyebrow">FOR CLIENTS</p>
              <h3>Have an idea? Let's make it happen.</h3>
              <p>
                Need a business website, landing page or help improving your
                existing digital experience?
              </p>
              <a href="#contact">
                Start a conversation <span>↗</span>
              </a>
            </article>
          </div>
        </section>

        <section
          className="section-wrap section-block contact-section"
          id="contact"
        >
          <div className="contact-grid">
            <div className="contact-copy reveal">
              <p className="eyebrow">05 / GET IN TOUCH</p>
              <h2>
                Let's create
                <br />
                something <span className="gradient-text">great.</span>
              </h2>
              <p>
                Have a project, job opportunity or collaboration in mind? Send
                me the details on WhatsApp and let's talk about what we can
                build together.
              </p>

              <div className="contact-social-block">
                <span>LET'S CONNECT</span>
                <SocialLinks compact />
              </div>

              <div className="contact-email">
                <span>WHATSAPP ME</span>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +91 63889 17812 ↗
                </a>
              </div>

              <a
                className="text-link contact-linkedin"
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                View my LinkedIn profile ↗
              </a>
            </div>

            <form className="contact-form reveal" onSubmit={handleSubmit}>
              <div className="form-title">
                <span>PROJECT ENQUIRY</span>
                <span>✳</span>
              </div>

              <div className="form-row">
                <label>
                  Your name
                  <input
                    name="from_name"
                    placeholder="e.g. Rahul Sharma"
                    autoComplete="name"
                    required
                  />
                </label>

                <label>
                  Email or contact (optional)
                  <input
                    name="reply_to"
                    type="text"
                    placeholder="you@example.com or phone"
                    autoComplete="email"
                  />
                </label>
              </div>

              <label>
                What would you like to discuss?
                <select name="subject" defaultValue="Website development">
                  <option>Website development</option>
                  <option>Full-stack developer role</option>
                  <option>UI/UX or branding</option>
                  <option>Freelance opportunity</option>
                  <option>Other</option>
                </select>
              </label>

              <label>
                Your message
                <textarea
                  name="message"
                  placeholder="Tell me a little about your idea..."
                  rows="5"
                  required
                />
              </label>

              <button
                className="button button-primary submit-button"
                type="submit"
                disabled={sending}
              >
                {sending ? "Saving..." : "Continue on WhatsApp"} <span>↗</span>
              </button>

              {formStatus && (
                <p className="form-status" role="status">
                  {formStatus}
                </p>
              )}

              <p className="form-note">
                Your enquiry will open in WhatsApp. Review it and press Send
                to message me.
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <a className="brand" href="#home">
            Sujal<span>.</span>
          </a>
          <p>Designed with curiosity. Built with care.</p>
          <div className="footer-right">
            <SocialLinks compact />
            <span>© {new Date().getFullYear()} Sujal Sharma</span>
          </div>
        </div>
      </footer>

      <a className="back-to-top" href="#home" aria-label="Back to top">
        ↑
      </a>
    </div>
  );
}

export default App;
