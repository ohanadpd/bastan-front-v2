import axios from "axios";
import Cookies from "js-cookie";
import { getLanguage } from "../getLanguage";

// NOTE: Do not import `auth` from '@/auth' or `getSession` from 'next-auth/react'
// at the top-level because this file is used in both browser and server.

const getLang = async () => {
  let lang;

  try {
    lang = await getLanguage();
  } catch (error) {
    lang = Cookies.get("lang") || "fa";
  }

  return lang;
};

const apiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the auth token to every request
apiClient.interceptors.request.use(
  async (config) => {
    if (typeof window === "undefined") {
      const publicApi = process.env.NEXT_PUBLIC_API_URL;
      const internalApi = process.env.INTERNAL_API_URL;

      if (config.url?.startsWith("http") && publicApi && internalApi) {
        config.url = config.url.replace(publicApi, internalApi);
        config.baseURL = "";
      } else {
        config.baseURL = internalApi;
      }
    } else {
      config.baseURL = process.env.NEXT_PUBLIC_API_URL;
    }

    let token: string | undefined;

    if (typeof window === "undefined") {
      // Server-side: use NextAuth auth() to read the session
      const { auth } = await import("@/auth");
      const session = await auth();
      token = session?.accessToken;
    } else {
      // Client-side: use getSession from next-auth/react
      const { getSession } = await import("next-auth/react");
      const session = await getSession();
      token = (session as any)?.accessToken as string | undefined;
    }

    const lang = await getLang();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (lang) {
      config.headers["Accept-Language"] = lang;
    }

    if (typeof window === "undefined") {
      config.headers["Host"] = "contino-bastan.bastantile.com";
      config.headers["X-Forwarded-Host"] = "contino-bastan.bastantile.com";
      config.headers["X-Forwarded-Proto"] = "https";
      config.headers["X-Forwarded-Port"] = "443";
    }
    if (config.url) {
      const [path, query] = config.url.split("?");

      if (/\/\d+$/.test(path)) {
        config.url = `${path}/${query ? `?${query}` : ""}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add a response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // These APIs are only available in the browser.
      if (typeof window !== "undefined") {
        Cookies.remove("access");
        Cookies.remove("refresh");

        const currentLocale = Cookies.get("lang") || "fa";
        window.location.href = `/${currentLocale}/auth/login`;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
