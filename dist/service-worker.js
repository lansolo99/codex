importScripts("/precache-manifest.d6f49025837f01a6d7369c6cd00b33c4.js", "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

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

