// filepath: src/components/Header.js
import Button from "./Button";
import { useTheme } from "../context/ThemeContext";
import "../styles/toggle-switch.css";

export default function Header({ searchQuery, setSearchQuery }) {
  const { isDark, setIsDark } = useTheme();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        {/* Name removed from header bar */}
        <nav className="header-nav">
          <Button variant="nav" onClick={() => scrollToSection("about")}>About</Button>
          <Button variant="nav" onClick={() => scrollToSection("skills")}>Skills</Button>
          <Button variant="nav" onClick={() => scrollToSection("projects")}>Projects</Button>
          <Button variant="nav" onClick={() => scrollToSection("contact")}>Contact</Button>
        </nav>
        <div className="header-actions">
          <input
            className="search-input"
            type="search"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search skills"
          />
          <label className="toggle-switch" title={isDark ? "Light mode" : "Dark mode"}>
            <input 
              type="checkbox" 
              checked={isDark}
              onChange={(e) => setIsDark(e.target.checked)}
              aria-label="Toggle theme"
            />
            <span className="slider">
              <span className="icon sun-icon"></span>
              <span className="icon moon-icon"></span>
              <span className="knob"></span>
            </span>
          </label>
        </div>
      </div>
    </header>
  );
}