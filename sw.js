var cacheName = 'test-app-v0.5';
var files = [
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
/*
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

//Adding `install` event listener
self.addEventListener('install', (event) => {
  console.info('Event: Install');

  event.waitUntil(
    caches.open(cacheName)
    .then((cache) => {
      //[] of files to cache & if any of the file not present `addAll` will fail
      return cache.addAll(files)
        .then(() => {
          console.info('All files are cached');
          return self.skipWaiting(); //To forces the waiting service worker to become the active service worker
        })
        .catch((error) => {
          console.error('Failed to cache', error);
        })
    })
  );
});

/*
  FETCH EVENT: triggered for every request made by index page, after install.
*/

//Adding `fetch` event listener
self.addEventListener('fetch', (event) => {
  console.info('Event: Fetch');

  var request = event.request;
  var url = new URL(request.url);
  if (url.origin === location.origin) {
    // Static files cache
    event.respondWith(cacheFirst(request));
  } else {
    // Dynamic API cache
    event.respondWith(networkFirst(request));
  }

  // // Checking for navigation preload response
  // if (event.preloadResponse) {
  //   console.info('Using navigation preload');
  //   return response;
  // }
});

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  return cachedResponse || fetch(request);
}

async function networkFirst(request) {
  const dynamicCache = await caches.open(cacheName);
  try {
    const networkResponse = await fetch(request);
    // Cache the dynamic API response
    dynamicCache.put(request, networkResponse.clone()).catch((err) => {
      console.warn(request.url + ': ' + err.message);
    });
    return networkResponse;
  } catch (err) {
    const cachedResponse = await dynamicCache.match(request);
    return cachedResponse;
  }
}

/*
  ACTIVATE EVENT: triggered once after registering, also used to clean up caches.
*/

//Adding `activate` event listener
self.addEventListener('activate', (event) => {
  console.info('Event: Activate');

  //Navigation preload is help us make parallel request while service worker is booting up.
  //Enable - chrome://flags/#enable-service-worker-navigation-preload
  //Support - Chrome 57 beta (behing the flag)
  //More info - https://developers.google.com/web/updates/2017/02/navigation-preload#the-problem

  // Check if navigationPreload is supported or not
  // if (self.registration.navigationPreload) { 
  //   self.registration.navigationPreload.enable();
  // }
  // else if (!self.registration.navigationPreload) { 
  //   console.info('Your browser does not support navigation preload.');
  // }

  //Remove old and unwanted caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            return caches.delete(cache); //Deleting the old cache (cache v1)
          }
        })
      );
    })
    .then(function() {
      console.info("Old caches are cleared!");
      // To tell the service worker to activate current one 
      // instead of waiting for the old one to finish.
      return self.clients.claim();
    })
  );
});