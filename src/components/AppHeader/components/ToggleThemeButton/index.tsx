import { SunMoon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToggleTheme } from "./hooks/useToggleTheme";

export default function ToggleThemeButton() {
  const { handleClickToggleTheme } = useToggleTheme();
  return (
    <Button variant="outline" size="icon" onClick={handleClickToggleTheme}>
      <SunMoon />
    </Button>
  );
}
