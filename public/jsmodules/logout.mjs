import { sendRequest, base_url , forceLogout } from "./util.mjs";

export function handleLogout(){
    var key = localStorage.getItem("XmasWishlist_key");
    sendRequest("POST", base_url + "/Users/logout" + "?access_token=" + key, resLogout, logoutTimedOut, null);
}

function resLogout(xhr){
    if (xhr.readyState == 4 && xhr.status == 204) {
        alert("Logout Successful, returning to login page");
    }else if(xhr.readyState == 4 && xhr.status == 401) {
        alert("Logout failed, you should have been logged out or access key timed out");
    }
    forceLogout();
}

function logoutTimedOut(){
    alert("Logout Failed! Timed Out, Check network connection!");

}