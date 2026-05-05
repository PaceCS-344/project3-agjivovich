// filepath: src/components/Skills.js
export default function Skills({ highlight }) {
  const skillCategories = [
    {
      title: "Programming",
      skills: ["Python", "Java", "Go", "node.js","SQL", "Swift", "JavaScript", "PowerShell"]
    },
    {
      title: "Tools & Systems",
      skills: ["Intune", "Jamf", "Active Directory", "AWS", "PostgreSQL"]
    },
    {
      title: "Productivity",
      skills: ["Microsoft 365", "macOS", "Agile", "Scrum", "Notion", "Jira", "Slack"]
    }
  ];

  return (
    <section id="skills" className={`section skills ${highlight ? "highlighted-search" : ""}`}>
      <h2 className="section-title">Skills</h2>
      <div className="skills-grid">
        {skillCategories.map((category) => (
          <div key={category.title} className="skill-category">
            <h3 className="skill-category-title">{category.title}</h3>
            <div className="skill-tags">
              {category.skills.map((skill) => {
                const isMatched = highlight && skill.toLowerCase().includes(highlight);
                return (
                  <span 
                    key={skill} 
                    className={`skill-tag ${isMatched ? "skill-tag-matched" : ""}`}
                  >
                    {skill}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}