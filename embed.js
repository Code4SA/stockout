if (document.location.hostname == "localhost") {
    var baseurl = "";
} else {
    var baseurl = "https://static.code4sa.org/stockout/";
}
document.write('<div id="code4sa-embed-stockout"></div>');
document.write('<script type="text/javascript" src="' + baseurl + 'js/pym.js"></script>');
document.write("<script>\n" +
"var pymParent = new pym.Parent('code4sa-embed-stockout', '" + baseurl + "index.html?show-embed-link=true', {});\n" +
"</script>");
