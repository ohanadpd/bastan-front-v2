import axios from 'axios';
import Cookies from 'js-cookie';
import { getLanguage } from '../getLanguage';
// import { cookies } from 'next/headers'
// NOTE: Do not import `auth` from '@/auth' or `getSession` from 'next-auth/react' at the top-level here 
// because this file is used in both browser and server. We'll dynamically import them inside the interceptor.

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getLang = async () => {
  let lang;
  try {
    lang = await getLanguage();
  } catch (error) {
    lang = Cookies.get('lang') || 'fa';
  }
  return lang;
}

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to every request
apiClient.interceptors.request.use(
  async (config) => {
    let token: string | undefined;
    if (typeof window === 'undefined') {
      // Server-side: use NextAuth auth() to read the session
      const { auth } = await import('@/auth');
      const session = await auth();
      token = session?.accessToken;
    } else {
      // Client-side: use getSession from next-auth/react (dynamic import to avoid server bundle issues)
      const { getSession } = await import('next-auth/react');
      const session = await getSession();
      token = (session as any)?.accessToken as string | undefined;
    }
    const lang = await getLang();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (lang) {
      config.headers['Accept-Language'] = lang;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // These APIs are only available in the browser.
      if (typeof window !== 'undefined') {
        // Clear auth tokens
        Cookies.remove('access');
        Cookies.remove('refresh');

        // Redirect to login page
        const currentLocale = Cookies.get('lang') || 'fa';
        window.location.href = `/${currentLocale}/auth/login`;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;