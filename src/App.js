// filepath: src/App.js
import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import EasterEgg from "./components/EasterEgg";
import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const matches = useMemo(() => {
    if (!normalizedQuery) {
      return { about: null, skills: null, projects: null, contact: null };
    }

    const aboutKeywords = [
      "computer science",
      "pforzheimer honors college",
      "pace university",
      "mathematics",
      "hardware/software troubleshooting",
      "device management",
      "intune",
      "jamf",
      "it operations",
      "plasticprophet",
      "coding club",
      "budget committee",
    ];

    const skillKeywords = [
      "python",
      "sql",
      "swift",
      "javascript",
      "jira",
      "github",
      "intune",
      "jamf",
      "active directory",
      "aws",
      "postgresql",
      "microsoft 365",
      "google workspace",
      "agile",
      "technical support",
    ];

    const projectKeywords = [
      "plasticprophet",
      "ios",
      "credit card",
      "savings application",
      "agile",
      "postgresql",
      "backend",
      "geofencing",
      "notification systems",
      "github",
      "jira",
    ];

    const contactKeywords = [
      "dominicgjivovich@gmail.com",
      "linkedin",
      "email",
      "contact",
    ];

    return {
      about: aboutKeywords.find((kw) => kw.includes(normalizedQuery)) || null,
      skills: skillKeywords.find((kw) => kw.includes(normalizedQuery)) || null,
      projects: projectKeywords.find((kw) => kw.includes(normalizedQuery)) || null,
      contact: contactKeywords.find((kw) => kw.includes(normalizedQuery)) || null,
    };
  }, [normalizedQuery]);

  const firstMatch = useMemo(() => {
    if (!normalizedQuery) return null;
    if (matches.about) return "about";
    if (matches.skills) return "skills";
    if (matches.projects) return "projects";
    if (matches.contact) return "contact";
    return null;
  }, [matches, normalizedQuery]);

  useEffect(() => {
    if (!firstMatch) return;
    const element = document.getElementById(firstMatch);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [firstMatch]);

  return (
    <ThemeProvider>
      <div className="app">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <main className="main-content">
          <Hero />
          <About highlight={matches.about} />
          <Skills highlight={matches.skills} />
          <Projects highlight={matches.projects} />
          <Contact highlight={matches.contact} />
        </main>
        <footer className="footer">
          <p>© {new Date().getFullYear()} Built with React.</p>
        </footer>
        <EasterEgg />
      </div>
    </ThemeProvider>
  );
}

