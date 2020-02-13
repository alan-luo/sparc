function fStr(str) {
	return str.toLowerCase().replace(/\s/g, "-");
}

let section = 0;
let subsection = 0;
$(".anchor").each(function() {
	let nameStr = $(this).text();
	

	let sectionNum = "";
	let subsectionStr = "";

	if($(this).is("h1")) {
		section++;
		sectionNum = ""+section;
		subsection = 0;
	} else {
		subsection++;
		sectionNum = `${section}.${subsection}`;
		subsectionStr = `class="subsection"`;
	}
	$(this).attr("data-content", sectionNum);

	let anchorStr = fStr(nameStr)+"-"+section+"-"+subsection;
	$(this).attr("id", anchorStr);

	$("#nav").append($(`<li ${subsectionStr}><a href="#${anchorStr}"><b>${sectionNum}</b> &nbsp; ${nameStr}</a></li>`))
});