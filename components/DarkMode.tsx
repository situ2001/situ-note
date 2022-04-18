import { FiMoon, FiSun } from "react-icons/fi";
import { useDarkMode } from "../hooks/useDarkMode";

const DarkMode = () => {
  const { isDarkMode, toggle } = useDarkMode();

  return (
    <div className="ml-2 flex justify-center items-center">
      <label className="swap swap-rotate">
        <input
          type="checkbox"
          onChange={() => {}}
          onClick={toggle}
          checked={isDarkMode}
        />
        <FiSun className="swap-off" />
        <FiMoon className="swap-on" />
      </label>
    </div>
  );
};

export default DarkMode;
