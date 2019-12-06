import { sendRequest } from "./util.mjs";

let base_url = "https://fa19server.appspot.com/api";

export function isEmail(email) {
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
        var resJson = JSON.parse(xhr.responseText);
        var id = resJson.id;
        var ttl = resJson.ttl;
        var create = resJson.created;
        var userId = resJson.userId;
        alert(id + ttl + create + userId);
    }else if(xhr.readyState == 4 && xhr.status == 401) {
        var resJson = JSON.parse(xhr.responseText);
        alert(resJson[0]);
    }
}