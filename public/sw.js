/* PoshanMitra service worker — offline app shell + runtime caching.
 *
 * Strategy:
 *  - Precache the app shell so the UI opens with no network.
 *  - Navigations: network-first, falling back to the cached shell (SPA).
 *  - Same-origin assets (JS/CSS/img): stale-while-revalidate.
 *  - Google Fonts: cache-first so type still renders offline.
 *  - Gemini API (generativelanguage) is NEVER cached — chat needs a live network;
 *    when offline it fails and the app shows its "couldn't reach Mitra" message.
 *
 * Bump CACHE_VERSION to force clients onto a new shell.
 */
const CACHE_VERSION = 'pm-v1'
const SHELL_CACHE = `${CACHE_VERSION}-shell`
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`
const FONT_CACHE = `${CACHE_VERSION}-fonts`

const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !k.startsWith(CACHE_VERSION))
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  )
})

function isFontRequest(url) {
  return url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com'
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Never intercept the model API — chat must be live.
  if (url.hostname === 'generativelanguage.googleapis.com') return

  // SPA navigations: network-first, fall back to the cached shell.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone()
          caches.open(SHELL_CACHE).then((c) => c.put('/', copy)).catch(() => {})
          return res
        })
        .catch(() => caches.match('/').then((r) => r || caches.match('/index.html')))
    )
    return
  }

  // Google Fonts: cache-first (rarely change, nice to have offline).
  if (isFontRequest(url)) {
    event.respondWith(
      caches.open(FONT_CACHE).then(async (cache) => {
        const hit = await cache.match(request)
        if (hit) return hit
        try {
          const res = await fetch(request)
          if (res.ok || res.type === 'opaque') cache.put(request, res.clone())
          return res
        } catch {
          return hit || Response.error()
        }
      })
    )
    return
  }

  // Same-origin assets: stale-while-revalidate.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        const hit = await cache.match(request)
        const fetching = fetch(request)
          .then((res) => {
            if (res.ok) cache.put(request, res.clone())
            return res
          })
          .catch(() => hit)
        return hit || fetching
      })
    )
  }
})
