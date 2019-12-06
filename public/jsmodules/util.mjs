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

export function sendRequest(method, url, responseFunction, payload) {
    var xhr = createXHR();

    if (xhr) {
        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () { responseFunction(xhr); };
        xhr.send(payload);
    }
}

function isEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}