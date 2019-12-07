export var base_url = "https://fa19server.appspot.com/api";


export function createElementToParent(parent, child_type, inner_html) {
    var child = document.createElement(child_type);
    child.innerHTML = inner_html;
    parent.appendChild(child);
    return child;
}

export function createXHR() {
    try { return new XMLHttpRequest(); } catch (e) { }
    try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e) { }
    try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e) { }
    try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e) { }
    try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch (e) { }
    alert("XMLHttpRequest not supported");
    return null;
}

export function sendRequest(method, url, responseFunction, timeoutFunction, payload) {
    var xhr = createXHR();

    if (xhr) {
        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () { responseFunction(xhr); };
        xhr.timeout = 5000;
        xhr.ontimeout = function() {timeoutFunction();};
        xhr.send(payload);
    }
}

export function isEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

export function forceLogout(){
    localStorage.removeItem("XmasWishlist_user");
    localStorage.removeItem("XmasWishlist_key");
    window.location.href = "login.html";
}