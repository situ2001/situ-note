import { FiMoon, FiSun } from "react-icons/fi";
import { useDarkMode } from "../hooks/useDarkMode";

const DarkMode = () => {
  const { currentTheme, setTheme } = useDarkMode();

  return (
    <div className="flex justify-center items-center">
      <label className="swap swap-rotate btn btn-ghost">
        <input
          type="checkbox"
          onChange={() => {}}
          onClick={(e: any) => {
            setTheme(e.target.checked ? "dark" : "light");
          }}
          checked={currentTheme === "dark"}
        />
        <FiSun className="swap-off" size={20} />
        <FiMoon className="swap-on" size={20} />
      </label>
    </div>
  );
};

export default DarkMode;
