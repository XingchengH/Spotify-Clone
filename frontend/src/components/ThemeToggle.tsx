import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.getAttribute("data-theme") !== "light"
  );

  const toggle = () => {
    const next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setIsDark(!isDark);
  };

  return (
    <button
      className="sp-theme-toggle"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        className="sp-theme-toggle-knob"
        animate={{ x: isDark ? 0 : 22 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
      >
        <FontAwesomeIcon icon={isDark ? faMoon : faSun} />
      </motion.div>
    </button>
  );
}
