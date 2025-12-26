import { useRouter } from "@tanstack/react-router";
import { getTheme, updateTheme } from "@/lib/server/theme";

export function useToggleTheme() {
  const router = useRouter();

  const handleClickToggleTheme = async () => {
    const themeResult = await getTheme();
    const newTheme = themeResult.value === "light" ? "dark" : "light";
    await updateTheme({ data: newTheme });
    router.invalidate();
  };

  return { handleClickToggleTheme };
}
