//run once upon browser start
chrome.runtime.onStartup.addListener( async function() {
  console.log('browser start');

  //sync at browser start
  if (localStorage.getItem('upStart_dbxSync') == 'true') {    
    let dbxServerModified = new Date(localStorage.getItem('upStart_dbxServerModified'))
    console.log("LOCALLastModification", dbxServerModified)
    let ACCESS_TOKEN = localStorage.getItem("upStart_dbxToken")  
    let dbx = new Dropbox.Dropbox({ fetch:fetch, accessToken: ACCESS_TOKEN })

    try {    
      await dbx.filesDownload({path: '/upStartDBX.txt'})
      .then(async function (response) {	
        localStorage.setItem("upStart_dbxLastSyncCheck", Date.now().toString())
        let remoteServerModified = new Date(response.server_modified)  

        console.log("remoteServerModified", remoteServerModified)

        if (remoteServerModified > dbxServerModified) { 				
          if (await downloadDataFromDropbox(response)) {
            //ignore local changes to prevent conflicts
            localStorage.setItem('upStart_newChanges', false)
          }	
        } else {
          console.log("Dropbox already synchronized")        
        }
      })

    }
    catch(error) {    
    }
  }

  //context menu at browser start
  chrome.contextMenus.removeAll(function () {
    if (localStorage.getItem('upStart_firstTime') !== null) { //firstTime
      if (localStorage.getItem('upStartSettings_showContextMenu') == 'true') { createContextMenu() }    
    }
  })

})


chrome.storage.onChanged.addListener(async function(changes, namespace) {
  let syncData = false
  
  if (localStorage.getItem('upStart_firstTime') !== null) { //firstTime
    console.log("changes", changes)
    localStorage.setItem('upStart_validLastMsg', 'true')
    
    for (key in changes) {
      //upStartDOM
      if (key == 'upStartDOM') {

      //upStartData
      } else if (key == 'upStartData') {                
        syncData = true
        let jsonData = JSON.parse(changes.upStartData.newValue)
        let bodyContent = await drawDOM(jsonData)
        await chrome.storage.local.set({"upStartDOM": bodyContent})
        if (localStorage.getItem('upStartSettings_showContextMenu') == 'true') {
          await chrome.contextMenus.removeAll()
          await createContextMenu()
        }          

      //upStartSettings
      } else if (key == 'upStartCustomImages') {
        syncData = true
      } else if (key == 'upStartSettings') {
        syncData = true
        let jsonSettings = JSON.parse(changes.upStartSettings.newValue)
        let oldJsonSettings = JSON.parse(changes.upStartSettings.oldValue)          
        setStorageVariables(jsonSettings)
        
        let result = await chrome.storage.local.get("upStartData")
        let jsonData = JSON.parse(result.upStartData)
        let dataModified = false

        //language
  	    const settingsLanguage = chrome.runtime.getURL('locale/upStart_'+jsonSettings.language+'.json')
  	    await fetch(settingsLanguage)
		    .then((response) => response.json())			
		    .then(async(json) => {await chrome.storage.local.set({"upStartLanguage": JSON.stringify(json)})})    

        //groups sort changed
        if ((jsonSettings.groupsSort != oldJsonSettings.groupsSort) && (jsonSettings.groupsSort != 'manual')) {
          console.log("sort changed")
          dataModified = true
          let sort = jsonSettings.groupsSort

          for (g = 0; g < jsonData.groups.length; g++) {            
            group = jsonData.groups[g]
            if (group.groupSort == 'auto') {
              let newOrder = []
              switch(sort) {
                case 'az': case 'za':
                  let items = []      
                  //array of arrays with key(label) value(id)
                  for (i = 0; i < group.items.length; i++) {            
                    items[i] = [jsonData['items'].find(item => item.id == group.items[i]).label.toLowerCase(), group.items[i]]
                  }        
                  //sort array by key(label)
                  sort == 'az' ? items.sort() : items.sort().reverse()        
                  //get new id order
                  for (i = 0; i < items.length; i++) {            
                    newOrder.push(items[i][1])
                  }        
                  group.items = newOrder   
                  break        
                case 'newest': case 'oldest':                  
                  //sort array by key(label)
                  sort == 'newest' ? group.items.sort().reverse() : group.items.sort() 
                  break
              }
            }
          }
        }

        //columns changed
        if (jsonSettings.pageColumns != oldJsonSettings.pageColumns) {
          console.log("columns changed")
          dataModified = true

          //distribute group into columns
          for (p = 0; p<jsonData.pages.length; p++) {  
            if (jsonData.pages[p].pageColumns == 'auto') {
              jsonData.pages[p].columns = await distributeGroups(jsonData.pages[p])
              jsonData.pages[p].pageAutoColumns = jsonData.pages[p].columns.length
            }
          }
        }

        //context menus
        if (jsonSettings.showContextMenu != oldJsonSettings.showContextMenu) {
          await chrome.contextMenus.removeAll()
          if (jsonSettings.showContextMenu) { await createContextMenu() }
        }   
    
        //store
        if (dataModified) { await chrome.storage.local.set({"upStartData": JSON.stringify(jsonData)}) }
        else {
          let bodyContent = await drawDOM(jsonData)
          await chrome.storage.local.set({"upStartDOM": bodyContent})
         }
      }

      if (localStorage.getItem('upStart_dbxSync') == 'true') { localStorage.setItem('upStart_newChanges', 'true') }
      
    }


    if ((localStorage.getItem('upStart_dbxSync') == 'true') && (syncData == true)) {      
      
      localStorage.setItem('upStart_newChanges', 'true')      
      if (await uploadDataToDropbox()) {
        localStorage.setItem('upStart_newChanges', 'false')   
        syncData == false     
        console.log("Dropbox data synchronized")
      } else {
        console.log("Data could not be synchronized.") 
      }     
      
    }
  }
})



