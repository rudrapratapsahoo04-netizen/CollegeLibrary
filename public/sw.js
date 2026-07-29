const CACHE_NAME = "library-v1";

const urls = [

"/",

"/offline.html",

"/css/style.css",

"/js/script.js"

];

self.addEventListener("install",event=>{

event.waitUntil(

caches.open(CACHE_NAME)

.then(cache=>cache.addAll(urls))

);

});

self.addEventListener("fetch",event=>{

event.respondWith(

fetch(event.request)

.catch(()=>{

return caches.match(event.request)

.then(response=>{

return response || caches.match("/offline.html");

});

})

);

});