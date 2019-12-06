import { sendRequest, base_url } from "./util.mjs";

export function handleLogout(){
    var key = localStorage.getItem("XmasWishlist_access_key")
    sendRequest("POST", base_url + "/Users/logout" + "?access_token=" + key, resLogout, null);
}

function resLogout(xhr){
    if (xhr.readyState == 4 && xhr.status == 204) {
        alert("Logout Successful, returning to login page");
        localStorage.removeItem("XmasWishlist_access_key");
        window.location.href = "login.html";
    }else if(xhr.readyState == 4 && xhr.status == 401) {
        alert("Logout failed, you should have been logged out or access key timed out");
        localStorage.removeItem("XmasWishlist_access_key");
        window.location.href = "login.html";
    }
}