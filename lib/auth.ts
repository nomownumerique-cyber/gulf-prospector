import { cookies } from "next/headers";
const COOKIE = "sahm_auth";
export function checkPassword(pw: string): boolean {
  return !!process.env.APP_PASSWORD && pw === process.env.APP_PASSWORD;
}
export function setAuthCookie() {
  cookies().set(COOKIE, "1", { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7 });
}
export function isAuthed(): boolean {
  return cookies().get(COOKIE)?.value === "1";
}