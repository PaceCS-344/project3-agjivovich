// filepath: src/components/EasterEgg.js
import { useState } from "react";
import "../styles/easter-egg.css";
import easterGif from "../john.gif";

export default function EasterEgg() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="easter-egg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div className="easter-egg-content">
          <img src={easterGif} alt="Easter Egg" />
        </div>
      )}
    </div>
  );
}
