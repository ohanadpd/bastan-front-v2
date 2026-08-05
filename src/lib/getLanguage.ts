'use server';
import { cookies } from 'next/headers';

export const getLanguage = async () => {
  const cookieStore = await cookies();
  return cookieStore.get('lang')?.value || 'fa';
}