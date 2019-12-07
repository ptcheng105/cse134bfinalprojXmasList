import { sendRequest, base_url, isEmail } from "./util.mjs";

export function handleLoginClicked() {
    let user = DOMPurify.sanitize(document.querySelector("#user").value);
    let secret = DOMPurify.sanitize(document.querySelector("#secret").value);

    let payload;
    if(!user || !secret){
        loginFailed();
        return;
    }
    if(isEmail(user)){
        payload = `email=${user}&password=${secret}`;
    }else{
        payload = `username=${user}&password=${secret}`;
    }
    sendRequest("POST", base_url + "/Users/login", responseToLoginRequest, handleLoginTimeout, payload);
}

export function responseToLoginRequest(xhr) {
    if (xhr.readyState == 4 && xhr.status == 200) {
        var resJson = JSON.parse(xhr.responseText);
        localStorage.setItem("XmasWishlist_user", DOMPurify.sanitize(document.querySelector("#user").value));
        localStorage.setItem("XmasWishlist_key", resJson.id);
        window.location.href = "XmasWishlist.html";
    }else if(xhr.readyState == 4 && xhr.status == 401) {
        loginFailed();
    }
}

function loginFailed(){
    document.querySelector("#error_box").innerHTML = "Login Failed! Double check your login credentials";
    document.querySelector("#user").value = "";
    document.querySelector("#secret").value = "";
}

function handleLoginTimeout(){
    document.querySelector("#error_box").innerHTML = "Login Failed! Connecting to Server is Timed out, check your network";
    document.querySelector("#user").value = "";
    document.querySelector("#secret").value = "";
}