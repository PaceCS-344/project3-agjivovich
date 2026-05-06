// filepath: src/components/Projects.js
import { useEffect, useState } from "react";
import Button from "./Button";

export default function Projects({ highlight }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalDetails, setModalDetails] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const username = "agjivovich";

        const response = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`
        );

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();

        const filtered = data.filter((repo) => repo.owner?.login === username).slice(0, 10);

        const formattedProjects = await Promise.all(
          filtered.map(async (repo) => {
            let languages = [];
            try {
              const langResponse = await fetch(repo.languages_url);
              if (langResponse.ok) {
                const langData = await langResponse.json();
                languages = Object.keys(langData);
              }
            } catch {
              // ignore language fetch errors
            }

            return {
              id: repo.id,
              title: repo.name,
              description: repo.description || "No description available yet.",
              technologies: repo.topics && repo.topics.length > 0 ? repo.topics : ["GitHub"],
              repoUrl: repo.html_url,
              homepage: repo.homepage,
              fork: repo.fork,
              languages: languages.length > 0 ? languages : ["Not specified"],
              fullName: repo.full_name,
              stars: repo.stargazers_count,
              watchers: repo.watchers_count,
              issues: repo.open_issues_count,
            };
          })
        );

        setProjects(formattedProjects);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching projects:", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const openModal = async (project) => {
    setSelectedProject(project);
    setModalLoading(true);
    setModalDetails(null);

    try {
      const [contributorsRes, releasesRes] = await Promise.all([
        fetch(`https://api.github.com/repos/${project.fullName}/contributors`),
        fetch(`https://api.github.com/repos/${project.fullName}/releases`),
      ]);

      const contributors = contributorsRes.ok ? await contributorsRes.json() : [];
      const releases = releasesRes.ok ? await releasesRes.json() : [];

      setModalDetails({
        contributors: Array.isArray(contributors) ? contributors.slice(0, 5) : [],
        latestRelease: releases.length > 0 ? releases[0].tag_name : "No releases yet",
      });
    } catch {
      setModalDetails({ contributors: [], latestRelease: "unavailable" });
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedProject(null);
    setModalDetails(null);
  };

  return (
    <section id="projects" className={`section projects ${highlight ? "highlighted-search" : ""}`}>
      <h2 className="section-title">Projects</h2>

      {loading && <p className="loading-text">Loading projects from GitHub...</p>}
      {error && <p className="error-text">Error loading projects: {error}</p>}

      {!loading && projects.length > 0 && (
        <div className="projects-grid">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card"
              onClick={() => openModal(project)}
              style={{ cursor: "pointer" }}
            >
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <div className="project-technologies">
                {project.technologies.map((tech) => {
                  const isMatched = highlight && tech.toLowerCase().includes(highlight);
                  return (
                    <span
                      key={tech}
                      className={`technology-tag ${isMatched ? "technology-tag-matched" : ""}`}
                    >
                      {tech}
                    </span>
                  );
                })}
                {project.languages.map((lang) => (
                  <span key={lang} className="technology-tag">
                    {lang}
                  </span>
                ))}
              </div>
              <div className="project-links">
                <Button variant="outline" href={project.repoUrl}>
                  View Code
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && projects.length === 0 && !error && (
        <p className="no-projects-text">No projects found. Check your GitHub repositories.</p>
      )}

      {/* Modal */}
      {selectedProject && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>
            <h2 className="modal-title">{selectedProject.title}</h2>
            <p className="modal-description">{selectedProject.description}</p>

            <div className="modal-stats">
              <span>⭐ {selectedProject.stars} Stars</span>
              <span>👁 {selectedProject.watchers} Watchers</span>
              <span>🐛 {selectedProject.issues} Open Issues</span>
            </div>

            {modalLoading && <p className="loading-text">Loading details...</p>}

            {modalDetails && (
              <>
                <div className="modal-section">
                  <h4>Latest Release</h4>
                  <p>{modalDetails.latestRelease}</p>
                </div>
                <div className="modal-section">
                  <h4>Contributors</h4>
                  {modalDetails.contributors.length > 0 ? (
                    <div className="modal-contributors">
                      {modalDetails.contributors.map((c) => (
                        <a key={c.id} href={c.html_url} target="_blank" rel="noopener noreferrer">
                          <img src={c.avatar_url} alt={c.login} title={c.login} className="contributor-avatar" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p>No contributors found.</p>
                  )}
                </div>
              </>
            )}

            <div className="modal-footer">
              <Button variant="outline" href={selectedProject.repoUrl}>
                View on GitHub
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}