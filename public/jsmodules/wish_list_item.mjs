import { createElementToParent, forceLogout } from "./util.mjs";
import { handleCloseDialog, createNewDialog } from './dialog.mjs';
import { sendRequest, base_url } from "./util.mjs";

export function uploadImage(dialog, afterImageUploadedFunction) {
    var item_image = dialog.querySelector("p:nth-child(4) input");
    let img = item_image.files[0];

    var url = `https://api.cloudinary.com/v1_1/b1ayala/upload`;
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    fd.append('upload_preset', 'default');
    fd.append('file', img);
    var imgurl;
    xhr.onreadystatechange = function (imgurl) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // File uploaded successfully
            var response = JSON.parse(xhr.responseText);
            imgurl = response.secure_url;
            // https://res.cloudinary.com/cloudName/image/upload/v1483481128/public_id.jpg
            console.log(imgurl);
            afterImageUploadedFunction(dialog, imgurl);
        }else if (xhr.readyState == 4 && xhr.status == 400){
            afterImageUploadedFunction(dialog, "");
        }
    }
    xhr.send(fd);
}
//get all list item
export function getAllListedItem(access_key){
    let url = base_url + "/wishlists/myWishlist?access_token=" + access_key;
    sendRequest("GET", url, respGetAllEntry, () => {document.querySelector("#dialog_div").innerHTML = ""; alert("Server Timed out! couldn't get saved list item")}, null)
}

function respGetAllEntry(xhr){
    var dialog = document.querySelector("#dialog_div dialog");
    if (xhr.readyState == 4 && xhr.status == 200) {
        var item_list = JSON.parse(xhr.responseText).wishItems;
        //var load_list_item_array = [new WishListItem("shitid", "shit", 999, "poop", "", "yikessss")];
        item_list.forEach(e => createListEntry("ul#wish_list", e.id, e.item, e.price, e.category, e.image, e.comment));
    } else if (xhr.readyState == 4 && xhr.status == 401) {
        alert("your access is outdated, please log in again!");
        forceLogout();
    }
}


//Adding a new list entry
export function addNewListEntry(dialog, imgurl) {
    var item_name = DOMPurify.sanitize(dialog.querySelector("p:nth-child(1) input").value);
    var item_price = dialog.querySelector("p:nth-child(2) input").value;
    var item_category = dialog.querySelector("p:nth-child(3) select").value;
    var item_comment = DOMPurify.sanitize(dialog.querySelector("p:nth-child(5) textarea").value);

    //clear error msg if exist
    var msg = document.querySelector("body ul p#error_msg");
    if (msg) {
        msg.parentNode.removeChild(msg);
    }

    let url = base_url + "/wishlists?access_token=" + localStorage.getItem("XmasWishlist_key");
    console.log(imgurl);
    let payload = `item=${item_name}&price=${item_price}&category=${item_category}&image=${imgurl}&comment=${item_comment}`;
    dialog.querySelector("#msg_box").innerText = "Waiting for server reply...please wait";
    //send request
    sendRequest("POST", url, respAddListEntry, () => { alert("add entry timed out!"); }, payload);
    //createListEntry("ul#wish_list", item_name, item_price, item_category, item_image, item_comment);
    //handleCloseDialog(dialog);
}

function respAddListEntry(xhr) {
    var dialog = document.querySelector("#dialog_div dialog");
    if (xhr.readyState == 4 && xhr.status == 200) {
        var resJson = JSON.parse(xhr.responseText);
        createListEntry("ul#wish_list", resJson.id, resJson.item, resJson.price, resJson.category, resJson.image, resJson.comment);
        handleCloseDialog(dialog);
    } else if (xhr.readyState == 4 && xhr.status == 401) {
        alert("your access is outdated, please log in again!");
        forceLogout();
    } else if (xhr.readyState == 4 && xhr.status == 422) {
        var resJson = JSON.parse(xhr.responseText);
        dialog.querySelector("#msg_box").innerText = "Failed to add! Error:" + resJson.error.message;
    }
}

export function createListEntry(list_selector, item_id, item_name, item_price, item_category, item_image, item_comment) {
    var list = document.querySelector(list_selector);
    var li = document.createElement("li");
    li.setAttribute("data-item-id", item_id);

    //create three div for different stuff in the entry
    //img div
    li.innerHTML = `<img src="${item_image}" alt="No Image">`;

    //info div
    var div_info = createElementToParent(li, "div", "");

    var p_name = createElementToParent(div_info, "p", `Name: <span id="item_name">${item_name}</span>`);
    var p_price = createElementToParent(div_info, "p", `Price: $<span id="item_price">${item_price}</span>`);
    var p_category = createElementToParent(div_info, "p", `Category: <span id="item_category">${item_category}</span>`);
    var p_comment = createElementToParent(div_info, "p", `Comment: <span id="item_comment">${item_comment}</span>`);

    //action div( for buttons)
    var div_edit = createElementToParent(li, "div", '<img src="/media/file.png" style="height:30px; width:30px;">');
    var div_delete = createElementToParent(li, "div", '<img src="/media/delete2.png" style="height:30px; width:30px;">');

    div_edit.addEventListener("click", () => handleEdit(li));
    div_delete.addEventListener("click", () => handleDelete(li));

    //append this li
    list.appendChild(li);

    //TODO: movie_array.push(new Movie(title, year, rating));  
}


