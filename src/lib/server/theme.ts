import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { ok } from "@/lib/result";
import { THEME_COOKIE_KEY, type Theme, themeSchema } from "@/lib/schema/theme";

export const getTheme = createServerFn({ method: "GET" }).handler(() => {
  const cookieValue = getCookie(THEME_COOKIE_KEY);
  const result = themeSchema.safeParse(cookieValue);
  const theme = result.success ? result.data : "light";
  return ok(theme);
});

export const updateTheme = createServerFn({ method: "POST" })
  .inputValidator((data: Theme) => data)
  .handler(({ data }) => {
    setCookie(THEME_COOKIE_KEY, data, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365 * 1, // 1 year
      sameSite: "lax",
      httpOnly: false,
      secure: false,
    });
    return ok(data);
  });
