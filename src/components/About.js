// filepath: src/components/About.js
import { useEffect, useState } from "react";

export default function About({ highlight }) {
  const [githubProfile, setGithubProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("https://api.github.com/users/agjivovich");
        if (response.ok) {
          const data = await response.json();
          setGithubProfile(data);
        }
      } catch {
        // silently fail, page still works without it
      }
    };
    fetchProfile();
  }, []);

  const achievements = [
    "Building PlasticProphet iOS app",
    "Vice President of Pace University Coding Club",
    "Student Representative on university tech budget committee"
  ];

  return (
    <section id="about" className={`section about ${highlight ? "highlighted-search" : ""}`}>
      <h2 className="section-title">About Me</h2>
      <div className="about-content">
        <div className="about-profile-column">
          <div className="about-profile">
            <img
              src={githubProfile?.avatar_url || "https://media.licdn.com/dms/image/v2/D5603AQEPYJBLVbxJSw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1707195379724?e=1779321600&v=beta&t=u6Qc9qn4nsSoCFDPGhOKU2VJKM3eky2BcDqKJJVch4E"}
              alt="Anthony Gjivovich"
              className="profile-photo"
            />
          </div>

          {githubProfile && (
            <div className="github-stats">
              <span>👥 {githubProfile.followers} Followers</span>
              <span>📁 {githubProfile.public_repos} Public Repos</span>
              {githubProfile.public_gists > 0 && (
                <span>📝 {githubProfile.public_gists} Gists</span>
              )}
            </div>
          )}

          <div className="about-highlights">
            <div className="highlight-card">
              <h3>🏆 Achievements</h3>
              <ul>
                {achievements.map((achievement, idx) => {
                  const isMatched = highlight && achievement.toLowerCase().includes(highlight);
                  return (
                    <li key={idx} className={isMatched ? "achievement-matched" : ""}>
                      {achievement}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        <div className="about-right">
          <div className="about-text">
            <p>
              I'm a Computer Science student at the Pforzheimer Honors College at
              Pace University with a Minor in Mathematics.
            </p>
            <p>
              I have experience with hardware/software troubleshooting, device management (Intune & Jamf), and IT operations.
            </p>
          </div>
          <img
            src="/images/fire.jpg"
            alt="Anthony"
            className="about-secondary-photo"
          />
        </div>
      </div>
    </section>
  );
}