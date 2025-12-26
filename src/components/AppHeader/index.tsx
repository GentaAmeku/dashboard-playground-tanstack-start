import { SidebarTrigger } from "@/components/ui/sidebar";
import ToggleThemeButton from "./components/ToggleThemeButton";

export default function AppHeader() {
  return (
    <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
      <SidebarTrigger variant="outline" />
      <div className="flex items-center">
        <ToggleThemeButton />
      </div>
    </div>
  );
}
