var jsonBackground;


chrome.storage.local.get("jsonUS", function(JsonData) {
  try {
      JSON.parse(JsonData.jsonUS);
  } catch (e) {
      //alert ('No data found on Chrome Storage!');
  } 

  jsonBackground = JSON.parse(JsonData.jsonUS);

  if (jsonBackground.settings.showBrowserContextMenu == 'true') {
    chrome.contextMenus.removeAll(function(){

      //PAGE MENUS
      chrome.contextMenus.create({
        "id": "contextMenuPageRoot",
        "title": "upStart - Add bookmark to",
        "contexts": ["page"]
      });

      //LIK MENUS
      chrome.contextMenus.create({
        "id": "contextMenuLinkRoot",
        "title": "upStart - Add bookmark to",
        "contexts": ["link"]
      });


      //POPULATE MENUS WITH CURRENT PAGES AND GROUPS
      for (p = 0; p < jsonBackground['pages'].length; p++) { 
        var pageLabel = jsonBackground.pages[p].pageLabel;

        //PAGES TO PAGEMENU
        chrome.contextMenus.create({
          "id": "contextMenuPage"+p,
          "title": pageLabel,
          "parentId": "contextMenuPageRoot"   
        }); 

        //PAGES TO LINKMENU
        chrome.contextMenus.create({
          "id": "contextMenuLink"+p,
          "title": pageLabel,
          "parentId": "contextMenuLinkRoot" ,
          "contexts": ["link"]   
        }); 


        for (g = 0; g < jsonBackground.pages[p]['groups'].length; g++) {      
          var groupLabel = jsonBackground.pages[p].groups[g].groupLabel;
          var gid = p.toString() +'.'+ g.toString();

          //GROUPS TO PAGEMENU
          chrome.contextMenus.create({
            "id": "Page_"+gid,
            "title": groupLabel,
            "parentId": "contextMenuPage"+p
          });   

          //GROUPS TO LINKMENU
          chrome.contextMenus.create({
             "id": "Link_"+gid,
             "title": groupLabel,
             "parentId": "contextMenuLink"+p,
             "contexts": ["link"] 
          });     

        }                        

      }

      chrome.contextMenus.onClicked.addListener( function (clickData) {
        if ( (clickData.menuItemId.startsWith('contextMenuPage')) || (clickData.menuItemId.startsWith('contextMenuLink')) ) {
        } else {
          saveItem(clickData);
        }
      });


    });

  }
})




function saveItem(clickData) {


          chrome.storage.local.get("jsonUS", function(JsonData) {
            try {
                JSON.parse(JsonData.jsonUS);
            } catch (e) {
                //alert ('No data found on Chrome Storage!');
            } 
            jsonBackground = JSON.parse(JsonData.jsonUS);

            menuID = clickData.menuItemId;
            pageURL = clickData.pageUrl;

            var contextID = menuID.split('_')[0];
            var GID = menuID.split('_')[1];
            var dstPage = GID.split('.')[0];
            var dstGroup = GID.split('.')[1];


            chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
              var activeTab = arrayOfTabs[0];
              var tabURL;
              var tabTitle;
              var tabAlt;
              var iconValue = '';

              //LINKMENU EVENT
              if (contextID == 'Page') {       
                tabURL = activeTab.url;
                tabTitle = activeTab.title;   
              } else { // Link
                tabURL = clickData.linkUrl;

                if (clickData.linkUrl.split('/')[2] == '') { tabTitle = clickData.linkUrl.split('/')[3]; } else { tabTitle = clickData.linkUrl.split('/')[2] }
              }
              console.log(activeTab.favIconUrl);
              iconValue = activeTab.favIconUrl;

              //GET ROOT DOMAIN
              var domainName = tabURL.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0];

              //GET MATCH ICON
              for (i = 0; i < jsonBackground['icons'].length; i++) {
                var allString = jsonBackground.icons[i].label;
                var regex = new RegExp(domainName, 'gi');

                var strResults = allString.match(regex);

                if (strResults) {
                  iconValue = jsonBackground.icons[i].value;
                  break;
                }
              }

              var newItemObj = new Object();
              newItemObj.label = tabTitle;
              newItemObj.url = tabURL;
              newItemObj.alt = '';
              newItemObj.icon = iconValue;
              newItemObj.date = Date.now().toString();

              jsonBackground.pages[dstPage].groups[dstGroup]['itens'].push(newItemObj);
              
              chrome.storage.local.set({"jsonUS": JSON.stringify(jsonBackground)}, function() {
                if (contextID == 'Page') { 
                  //alert("Page added to "+ jsonBackground.pages[dstPage].pageLabel +' - '+jsonBackground.pages[dstPage].groups[dstGroup].groupLabel)
                } else {
                  //alert("Link added to "+ jsonBackground.pages[dstPage].pageLabel +' - '+jsonBackground.pages[dstPage].groups[dstGroup].groupLabel)
                }          
              });              
            });
          });

}