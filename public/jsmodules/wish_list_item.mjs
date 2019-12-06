import {createElementToParent} from "./util.mjs";
import {handleCloseDialog, createNewDialog} from './dialog.mjs';

export class WishListItem {
    constructor(name, price, category, image, comment) {
        this.name = name;
        this.price = price;
        this.category = category;
        this.image = image;
        this.comment = comment;
    }
}

export function addNewListEntry(dialog) {
    var item_name = DOMPurify.sanitize(dialog.querySelector("p:nth-child(1) input").value);
    var item_price = dialog.querySelector("p:nth-child(2) input").value;
    var item_category = dialog.querySelector("p:nth-child(3) select").value;
    var item_image = dialog.querySelector("p:nth-child(4) input").value;
    var item_comment = dialog.querySelector("p:nth-child(5) textarea").value;

    //clear error msg if exist
    var msg = document.querySelector("body ul p#error_msg");
    if(msg){
        msg.parentNode.removeChild(msg);
    }
    createListEntry("ul#wish_list", item_name, item_price, item_category, item_image, item_comment);
    handleCloseDialog(dialog);
}

export function createListEntry(list_selector, item_name, item_price, item_category, item_image, item_comment) {
    var list = document.querySelector(list_selector);
    var li = document.createElement("li");

    //create three div for different stuff in the entry
    //img div
    var div_image = createElementToParent(li, "div", `<img src="${item_image}" alt="item image broken">`);
    
    //info div
    var div_info = createElementToParent(li, "div", "");
   
    var p_name = createElementToParent(div_info, "p", `Name:<span id="item_name"> ${item_name}</span>`);
    var p_price = createElementToParent(div_info, "p", `Price: $<span id="item_price"> ${item_price}</span>`);
    var p_category = createElementToParent(div_info, "p", `Category: <span id="item_category"> ${item_category}</span>`);
    var p_comment = createElementToParent(div_info, "p", `Comment: <span id="item_comment"> ${item_comment}</span>`);

    //action div( for buttons)
    var div_action = createElementToParent(li, "div", '<button id="edit">EDIT</button><button id="delete">DELETE</button>');

    div_action.querySelector("#edit").addEventListener("click", () => handleEdit(li));
    div_action.querySelector("#delete").addEventListener("click", () => handleDelete(li));

    //append this li
    list.appendChild(li);

    //TODO: movie_array.push(new Movie(title, year, rating));  
}

function handleEdit(li){
    var dialog = createNewDialog();

    //TODO deal with img

    var item_name = li.querySelector("#item_name").innerHTML;
    var item_price = li.querySelector("#item_price").innerHTML;
    var item_category = li.querySelector("#item_category").innerText;
    console.log(item_category);
    //var item_image = li.querySelector("img").innerHTML;
    var item_comment = li.querySelector("#item_comment").innerHTML;


    dialog.querySelector("p:nth-child(1) input").value = item_name;
    dialog.querySelector("p:nth-child(2) input").value = parseInt(item_price, 10);
    dialog.querySelector("select").value = item_category;
    //dialog.querySelector("p:nth-child(4) input").value = item_image;
    dialog.querySelector("p:nth-child(5) textarea").value = item_comment;

    dialog.querySelector("button#save").addEventListener("click", () => editExistingEntry(dialog, li));
    dialog.querySelector("button#cancel").addEventListener("click", () => handleCloseDialog(dialog));
    dialog.showModal();
}

function editExistingEntry(dialog, li) {
    var item_name = DOMPurify.sanitize(dialog.querySelector("p:nth-child(1) input").value);
    var item_price = dialog.querySelector("p:nth-child(2) input").value;
    var item_category = dialog.querySelector("p:nth-child(3) select").value;
    //var item_image = dialog.querySelector("p:nth-child(4) input").value;
    var item_comment = dialog.querySelector("p:nth-child(5) textarea").value;


    li.querySelector("#item_name").innerHTML = item_name;
    li.querySelector("#item_price").innerHTML = item_price;
    li.querySelector("#item_category").innerHTML = item_category;
    //li.querySelector("img").innerHTML;
    li.querySelector("#item_comment").innerHTML = item_comment;

    handleCloseDialog(dialog);
}

function handleDelete(li){
    var dialog_div = document.getElementById("dialog_div");
    var dialog = document.createElement("dialog");
    dialog.innerHTML = 'Delete This Item?<br><button id="no">No</button><button id="yes">Yes</button>';
    dialog_div.appendChild(dialog);
    dialog.querySelector("#no").addEventListener("click", () => handleCloseDialog(dialog));
    dialog.querySelector("#yes").addEventListener("click", () => deleteEntry(dialog, li));
    dialog.showModal();
}

function deleteEntry(dialog, li) {
    li.parentNode.removeChild(li);
    // var title = li.querySelector("p #title").innerHTML;
    // var year = li.querySelector("p #year").innerHTML;
    // var rating = li.querySelector("p #rating").innerHTML;
    // //remove the entry
    // for (var i = 0; i < movie_array.length; i++) {
    //     if (movie_array[i].title == title && movie_array[i].year == year && movie_array[i].rating == rating) {
    //         movie_array.splice(i, 1);
    //     }
    // }
    // if (movie_array.length == 0) {
    //     document.getElementById("movie_list").innerHTML = '<p id="error_msg">No movies currently listed</p>';
    // }
    handleCloseDialog(dialog);
}