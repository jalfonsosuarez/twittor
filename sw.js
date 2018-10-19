// Imports
importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v2';
const STATIC_DYNAMIC = 'dynamic-v1';
const STATIC_INMUTABLE = 'inmutable-v1';

const APP_SHELL = [
    '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

// Instalación
self.addEventListener('install', e => {

    const cacheStatic = caches.open(STATIC_CACHE)
        .then(cache => {
            return cache.addAll(APP_SHELL);
        });

    const cacheInmutable = caches.open(STATIC_INMUTABLE)
        .then(cache => {
            return cache.addAll(APP_SHELL_INMUTABLE);
        });


    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));

})

self.addEventListener('activate', e => {

    const respuesta = caches.keys().then(keys => {

        keys.forEach(key => {

            if (key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }
        });

    });

    e.waitUntil(respuesta);

});

self.addEventListener('fetch', e => {

    const respuesta = caches.match(e.request)
        .then(res => {

            if (res) {
                return res;
            } else {
                return fetch(e.request).then(nRes => {
                    return actualizaCacheDinamico(STATIC_DYNAMIC, e.request, nRes);
                });
            }

        });

    e.respondWith(respuesta);

})