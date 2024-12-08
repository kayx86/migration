import { useUniversalLinks } from "./types";

export const buildUrl = (path: string, params: URLSearchParams) =>
    `${
      useUniversalLinks ? "https://phantom.app/ul/" : "phantom://"
  }v1/${path}?${params.toString()}`;

