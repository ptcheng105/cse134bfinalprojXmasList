import { createElementToParent, isEmail } from "./util.mjs";

export function handleSignupClicked() {
    let user = DOMPurify.sanitize(document.querySelector("#user").value);
    let secret = DOMPurify.sanitize(document.querySelector("#secret").value);
    let dialog = document.createElement("dialog");
    dialog.id = "signdialog";
    let username = createElementToParent(dialog, "p", '<label>Username:</label><input type="text" id="signuser">' );
    let email = createElementToParent(dialog, "p", '<label>Email:</label><input type="text" id="signemail">')
    let password = createElementToParent(dialog, "p", '<label>Password:</label><input type="text" id="signpass">');
    let button = createElementToParent(dialog, "button", "");
    button.innerText = "Sign Up!";
    button.addEventListener("click", handleSignUpButton);
    let err = createElementToParent(dialog, "p", '');
    err.id = "errmsg";
    err.style = "color:red";
    document.body.appendChild(dialog);
    dialog.showModal();
}

export function handleSignUpButton() {
    let user = DOMPurify.sanitize(document.querySelector("#signuser").value);
    let email = DOMPurify.sanitize(document.querySelector("#signemail").value);
    let secret = DOMPurify.sanitize(document.querySelector("#signpass").value);
    let payload;
    if(isEmail(email) && user && secret) {
        payload = `username=${email}&email=${user}&password=${secret}`;
        sendRequest("POST", base_url + "/Users", responseToSignupRequest, payload );
    }else{
        let err = document.body.querySelector("#errmsg");
        err.innerText = "Please enter a valid username, email and password"; 
    }
    

}

function responseToSignupRequest(xhr) {
    let dialog = document.getElementById("signdialog");
    dialog.close();
    dialog.parentNode.removeChild()
}
