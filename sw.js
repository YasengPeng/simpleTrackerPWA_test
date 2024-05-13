const VERSION = "v1";

const CACHE_NAME = `period-tracker-${VERSION}`;

const APP_STATIC_RESOURCES = [
  "./",
  "./index.html",
  "./app.js",
  "./style.css",
  "./circle.svg",
];

const addResourcesToCache = async (resources) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
};

self.addEventListener('install', (event) => {
  console.log('install');
  event.waitUntil(
    addResourcesToCache(APP_STATIC_RESOURCES)
  );
});

const cacheFirst = async (request) => {
  console.log(request.url);
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    console.log('responseFromCache');
    return responseFromCache;
  }

  try {
    const responseFromNetwork = await fetch(request.clone());
    console.log('responseFromNetwork');
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
};

self.addEventListener('fetch', (event) => {
  event.respondWith(
    cacheFirst(event.request)
  );
});