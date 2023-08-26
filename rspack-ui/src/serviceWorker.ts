import { read, utils, WorkBook } from 'xlsx';

console.log("hello from service worker");

self.addEventListener('message', async event => {
    console.log("service worker was pinged");

    if (event.data.type === 'file') {
        const file = event.data.file;
        const fileData = await file.arrayBuffer();
        console.log("file data are: ", fileData);
        // Do something with the uploaded file in the service worker
        console.log('Service Worker received file:', file);

        // Process the file and generate some data
        const responseData = { "foo": "bar" };

        // Send the data back to the original client
        event.source?.postMessage({ type: 'fileResponse', data: responseData });
    }
});
