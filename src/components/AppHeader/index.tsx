import { SidebarTrigger } from "@/components/ui/sidebar";

export default function AppHeader() {
  return (
    <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger variant="outline" />
    </div>
  );
}
