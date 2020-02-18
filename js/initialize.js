var json; // main json
var imagesJson; // images json
var jsonSearchIndex = JSON.parse('{"itens": [] }'); //index items for search
var allowFileAccessMessage = '';

chrome.extension.isAllowedFileSchemeAccess(function(isAllowedAccess) {
	if (isAllowedAccess) { allowFileAccessMessage = '' }
    else { allowFileAccessMessage = '<div id="allowFileAccessMessageWarning" style="cursor: pointer; background-color: rgba(0,0,0, 0.1); width: 100%; height: 50px; margin-top: 10px; padding:10px; display: inline-flex; font-weight: normal;"><div style="color: red; display: inline-block;"><i class="fas fa-exclamation-triangle fa-2x"></i></div><div "style="display: inline-block;">If you want to use local URLs, icons and images, please check the option "Allow access to file URLs" at the <b>Extensions Manager Page</b></div>' }  	
});


//load links json
chrome.storage.local.get("jsonUS", callbackJSON);
chrome.storage.local.get("jsonIMG", callbackJSONIMG);

//main initialize function
function initialize() {

		/********************************** SET OPTIONS BEGIN ***************************************/
	        	 
		//DEFAULT ITEM ORDER
		var defaultItensSort = json.settings.defaultItensSort;

            for (p = 0; p < json['pages'].length; p++) {
            	for (g = 0; g < json.pages[p]['groups'].length; g++) {
            		var groupSort = json.pages[p].groups[g].groupSort;				
            		if (groupSort  == "auto") {					
						switch(defaultItensSort) {
            			case 'az':
            			    json.pages[p].groups[g]['itens'].sort(function(a, b) {
            			        var labelA = a.label.toUpperCase(); // ignore upper and lowercase
            			        var labelB = b.label.toUpperCase(); // ignore upper and lowercase
            			        if (labelA < labelB) {
            			          return -1;
            			        }
            			        if (labelA > labelB) {
            			          return 1;
            			        }                
            			        // names must be equal
            			        return 0;
            			        });
            			    chrome.storage.local.set({ "jsonUS": JSON.stringify(json) }, function(){});
            			    break;
            			case 'za':
            			    json.pages[p].groups[g]['itens'].sort(function(a, b) {
            			        var labelA = a.label.toUpperCase(); // ignore upper and lowercase
            			        var labelB = b.label.toUpperCase(); // ignore upper and lowercase
            			        if (labelA > labelB) {
            			          return -1;
            			        }
            			        if (labelA < labelB) {
            			          return 1;
            			        }                
            			        // names must be equal
            			        return 0;
            			        }); 
            			    chrome.storage.local.set({ "jsonUS": JSON.stringify(json) }, function(){});               
            			    break;
            			case 'newst':         
            			    json.pages[p].groups[g]['itens'].sort(function(a, b) {
            			        var dateA = a.date;
            			        var dateB = b.date;
            			        if (dateA > dateB) {
            			          return -1;
            			        }
            			        if (dateA < dateB) {
            			          return 1;
            			        }                
            			        // names must be equal
            			        return 0;
            			        });
            			    chrome.storage.local.set({ "jsonUS": JSON.stringify(json) }, function(){});               
            			    break;                 
            			case 'oldest':        
            			    json.pages[p].groups[g]['itens'].sort(function(a, b) {
            			        var dateA = a.date;
            			        var dateB = b.date;
            			        if (dateA < dateB) {
            			          return -1;
            			        }
            			        if (dateA > dateB) {
            			          return 1;
            			        }                
            			        // names must be equal
            			        return 0;
            			        }); 
            			    chrome.storage.local.set({ "jsonUS": JSON.stringify(json) }, function(){});              
            			    break;   
            			}        
           			} else { //SORT BY GROUP OPTION
						switch(groupSort) {
            			case 'az':
            			    json.pages[p].groups[g]['itens'].sort(function(a, b) {
            			        var labelA = a.label.toUpperCase(); // ignore upper and lowercase
            			        var labelB = b.label.toUpperCase(); // ignore upper and lowercase
            			        if (labelA < labelB) {
            			          return -1;
            			        }
            			        if (labelA > labelB) {
            			          return 1;
            			        }                
            			        // names must be equal
            			        return 0;
            			        });
            			    chrome.storage.local.set({ "jsonUS": JSON.stringify(json) }, function(){});
            			    break;
            			case 'za':
            			    json.pages[p].groups[g]['itens'].sort(function(a, b) {
            			        var labelA = a.label.toUpperCase(); // ignore upper and lowercase
            			        var labelB = b.label.toUpperCase(); // ignore upper and lowercase
            			        if (labelA > labelB) {
            			          return -1;
            			        }
            			        if (labelA < labelB) {
            			          return 1;
            			        }                
            			        // names must be equal
            			        return 0;
            			        }); 
            			    chrome.storage.local.set({ "jsonUS": JSON.stringify(json) }, function(){});               
            			    break;
            			case 'newst':         
            			    json.pages[p].groups[g]['itens'].sort(function(a, b) {
            			        var dateA = a.date;
            			        var dateB = b.date;
            			        if (dateA > dateB) {
            			          return -1;
            			        }
            			        if (dateA < dateB) {
            			          return 1;
            			        }                
            			        // names must be equal
            			        return 0;
            			        });
            			    chrome.storage.local.set({ "jsonUS": JSON.stringify(json) }, function(){});               
            			    break;                 
            			case 'oldest':        
            			    json.pages[p].groups[g]['itens'].sort(function(a, b) {
            			        var dateA = a.date;
            			        var dateB = b.date;
            			        if (dateA < dateB) {
            			          return -1;
            			        }
            			        if (dateA > dateB) {
            			          return 1;
            			        }                
            			        // names must be equal
            			        return 0;
            			        }); 
            			    chrome.storage.local.set({ "jsonUS": JSON.stringify(json) }, function(){});              
            			    break;           
           				}           					
           			}
           		}
           	}


		/********************************** SET OPTIONS BEGIN ***************************************/


	//PREVENT CONTEXT MENU LISTENERS
	document.body.addEventListener("contextmenu", function(e) { e.preventDefault(); })

	//TOPNAV BUTTONS EVENT LISTENERS
	document.getElementById('plusIcon').addEventListener('click', function(event) { showPlusMenu(event); event.stopPropagation() });
	document.getElementById('optionsIcon').addEventListener('click', function() { chrome.tabs.create({ active: true, url: 'options.html' }); event.stopPropagation() });


	//TOPNAV BUTTONS BALLOONS
	$('.plusIcon').balloon({ position:'bottom', maxLifetime: 3000, css:{fontSize: '110%'} });


	//CREATE BODY MAIN CONTENT
	var bodyContent = document.createElement('DIV');
	bodyContent.id = "bodyContent";


	/******************** TOPBAR AND SEARCHBAR ****************/
	var topNav = document.getElementById("topNav");
	var topNavList = document.getElementById("topNavList");
	var searchTopNav = document.getElementById("searchTopNav");
	
	//TOPNAV SEARCH EVENT LISTENERS
	$("#searchTopBarInput").on('enter', function(){ showSearchResults() });
	$("#closeSearch").on('click', function(){ searchClose() });
	$("#searchTopBarInput").on('keydown', function(event){ 
	    //if (event.keyCode == 13) {        
	        reflowSearchResults(this.value);
	        searchOpen();
	   // }
	    //    reflowSearchResults(this.value)
	    });
	$("#searchTopBarInput").on('change paste input', function(event){ reflowSearchResults(this.value) });	
	$("#searchTopBarForm").on("submit",function(event){event.preventDefault()})
	

	var defaultPageColumns = json['settings'].defaultPageColumns;
	var defaultBackgroundColor = json['settings'].defaultBackgroundColor;
	var itemLabelFontColor = json['settings'].itemLabelFontColor;

	/******************** PAGE BEGIN ****************/	
	for (p = 0; p < json['pages'].length; p++) { 
	    var pageLabel = json.pages[p].pageLabel;
	    var pageDescription = json.pages[p].pageDescription;	    
	    var pageBackground = json.settings.defaultPageBackground;
	    var pageColumns = json.pages[p].pageColumns;
	    var pageColor = json.pages[p].pageColor;
	    var pageLenght = json.pages[p]['groups'].length;
	
		//PAGE BACKGROUND OPTION
		if (json.pages[p].pageBackground != '' ) { pageBackground = json.pages[p].pageBackground };



	    /*** INCLUDE PAGE ON TOPNAV BEGIN ***/
	    var topLink = document.createElement('A');
	    topLink.className = "topLink"; 
	    topLink.dataset.page = p;
	    topLink.id = 'topLink'+p;    
	    topLink.title = pageDescription;
	    topLink.innerHTML = pageLabel;
	    topLink.href = "#";
	    topLink.addEventListener('click', function() {selectPage(this.dataset.page)});
	    topLink.addEventListener('contextmenu', function(event){
	        event.preventDefault(); 
	        showMenu(event, 'topbar', this.dataset.page)
	        event.stopPropagation();
	    });

	    var topLinkItem = document.createElement('LI');		
		topLinkItem.className = "topLinkItem"; 
		topLinkItem.id = 'topLinkItem'+p;    
	    topLinkItem.dataset.page = p;

	    topLinkItem.appendChild(topLink);
	    topNavList.appendChild(topLinkItem);    

		/*** INCLUDE PAGE ON TOPNAV END ***/


	    //PAGE SECTION
	    var pageSection = document.createElement('DIV');
	    pageSection.className = "pageSection";
	    pageSection.id = "pageSection"+p;
	    pageSection.style.display = 'none';
	    pageSection.addEventListener("click", function() {     
	        $('#contextPageMenu').remove();
	        $('#contextTopNavMenu').remove();
	        $('#contextGroupMenu').remove();
	        $('#contextItemMenu').remove();
	    });
	
		//PAGE CONTENT
	    var contentPage = document.createElement('DIV');
	    contentPage.className = "contentPage";
	    contentPage.id = "contentPage"+p;
	    contentPage.dataset.page = p;
	    contentPage.style.minHeight = screen.height;	    
	    if (pageColor == '') {
	    	contentPage.style.backgroundColor = '#'+defaultBackgroundColor;	
	    } else {
	    	pageColor = '#'+pageColor;
	    	contentPage.style.backgroundColor = pageColor;
	    }	    
	    contentPage.addEventListener('contextmenu', function(event) { showMenu(event, 'page', this.dataset.page) });
	    if (pageBackground != '' ) {
	        //if ( (pageBackground.toLowerCase().startsWith('http://')) || (pageBackground.toLowerCase().startsWith('file:///')) ) {        	
	        if (pageBackground.toLowerCase().match(/^(http:\/\/|https:\/\/|file:\/\/\/).*/) ) {
	            contentPage.style.background = pageColor+' url("'+pageBackground+'") no-repeat center center fixed';
	            contentPage.style.backgroundSize = 'cover';
	        } else {	        	
	            contentPage.style.background = pageColor+' url("../bg/'+pageBackground+'") no-repeat center center fixed';
	            contentPage.style.backgroundSize = 'cover';
	        }	        
	    }



	    /******************** GROUP BEGIN ****************/	
	    for (g = 0; g < json.pages[p]['groups'].length; g++) { 
	        var gid = p.toString() + g.toString();	
	        var groupLabelText = json.pages[p].groups[g].groupLabel;
	        var groupDescriptionText = json.pages[p].groups[g].groupDescription;
	        var groupIconImage = json.pages[p].groups[g].groupIcon;
	        var groupColor = json.pages[p].groups[g].groupColor;

	        //GROUP SECTION
	    	var groupSection = document.createElement('DIV');
			groupSection.className = "groupSection"; 
			groupSection.id = 'groupSection'+gid;    
	    	groupSection.dataset.page = p;
	    	groupSection.dataset.group = g;	    	
	    	

	    	//CONTENT GROUP	
	        var contentGroup = document.createElement('DIV');
	        contentGroup.className = "contentGroup";
	        contentGroup.id = "contentGroup"+gid;    
	        contentGroup.dataset.page = p;
	        contentGroup.dataset.group = g;
	        if ( groupColor == 'transparent' ) {
	        	contentGroup.style.backgroundColor = 'transparent';
	        } else {
	        	contentGroup.style.backgroundColor = '#'+groupColor;
	        }

	        if ( pageColumns == 0 ) { //pageComuns auto
	        	if ( defaultPageColumns != 0 ) {
	        		contentGroup.style.width = 'calc('+100/defaultPageColumns+'% - 20px)';
	        	} else if ( pageLenght <= 5 ) {
	        	    contentGroup.style.width = 'calc('+100/pageLenght+'% - 20px)';
	        	}
	        } else { //not auto
	        	contentGroup.style.width = 'calc('+100/pageColumns+'% - 20px)';
	        }	        
	        contentGroup.addEventListener('contextmenu', function(event){
	            event.preventDefault(); 
	            showMenu(event, 'group', this.dataset.page, this.dataset.group)
	            event.stopPropagation();
	        });

			//GROUP HEADER
	        var groupHeader = document.createElement('DIV');
	        groupHeader.className = "groupHeader";
	        groupHeader.id = "groupHeader"+gid;
	        groupHeader.dataset.page = p;
	        groupHeader.dataset.group = g;
	
			//GROUP ICON
	        var groupIcon = document.createElement('DIV');
	        groupIcon.className = "groupIcon";
	        groupIcon.id = "groupIcon"+gid;
	        if ( (groupIconImage != '' ) && (groupIconImage != 'bookmark.png' ) ) {
	            //if ( (groupIconImage.toLowerCase().startsWith('http://')) || (groupIconImage.toLowerCase().startsWith('file:///')) ) {
	            if (groupIconImage.toLowerCase().match(/^(http:\/\/|https:\/\/|file:\/\/\/).*/) ) {
	                groupIcon.style.backgroundImage = 'url("'+groupIconImage+'")';
	            } else {
	                groupIcon.style.backgroundImage = 'url("../gicons/'+groupIconImage+'")';
	            }
	        }          

	        //GROUP LABEL
	        var groupLabel = document.createElement('DIV');
	        groupLabel.className = "groupLabel";
	        groupLabel.id = "groupLabel"+gid;
	        groupLabel.innerHTML = groupLabelText;        
	
			//GROUP DESCRIPTION
	        var groupDescription = document.createElement('DIV');
	        groupDescription.className = "groupDescription";
	        groupDescription.id = "groupDescription"+gid;
	        groupDescription.innerHTML = groupDescriptionText;
	        if (! isNull (groupDescription.innerHTML)) { groupDescription.style.display = 'block'; } //DESCRIPTION HIDE

			//GROUP BOOKMARK SECTION
	        var bookmarksSection = document.createElement('DIV');
	        bookmarksSection.className = "bookmarksSection";
	        bookmarksSection.id = "bookmarksSection"+gid;
	
			//GROUP BOOKMARK LIST
	        var bookmarksList = document.createElement('UL');
	        bookmarksList.className = "bookmarksList";
	        bookmarksList.id = "bookmarksList"+gid;
	        bookmarksList.dataset.page = p;
	        bookmarksList.dataset.group = g;
	        bookmarksList.dataset.gid = gid;


	        //GROUP ASSEMBLE
	        bookmarksSection.appendChild(bookmarksList);

	        groupHeader.appendChild(groupIcon);
	        groupHeader.appendChild(groupLabel);
	
	        contentGroup.appendChild(groupHeader);
	        contentGroup.appendChild(groupDescription);
	        contentGroup.appendChild(bookmarksSection);

	        groupSection.appendChild(contentGroup);

			contentPage.appendChild(groupSection);	        
	
	
	        /******************** ITEM BEGIN ****************/	
	        for (i = 0; i < json.pages[p].groups[g]['itens'].length; i++) {
	        	var iid = p.toString() + g.toString() + i.toString();
	            var itemLabelText = json.pages[p].groups[g].itens[i].label;
	            var itemUrl = json.pages[p].groups[g].itens[i].url;
	            var itemAlt = json.pages[p].groups[g].itens[i].alt;
	            var itemIcon = json.pages[p].groups[g].itens[i].icon;           
	
	            //ITEM SEARCH INDEX
	            var jsonItemClone = JSON.parse(JSON.stringify(json.pages[p].groups[g].itens[i]));
	            jsonItemClone['page'] = p;
	            jsonItemClone['group'] = g;
	            jsonItemClone['item'] = i;
	            jsonSearchIndex['itens'].push(jsonItemClone);
	
				//GROUP BOOKMARK LIST ITEM
	            var bookmarksListItem = document.createElement('LI');
	            bookmarksListItem.className = "bookmarksListItem";
	            bookmarksListItem.id = "bookmarksListItem"+iid;
	            bookmarksListItem.dataset.page = p;
	            bookmarksListItem.dataset.group = g;
	            bookmarksListItem.dataset.item = i;
	            if (itemAlt == '') {
	            	bookmarksListItem.title = itemLabelText+"\n"+itemUrl;
	            } else {
	            	bookmarksListItem.title = itemLabelText+"\n"+itemAlt;
	            }
	            
	            bookmarksListItem.addEventListener('contextmenu', function(event){
	                event.preventDefault(); 
	                showMenu(event, 'item', this.dataset.page, this.dataset.group, this.dataset.item)
	                event.stopPropagation();
	            });         

				//ITEM LINK
	            var itemLink = document.createElement('A');
	            itemLink.className = "itemLink";
	            itemLink.id = "itemLink"+iid;    
	            itemLink.href = itemUrl;
				if (json.settings.openLinksNewTab == 'true') { itemLink.target = "_blank"}

				//CONTENT ITEM
	            var contentItem = document.createElement('DIV');
	            contentItem.className = "contentItem";
	            contentItem.id = "contentItem"+iid;
	
				//ITEM ICON IMAGE
	            var itemIconImage = document.createElement('IMG');
	            itemIconImage.className = "itemIconImage";
	            itemIconImage.id = "itemIconImage"+iid;
	            
	            //if ( (itemIcon.toLowerCase().startsWith('http')) || (itemIcon.toLowerCase().startsWith('file')) ) {
	            //if ( (itemIcon.toLowerCase().startsWithAny('http://', 'https://', 'file:///')) || (itemIcon.toLowerCase().startsWith('file:///')) ) {
	            if (itemIcon.toLowerCase().match(/^(http:\/\/|https:\/\/|file:\/\/\/).*/) ) {	            
	                itemIconImage.src = itemIcon;   
	            } else if (itemIcon == '') {
	                itemIconImage.src = 'icons/default.png'; 
	            } else {
	            	itemIconImage.src = 'icons/'+itemIcon;
	            }

	            //itemIconImage.onerror = 'this.src="icons/default.png"'
	            //itemIconImage.onload = function() {  };
	            //itemIconImage.onerror = function() { itemIconImage.src = 'icons/default.png' };
	            
				//ITEM LABEL
	            var itemLabel = document.createElement('DIV');
	            itemLabel.className = "itemLabel";   
	            itemLabel.id = "itemLabel"+iid;         
	            itemLabel.innerHTML = itemLabelText;
	            itemLabel.style.color = itemLabelFontColor;
	            
	

	 			//ITEM ASSEMBLE
	            //itemLink.appendChild(itemIconImage);

	            contentItem.appendChild(itemIconImage);
	            contentItem.appendChild(itemLabel);

				itemLink.appendChild(contentItem);

	            bookmarksListItem.appendChild(itemLink);
	            bookmarksList.appendChild(bookmarksListItem);	

	        } /******************** ITEM END ****************/	
	    } /******************** GROUP END ****************/	
	    pageSection.appendChild(contentPage);
	    bodyContent.appendChild(pageSection);
	} /******************** PAGE END ****************/	



	//SELECT CURRENT PAGE
	chrome.storage.local.get("currentPage", function(results){
	    if (typeof results.currentPage === 'undefined' || results.currentPage === null) {
	        selectPage(0);
	    } else if (json.settings.remeberLastPage == 'false') {
	    	selectPage(0);
	    } else {
	        selectPage(results.currentPage);
	    }    
	});
	

	/******************** PREPARE DOCUMENT CONTENT BEGIN ****************/		
    $(document).ready(function () {    	
    	document.body.appendChild(bodyContent);

    	// LOOP TO FIX BROKEN ICONS
		$('.itemIconImage').each(function() {
  			//console.log($(this).attr('src'));
 			var element = $(this);
			$.ajax( {
				url:$(this).attr('src'),
				type:'get',
				async: false,
				error:function(response){
 			   		var replace_src = "icons/broken.png";
					// Again check the default image
		   			$.ajax({
		    			url: replace_src,
		    			type:'get',
		    			async: false,
		    			success: function(){
		     				$(element).attr('src', replace_src);
		    			},
		    		error:function(response){
		    			$(element).hide();
		    			}
		  			});
		 		}
			});
		});



    	//APPLY SORTABLE ITENS
		$('ul.bookmarksList').sortable({
			delay: 300,
			connectWith: ".bookmarksList",
			forcePlaceholderSize: true,
			receive: function (event, ui) {
				$(ui.item).attr('data-receive', 'true'); //prevent from run stop section

            	var srcPage = $(ui.item).attr('data-page');
            	var srcGroup = $(ui.item).attr('data-group');
            	var srcIndex = $(ui.item).attr('data-fromIndex');
            	 
				var dstPage = $(ui.item).parent().attr("data-page");
				var dstGroup = $(ui.item).parent().attr("data-group");
            	var dstIndex = $(ui.item).index();

        		document.getElementById($(ui.item).attr("id")).style.backgroundColor = '';
        		document.getElementById($(ui.item).attr("id")).style.transform = '';
        		document.getElementById($(ui.item).attr("id")).style.boxShadow = '';

				var element = json.pages[srcPage].groups[srcGroup].itens[srcIndex];
				json.pages[dstPage].groups[dstGroup]['itens'].splice(dstIndex, 0, element);
				json.pages[srcPage].groups[srcGroup].itens.splice(srcIndex,1);   

				chrome.storage.local.set({ "jsonUS": JSON.stringify(json) }, function(){ location.reload() });
        },
			start: function (event, ui) {
				$(ui.item).attr('data-fromIndex', ui.item.index());
            	$(this).attr('data-fromIndex', ui.item.index());

            	document.getElementById(ui.item.attr("id")).style.backgroundColor = '#FFF';
            	document.getElementById(ui.item.attr("id")).style.paddingTop = '15px';
            	document.getElementById(ui.item.attr("id")).style.transform = 'rotateZ(10deg)';
            	document.getElementById(ui.item.attr("id")).style.boxShadow = 'rgba(0, 0, 0, 0.4) 2px 2px 3px 0.6px, rgba(0, 0, 0, 0.07) 0px 0px 1px 1px';

        	},
        	change: function (event, ui) {
        		ui.placeholder.css('box-shadow', 'inset rgba(0, 0, 0, 0.4) 2px 2px 3px 0.6px, rgba(0, 0, 0, 0.07) 0px 0px 1px 1px');
        		ui.placeholder.css('background-color', '#F3F3F3');
        		ui.placeholder.css("visibility", "visible");
        		ui.placeholder.css("min-width", json.settings.itemIconSize+'px');
        	},
        	stop: function (event, ui) {
        		if ($(ui.item).attr('data-receive') != 'true') {  //prevent from run stop section
        			var p = this.dataset.page;
    	    		var g = this.dataset.group; 
        			var toIndex = ui.item.index();
        			var fromIndex = $(this).attr('data-fromIndex');
	
        			document.getElementById(ui.item.attr("id")).style.backgroundColor = '';
        			document.getElementById(ui.item.attr("id")).style.transform = '';
        			document.getElementById(ui.item.attr("id")).style.boxShadow = '';
	
        			if (fromIndex != toIndex) {
						var element = json.pages[p].groups[g].itens[fromIndex];
    					json.pages[p].groups[g]['itens'].splice(fromIndex, 1);
    					json.pages[p].groups[g]['itens'].splice(toIndex, 0, element);
    					chrome.storage.local.set({ "jsonUS": JSON.stringify(json) }, function(){ location.reload() });
    	    		}
        		}
        		$(ui.item).attr('data-receive', 'false');        		
         	}
    	}).disableSelection();


		//APPLY SORTABLE PAGES ON TOPNAV
		$('ul.topNavList').sortable({
			delay: 400,
			start: function (event, ui) {
            	$(this).attr('data-fromIndex', ui.item.index());
            	$("#topNavList").css('margin-top', '-15px');
        	},
        	stop: function (event, ui) {
        		$("#topNavList").css('margin-top', '0px');
        		var p = this.dataset.page;
    	    	var g = this.dataset.group; 
        		var toIndex = ui.item.index();
        		var fromIndex = $(this).attr('data-fromIndex');
        		if (fromIndex != toIndex) {
					var element = json.pages[fromIndex];
    				json['pages'].splice(fromIndex, 1);
    				json['pages'].splice(toIndex, 0, element);
    	    		chrome.storage.local.set({ "jsonUS": JSON.stringify(json) }, function(){ location.reload() });
    	    	}
        	}
    	});


		/**********************************************/
		/**************** SET OPTIONS *****************/
		/**********************************************/
		
		//TOPNAV COLORS
		document.getElementById("topNav").style.backgroundColor = '#'+json['settings'].colorsTopnavBackgroundColor;
		$('.topLink').css('color', '#'+json['settings'].colorsTopnavColor);




		//ITEM MARGIN		
		var itemIconMargin = parseInt(json.settings.itemIconMargin);
		//$('.bookmarksListItem').css({ 'margin': itemIconMargin+'px' });		
		
		// ITEM SIZE
		var itemIconSize = parseInt(json.settings.itemIconSize);
/*				
		var contentGroupMinWidth = itemIconSize + (2 * itemIconMargin) + 10;

		var contentGroupMinHeight = itemIconSize + (2 * itemIconMargin) + 10 + 15 + 3 + 35;
		if (json.settings.noItemLabels == 'true') { contentGroupMinHeight = itemIconSize + (2 * itemIconMargin) + 10 + 15 + 3; } //no label
		

		$('.contentGroup').css({ 'min-width': contentGroupMinWidth+'px', 'min-height': contentGroupMinHeight+'px' });
		$('.bookmarksList').css({ 'min-width': contentGroupMinWidth+'px', 'min-height': contentGroupMinHeight+'px' });

		var bookmarksListItemMinWidth = itemIconSize +5;
		var BookmarksListItemMaxWidth = itemIconSize + 12;
		var BookmarksListItemMinHeight = itemIconSize + 18;
		if (json.settings.noItemLabels == 'true') { BookmarksListItemMinHeight = itemIconSize; } //no label
		var BookmarksListItemMaxHeight = BookmarksListItemMinHeight + 32;
		if (json.settings.noItemLabels == 'true') { BookmarksListItemMaxHeight = itemIconSize; } //no label



		//$('.bookmarksListItem').css({ 'min-width': bookmarksListItemMinWidth+'px', 'max-width': BookmarksListItemMaxWidth+'px', 'min-height': BookmarksListItemMinHeight+'px', 'max-height': BookmarksListItemMaxHeight+'px' });
		//$('.bookmarksListItem').css({ 'min-width': bookmarksListItemMinWidth+'px', 'min-height': BookmarksListItemMinHeight+'px', 'max-height': BookmarksListItemMaxHeight+'px' });
		$('.bookmarksListItem').css({ 'min-width': bookmarksListItemMinWidth+'px', 'min-height': BookmarksListItemMinHeight+'px', 'max-height': BookmarksListItemMaxHeight+'px' });

		//
		$('.bookmarksListItem').css({ 'height': BookmarksListItemMaxHeight+'px'});


*/
		var itemWith = (itemIconSize + itemIconSize*0.2) + 12;

		if (json.settings.noItemLabels == 'true') { 
			var itemHeight = itemWith;
		} else {
			var itemHeight = (itemIconSize + 3.7*parseInt(json.settings.itemLabelFontSize));
		}
		
		

		
		$('.bookmarksList').css({ 'grid-template-columns': 'repeat(auto-fill, '+itemWith+'px)', 'grid-gap': itemIconMargin+'px'});
		

		$('.bookmarksListItem').css({ 'width': itemWith+'px', 'height': itemHeight+'px'});

		$('.itemIconImage').css({ 'max-width': itemIconSize+'px', 'max-height': itemIconSize+'px' });


		//ITEM RADIUS
		var itemIconRadius = json.settings.itemIconRadius;
		$('.bookmarksListItem').css({ 'border-radius': itemIconRadius+'px' });

		//ITEM LABEL FONT SIZE
		var itemLabelFontSize = json.settings.itemLabelFontSize;
		$('.itemLabel').css({ 'font-size': itemLabelFontSize+'px' });

		//ITEM LABEL LINES SHOWN
		var itemIconLabelLabelShown = json.settings.itemLabelShowLines;
		switch (itemIconLabelLabelShown) {
		    case '2': 
		    	$('.itemLabel').css({ 'max-height': '2.6em' });
		    	$('.bookmarksListItem').css({ 'height': 'auto'});
		    	break;
		    case 'all': 
		    	$('.itemLabel').css({ 'max-height': 'none'});
		    	$('.bookmarksListItem').css({ 'height': 'auto'});
		    	break;
		}
		$('.itemLabel').css({ 'text-align': itemIconLabelTextAlign });

		//ITEM LABEL TEXT ALIGN
		var itemIconLabelTextAlign = json.settings.itemIconLabelTextAlign;
		$('.itemLabel').css({ 'text-align': itemIconLabelTextAlign });

		//ITEM LABEL FONT FAMILY
		var itemIconLabelFontFamily = json.settings.itemIconLabelFontFamily;
		$('.itemLabel').css({ 'font-family': itemIconLabelFontFamily });

		//ITEM LABEL FONT STYLE
		var itemIconLabelFontStyle = json.settings.itemIconLabelFontStyle;
		$('.itemLabel').css({ 'font-style': itemIconLabelFontStyle });

		//ITEM LABEL FONT WEIGHT
		var itemIconLabelFontWeight = json.settings.itemIconLabelFontWeight;
		$('.itemLabel').css({ 'font-weight': itemIconLabelFontWeight });

		//BROWSER CONTEXTMENU
	    if (json.settings.showBrowserContextMenu == 'false') {
	    	chrome.contextMenus.removeAll();
	    } else {
        recreateBrowserContextMenus(json);        
      }



		//NO ITEM LABELS
		if (json.settings.noItemLabels == 'true') { 
			$('.bookmarksList').css({ 'align-items': 'center', 'justify-content': 'center'});
			$('.bookmarksListItem').css({ 'height': 'auto', 'width': 'auto' });
			$('.itemLabel').css("display", "none");
			 }

		/**************** SET OPTIONS END *****************/


    	//MASONRY ALIGNMENT
		$('.contentPage').masonry({
	    	itemSelector: '.contentGroup',
	    	columnWidth: '.contentGroup',
	    	percentPosition: true,      
	    	transitionDuration: '0.2s',        
		});

    }); 

	
} /******************** PREPARE DOCUMENT CONTENT END ****************/	

