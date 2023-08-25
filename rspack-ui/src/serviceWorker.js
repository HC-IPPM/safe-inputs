console.log("hello from service worker");

self.addEventListener('message', event => {
    console.log("service worker was pinged");

    if (event.data.type === 'file') {
        const file = event.data.file;
        // Do something with the uploaded file in the service worker
        console.log('Service Worker received file:', file);
    }
});