async function createContextMenu() {
  //context menus
  console.log('context start')
  let result = await chrome.storage.local.get("upStartData")
  let jsonData = JSON.parse(result.upStartData)  
  	try {
      chrome.contextMenus.removeAll(function () {
  
        chrome.contextMenus.create({
          "id": "upStartRootMenu",
          "title": "upStart",
          "contexts": ["page"]
        }) 
        
        //populate menu
        for (p = 0; p < jsonData['pages'].length; p++) {             
          let groupCount = 0
          for (let i=0; i<jsonData.pages[p].columns.length; i++) {  groupCount += jsonData.pages[p].columns[i].length }
          
          if (groupCount > 0) {
            let pageLabel = jsonData.pages[p].pageLabel    
            chrome.contextMenus.create({
              "id": 'page'+p,
              "title": pageLabel,
              "parentId": "upStartRootMenu",
            }) 
    
            //groups
            for (c=0; c<jsonData.pages[p].columns.length; c++) {
              let columnGroups = jsonData.pages[p].columns[c]
    
              for (g = 0; g < columnGroups.length; g++) {   
                group = jsonData['groups'].find(group => group.id == columnGroups[g])  
                chrome.contextMenus.create({
                  "id": columnGroups[g],
                  "title": group.groupLabel,
                  "parentId": 'page'+p
                })
              }
            }
          }
        }
        chrome.contextMenus.onClicked.addListener(addToGroup)
      })
    }
    catch (error) {
      console.log(error)
    }    
}

//register an 10 min alarm
chrome.alarms.create('', { periodInMinutes: 10 })


//background cron tasks
chrome.alarms.onAlarm.addListener(async function() {
  let now = Date.now().toString()
  console.log("now: ", now)

  //backup
  let autoBkpTime = localStorage.getItem('upStartSettings_autoBkpTime')
  console.log("autoBkpTime: ", autoBkpTime)


  if (autoBkpTime != 'disabled') {   
    let lastBkp = localStorage.getItem('upStart_lastAutoBackup')
    let timeDiff = (now-lastBkp)/3600000*60*60 //seconds    
    console.log("timeDiff: ", timeDiff)
    
    if (timeDiff > localStorage.getItem('upStartSettings_autoBkpTime')) {
      await createBackup('auto') 
    }
  }
  
  console.log("sync: ", localStorage.getItem('upStart_dbxSync'))

  //dropbox sync
  if (localStorage.getItem('upStart_dbxSync') == 'true') {  
    dropboxSync('bg')
  }

})



























