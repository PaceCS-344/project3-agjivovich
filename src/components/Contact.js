// filepath: src/components/Contact.js
import Button from "./Button";

export default function Contact({ highlight }) {
  const contactInfo = {
    email: "dominicgjivovich@gmail.com",
    linkedin: "https://www.linkedin.com/in/anthonygjivovich/",
    github: "https://github.com/agjivovich",
  };

  return (
    <section id="contact" className={`section contact ${highlight ? "highlighted-search" : ""}`}>
      <h2 className="section-title">Get In Touch</h2>
      <p className="contact-intro">
        Feel free to reach out at the following:
      </p>
      <div className="contact-links">
        {(() => {
          const emailMatched = highlight && contactInfo.email.includes(highlight);
          const linkedinMatched = highlight && "linkedin".includes(highlight);
          const githubMatched = highlight && "github".includes(highlight);
          return (
            <>
              <Button 
                href={`mailto:${contactInfo.email}`}
                className={emailMatched ? "button-matched" : ""}
              >
                📧 {contactInfo.email}
              </Button>
              <Button 
                href={contactInfo.linkedin}
                className={linkedinMatched ? "button-matched" : ""}
              >
                💼 LinkedIn
              </Button>
              <Button 
                href={contactInfo.github}
                className={githubMatched ? "button-matched" : ""}
              >
                🐙 GitHub
              </Button>
            </>
          );
        })()}
      </div>
    </section>
  );
}