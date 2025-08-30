const CACHE_NAME = 'drunkenpilot-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/App.vue',
  '/src/style.css',
  '/src/data/cards.json',
  '/src/components/GameSetup.vue',
  '/src/components/GameController.vue',
  '/src/components/CardDisplay.vue',
  '/src/components/PlayerList.vue',
  '/src/components/TimerComponent.vue',
  '/src/components/StatsComponent.vue',
  'https://fonts.googleapis.com/css2?family=Pirata+One&family=Roboto:wght@400;500;700&display=swap'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response
        }
        return fetch(event.request)
      })
  )
})