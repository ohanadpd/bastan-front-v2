import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import moment from "moment-jalaali";

// بارگذاری فارسی
moment.loadPersian({ dialect: "persian-modern" });

/**
 * تبدیل تاریخ میلادی به شمسی با فرمت "ماه YYYY"
 * @param {string} dateStr - تاریخ میلادی به فرمت "YYYY-MM-DD"
 * @returns {string} - تاریخ شمسی به فرمت "ماه YYYY"
 */
export function toPersianDate(dateStr: string) : string {
  if (!dateStr) return "";
  return moment(dateStr, "YYYY-MM-DD").format("jMMMM jYYYY");
}

/**
 * تبدیل تاریخ ISO به شمسی با فرمت "YYYY/MM/DD HH:mm"
 * @param {string} isoDate - تاریخ ISO (مثل "2024-02-22T22:30:00Z")
 * @returns {string} - تاریخ شمسی به فرمت "1403/12/03 22:30"
 */
export function formatIsoToJalali(isoDate: string): string {
  if (!isoDate) return "";
  return moment(isoDate).format("jYYYY/jMM/jDD HH:mm");
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMediaUrl(image: string | null | undefined) {
  if (!image) {
    return ''
  }
  if (image.startsWith('http')) {
    return image
  }
  return `${process.env.NEXT_PUBLIC_BASE_URL}${image}`
}