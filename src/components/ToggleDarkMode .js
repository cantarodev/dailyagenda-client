import { useEffect, useState } from "react";
import { CiDark } from "react-icons/ci";
import { MdOutlineLightMode } from "react-icons/md";

const ToggleDarkMode = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const toggleMode = () => {
    const updatedTheme = theme === "light" ? "dark" : "light";
    setTheme(updatedTheme);
    localStorage.setItem("theme", updatedTheme);
  };

  useEffect(() => {
    theme === "dark"
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
