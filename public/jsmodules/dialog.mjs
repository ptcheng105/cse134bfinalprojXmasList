import {createElementToParent} from "./util.mjs";

var Category_list = ["Clothing", "Electric", "Books", "Movies", "Smart Home", "Pet Supplies", "Food & Grocery", "Beauty & Health", "Automotives"].sort();

export function createNewDialog() {
    //create dialog
    var dialog_div = document.getElementById("dialog_div");
    var dialog = document.createElement("dialog");

    var line1 = createElementToParent(dialog, "p", '<label>Item Name:</label><input type="text">');
    var line2 = createElementToParent(dialog, "p", '<label>Price: $</label><input type="number">' );

    var category_list_html = generateSelectHtml(Category_list);
    var line3 = createElementToParent(dialog, "p", category_list_html);
    //var line4 = createElementToParent(dialog, "p", '<label>Add Image? </label><input type="file" name="item_image" accept="image/jpg">');
    var line4 = createElementToParent(dialog, "p", '<label>Add Image? </label><input type="text" name="item_image">');
    var line5 = createElementToParent(dialog, "p", "<label>Add Comment? </label><br><textarea name='item_comment' rows='10' cols='30' spellcheck='true'>");
    var line6 = createElementToParent(dialog, "div", "<button id='confirm'>confirm</button><button id='cancel'>CANCEL</button>");
    var line7 = createElementToParent(dialog, "div", "<p id='msg_box'></p>");

    dialog_div.appendChild(dialog);
    return dialog;
}

export function handleCloseDialog(dialog) {
    dialog.close();
    dialog.parentNode.removeChild(dialog);
}

function generateSelectHtml(sorted_list){
    var ret_string = "<label>Category:</label><select>";
    sorted_list.forEach(element => {
        var add_string = `<option value="${element}">${element}</option>`;
        ret_string = ret_string.concat(add_string);
    });
    return ret_string.concat("</select>");
}