// Editing items
function handleEdit(li) {
    var dialog = createNewDialog();
    let item_id = li.getAttribute("data-item-id");
    dialog.setAttribute("data-item-id", `${item_id}`)
    //TODO deal with img

    var item_name = li.querySelector("#item_name").innerHTML;
    var item_price = li.querySelector("#item_price").innerHTML;
    var item_category = li.querySelector("#item_category").innerText;
    //var item_image = li.querySelector("img").innerHTML;
    var item_comment = li.querySelector("#item_comment").innerHTML;

    dialog.querySelector("p:nth-child(1) input").value = item_name;
    dialog.querySelector("p:nth-child(2) input").value = parseInt(item_price, 10);
    dialog.querySelector("select").value = item_category;
    //dialog.querySelector("p:nth-child(4) input").value = item_image;
    dialog.querySelector("p:nth-child(5) textarea").value = item_comment;

    dialog.querySelector("button#confirm").addEventListener("click", () => uploadImage(dialog, editExistingEntry));
    dialog.querySelector("button#cancel").addEventListener("click", () => handleCloseDialog(dialog));
    dialog.showModal();
}

function editExistingEntry(dialog,imgurl) {
    var item_name = DOMPurify.sanitize(dialog.querySelector("p:nth-child(1) input").value);
    var item_price = dialog.querySelector("p:nth-child(2) input").value;
    var item_category = dialog.querySelector("p:nth-child(3) select").value;
    var item_comment = dialog.querySelector("p:nth-child(5) textarea").value;
    console.log(imgurl);
    let item_id = dialog.getAttribute("data-item-id");
    let url = base_url + `/wishlists/${item_id}/replace?access_token=` + localStorage.getItem("XmasWishlist_key");
    let payload = `item=${item_name}&price=${item_price}&category=${item_category}&image=${imgurl}&comment=${item_comment}`;
    
    //send request
    dialog.querySelector("#msg_box").innerText = "Waiting for server reply...please wait";
    sendRequest("POST", url, respEditEntry, () => { alert("edit entry timed out!"); }, payload);
}

function respEditEntry(xhr) {
    var dialog = document.querySelector("#dialog_div dialog");
    if (xhr.readyState == 4 && xhr.status == 200) {
        var resJson = JSON.parse(xhr.responseText);
        var li = document.querySelector(`[data-item-id="${resJson.id}"]`);

        li.querySelector("#item_name").innerHTML = resJson.item;
        li.querySelector("#item_price").innerHTML = resJson.price;
        li.querySelector("#item_category").innerHTML = resJson.category;
        console.log("Update:" + resJson.image);
        li.querySelector("img").src = resJson.image;
        li.querySelector("#item_comment").innerHTML = resJson.comment;

        handleCloseDialog(dialog);
    } else if (xhr.readyState == 4 && xhr.status == 401) {
        alert("your access is outdated, please log in again!");
        forceLogout();
    } else if (xhr.readyState == 4 && xhr.status == 422) {
        var resJson = JSON.parse(xhr.responseText);
        dialog.querySelector("#msg_box").innerText = "Failed to edit! Error:" + resJson.error.message;
    }
}

// DELETE entry
function handleDelete(li) {
    var dialog_div = document.getElementById("dialog_div");
    var dialog = document.createElement("dialog");
    dialog.innerHTML = 'Delete This Item?<button id="yes">Yes</button><button id="no">No</button><br><div id="msg_box"></div>';
    dialog_div.appendChild(dialog);
    dialog.querySelector("#no").addEventListener("click", () => handleCloseDialog(dialog));
    dialog.querySelector("#yes").addEventListener("click", () => deleteEntry(dialog, li));
    dialog.showModal();
}

function deleteEntry(dialog, li) {
    let item_id = li.getAttribute("data-item-id");

    let url = base_url + `/wishlists/${item_id}?access_token=` + localStorage.getItem("XmasWishlist_key");
    //send request
    dialog.querySelector("#msg_box").innerText = "Waiting for server reply...please wait";
    sendRequest("DELETE", url, (xhr) => { respDeleteEntry(xhr, li); }, () => { alert("delete entry timed out!"); }, null);

}

function respDeleteEntry(xhr, li) {
    var dialog = document.querySelector("#dialog_div dialog");
    if (xhr.readyState == 4 && xhr.status == 200) {
        li.parentNode.removeChild(li);
        handleCloseDialog(dialog);
    } else if (xhr.readyState == 4 && xhr.status == 401) {
        alert("your access is outdated, please log in again!");
        forceLogout();
    }
}