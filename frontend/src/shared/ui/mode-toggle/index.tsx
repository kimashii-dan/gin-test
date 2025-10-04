import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../hooks/useTheme";

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      className="p-2 border-secondary border-1 rounded-md bg-secondary text-secondary-foreground"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <MoonIcon className="size-6" />
      ) : (
        <SunIcon className="size-6" />
      )}
    </button>
  );
}
