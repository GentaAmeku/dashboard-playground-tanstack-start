import * as z from "zod";

export const themeSchema = z.enum(["light", "dark"]);

export type Theme = z.infer<typeof themeSchema>;

export const THEME_COOKIE_KEY = "app-theme-pref";
