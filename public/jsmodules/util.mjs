export function createElementToParent(parent, child_type, inner_html){
    var child = document.createElement(child_type);
    child.innerHTML = inner_html;
    parent.appendChild(child);
    return child;
}