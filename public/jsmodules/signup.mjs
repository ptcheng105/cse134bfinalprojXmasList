import { createElementToParent, isEmail, sendRequest, base_url } from "./util.mjs";
import { responseToLoginRequest } from "./login.mjs"

export function handleSignupClicked() {
    let dialog = document.createElement("dialog");
    dialog.id = "signdialog";
    let username = createElementToParent(dialog, "p", '<label>Username:</label><input type="text" id="signuser">' );
    let email = createElementToParent(dialog, "p", '<label>Email:</label><input type="text" id="signemail">')
    let password = createElementToParent(dialog, "p", '<label>Password:</label><input type="text" id="signpass">');
    let submitbutton = createElementToParent(dialog, "button", "Sign Up!");
    submitbutton.addEventListener("click", handleSignUpButton);
    let cancelbutton = createElementToParent(dialog, "button", "Cancel");
    cancelbutton.addEventListener("click", handleCancelButton);
    let err = createElementToParent(dialog, "p", '');
    err.id = "errmsg";
    err.style = "color:red";
    document.body.appendChild(dialog);
    dialog.showModal();
}

function handleCancelButton(){
    let dialog = document.getElementById("signdialog");
    dialog.close();
    dialog.parentNode.removeChild(dialog);
}

export function handleSignUpButton() {
    let user = DOMPurify.sanitize(document.querySelector("#signuser").value);
    let email = DOMPurify.sanitize(document.querySelector("#signemail").value);
    let secret = DOMPurify.sanitize(document.querySelector("#signpass").value);
    let payload;
    if(isEmail(email) && user && secret) {
        payload = `username=${user}&email=${email}&password=${secret}`;
        sendRequest("POST", base_url + "/Users", responseToSignupRequest, payload );
    }else{
        let err = document.body.querySelector("#errmsg");
        err.innerText = "Please enter a valid username, email and password"; 
    }
    

}

function responseToSignupRequest(xhr) {
    if (xhr.readyState == 4 && xhr.status == 200) {
        let user = DOMPurify.sanitize(document.querySelector("#signuser").value);
        let secret = DOMPurify.sanitize(document.querySelector("#signpass").value);
        let payload = `username=${user}&password=${secret}`;
        sendRequest("POST", base_url + "/Users/login", responseToLoginRequest, () => (alert("Sign Up Timed Out")), payload );
        let dialog = document.getElementById("signdialog");
        dialog.close();
        dialog.parentNode.removeChild(dialog);
    }else if(xhr.readyState == 4 && xhr.status == 422) {
        // print msg from xhr
        let err = document.getElementById("errmsg");
        err.innerText = "Account Creation Failed";
    }
}
