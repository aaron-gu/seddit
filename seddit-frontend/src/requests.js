
const baseURL = "https://seddit-backend.herokuapp.com/"  // "http://127.0.0.1:5000/";

export function getRequest(extension){
    return fetch(baseURL + extension)
    .then((response) => {
        return response.json();
    })
    .then((myJson) => {
        console.log(myJson);
        return myJson;
    });
    
}

export function postRequest(extension, req_body){
    return fetch(baseURL + extension, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(req_body)
    }).then((response) => {
        return response.json();
    })
    .then((myJson) => {
        console.log(myJson);
        return myJson;
    });
}