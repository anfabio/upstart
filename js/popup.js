var jsonPopup;
var jsonPopupImg;

chrome.storage.local.get("jsonIMG", function(results){

    //TEST CHROME LOCAL STORAGE
    try {
        JSON.parse(results.jsonIMG);
    } catch (e) {
        return false;
    }
    jsonPopupImg = JSON.parse(results.jsonIMG); 
});

chrome.storage.local.get("jsonUS", function(results){

	//TEST CHROME LOCAL STORAGE
	try {
        JSON.parse(results.jsonUS);
    } catch (e) {
        return false;
    }
    jsonPopup = JSON.parse(results.jsonUS);	
	var accordionPages = document.getElementById("accordionPages");

	// PAGE
	for (p = 0; p < jsonPopup['pages'].length; p++) { 
	    var pageLabel = jsonPopup.pages[p].pageLabel;
	
		var accordionPagesPanel = document.createElement('DIV');
		accordionPagesPanel.className = 'panel panel-default';

		var accordionPagesItem = document.createElement('A'); 		
		accordionPagesItem.id = "accordionPagesItem"+p;	
		accordionPagesItem.dataset.toggle = 'collapse';
		accordionPagesItem.dataset.parent = '#accordionPages';
		accordionPagesItem.href = '#page'+p;
		accordionPagesItem.innerHTML = '<div class="panel-heading">'+pageLabel+'</div>';		

		var accordionPagesGroups = document.createElement('DIV');
		accordionPagesGroups.className ="panel-collapse collapse";
		accordionPagesGroups.id = 'page'+p;

		accordionPagesPanel.appendChild(accordionPagesItem);
		accordionPagesPanel.appendChild(accordionPagesGroups);
	
		// GROUP
	    for (g = 0; g < jsonPopup.pages[p]['groups'].length; g++) { 
	        var groupLabel = jsonPopup.pages[p].groups[g].groupLabel;        
	
			var accordionGroupItem = document.createElement('DIV');
			accordionGroupItem.id = "accordionGroupItem"+p+g;
			accordionGroupItem.className = 'panel-collapse collapse in';
			accordionGroupItem.dataset.page = p;
			accordionGroupItem.dataset.group = g;	
			accordionGroupItem.innerHTML = '<div class="panel-body">'+groupLabel+'</div>';
			accordionGroupItem.addEventListener('click', function() { saveCurrentURL(this.dataset.page, this.dataset.group) });
		
			accordionPagesGroups.appendChild(accordionGroupItem);
		}
		accordionPages.appendChild(accordionPagesPanel);	
	}

	$("button#popupPageAdd").click(function() { popupPageAdd(); });

	var popupPageTarget = document.getElementById('popupPageTarget');
    for (p = 0; p < jsonPopup['pages'].length; p++) { 
        popupPageTarget.innerHTML += '<option value="'+p+'">'+jsonPopup.pages[p].pageLabel+'</option>';
    }
    
    $("button#popupGroupAdd").click(function() { popupGroupAdd(); });

});


function saveCurrentURL(pageID, groupID){
	chrome.tabs.query({active: true, currentWindow: true}, 
    	async function(arrayOfTabs) {
       	var activeTab = arrayOfTabs[0];
       	tabURL = activeTab.url;
       	tabTitle = activeTab.title;
        tabIcon = activeTab.favIconUrl;

        //GET ROOT DOMAIN
        var domainName = tabURL.replace('http://','').replace('https://','').replace('www.','').replace('web.','').split(/[/?#]/)[0];

        var newItemObj = new Object();
        newItemObj.label = tabTitle;
        newItemObj.url = tabURL;
        newItemObj.alt = '';
        newItemObj.date = Date.now().toString();
        newItemObj.icon = ''+tabIcon;             

        //GET MATCH ICON
        for (i = 0; i < jsonPopupImg['icons'].length; i++) {
          var allString = jsonPopupImg.icons[i].label;

          if (allString.includes(domainName)) {
            newItemObj.icon = jsonPopupImg.icons[i].value;
            break;
          }
        }

				
		if (jsonPopup['settings'].iconsBase64 == 'true') {
			if ((newItemObj.icon != '')||(newItemObj.icon != 'undefined')) {
				try {
					var base64ImageData = await getBase64ImageAsync(newItemObj.icon, 128, 128);
					newItemObj.icon = base64ImageData;  
		    		jsonPopup.pages[pageID].groups[groupID]['itens'].push(newItemObj);      		
				}
				catch (err) {				
					//console.log(err);
					jsonPopup.pages[pageID].groups[groupID]['itens'].push(newItemObj);
				}				
	        	chrome.storage.local.set({ "jsonUS": JSON.stringify(jsonPopup) }, function(){  
        			alert('Page "'+tabTitle+'" added to "'+jsonPopup.pages[pageID].groups[groupID].groupLabel+'"');
        			window.close();	
        		});				
			}
		} else {
			jsonPopup.pages[pageID].groups[groupID]['itens'].push(newItemObj);
	        chrome.storage.local.set({ "jsonUS": JSON.stringify(jsonPopup) }, function(){  
        		alert('Page "'+tabTitle+'" added to "'+jsonPopup.pages[pageID].groups[groupID].groupLabel+'"');
        		window.close();	
        	});
		}
     });
}

// PAGE NEW
function popupPageAdd() {
    var pageLabel = $("#popupPageLabel").val();
    var pageDescription = $("#popupPageDescription").val();
    var nextPageID = jsonPopup['pages'].length;
    if  ( typeof pageLabel === 'undefined' || pageLabel === null || pageLabel === "" ) {
 		alert('Page label cannot be empty!');
    } else {  
    	window.close();  
        var newPageObj = new Object();
        newPageObj.pageLabel = pageLabel;
        newPageObj.pageDescription = pageDescription;
        newPageObj.pageColumns = "0",
        newPageObj.pageBackground = "",
        newPageObj['groups'] = [];
    
        jsonPopup['pages'].push(newPageObj);
        chrome.storage.local.set({ "jsonUS": JSON.stringify(jsonPopup) }, function(){});
        	alert('Page "'+pageLabel+'" successfully created.');
    }
}        

// GROUP NEW
function popupGroupAdd() {
    var groupLabel = $("#popupGroupLabel").val();
    var groupDescription = $("#popupGroupDescription").val();
    var pageTarget = $("#popupPageTarget").val();

    if  ( typeof groupLabel === 'undefined' || groupLabel === null || groupLabel === "" ) {
 		alert('Group label cannot be empty!');
    } else {  
    	window.close();  
        var newGroupObj = new Object();
        newGroupObj.groupLabel = groupLabel;
        newGroupObj.groupDescription = groupDescription;
        newGroupObj.groupIcon = "";
        newGroupObj['itens'] = [];
    
    	jsonPopup.pages[pageTarget]['groups'].push(newGroupObj);
        chrome.storage.local.set({ "jsonUS": JSON.stringify(jsonPopup) }, function(){});
        	alert('Group "'+groupLabel+'" successfully created.');
    }
}    