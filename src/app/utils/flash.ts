import 'hono';
import type { Context, Next } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';

declare module 'hono' {
  interface Context {
    flash: {
      set(type: string, message: string | string[]): void;
      get(): Record<string, string[]>;
    };
  }
}

const FLASH_COOKIE = 'flash';

export const flashMiddleware = async (c: Context, next: Next) => {
  // Read cookie (JSON object) and clear
  const cookieVal = getCookie(c, FLASH_COOKIE);
  let stored: Record<string, string[]> = {};
  if (cookieVal) {
    try {
      stored = JSON.parse(cookieVal);
    } catch {
      stored = {};
    }
  }

  // Cache in memory for this request
  const cache: Record<string, string[]> = structuredClone(stored);

  c.flash = {
    set(type: string, messages: string | string[]) {
      const obj = { ...cache };
      if (!obj[type]) obj[type] = [];
      obj[type].push(...messages);
      setCookie(c, FLASH_COOKIE, JSON.stringify(obj), { httpOnly: true });
    },
    get() {
      setCookie(c, FLASH_COOKIE, '', { maxAge: 0 });
      return cache;
    },
  };

  await next();
};
