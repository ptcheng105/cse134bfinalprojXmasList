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

export function sendRequest(method, url, readyState, status, reactionFunction)
{
    var xhr = createXHR();
 
    if (xhr)
     {
       xhr.open(method,url,true);
      xhr.onreadystatechange = function(){handleResponse(xhr, readyState, status, reactionFunction);};
      xhr.send(null);
     }
}

function handleResponse(xhr, readyState, status, reactionFunction){
    if ( xhr.readyState == readyState && xhr.status == status){
        reactionFunction();
    }
}