// ==UserScript==
// @name         Nexus 3 XML Dependency
// @namespace    http://xobo.org/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://172.16.0.13:8081/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';


var tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};

function replaceTag(tag) {
    return tagsToReplace[tag] || tag;
}

function safe_tags_replace(str) {
    return str.replace(/[&<>]/g, replaceTag);
}

function generateXMLDependencies() {
	var groupId = null;
	var artifactId = null;
	var version = null;

	var entries = document.querySelectorAll(".nx-info-entry");
	entries.forEach(function(entry){
		var name = entry.children[0].innerText.trim();
		var value = entry.children[1].innerText;
		if (name == "Group"){
			groupId = value;
		} else if (name == "Name") {
			artifactId = value;
		} else if (name == "Version") {
			version = value;
		}
	});

    if (!groupId || !artifactId || !version){
        return;
    }

	var template = `<dependency>
	<groupId>${groupId}</groupId>
	<artifactId>${artifactId}</artifactId>
	<version>${version}</version>
</dependency>
`;
    if( window.xmlBoxNode ){
        window.xmlBoxNode.remove();
        window.xmlBoxNode = null;
    }
    try{
		var boxNode = entries[7].parentNode.parentNode.parentNode.parentNode;
	} catch(e){
		/// console.log(e);
		return;
	}
	var panelNode = boxNode.parentNode;
	window.xmlBoxNode = boxNode.cloneNode();
	window.xmlBoxNode.id = "xmlDependenciesBoxId";
	panelNode.appendChild(window.xmlBoxNode);
	var previousSibling = window.xmlBoxNode.previousSibling;

	window.xmlBoxNode.style.left = parseInt(previousSibling.style.left) + parseInt(previousSibling.offsetWidth) + "px";
	window.xmlBoxNode.innerHTML="<textarea style='white-space: pre-wrap;' cols='60' rows='5'>" + safe_tags_replace(template) + "</textarea>";
}
window.addEventListener("hashchange", generateXMLDependencies);

})();
