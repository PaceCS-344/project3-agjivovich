// filepath: src/components/Projects.js
import { useEffect, useState } from "react";
import Button from "./Button";

export default function Projects({ highlight }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const username = process.env.REACT_APP_GITHUB_USERNAME;
        const token = process.env.REACT_APP_GITHUB_TOKEN;

        if (!token || !username) {
          throw new Error("GitHub token or username not configured. Check .env.local");
        }

        const authSchemes = [
          `Bearer ${token}`,
          `token ${token}`,
        ];
        const endpoints = [
          `https://api.github.com/user/repos?sort=updated&per_page=10`,
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`,
        ];

        let response = null;
        let data = null;

        for (const scheme of authSchemes) {
          for (const endpoint of endpoints) {
            response = await fetch(endpoint, {
              headers: {
                Authorization: scheme,
                Accept: "application/vnd.github+json",
              },
            });

            if (response.ok) {
              data = await response.json();
              break;
            }

            if (response.status === 401 || response.status === 403) {
              continue;
            }
          }

          if (data) {
            break;
          }
        }

        if (!response || !response.ok) {
          let message = `GitHub API error: ${response ? response.status : "unknown"}`;
          try {
            const body = response ? await response.json() : null;
            if (body && body.message) {
              message += ` - ${body.message}`;
            }
          } catch (parseError) {
            // ignore parse errors
          }
          throw new Error(message);
        }

        // Filter and transform repositories
        const formattedProjects = data
          .filter((repo) => repo.owner?.login === username)
          .map((repo) => ({
            id: repo.id,
            title: repo.name,
            description: repo.description || "No description available yet.",
            technologies: repo.topics && repo.topics.length > 0 ? repo.topics : ["GitHub"],
            repoUrl: repo.html_url,
            homepage: repo.homepage,
            fork: repo.fork,
          }))
          .slice(0, 10); // Limit to 10 projects

        setProjects(formattedProjects);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching projects:", err);
        // Fallback to empty state
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section id="projects" className={`section projects ${highlight ? "highlighted-search" : ""}`}>
      <h2 className="section-title">Projects</h2>

      {loading && <p className="loading-text">Loading projects from GitHub...</p>}
      {error && <p className="error-text">Error loading projects: {error}</p>}

      {!loading && projects.length > 0 && (
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
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
    </section>
  );
}