self.addEventListener('install', (event) => {
    event.waitUntil(preLoad())
})

var preLoad = () => {
    console.log('Installing web app')
    return caches.open('offline').then((cache) => {
        console.log('caching index')
        return cache.addAll(['/offline.html', '/style.css', '/script.js'])
    })
}

