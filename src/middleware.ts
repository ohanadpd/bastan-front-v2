/*
 * For more info see
 * https://nextjs.org/docs/app/building-your-application/routing/internationalization
 * */
import { type NextRequest, NextResponse } from 'next/server'

import Negotiator from 'negotiator'
import linguiConfig from '../lingui.config'

const { locales } = linguiConfig

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    const locale = pathname.split('/')[1]
    const response = NextResponse.next()
    response.cookies.set('lang', locale)
    return response
  }

  // Redirect if there is no locale
  const locale = getRequestLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  // e.g. incoming request is /products
  // The new URL is now /en/products
  const response = NextResponse.redirect(request.nextUrl)
  // Set the cookie on the response object
  response.cookies.set('lang', locale)
  return response
}

function getRequestLocale(request: NextRequest): string {
  const langHeader = request.cookies.get('lang')?.value || 'fa'
  // const langHeader = "fa"
  const languages = new Negotiator({
    headers: { 'accept-language': langHeader }
  }).languages(locales.slice())

  const activeLocale = languages[0] || locales[0] || 'en'
  return activeLocale
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * - api/auth/* (authentication routes)
     * Feel free to modify this pattern to include more paths.
     */
    // Exclude API routes (like NextAuth), Next static assets, images, and favicon from locale middleware
    '/((?!api/auth|api/|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|webm|mp4|lottie|json|ico)$).*)'
  ]
}