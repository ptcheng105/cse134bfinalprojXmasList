import { sendRequest } from "./util.mjs";

let base_url = "https://fa19server.appspot.com/api";

function isEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

export function handleLoginClicked() {
    let user = DOMPurify.sanitize(document.querySelector("#user").value);
    let secret = DOMPurify.sanitize(document.querySelector("#secret").value);

    let payload;
    if(isEmail(user)){
        payload = `email=${user}&password=${secret}`;
    }else{
        payload = `username=${user}&password=${secret}`;
    }


    sendRequest("POST", base_url + "/Users/login", responseToLoginRequest, payload );
}

function responseToLoginRequest(xhr) {
    if (xhr.readyState == 4 && xhr.status == 200) {
        alert(xhr.responseText);
    }
}