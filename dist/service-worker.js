importScripts("/precache-manifest.3cd2f1a059c78ca1dd29220deb7bf092.js", "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

if (workbox) {
  console.log(`Workbox is loaded`)
  self.__precacheManifest = [].concat(self.__precacheManifest || [])
  workbox.precaching.suppressWarnings()
  workbox.precaching.precacheAndRoute(self.__precacheManifest, {})

  // install new service worker when ok, then reload page.
  self.addEventListener('message', msg => {
    if (msg.data.action == 'skipWaiting') {
      self.skipWaiting()
    }
  })
} else {
  console.log(`Workbox didn't load`)
}

