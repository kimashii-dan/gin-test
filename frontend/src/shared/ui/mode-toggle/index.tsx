import { useTheme } from "../../hooks/useTheme";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
export default function ModeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      className="p-2 border-border border-1 rounded-lg"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <MoonIcon className="size-5" />
      ) : (
        <SunIcon className="size-5" />
      )}
    </button>
  );
}
