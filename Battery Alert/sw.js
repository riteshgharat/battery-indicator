var CACHE_VERSION = 'app-v1';
var CACHE_FILES = [
    '/',
    'index.html',
    '/sounds/batery_full_capacity.mp3',
    '/sounds/notification.mp3',
    '/css/style.css',
    '/js/main.js',
    'favicon.ico',
    'manifest.json',
    "/icons/android-launchericon-512-512.png",
    "/icons/android-launchericon-192-192.png",
    "/icons/android-launchericon-144-144.png",
    "/icons/android-launchericon-96-96.png",
    "/icons/android-launchericon-72-72.png",
  ];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_VERSION)
    .then(function(cache) {
      console.log('Opened cache');
      return cache.addAll(CACHE_FILES);
    })
  );
});

self.addEventListener('fetch', function(event) {
  let online = navigator.onLine
  if (!online) {
    event.respondWith(
      caches.match(event.request).then(function(res) {
        if (res) {
          return res;
        }
        requestBackend(event);
      })
    )
  }
});

function requestBackend(event) {
  var url = event.request.clone();
  return fetch(url).then(function(res) {
    //if not a valid response send the error
    if (!res || res.status !== 200 || res.type !== 'basic') {
      return res;
    }

    var response = res.clone();

    caches.open(CACHE_VERSION).then(function(cache) {
      cache.put(event.request, response);
    });

    return res;
  })
}

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(key, i) {
        if (key !== CACHE_VERSION) {
          return caches.delete(keys[i]);
        }
      }))
    })
  )
});
self.addEventListener('sync', function(event) {
  if (event.tag == 'myFirstSync') {
    event.waitUntil(doSomeStuff());
  }
});
/*
if ('serviceWorker' in navigator && 'SyncManager' in window) {
  navigator.serviceWorker.ready.then(function(reg) {
    return reg.sync.register('tag-name');
  }).catch(function() {
    // system was unable to register for a sync,
    // this could be an OS-level restriction
    postDataFromThePage();
  });
} else {
  // serviceworker/sync not supported
  postDataFromThePage();
}*/