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
        //if (clickData.menuItemId.match(/^(contextMenuPage|contextMenuLink).*/) ) {

        } else {
          saveItem(clickData);
        }
      });


    });

  }
})



function saveCurrentURL(pageID, groupID){
  chrome.tabs.query({active: true, currentWindow: true}, 
      function(arrayOfTabs) {
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

    jsonPopup.pages[pageID].groups[groupID]['itens'].push(newItemObj);
        chrome.storage.local.set({ "jsonUS": JSON.stringify(jsonPopup) }, function(){  
          alert('Page "'+tabTitle+'" added to "'+jsonPopup.pages[pageID].groups[groupID].groupLabel+'"');
          window.close();             
        }); 
     });
}


function saveItem(clickData) {

var jsonBackground;
var jsonBackgroundImg;

          chrome.storage.local.get("jsonIMG", function(results){
              try {
                  JSON.parse(results.jsonIMG);
              } catch (e) {
                  return false;
              }
              jsonBackgroundImg = JSON.parse(results.jsonIMG); 
          });

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
              var tabIcon;

              //LINKMENU EVENT
              if (contextID == 'Page') {       
                tabURL = activeTab.url;
                tabTitle = activeTab.title;
                tabIcon = activeTab.favIconUrl; 
              } else { // Just a link, no title
                tabURL = clickData.linkUrl;

              if (clickData.linkUrl.split('/')[2] == '') { tabTitle = clickData.linkUrl.split('/')[3]; } else { tabTitle = clickData.linkUrl.split('/')[2] }
              }

              //GET ROOT DOMAIN
              var domainName = tabURL.replace('http://','').replace('https://','').replace('www.','').replace('web.','').split(/[/?#]/)[0];

              var newItemObj = new Object();
              newItemObj.label = tabTitle;
              newItemObj.url = tabURL;
              newItemObj.alt = '';
              newItemObj.date = Date.now().toString();
              newItemObj.icon = ''+tabIcon;             

              //GET MATCH ICON
              for (i = 0; i < jsonBackgroundImg['icons'].length; i++) {
                var allString = jsonBackgroundImg.icons[i].label;

                if (allString.includes(domainName)) {
                  newItemObj.icon = jsonBackgroundImg.icons[i].value;
                  break;
                }
              }
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