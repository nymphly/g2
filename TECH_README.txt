1) Window location and absolute references
    window.addEventListener('hashchange', (e) => {console.log(location.hash)})
    goog.global.location.origin + goog.global.location.pathname + goog.global.location.search
    https://stackoverflow.com/questions/6390341/how-to-detect-url-change-in-javascript

2) Pay attention to document.querySelectAll
    https://stackoverflow.com/questions/16791527/can-i-use-a-regular-expression-in-queryselectorall

    var dom = stage.domElement();
    console.log(dom);

    var selection1 = dom.querySelectorAll('[fill^="url("]');
    var selection2 = dom.querySelectorAll('[clip-path*="url("]'); //TODO find the difference between ^= and *=
    console.log(selection1);
    console.log(selection2);