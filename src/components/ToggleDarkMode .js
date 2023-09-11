import { useEffect, useState } from "react";
import { CiDark } from "react-icons/ci";
import { MdOutlineLightMode } from "react-icons/md";

const ToggleDarkMode = ({ theme, setTheme }) => {
  const toggleMode = () => {
    const updatedTheme = theme === "light" ? "system" : "light";
    setTheme(updatedTheme);
    localStorage.setItem("theme", updatedTheme);
  };

  useEffect(() => {
    theme === "system"
      ? document.body.classList.add("dark-mode")
      : document.body.classList.remove("dark-mode");
  }, [theme]);

  return (
    <div>
      <button className="mode-webpage" onClick={toggleMode}>
        {theme === "dark" ? (
          <MdOutlineLightMode
            style={{ color: "rgb(255, 255, 255)" }}
            size={"28"}
            title="Ligth Mode"
          />
        ) : (
          <CiDark size={"28"} title="Dark Mode" />
        )}
      </button>
    </div>
  );
};

export default ToggleDarkMode;
