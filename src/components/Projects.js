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
        const username = "agjivovich";

        const response = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`
        );

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();

        const filtered = data.filter((repo) => repo.owner?.login === username).slice(0, 10);

        // Fetch languages for each repo
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
    </section>
  );
}