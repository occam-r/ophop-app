export const convert_into_base64 = (file, func) => {
    const reader = new FileReader();

    reader.onload = function (event) {
        const base64String = event.target.result;
        // console.log("Base64:", base64String);
        if (func) {
            func(base64String);
        }
        // You can use this base64String as needed
    };

    reader.onerror = function (event) {
        console.error("File could not be read! Code " + event.target.error.code);
    };

    reader.readAsDataURL(file);
};

export const base64File_url = async (uri, func) => {
    // return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // If successful -> return with blob
    xhr.onload = function () {
        convert_into_base64(xhr.response, func);
        // resolve(xhr.response);
    };

    // reject on error
    xhr.onerror = function () {
        // reject(new Error('uriToBlob failed'));
        console.log('blob failed');
    };

    // Set the response type to 'blob' - this means the server's response 
    // will be accessed as a binary object
    xhr.responseType = 'blob';

    // Initialize the request. The third argument set to 'true' denotes 
    // that the request is asynchronous
    xhr.open('GET', uri, true);

    // Send the request. The 'null' argument means that no body content is given for the request
    xhr.send(null);
    // });
}