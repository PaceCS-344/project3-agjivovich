// filepath: src/components/Button.js
import "../styles.css";

export default function Button({ children, onClick, variant = "primary", href, className = "" }) {
  const buttonClass = `button button-${variant} ${className}`.trim();
  
  if (href) {
    return (
      <a href={href} className={buttonClass} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  
  return (
    <button className={buttonClass} onClick={onClick}>
      {children}
    </button>
  );
}