async function firstTime() {
  //test browser language
  let lang = 'en' //default language
  let browserLanguage = window.navigator.userLanguage || window.navigator.language

  if (browserLanguage.match(/^en.*/i)) {lang = 'en'}
  else if (browserLanguage.match(/^pt.*/i)) {lang = 'pt'}

  //initial language
  let initialLanguage
  const langFile = chrome.runtime.getURL('locale/upStart_'+lang+'.json')
  await fetch(langFile)
  .then((response) => response.json())			
  .then((json) => { initialLanguage = json })  
  
  let languageValues = ''
  for (let [key, value] of Object.entries(initialLanguage.settings.options_languages)) {languageValues += '<option value="'+key+'">'+value+'</option>'}
   
  let themeValues = ''
  for (let [key, value] of Object.entries(initialLanguage.settings.appearance_theme)) {themeValues += '<option value="'+key+'">'+value+'</option>'}

  //test for old version
  let oldData = await chrome.storage.local.get("jsonUS")  

  //no old version
  if (Object.keys(oldData).length <= 0) {
    try {
      Swal.fire({
        title: initialLanguage.start.welcome,
        html: '<span style="font-size:20px">'+initialLanguage.start.welcomeMsg+'</span>'+
        
        '<div class="swal2-grid" style="padding-top:50px;">'+          
        '<div class="swal-option">'+
          '<div class="swal-content-label"><span>'+initialLanguage.start.language+'</span></div>'+
          '<div><select class="swal2-select" id="swal-lang" style="display: flex;">'+languageValues+'</select></div>'+
        '</div>'+
        '<div class="swal-option">'+
          '<div class="swal-content-label"><span>'+initialLanguage.start.theme+'</span></div>'+
          '<div><select class="swal2-select" id="swal-theme" style="display: flex;">'+themeValues+'</select></div>'+
        '</div>',
        showClass: {
          popup: 'animated fadeIn faster',
          icon: 'animated heartBeat delay-1s'
        },
        hideClass : {
          popup: 'swal2-hide',
          backdrop: 'swal2-backdrop-hide',
          icon: 'swal2-icon-hide'
        },
        width: '600px',
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonColor: '#3085d6',        
        confirmButtonText: initialLanguage.data.dialog_Ok,
        onOpen: async function() {
          document.getElementById('swal-lang').value = lang
          document.getElementById('swal-theme').value = 'dark'
        }
      }).then(async (result) => {
        let chosenLang = document.getElementById('swal-lang').value
        console.log("######### DUMP #########: firstTime -> language", chosenLang)
        let chosenTheme = document.getElementById('swal-theme').value
        console.log("######### DUMP #########: firstTime -> theme", chosenTheme)

        if (lang != chosenLang) {
          //chosen language        
          const chosenLangFile = chrome.runtime.getURL('locale/upStart_'+chosenLang+'.json')
          await fetch(chosenLangFile)
          .then((response) => response.json())			
          .then((json) => { initialLanguage = json })  
        }


        Swal.fire({
          title: initialLanguage.start.msgTitle,
          html: '<span style="font-size:20px">'+initialLanguage.start.msgText+'</span>',
          showClass: {
            popup: 'animated fadeIn faster',
            icon: 'animated heartBeat delay-1s'
          },
          hideClass : {
            popup: 'swal2-hide',
            backdrop: 'swal2-backdrop-hide',
            icon: 'swal2-icon-hide'
          },
          width: '600px',
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonColor: '#3085d6',          
          confirmButtonText: initialLanguage.data.dialog_Ok,

        }).then(async (result) => {

          //language
  	      const settingsLanguage = chrome.runtime.getURL('locale/upStart_'+chosenLang+'.json')
  	      await fetch(settingsLanguage)
		      .then((response) => response.json())			
          .then(async(json) => {await chrome.storage.local.set({"upStartLanguage": JSON.stringify(json)})})  
          
          //backups 
          const jsonDefaultBackups = chrome.runtime.getURL('js/upStartBackups.json')
          await fetch(jsonDefaultBackups)
          .then((response) => response.json())
          .then(async(json) => {await chrome.storage.local.set({"upStartBackups": JSON.stringify(json)})})   

          //custom images   
          const jsonDefaultCustomImages = chrome.runtime.getURL('js/upStartCustomImages.json')
          await fetch(jsonDefaultCustomImages)
          .then((response) => response.json())
          .then(async(json) => {await chrome.storage.local.set({"upStartCustomImages": JSON.stringify(json)})})
    
          //settings   
          const jsonDefaultSettings = chrome.runtime.getURL('js/upStartSettings.json')
          await fetch(jsonDefaultSettings)
          .then((response) => response.json())
          .then(async(json) => {
            json.language = chosenLang
            json.theme = chosenTheme
            setStorageVariables(json)
            await chrome.storage.local.set({"upStartSettings": JSON.stringify(json)})
          })

          //data          
          const jsonDefaultData = chrome.runtime.getURL('js/upStartData_'+chosenLang+'.json')
          await fetch(jsonDefaultData)
          .then((response) => response.json())
          .then(async (json) => { 
            let bodyContent = await drawDOM(json)
            await chrome.storage.local.set({"upStartData": JSON.stringify(json)})
            await chrome.storage.local.set({"upStartDOM": bodyContent})        
            await createBackup('auto')
            localStorage.setItem('upStart_firstTime', false)
            location.reload()
          })
          

        })
      })      
    }
    catch (error) { console.log(error) }
  //import from old version  
  } else {
    let jsonOld = JSON.parse(oldData.jsonUS)
    console.log("######### DUMP #########: firstTime -> jsonOld", jsonOld)

    try {
      Swal.fire({
        title: 'Update Message',
        text: "We need to update your data to the new version",
        icon: 'warning',
        showClass: {
          popup: 'animated fadeIn faster',
          icon: 'animated heartBeat delay-1s'
        },
        hideClass : {
          popup: 'swal2-hide',
          backdrop: 'swal2-backdrop-hide',
          icon: 'swal2-icon-hide'
        },
        showCancelButton: false,
        allowOutsideClick: false,
        width: '500px',
        confirmButtonColor: '#3085d6',        
        confirmButtonText: 'OK. Let\'s go'
      })
      .then(async (result) => {
        Swal.fire({
          icon: 'info',
          title: 'Data and Settings Export',
          html: "First we are going to export you current data and settings. Please keep this file in a safe place",
          showCancelButton: false,
          allowOutsideClick: false,
          width: '500px',
          confirmButtonColor: '#3085d6',        
          confirmButtonText: 'Export'
        })
        .then(() => { 
          
          //create backup
					let now = new Date()
    			let formattedDate = (now.getMonth() + 1) + '-' + now.getDate() + '-' + now.getFullYear();
    			let blob = new Blob([JSON.stringify(jsonOld)], {type: "text/plain;charset=utf-8"});
          saveAs(blob, 'upStart-version1-backup-'+formattedDate+'.txt')          	
          
    			//import from old data
          Swal.fire({
            icon: 'info',
            title: 'All right! Now let\'s update',
            html: 'This version has a lot of new features, therefore <span style="color:red;">some of the older options may not be compatible and will be replaced</span>.The old icons <span style="color:red;">will also be replaced</span> by the default one unless you are using base64 data:image icons<BR>If you find any issues after the update, please uninstall this application, get the latest version and import the file we just created at the settings section<BR>If you chose <span style="color:red;">not to save it</span> you can just <span style="color:red;">reload this page now and try again</span>',
            showCancelButton: false,
            allowOutsideClick: false,
            width: '500px',
            confirmButtonColor: '#3085d6',        
            confirmButtonText: 'File is saved. Go ahead'
          })
          .then(async () => {
            //language
  	        const settingsLanguage = chrome.runtime.getURL('locale/upStart_en.json')
  	        await fetch(settingsLanguage)
		        .then((response) => response.json())			
            .then(async(json) => {await chrome.storage.local.set({"upStartLanguage": JSON.stringify(json)})})  
            
            //backups 
            const jsonDefaultBackups = chrome.runtime.getURL('js/upStartBackups.json')
            await fetch(jsonDefaultBackups)
            .then((response) => response.json())
            .then(async(json) => {await chrome.storage.local.set({"upStartBackups": JSON.stringify(json)})})          

            await importFromOldVersion(jsonOld)

            //new settings
            let newSettings = await chrome.storage.local.get("upStartSettings")
            let jsonSettings = JSON.parse(newSettings.upStartSettings)
            setStorageVariables(jsonSettings)

            //new data
            let newData = await chrome.storage.local.get("upStartData")
            let jsonData = JSON.parse(newData.upStartData)
            
            let bodyContent = await drawDOM(jsonData)
            await chrome.storage.local.set({"upStartDOM": bodyContent})        
            await createBackup('auto')
            localStorage.setItem('upStart_firstTime', false)
            
            //remove old data
            await chrome.storage.local.remove("jsonUS")
            await chrome.storage.local.remove("jsonIMG")
            await chrome.storage.local.remove("currentPage") 
            
            await chrome.runtime.reload()
          })
				})
      })
    }
    catch (error) { console.log(error) }  
  }  
}

async function importFromOldVersion(jsonOld) {
  let defaultGroupSort = localStorage.getItem('upStartSettings_groupsSort')
  if (!defaultGroupSort) { defaultGroupSort = jsonOld.settings.defaultItensSort }
  
  let jsonImportedData   = JSON.parse('{ "pages": [], "groups": [], "items": [] }')
  
  //data
  let baseID = Number(Date.now().toString())
  for (let p=0;p<jsonOld.pages.length;p++) {
    console.log(jsonOld.pages[p].pageLabel)
    
    let newPageObj = new Object()
    newPageObj.pageLabel = jsonOld.pages[p].pageLabel
    newPageObj.pageDescription = jsonOld.pages[p].pageDescription
    newPageObj.pageIcon = "theme"

    console.log("old pagecolumns: ",jsonOld.pages[p].pageColumns)
    if (jsonOld.pages[p].pageColumns == '0') { newPageObj.pageColumns  = 'auto' }
    else { newPageObj.pageColumns  = jsonOld.pages[p].pageColumns }   
    
    newPageObj.pageAutoColumns = "1"
    
    if (jsonOld.pages[p].pageBackground.toLowerCase().match(/^(http:\/\/|https:\/\/|file:\/\/\/|data:image\/).*/) ) {
      newPageObj.pageBgImage = jsonOld.pages[p].pageBackground
    } else { newPageObj.pageBgImage = "theme" }
    
    if (!jsonOld.pages[p].pageColor) { newPageObj.pageBgColor = "theme" }
    else if (jsonOld.pages[p].pageColor != '') { newPageObj.pageBgColor = jsonOld.pages[p].pageColor }      
    else { newPageObj.pageBgColor = "theme" }
    
    newPageObj.columns = [[]]

    for (let g=0;g<jsonOld.pages[p].groups.length;g++) {
      console.log(jsonOld.pages[p].groups[g].groupLabel)
      
      let newGroupObj = new Object()
      newGroupObj.groupLabel = jsonOld.pages[p].groups[g].groupLabel
      newGroupObj.groupDescription = jsonOld.pages[p].groups[g].groupDescription            

      if (jsonOld.pages[p].groups[g].groupIcon.toLowerCase().match(/^(http:\/\/|https:\/\/|file:\/\/\/|data:image\/).*/) ) {
        newGroupObj.groupIcon = jsonOld.pages[p].groups[g].groupIcon
      } else { newGroupObj.groupIcon = 'icon/bookmark.svg' }

    
      if ((jsonOld.pages[p].groups[g].groupColor == '') || (jsonOld.pages[p].groups[g].groupColor == '000000')  || (jsonOld.pages[p].groups[g].groupColor == 'FFFFFF')) { newGroupObj.groupBgColor = "theme" }
      else { newGroupObj.groupBgColor = jsonOld.pages[p].groups[g].groupColor}



      newGroupObj.groupFgColor = "theme"

      if ((jsonOld.pages[p].groups[g].groupSort) && (jsonOld.pages[p].groups[g].groupSort != '')) {newGroupObj.groupSort = jsonOld.pages[p].groups[g].groupSort}
      else {newGroupObj.groupSort = "auto"}

      newGroupObj.groupView = "auto"
      newGroupObj.hideBookmarkLabels = "auto",
      newGroupObj.id = baseID.toString()
      newGroupObj.items = []
      baseID++

      newPageObj.columns[0].push(newGroupObj.id)

      
      for (let i=0;i<jsonOld.pages[p].groups[g].itens.length;i++) {
        console.log(jsonOld.pages[p].groups[g].itens[i].label)
        let newItemObj = new Object()
        newItemObj.label = jsonOld.pages[p].groups[g].itens[i].label
        newItemObj.description = jsonOld.pages[p].groups[g].itens[i].alt
        newItemObj.url = jsonOld.pages[p].groups[g].itens[i].url

        if (jsonOld.pages[p].groups[g].itens[i].icon.toLowerCase().match(/^(http:\/\/|https:\/\/|file:\/\/\/|data:image\/).*/) ) {
          newItemObj.icon = jsonOld.pages[p].groups[g].itens[i].icon        
        } else { newItemObj.icon = 'icon/default.svg' }

        newItemObj.id = baseID.toString() 
        baseID++

        jsonImportedData.items.push(newItemObj)
        newGroupObj.items.push(newItemObj.id)        
      }

      //sort
      if ((newGroupObj.groupSort != 'manual') && (newGroupObj.groupSort != 'auto')){
        newGroupObj.items = sortGroup(newGroupObj.items, newGroupObj.groupSort, jsonImportedData)
      } else if ((newGroupObj.groupSort == 'auto') && (defaultGroupSort != 'manual')) {
        newGroupObj.items = sortGroup(newGroupObj.items, defaultGroupSort, jsonImportedData)
      }

      jsonImportedData.groups.push(newGroupObj)
    }

    console.log("ne columns: ",newPageObj.pageColumns)

    //distribute group into columns
    if (newPageObj.pageColumns == "auto") {
      newPageObj.columns = await distributeGroups(newPageObj)
      newPageObj.pageAutoColumns = newPageObj.columns.length
    } else {
        newPageObj.columns = await distributeGroups(newPageObj,newPageObj.pageColumns)
    }
  
    jsonImportedData.pages.push(newPageObj)  
  }
  
  //settings
  let jsonImportedSettings  = JSON.parse('{}')
  jsonImportedSettings.app = "upStart"
  jsonImportedSettings.version = "2.0"	
  jsonImportedSettings.language = "en"
  jsonImportedSettings.groupsSort = jsonOld.settings.defaultItensSort
  jsonImportedSettings.groupView = "icon"
  if ((jsonOld.settings.itemLabelFontColor != '') && (jsonOld.settings.itemLabelFontColor != '000000')) { jsonImportedSettings.groupFgColor = sonOld.settings.itemLabelFontColor }
  else { jsonImportedSettings.groupFgColor  = 'theme' } 
  
  if ((jsonOld.settings.defaultGroupColor != '') && (jsonOld.settings.defaultGroupColor != 'FFFFFF')) { jsonImportedSettings.groupBgColor = jsonOld.settings.defaultGroupColor }
  else { jsonImportedSettings.groupBgColor  = 'theme' } 
  
  if (jsonOld.settings.defaultPageColumns == '0') { jsonImportedSettings.pageColumns = 'auto' }
  else { jsonImportedSettings.pageColumns  = jsonOld.settings.defaultPageColumns } 
  
  jsonImportedSettings.rememberLastPage = jsonOld.settings.remeberLastPage
  jsonImportedSettings.openLinksNewTab = jsonOld.settings.openLinksNewTab
  jsonImportedSettings.showContextMenu = jsonOld.settings.showBrowserContextMenu
  jsonImportedSettings.iconsBase64 = jsonOld.settings.iconsBase64
  jsonImportedSettings.dragLock = "false"
  jsonImportedSettings.itemIconSize = "64"
  jsonImportedSettings.itemLabelFontSize = "14"
  jsonImportedSettings.itemLabelShowLines = "1"
  jsonImportedSettings.itemLabelFontStyle = "normal"
  jsonImportedSettings.itemLabelAlign = "center"
  jsonImportedSettings.hideItemLabels = jsonOld.settings.noItemLabels
  
  if (jsonOld.settings.darkMode == 'true') { jsonImportedSettings.theme  = 'dark' }
  else { jsonImportedSettings.theme = 'light' }  
  
  jsonImportedSettings.pageIcon = "theme"
      
  if (jsonOld.settings.defaultPageBackground.toLowerCase().match(/^(http:\/\/|https:\/\/|file:\/\/\/|data:image\/).*/) ) {
    jsonImportedSettings.pageBgImage = jsonOld.settings.defaultPageBackground
  } else { jsonImportedSettings.pageBgImage = "theme" }
  
  if ((jsonOld.settings.defaultBackgroundColor == 'F6F6F9') || (jsonOld.settings.defaultBackgroundColor == '2D2D5F')) { jsonImportedSettings.pageBgColor  = 'theme' }
  else { jsonImportedSettings.pageBgColor = jsonOld.settings.defaultBackgroundColor }  
  
  if (jsonOld.settings.colorsTopnavBackgroundColor == '2D2D5F') { jsonImportedSettings.topNavBgColor = 'theme' }
  else { jsonImportedSettings.topNavBgColor = jsonOld.settings.colorsTopnavBackgroundColor }  
  
  if (jsonOld.settings.colorsTopnavColor == 'FFFFFF') { jsonImportedSettings.topNavFgColor = 'theme' }
  else { jsonImportedSettings.topNavFgColor = jsonOld.settings.colorsTopnavColor } 
  
  jsonImportedSettings.autoBkpTime = "604800"
  jsonImportedSettings.autoBkpMax = "5"
  jsonImportedSettings.manualBkpMax = "5"
    
  //custom images
  const jsonDefaultCustomImages = chrome.runtime.getURL('js/upStartCustomImages.json')
  await fetch(jsonDefaultCustomImages)
  .then((response) => response.json())
  .then((json) => { chrome.storage.local.set({"upStartCustomImages": JSON.stringify(json)}) })

  await chrome.storage.local.set({"upStartSettings": JSON.stringify(jsonImportedSettings)})

  await chrome.storage.local.set({"upStartData": JSON.stringify(jsonImportedData)})
}


function setStorageVariables(json) {  
  for (let [key, value] of Object.entries(json)) {
    localStorage.setItem('upStartSettings_'+key, value)
  }
  //not in json
  localStorage.setItem('upStart_lastPage', '0')
  localStorage.setItem("upStart_dbxUploading", 'false')
  localStorage.setItem('upStart_loading', 'false')
  if (!localStorage.getItem('upStart_dbxSync')) {
    localStorage.setItem('upStart_dbxSync', 'false')
  }
}

async function loadFromData(jsonFileData,jsonFileSettings,jsonFileCustomImages) {   
  //reset page
  const upStartChannel_reset = new BroadcastChannel('upStartChannel_reset')
  upStartChannel_reset.postMessage(0)

  await chrome.storage.local.set({"upStartCustomImages": jsonFileCustomImages})
  await chrome.storage.local.set({"upStartSettings": jsonFileSettings})
  await chrome.storage.local.set({"upStartData": jsonFileData})
}

async function loadDefault() {
  localStorage.setItem('upStart_lastPage', '0')
  localStorage.setItem("upStart_loading", 'true')
  let lang = localStorage.getItem('upStartSettings_language')
  const upStartChannel_reset = new BroadcastChannel('upStartChannel_reset')
  upStartChannel_reset.postMessage(0)  
  
  const jsonDefaultCustomImages = chrome.runtime.getURL('js/upStartCustomImages.json')
  await fetch(jsonDefaultCustomImages)
  .then((response) => response.json())
  .then((json) => { chrome.storage.local.set({"upStartCustomImages": JSON.stringify(json)}) })
  
  const jsonDefaultSettings = chrome.runtime.getURL('js/upStartSettings.json')
  await fetch(jsonDefaultSettings)
  .then((response) => response.json())
  .then((json) => {
    json.language = lang
    chrome.storage.local.set({"upStartSettings": JSON.stringify(json)})
  })  

  const jsonDefaultData = chrome.runtime.getURL('js/upStartData_'+lang+'.json')
  await fetch(jsonDefaultData)
  .then((response) => response.json())
  .then(async (json) => {
    localStorage.setItem("upStart_loading", 'false')
    chrome.storage.local.set({"upStartData": JSON.stringify(json)})
  })  
}



async function createBackup(type, json, oldValue) {
  console.log("making a "+type+" backup")
  try {
    let resultData = await chrome.storage.local.get("upStartData")
    let resultSettings = await chrome.storage.local.get("upStartSettings")
    let resultCustomImages = await chrome.storage.local.get("upStartCustomImages")
    
    let bkp = LZString.compress('{"data":'+resultData.upStartData+',"settings":'+resultSettings.upStartSettings+',"customImages":'+resultCustomImages.upStartCustomImages+'}')
    console.log("######### DUMP #########: makeBackup -> bkp", bkp)
    
    let result = await chrome.storage.local.get("upStartBackups")      
    jsonBackups = JSON.parse(result.upStartBackups)

    var newBkp = new Object()
    newBkp.timestamp = Date.now().toString()
    newBkp.backupData = bkp

    if (type == 'auto') {localStorage.setItem('upStart_lastAutoBackup', newBkp.timestamp)}

    if (jsonBackups[type].length < localStorage.getItem('upStartSettings_'+type+'BkpMax')) {
      await jsonBackups[type].push(newBkp)
    } else {
      let bkps = []      
      for (i=0;i<jsonBackups[type].length;i++) { bkps.push(Number(jsonBackups[type][i].timestamp)) }
      await jsonBackups[type].splice(jsonBackups[type].findIndex(bkpItem => bkpItem.timestamp == Math.min(...bkps)),1)
      await jsonBackups[type].push(newBkp)
    }
    await chrome.storage.local.set({"upStartBackups": JSON.stringify(jsonBackups)})

    
  }
  catch (error) {
    console.log(error)
  }
}
    

function toggleDark() {
  if (document.body.getAttribute('data-theme').includes('dark')) {
    document.body.setAttribute('data-theme', 'light')    
    //sweetalert
    document.getElementById("sweetalert2-theme").href = 'css/sweetalert2/light.min.css'
    //iziToast    
    iziTheme = 'light'
    iziBgColor = '#fff'
    //slider
    document.getElementById('switch-icon').src = '../img/moon.svg'
  } else {    
    document.body.setAttribute('data-theme', 'dark')   
    //sweetalert
    document.getElementById("sweetalert2-theme").href = 'css/sweetalert2/dark.min.css'
    //iziToast    
    iziTheme = 'dark'
    iziBgColor = '#192935'
    //slider
    document.getElementById('switch-icon').src = '../img/sun.svg'
  }
}


function searchToggle() {
  if ((search.style.display == 'none') || (search.style.display == '')) { search.style.display = 'grid'; document.getElementById("search-input").select(); document.getElementById("search-input").focus() }
  else { search.style.display = 'none' }  
}

async function showPage(pageID) {
  //hide pages    
  let pages = document.querySelectorAll('.page')
  for (i=0;i<pages.length;i++) { pages[i].style.display = 'none' }

  document.getElementById("page"+pageID).style.display = "grid"

  //set active top-nav
  let navPages = document.querySelectorAll('.top-nav-page')
  for (i=0;i<navPages.length;i++) { navPages[i].classList.remove("top-nav-page-active")	}
  document.getElementById("top-nav-page"+pageID).classList.add("top-nav-page-active")

  //keep the current page session
  sessionStorage.setItem('upStart_curPage', pageID)

  //keep last visited page on disk  
  localStorage.setItem('upStart_lastPage',pageID) 
}


async function drawDOM(jsonData){    
  let result = await chrome.storage.local.get("upStartLanguage")
  let jsonLanguage = JSON.parse(result.upStartLanguage)

  console.log(jsonData)
  console.log("drawDOM")

  //bodyContent
  let bodyContent = document.createElement('DIV')  
  bodyContent.id = "body-content"
  bodyContent.className = "body-content"

  //topNav
  let topNav = document.createElement('DIV')  
  topNav.id = "top-nav"
  topNav.className = "top-nav"

  //topNavList
  let topNavList = document.createElement('DIV')  
  topNavList.id = "top-nav-list"
  topNavList.className = "top-nav-list"  

  let topNavScrollLeft = document.createElement('DIV')
  topNavScrollLeft.id = "top-nav-scroll-left"
  topNavScrollLeft.className = "top-nav-scroll-button"
  topNavScrollLeft.innerHTML = "<i class='fas fa-caret-square-left fa-2x'></i>"


  let topNavScrollRight = document.createElement('DIV')
  topNavScrollRight.id = "top-nav-scroll-right"
  topNavScrollRight.className = "top-nav-scroll-button"
  topNavScrollRight.innerHTML = "<i class='fas fa-caret-square-right fa-2x'></i>"
  
  
  //topNavIcons
  let topNavIcons = document.createElement('DIV')  
  topNavIcons.id = "top-nav-icons"
  topNavIcons.className = "top-nav-icons"

  //plusIcon switch
  let switchIcon = document.createElement('IMG')  
  switchIcon.id = "switch-icon"
  switchIcon.className = "switch-icon unselectable undraggable undraggable"
  switchIcon.title = jsonLanguage.data.main_switchIconTitle
  switchIcon.src = "../img/sun.svg"

  //lock icon
  let lockIcon = document.createElement('DIV')  
  lockIcon.id = "lock-icon"
  lockIcon.className = "lock-icon"
  lockIcon.title = jsonLanguage.data.main_lockIconTitle
  lockIcon.innerHTML = "<i class='fas fa-lock-open fa-2x'></i>"

  //plusIcon search
  let searchIcon = document.createElement('DIV')  
  searchIcon.id = "search-icon"
  searchIcon.className = "search-icon"
  searchIcon.title = jsonLanguage.data.main_searchIconTitle
  searchIcon.innerHTML = "<i class='fas fa-search fa-2x'></i>"

  //plusIcon create
  let createIcon = document.createElement('DIV')  
  createIcon.id = "create-icon"
  createIcon.className = "plus-icon"
  createIcon.title = jsonLanguage.data.main_plusIconTitle
  createIcon.innerHTML = "<i class='fas fa-plus-circle fa-2x'></i>"
  
  //plusIcon settings
  let optionsIcon = document.createElement('DIV')  
  optionsIcon.id = "settings-icon"
  optionsIcon.className = "plus-icon"
  optionsIcon.title = jsonLanguage.data.main_settingsIconTitle
  optionsIcon.innerHTML = "<i class='fas fa-cog fa-2x'></i>"

  //Search
  let search = document.createElement('DIV')  
  search.id = "search"
  search.className = "search"

  //Search Wrapper
  let searchWrapper = document.createElement('DIV')  
  searchWrapper.id = "search-wrapper"
  searchWrapper.className = "search-wrapper"  
  searchWrapper.innerHTML = '<span class="search-title">'+jsonLanguage.data.main_search+'</span>'

  //Search Input
  let searchInput = document.createElement('INPUT')  
  searchInput.id = "search-input"
  searchInput.className = "search-input"  
  searchInput.type = "search"
  searchInput.setAttribute("autocomplete", "off")

  //Search Results
  let searchResults = document.createElement('DIV')  
  searchResults.id = "search-results"
  searchResults.className = "search-results"  

  
  //top nav assemble
  topNav.append(topNavScrollLeft)
  topNav.append(topNavList)
  topNav.append(topNavScrollRight)
  topNav.append(topNavIcons)
  
  topNavIcons.append(switchIcon) 
  topNavIcons.append(searchIcon)    
  topNavIcons.append(createIcon)  
  topNavIcons.append(lockIcon)  
  topNavIcons.append(optionsIcon)
  

  //search assemble  
  searchWrapper.append(searchInput)
  searchWrapper.append(searchResults)  
  search.append(searchWrapper)

  bodyContent.append(topNav)
  bodyContent.append(search)

  //build top menus and pages 
  for (pageID = 0; pageID < jsonData['pages'].length; pageID++) {

    // topNavPage
    let topNavPage = document.createElement('DIV')
    topNavPage.className = "top-nav-page"
    topNavPage.dataset.page = pageID
    topNavPage.id = 'top-nav-page'+pageID
    topNavPage.title = jsonData.pages[pageID].pageDescription
    topNavPage.innerHTML = jsonData.pages[pageID].pageLabel
    topNavPage.href = "#"

    //settings page icon
    if (localStorage.getItem("upStartSettings_pageIcon") != "theme") {
      topNavPage.style.backgroundImage = "url('"+localStorage.getItem("upStartSettings_pageIcon")+"')"
    }

    //set custom page icon
    if (jsonData.pages[pageID].pageIcon != "theme") {topNavPage.style.backgroundImage = "url('"+jsonData.pages[pageID].pageIcon+"')"}

    //no page icon
    if (jsonData.pages[pageID].pageIcon == "") {
      topNavPage.style.removeProperty("backgroundImage")
      topNavPage.style.padding = '5px 5px 5px 5px'
    }    


    //topNavPage assemble          
    topNavList.append(topNavPage)    

    //build elements
    //page
    let page = document.createElement('DIV')
    page.className = "page"
    page.id = "page"+pageID
    page.dataset.page = pageID
    page.dataset.label = jsonData.pages[pageID].pageLabel


    //settings page background
    let pageBgImage = localStorage.getItem("upStartSettings_pageBgImage")
    if (pageBgImage != "theme") {
      page.style.background = "url('"+pageBgImage+"') no-repeat center center fixed"
    }
    
    //set custom page background
    if (jsonData.pages[pageID].pageBgImage != "theme") {      
      if (jsonData.pages[pageID].pageBgImage.toLowerCase().match(/^(http:\/\/|https:\/\/|file:\/\/\/|data:image\/).*/)) {page.style.background = 'url("'+jsonData.pages[pageID].pageBgImage+'") no-repeat center center fixed'}
      else {page.style.background = "url('"+jsonData.pages[pageID].pageBgImage+"') no-repeat center center fixed"}
    }

    //no background
    if (pageBgImage == "") {page.style.background = ""}

    //set background to cover
    page.style.backgroundSize = 'cover'
    
    
    //page bg color
    if (jsonData.pages[pageID].pageBgColor) {
      if (jsonData.pages[pageID].pageBgColor != "theme") { page.style.backgroundColor = jsonData.pages[pageID].pageBgColor}
      else { 
        if (localStorage.getItem('upStartSettings_pageBgColor') != 'theme') {
          page.style.backgroundColor = localStorage.getItem('upStartSettings_pageBgColor') 
        }
      }
    }

    
    if (jsonData.pages[pageID].pageColumns == "auto") {columnsCount = jsonData.pages[pageID].pageAutoColumns}    
    else {columnsCount = jsonData.pages[pageID].pageColumns}


    //set page columns width
    let pageGridTemplateColumns = 'auto'

    for (let c=1; c<columnsCount; c++) { pageGridTemplateColumns += ' auto' }

    page.style.gridTemplateColumns = pageGridTemplateColumns
    page.dataset.columns = columnsCount
    page.style.minWidth = (Number(columnsCount)*124) +'px'

    //column loop    
    for (columnID=0; columnID<columnsCount; columnID++) {
      //column  
      let column = document.createElement('DIV')
      column.className = "column"
      column.id = "column"+pageID+columnID
      column.dataset.page = pageID
      column.dataset.column = columnID
      page.append(column)
      
      let columnGroups = jsonData.pages[pageID].columns[columnID]  

      for (g = 0; g < columnGroups.length; g++) {
        groupID = columnGroups[g]
        group = jsonData['groups'].find(group => group.id == groupID)   
        
        
        if (group) { //resilience

          //group
          let groupElement = document.createElement('DIV')
          groupElement.className = "group"
          groupElement.id = "group"+group.id
          groupElement.dataset.group = group.id
          if (group.groupLabel) { groupElement.dataset.label = group.groupLabel}
          if (group.hideBookmarkLabels) { groupElement.dataset.hide = group.hideBookmarkLabels }
          else { groupElement.dataset.hide = "auto" }

          //group fg color
          if (group.groupFgColor) {
            if (group.groupFgColor != "theme") { groupElement.style.color = group.groupFgColor}
            else { 
              if (localStorage.getItem('upStartSettings_groupFgColor') != 'theme') {
                groupElement.style.color = localStorage.getItem('upStartSettings_groupFgColor') 
              }
            }
          }

          //group bg color
          if (group.groupBgColor) {
            if (group.groupBgColor != "theme") { groupElement.style.backgroundColor = group.groupBgColor}
            else { 
              if (localStorage.getItem('upStartSettings_groupBgColor') != 'theme') {
                groupElement.style.backgroundColor = localStorage.getItem('upStartSettings_groupBgColor') 
              }
            }
          }
          

          //group header
          let groupHeader = document.createElement('DIV')
          groupHeader.className = "group-header handle"
          groupHeader.id = "group-header"+group.id

          //group icon
          let groupIcon = document.createElement('DIV')
          groupIcon.className = "group-icon handle"
          groupIcon.id = "group-icon"+group.id

          if (group.groupIcon) {
            if (group.groupIcon != '' ) { groupIcon.style.backgroundImage = "url("+group.groupIcon+")"}
          }

          //group label
          let groupLabel = document.createElement('DIV')
          groupLabel.className = "group-label handle"
          groupLabel.id = "group-label"+group.id

          if (group.groupLabel) {
            groupLabel.innerHTML = group.groupLabel
          }

          if (group.groupFgColor) {
            if ( group.groupFgColor != "theme" ) {
              groupLabel.style.color = group.groupFgColor
            }
          }

          //group open button
          let groupOpenButton = document.createElement('DIV')
          groupOpenButton.className = "group-open-button"
          groupOpenButton.title = jsonLanguage.data.main_groupOpenButtonTitle
          groupOpenButton.id = "group-open-button-"+group.id
          groupOpenButton.innerHTML = "<i class='fas fa-external-link-square-alt fa-1x'></i>"

          //group add button
          let groupAddButton = document.createElement('DIV')
          groupAddButton.className = "group-add-button"
          groupAddButton.title = jsonLanguage.data.main_groupAddButtonTitle
          groupAddButton.id = "group-add-button-"+group.id
          groupAddButton.innerHTML = "<i class='fas fa-plus fa-1x'></i>"

          //group dots button
          let groupDotsButton = document.createElement('DIV')
          groupDotsButton.className = "group-dots-button"
          groupDotsButton.title = jsonLanguage.data.main_groupDotsButtonTitle
          groupDotsButton.id = "group-dots-button-"+group.id
          groupDotsButton.innerHTML = "<i class='fas fa-ellipsis-v fa-1x'></i>"

          //group description
          let groupDescription = document.createElement('DIV')
          groupDescription.className = "group-description"
          groupDescription.id = "group-description"+group.id

          if (group.groupDescription) {
            if (group.groupDescription == "") {
              groupDescription.style.display = 'none'
            } else {
              groupDescription.innerHTML = group.groupDescription
              groupDescription.style.display = 'block'
            }
            if ( group.groupFgColor != "theme" ) {
              groupDescription.style.color = group.groupFgColor
            } 
          } else {
            groupDescription.style.display = 'none'
          }
           
          //group content
          var groupContent = document.createElement('DIV')
          groupContent.className = "group-content"

          if (group.groupView) {
            if (((group.groupView == 'auto') && (localStorage.getItem('upStartSettings_groupView') == 'list')) || (group.groupView == 'list')) {groupContent.classList.add("group-content-list") }        
          }
          
          groupContent.id = "group-content"+group.id        
          groupContent.dataset.page = pageID
          groupContent.dataset.group = groupID

          if (group.groupSort) {
            if (((group.groupSort != 'manual') && (group.groupSort != 'auto')) || ((group.groupSort == 'auto') && (localStorage.getItem('upStartSettings_groupsSort') != 'manual'))) { groupContent.className.add = "non-sortable"}
          }


          //group assemble  
          groupHeader.append(groupIcon)
          groupHeader.append(groupLabel)
          groupHeader.append(groupOpenButton)
          groupHeader.append(groupAddButton)
          groupHeader.append(groupDotsButton)

          groupElement.append(groupHeader)
          groupElement.append(groupDescription)
          groupElement.append(groupContent)

          //items bookmarks  
          for (i = 0; i < group.items.length; i++) {
            let itemID = group.items[i]
            let item = jsonData['items'].find(item => item.id == itemID)    

            if (item) {
              //bookmark
              let bookmark = document.createElement('DIV')
              bookmark.className = "bookmark"

              if (group.groupView) {
                if (((group.groupView == 'auto') && (localStorage.getItem('upStartSettings_groupView') == 'list')) || (group.groupView == 'list')) {bookmark.classList.add("bookmark-list") }
              }

              bookmark.id = "bookmark"+item.id
              bookmark.dataset.group = group.id
              bookmark.dataset.item = item.id

              let description = ''
              let label = ''
              let url = ''

              if (item.description) { description = item.description }
              if (item.label) { label = item.label }
              if (item.url) { url = item.url }

              if (description == '') {bookmark.title = label+"\n"+url}
              else {bookmark.title = label+"\n"+description+"\n"+url}


              // bookmark content
              let bookmarkContent = document.createElement('DIV')
              bookmarkContent.className = "bookmark-content"
              bookmarkContent.id = "bookmark-content"+item.id

              if (group.groupView) {
                if (((group.groupView == 'auto') && (localStorage.getItem('upStartSettings_groupView') == 'list')) || (group.groupView == 'list')) {bookmarkContent.classList.add("bookmark-content-list") }
              }

              //bookmark link
              let bookmarkLink = document.createElement('A')
              bookmarkLink.className = "bookmark-link"

              if (group.groupView) {
                if (((group.groupView == 'auto') && (localStorage.getItem('upStartSettings_groupView') == 'list')) || (group.groupView == 'list')) {bookmarkLink.classList.add("bookmark-link-list") }
              }

              bookmarkLink.id = "bookmark-link"+item.id

              if (item.url) {bookmarkLink.href = item.url}

              //bookmark icon
              let bookmarkIcon = document.createElement('IMG')
              bookmarkIcon.className = "bookmark-icon"

              if (group.groupView) {
                if (((group.groupView == 'auto') && (localStorage.getItem('upStartSettings_groupView') == 'list')) || (group.groupView == 'list')) {bookmarkIcon.classList.add("bookmark-icon-list") }
              }

              bookmarkIcon.id = "bookmark-icon"+item.id

              if (!item.icon) { bookmarkIcon.src = 'icon/default.svg' }
              else {
                if (item.icon.toLowerCase().match(/^(http:\/\/|https:\/\/|file:\/\/\/|data:image\/).*/) ) {
                  bookmarkIcon.src = item.icon   
                } else if (item.icon == "") {
                  bookmarkIcon.src = 'icon/default.svg'
                } else {
                  bookmarkIcon.src = item.icon
                }
              }


              //bookmark label
              var bookmarkLabel = document.createElement('DIV')
              bookmarkLabel.className = "bookmark-label"   

              if (group.groupView) {
                if (((group.groupView == 'auto') && (localStorage.getItem('upStartSettings_groupView') == 'list')) || (group.groupView == 'list')) {bookmarkLabel.classList.add("bookmark-label-list") }
              }

              bookmarkLabel.id = "bookmark-label"+item.id

              if (item.label) {
                bookmarkLabel.innerHTML = item.label
              }

              if (group.groupFgColor) {
                if (group.groupFgColor != "theme") { bookmarkLabel.style.color = group.groupFgColor} else { bookmarkLabel.style.color = localStorage.getItem    ('upStartSettings_groupFgColor') }
              }


              //item assemble          
              bookmarkLink.append(bookmarkIcon)
              bookmarkLink.append(bookmarkLabel)  
              bookmarkContent.append(bookmarkLink)  
              bookmark.append(bookmarkContent)  
              groupContent.append(bookmark)  
            }
          }        
          column.append(groupElement) 
        }       
      }           

    }
    bodyContent.append(page) 
  }
  return (bodyContent.outerHTML)
}



function destroyContextMenus() {
  let listGroups = document.querySelectorAll('.list-group')
  for (i=0;i<listGroups.length;i++) { listGroups[i].remove()	}
}

function showMenu(type, elementA, elementB, elementC) {  
  destroyContextMenus() // destroy old menus

  // create a new menu
  let contextMenu = document.createElement('DIV')  
  document.body.append(contextMenu)

   // define type and build
  switch(type) {
    case 'page':
    contextMenu.className = "list-group list-group-page unselectable undraggable undraggable"
    contextMenu.id = "contextPageMenu"
    contextMenu.innerHTML =      	
      //'<div class="list-group-header unselectable undraggable undraggable">'+jsonLanguage.data.menu_pageHeader+'</div>'+
      '<a class="list-group-item unselectable undraggable undraggable" href="#" id="contextPageEdit"><i class="context-menu-icon fas fa-pencil-alt"></i>'+jsonLanguage.data.menu_Edit+'</a>' +
      '<a class="list-group-item unselectable undraggable" href="#" id="contextPageCopy"><i class="context-menu-icon fas fa-clone"></i>'+jsonLanguage.data.menu_Copy+'</a>'+
      '<a class="list-group-item list-group-item-danger unselectable undraggable" href="#" id="contextPageDelete"><i class="context-menu-icon fas fa-trash"></i>'+jsonLanguage.data.menu_Delete+'</a>'+
      '<div class="list-group-divider"></div>'+
      '<a class="list-group-item unselectable undraggable" href="#" id="contextPageAddPage"><i class="context-menu-icon fas fa-plus"></i>'+jsonLanguage.data.menu_AddPage+'</a>'+
      '<a class="list-group-item unselectable undraggable" href="#" id="contextPageAddGroup"><i class="context-menu-icon fas fa-plus"></i>'+jsonLanguage.data.menu_AddGroup+'</a>'      
    document.getElementById("contextPageEdit").addEventListener('click', () => {destroyContextMenus(); pageEdit(elementA)})
    document.getElementById("contextPageCopy").addEventListener('click', () => {destroyContextMenus(); pageCopy(elementA)})
    document.getElementById("contextPageAddPage").addEventListener('click', () => {destroyContextMenus(); pageAdd()})
    document.getElementById("contextPageAddGroup").addEventListener('click', () => {destroyContextMenus(); groupAdd(elementA)})
    document.getElementById("contextPageDelete").addEventListener('click', () => {destroyContextMenus(); pageDelete(elementA)})
    break
    case 'topNavPage':
    contextMenu.className = "list-group list-group-page unselectable undraggable"
    contextMenu.id = "contextTopLinkMenu"
    contextMenu.innerHTML = 
        //'<div class="list-group-header">'+jsonLanguage.data.menu_pageHeader+'</div>' +
        '<a class="list-group-item unselectable undraggable" href="#" id="contextTopNavEdit"><i class="context-menu-icon fas fa-pencil-alt"></i>'+jsonLanguage.data.menu_Edit+'</a>'+
        '<a class="list-group-item unselectable undraggable" href="#" id="contextTopNavCopy"><i class="context-menu-icon fas fa-clone"></i>'+jsonLanguage.data.menu_Copy+'</a>'+
        '<a class="list-group-item list-group-item-danger unselectable undraggable" href="#" id="contextTopNavDelete"><i class="context-menu-icon fas fa-trash"></i>'+jsonLanguage.data.menu_Delete+'</a>'+        
        '<div class="list-group-divider"></div>'+
        '<a class="list-group-item unselectable undraggable" href="#" id="contextTopNavAddPage"><i class="context-menu-icon fas fa-plus"></i>'+jsonLanguage.data.menu_AddPage+'</a>'+
        '<a class="list-group-item unselectable undraggable" href="#" id="contextTopNavAddGroup"><i class="context-menu-icon fas fa-plus"></i>'+jsonLanguage.data.menu_AddGroup+'</a>'
    document.getElementById("contextTopNavEdit").addEventListener('click', () => {destroyContextMenus(); pageEdit(elementA)})
    document.getElementById("contextTopNavCopy").addEventListener('click', () => {destroyContextMenus(); pageCopy(elementA)})
    document.getElementById("contextTopNavAddPage").addEventListener('click', () => {destroyContextMenus(); pageAdd()})
    document.getElementById("contextTopNavAddGroup").addEventListener('click', () => {destroyContextMenus(); groupAdd(elementA)}) 
    document.getElementById("contextTopNavDelete").addEventListener('click', () => {destroyContextMenus(); pageDelete(elementA)})
    break
    case 'group':
    contextMenu.className = "list-group list-group-group unselectable undraggable"        
    contextMenu.id = "contextGroupMenu"
    contextMenu.innerHTML = 
      //'<div class="list-group-header unselectable undraggable">'+jsonLanguage.data.menu_groupHeader+'</div>' +
      '<a class="list-group-item unselectable undraggable" href="#" id="contextGroupEdit"><i class="context-menu-icon fas fa-pencil-alt"></i>'+jsonLanguage.data.menu_Edit+'</a>'+
      '<a class="list-group-item unselectable undraggable" href="#" id="contextGroupCopy"><i class="context-menu-icon fas fa-clone"></i>'+jsonLanguage.data.menu_Copy+'</a>'+
      '<a class="list-group-item unselectable undraggable" href="#" id="contextGroupMove"><i class="context-menu-icon fas fa-arrows-alt"></i>'+jsonLanguage.data.menu_Move+'</a>'+
      '<a class="list-group-item unselectable undraggable" href="#" id="contextGroupMerge"><i class="context-menu-icon fas fa-object-ungroup"></i>'+jsonLanguage.data.menu_Merge+'</a>'+
      '<a class="list-group-item unselectable undraggable" href="#" id="contextGroupSort"><i class="context-menu-icon fas fa-sort-alpha-down"></i>'+jsonLanguage.data.menu_Sort+'</a>'+
      '<a class="list-group-item unselectable undraggable" href="#" id="contextGroupOpenAll"><i class="context-menu-icon fas fa-external-link-square-alt"></i>'+jsonLanguage.data.menu_Open+'</a>'+
      '<a class="list-group-item list-group-item-danger unselectable undraggable" href="#" id="contextGroupDelete"><i class="context-menu-icon fas fa-trash"></i>'+jsonLanguage.data.menu_Delete+'</a>'+
      '<div class="list-group-divider unselectable undraggable"></div>'+
      '<a class="list-group-item unselectable undraggable" href="#" id="contextGroupAddItem"><i class="context-menu-icon fas fa-plus"></i>'+jsonLanguage.data.menu_AddItem+'</a>'
    document.getElementById("contextGroupEdit").addEventListener('click', () => {destroyContextMenus(); groupEdit(elementA)})
    document.getElementById("contextGroupCopy").addEventListener('click', () => {destroyContextMenus(); groupCopy(elementA)})
    document.getElementById("contextGroupMove").addEventListener('click', () => {destroyContextMenus(); groupMove(elementA,elementB,elementC)})
    document.getElementById("contextGroupMerge").addEventListener('click', () => {destroyContextMenus(); groupMerge(elementA,elementB,elementC)})
    document.getElementById("contextGroupSort").addEventListener('click', () => {destroyContextMenus(); groupSort(elementA)})
    document.getElementById("contextGroupOpenAll").addEventListener('click', () => {destroyContextMenus(); groupOpen(elementA)})       
    document.getElementById("contextGroupAddItem").addEventListener('click', () => {destroyContextMenus(); itemAdd(elementA)})
    document.getElementById("contextGroupDelete").addEventListener('click', () => {destroyContextMenus(); groupDelete(elementA, elementB, elementC)}) 
    break
    case 'item':
    contextMenu.className = "list-group list-group-bookmark unselectable undraggable"
    contextMenu.id = "contextItemMenu"
    contextMenu.innerHTML =
      //'<div class="list-group-header unselectable undraggable">'+jsonLanguage.data.menu_itemHeader+'</div>' +
      '<a class="list-group-item unselectable undraggable" href="#" id="contextItemNewTab"><i class="context-menu-icon fas fa-external-link-alt"></i>'+jsonLanguage.data.menu_OpenTab+'</a>'+
      '<a class="list-group-item unselectable undraggable" href="#" id="contextItemCopyUrl"><i class="context-menu-icon fas fa-clipboard"></i>'+jsonLanguage.data.menu_CopyAddress+'</a>'+
      '<a class="list-group-item unselectable undraggable" href="#" id="contextItemEdit"><i class="context-menu-icon fas fa-pencil-alt"></i>'+jsonLanguage.data.menu_Edit+'</a>'+
      '<a class="list-group-item unselectable undraggable" href="#" id="contextItemCopy"><i class="context-menu-icon fas fa-clone"></i>'+jsonLanguage.data.menu_Copy+'</a>'+
      '<a class="list-group-item unselectable undraggable" href="#" id="contextItemMove"><i class="context-menu-icon fas fa-arrows-alt"></i>'+jsonLanguage.data.menu_Move+'</a>'+
      '<a class="list-group-item unselectable undraggable" href="#" id="contextItemConvertIcon"><i class="context-menu-icon fas fa-exchange-alt"></i>'+jsonLanguage.data.menu_Convert+'</a>'+
      '<a class="list-group-item list-group-item-danger unselectable undraggable" href="#" id="contextItemDelete"><i class="context-menu-icon fas fa-trash"></i>'+jsonLanguage.data.menu_Delete+'</a>'
    document.getElementById("contextItemNewTab").addEventListener('click',() => {destroyContextMenus(); openItemNewTab(elementA)})
    document.getElementById("contextItemCopyUrl").addEventListener('click',() => {destroyContextMenus(); copyUrlToClipboard(elementA)})
    document.getElementById("contextItemEdit").addEventListener('click',() => {destroyContextMenus(); itemEdit(elementA, elementB)})
    document.getElementById("contextItemCopy").addEventListener('click',() => {destroyContextMenus(); itemCopy(elementA)})
    document.getElementById("contextItemMove").addEventListener('click',() => {destroyContextMenus(); itemMove(elementA, elementB)})
    document.getElementById("contextItemConvertIcon").addEventListener('click',() => {destroyContextMenus(); itemConvertIcon(elementA)})
    document.getElementById("contextItemDelete").addEventListener('click',() => {destroyContextMenus(); itemDelete(elementA, elementB)})
    break
    case 'plus':
      contextMenu.className = "list-group unselectable undraggable"
      contextMenu.id = "contextPlusMenu"
      contextMenu.innerHTML =
        '<a class="list-group-item unselectable undraggable" href="#" id="contextPlusAddPage"><i class="context-menu-icon fas fa-plus"></i>'+jsonLanguage.data.menu_AddPage+'</a>'+
        '<a class="list-group-item unselectable undraggable" href="#" id="contextPlusAddGroup"><i class="context-menu-icon fas fa-plus"></i>'+jsonLanguage.data.menu_AddGroup+'</a>'+
        '<a class="list-group-item unselectable undraggable" href="#" id="contextPlusAddItem"><i class="context-menu-icon fas fa-plus"></i>'+jsonLanguage.data.menu_AddItem+'</a>'
      document.getElementById("contextPlusAddPage").addEventListener('click',() => {destroyContextMenus(); pageAdd()})
      document.getElementById("contextPlusAddGroup").addEventListener('click',() => {destroyContextMenus(); groupAdd(elementA)})
      document.getElementById("contextPlusAddItem").addEventListener('click',() => {destroyContextMenus(); itemAddPlus(elementA)})
      break       
  }
  
  let posx, posy
  let diffX = 0
  let diffY = 0

  contextMenu.style.position = 'absolute'
  contextMenu.style.display = 'inline'

  if ( event.clientX+contextMenu.clientWidth > window.innerWidth) {  diffX = event.clientX+contextMenu.clientWidth-window.innerWidth+10 }
  if ( event.clientY+contextMenu.clientHeight > window.innerHeight) {  diffY = event.clientY+contextMenu.clientHeight-window.innerHeight+5 }

  if (type != 'plus') {
    posx = event.clientX + window.pageXOffset - diffX +'px' //Left Position of Mouse Pointer    
    posy = event.clientY + window.pageYOffset - diffY + 'px' //Top Position of Mouse Pointer
  } else {
    posx = event.clientX + window.pageXOffset - (event.clientX+180-window.innerWidth) + 'px'    
    posy = event.clientY + window.pageYOffset + (30-event.clientY) + 'px'
  }

  contextMenu.style.left = posx
  contextMenu.style.top = posy



}



//page drag move
async function pageDragSort(pageID, oldIndex, newIndex) {
  //load current settings  
  let result = await chrome.storage.local.get("upStartData")
  jsonData = JSON.parse(result.upStartData)

  let pageClone = JSON.parse(JSON.stringify(jsonData.pages[oldIndex]))

  jsonData.pages.splice(oldIndex,1)
  jsonData.pages.splice(newIndex,0, pageClone)



  let sessionPage = sessionStorage.getItem('upStart_curPage')

  if (sessionPage == oldIndex) {
    sessionStorage.setItem('upStart_curPage', newIndex)
  } else if ((sessionPage > oldIndex) && (newIndex >= sessionPage)) {
    sessionStorage.setItem('upStart_curPage', Number(sessionPage)-1)
  } else if ((sessionPage < oldIndex) && (newIndex <= sessionPage)) {
    sessionStorage.setItem('upStart_curPage', Number(sessionPage)+1)
  }
  

  let lastPage = localStorage.getItem('upStart_lastPage')

  if (lastPage == oldIndex) {
    localStorage.setItem('upStart_lastPage', newIndex)
  } else if ((lastPage > oldIndex) && (newIndex >= lastPage)) {
    localStorage.setItem('upStart_lastPage', Number(lastPage)-1)
  } else if ((lastPage < oldIndex) && (newIndex <= lastPage)) {
    localStorage.setItem('upStart_lastPage', Number(lastPage)+1)
  }

  await chrome.storage.local.set({"upStartData": JSON.stringify(jsonData)})

  
}









//group drag move
async function groupDragMove(sourceGroupID, sourcePage, sourceColumn, sourceChildren, targetPage, targetColumn, targetChildren) {

  //load current settings
  if (!jsonDataTmp) {
    let result = await chrome.storage.local.get("upStartData")
    jsonDataTmp = JSON.parse(result.upStartData)
  }
  
  let sourceColumnGroups = []
  let targetColumnGroups = []

  for (i=0;i<sourceChildren.length;i++) {    
    sourceColumnGroups.push(sourceChildren[i].dataset.group)
  }

  for (i=0;i<targetChildren.length;i++) {    
    targetColumnGroups.push(targetChildren[i].dataset.group)
  }
  
  jsonDataTmp.pages[sourcePage].columns[sourceColumn] = sourceColumnGroups
  jsonDataTmp.pages[targetPage].columns[targetColumn] = targetColumnGroups

  //add modified pages to columnChangedPages
  if (!columnChangedPages.includes(sourcePage)) {columnChangedPages.push(sourcePage)}
  if (!columnChangedPages.includes(targetPage)) {columnChangedPages.push(targetPage)}
 
  if (!saveMsg) {
    saveMsg = true
    saveLayoutMessage()
  }
}



//group drag move
async function groupDragSort(groupID, page, column, children) {
  //load current settings
  if (!jsonDataTmp) {
    let result = await chrome.storage.local.get("upStartData")
    jsonDataTmp = JSON.parse(result.upStartData)
  }
  
  let columnGroups = []

  for (i=0;i<children.length;i++) {    
    columnGroups.push(children[i].dataset.group)
  }

  jsonDataTmp.pages[page].columns[column] = columnGroups

  if (!saveMsg) {
    saveMsg = true
    saveLayoutMessage()
  }
}




//bookmark drag move
async function bookmarkDragMove(sourceItemElemID, sourceGroupID, targetGroupID, sourceChildren, targetChildren) {
  //load current settings
  if (!jsonDataTmp) {
    let result = await chrome.storage.local.get("upStartData")
    jsonDataTmp = JSON.parse(result.upStartData)
  }

  let sourceGroup = jsonDataTmp['groups'].find(group => group.id == sourceGroupID)
  let targetGroup = jsonDataTmp['groups'].find(group => group.id == targetGroupID)

  let sourceGroupItems = []
  let targetGroupItems = []    

  for (i=0;i<sourceChildren.length;i++) {    
    sourceGroupItems.push(sourceChildren[i].dataset.item)
  }

  for (i=0;i<targetChildren.length;i++) {
    targetGroupItems.push(targetChildren[i].dataset.item)
  }   

  sourceGroup.items = sourceGroupItems
  targetGroup.items = targetGroupItems
  
  //sort source
  if ((sourceGroup.groupSort != 'manual') && (sourceGroup.groupSort != 'auto')){
    sourceGroup.items = sortGroup(sourceGroupItems, sourceGroup.groupSort, jsonDataTmp)
  } else if ((sourceGroup.groupSort == 'auto') && (localStorage.getItem('upStartSettings_groupsSort') != 'manual')) {
    sourceGroup.items = sortGroup(sourceGroupItems, localStorage.getItem('upStartSettings_groupsSort'), jsonDataTmp)
  }

  //sort target
  if ((targetGroup.groupSort != 'manual') && (targetGroup.groupSort != 'auto')){
    targetGroup.items = sortGroup(targetGroupItems, targetGroup.groupSort, jsonDataTmp)
  } else if ((targetGroup.groupSort == 'auto') && (localStorage.getItem('upStartSettings_groupsSort') != 'manual')) {
    targetGroup.items = sortGroup(targetGroupItems, localStorage.getItem('upStartSettings_groupsSort'), jsonDataTmp)
  }

  if (!saveMsg) {
    saveMsg = true
    saveLayoutMessage()
  }
}


//bookmark drag sort
async function bookmarkDragSort(sourceItemElemID, groupID, children, oldIndex) {
  //load current settings
  if (!jsonDataTmp) {
    let result = await chrome.storage.local.get("upStartData")
    jsonDataTmp = JSON.parse(result.upStartData)
  }

  let group = jsonDataTmp['groups'].find(group => group.id == groupID)

  //sort
  if ((group.groupSort != 'manual') && (group.groupSort != 'auto')){    
    document.getElementById(sourceItemElemID).classList.add('bookmark-drag-error')
    infoMessage(jsonLanguage.data.message_groupSortSet)
    //group.items = sortGroup(groupItems, group.groupSort, jsonDataTmp)   
  } else if ((group.groupSort == 'auto') && (localStorage.getItem('upStartSettings_groupsSort') != 'manual')) {
    document.getElementById(sourceItemElemID).classList.add('bookmark-drag-error')
    infoMessage(jsonLanguage.data.message_groupSortSet)
    //group.items = sortGroup(groupItems, localStorage.getItem('upStartSettings_groupsSort'), jsonDataTmp)
  } else {

    let groupItems =  []
  
    for (i=0;i<children.length;i++) {   
      groupItems.push(children[i].dataset.item)
    }
    group.items = groupItems

    if (!saveMsg) {
      saveMsg = true
      saveLayoutMessage()
    }
  }
}




//// Auxiliary Functions //////

//return a boolean
function bool(v){ return v==="false" ? false : !!v; }
  

//draw Backups DOM
async function drawBackup(timestamp, parentElement) {
  let result = await chrome.storage.local.get("upStartLanguage")
  let jsonLanguage = JSON.parse(result.upStartLanguage)

  let locale = localStorage.getItem('upStartSettings_language')
  let localeJS = 'en-US'

  switch (locale) { //developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation
    case 'en':
      localeJS = 'en-US'
      break
      case 'pt':
      localeJS = 'pt-BR'
      break      
    default:
      localeJS = 'en-US'
      break
  }

  let date = new Date(Number(timestamp)) 
  let formattedDate = date.toLocaleString(localeJS, {dateStyle:'full', timeStyle:'medium'})
  //let formattedDate = date.getMonth() +'/'+ date.getDate() +'/'+ date.getFullYear() +' at '+ date.getHours() +':'+ date.getMinutes() +':'+ date.getSeconds() +' ('+date.getDay() +' '+ date.getDay() +' '+ date.getFullYear() +')'
  
	let bkpDate = document.createElement('DIV')    
  bkpDate.className = "backup-timestamp"
  bkpDate.id = 'backup-timestamp-'+timestamp
	bkpDate.innerHTML = formattedDate

	let bkpActions = document.createElement('DIV')    
	bkpActions.className = "backup-actions"
  bkpActions.id = 'backup-actions-'+timestamp
  bkpActions.dataset.index = i
  bkpActions.dataset.timestamp = timestamp
  bkpActions.dataset.date = formattedDate
	
	let btnActionsDelete = document.createElement('BUTTON')    
  btnActionsDelete.className = "btn-actions btn-actions-delete"
  btnActionsDelete.title = jsonLanguage.settings.restore_btnActionsDeleteTitle
  btnActionsDelete.innerHTML = '<i class="context-menu-icon fas fa-trash"></i>'  
  
	let btnActionsDownload = document.createElement('BUTTON')    
  btnActionsDownload.className = "btn-actions btn-actions-download"
  btnActionsDownload.title = jsonLanguage.settings.restore_btnActionsDownloadTitle
	btnActionsDownload.innerHTML = '<i class="context-menu-icon fas fa-download"></i>'   
  
	let btnActionsRestore = document.createElement('BUTTON')    
  btnActionsRestore.className = "btn-actions btn-actions-restore"
  btnActionsRestore.title = jsonLanguage.settings.restore_btnActionsRestoreTitle
	btnActionsRestore.innerHTML = '<i class="context-menu-icon fas fa-undo-alt"></i>'  
  
	let btnActionsPreview = document.createElement('BUTTON')    
  btnActionsPreview.className = "btn-actions btn-actions-preview"
  btnActionsPreview.title = jsonLanguage.settings.restore_btnActionsPreviewTitle
	btnActionsPreview.innerHTML = '<i class="context-menu-icon fas fa-eye"></i>'  
	
	//bkp assemble
  bkpActions.append(btnActionsDelete)
  bkpActions.append(btnActionsDownload)
	bkpActions.append(btnActionsRestore)
	bkpActions.append(btnActionsPreview)


	parentElement.append(bkpDate) 
	parentElement.append(bkpActions) 

}		



async function distributeGroups(page,columns) {
  
  let defaultPageColumns = localStorage.getItem('upStartSettings_pageColumns')
  let pageGroups = []
  let pageColumns = []
  let columnCount = 1
  let groupCount = 0

  for (c=0; c<page.columns.length; c++) {
      pageGroups = pageGroups.concat(page.columns[c])
      
      groupCount += page.columns[c].length
  }

  if ((!columns) || (columns == 'auto')) {    
    if ((!defaultPageColumns) || (defaultPageColumns == 'auto')) {
      switch (groupCount) {
        case 0: case 1:
          columnCount = 1
          break
        case 2:  case 3:  case 4:
          columnCount = 2
          break
        case 5:  case 6:
          columnCount = 3
          break
        case 7:  case 8:
          columnCount = 4
          break
        default:
          columnCount = 5
          break
      }
    } else {columnCount = defaultPageColumns}
  } else {
    columnCount = columns
  }
    
  
  //create columns
  
  for (c=0; c<columnCount; c++) {
    pageColumns.push(new Array())    
  }
  
  //distribute groups
  let columnIndex = 0
  
  for (g=0; g<pageGroups.length; g++) {        
    pageColumns[columnIndex].push(pageGroups[g])
    if (columnIndex == columnCount-1) {columnIndex = 0}
    else {columnIndex++}    
  }
  

  console.log("pageColumns")
  console.log(pageColumns)
  return pageColumns

}


async function addToGroup(info, tab) {
  let result = await chrome.storage.local.get("upStartLanguage")
  let jsonLanguage = JSON.parse(result.upStartLanguage)
  console.log("######### DUMP #########: addToGroup -> jsonLanguage", jsonLanguage)

  let groupID = info.menuItemId
  if (!groupID.toLowerCase().match(/^page.*/)) {

    let tabURL = tab.url
    let tabLabel = tab.title
    let tabIcon = tab.favIconUrl
       
    let newItemObj = new Object()
    newItemObj.label = tabLabel
    newItemObj.description = ''
    newItemObj.url = tabURL
    newItemObj.icon = 'icon/default.svg'
    if ((tabIcon) && (tabIcon != '')) { newItemObj.icon = tabIcon }
    newItemObj.id = Date.now().toString()
    
    if (localStorage.getItem('upStartSettings_iconsBase64') == 'true') {
      try {
        let base64ImageData = await getBase64Image(newItemObj.icon, 128, 128)
        newItemObj.icon = base64ImageData 
      }
      catch (error) {
        console.log(error)
      }
    }
  
    try {
        chrome.storage.local.get('upStartData', function(result) { 
          let jsonData  = JSON.parse(result.upStartData)
  
          //push item to json
          jsonData.items.push(newItemObj)				
  
          let group = jsonData['groups'].find(group => group.id == groupID)
          let groupLabel = group.groupLabel
  
          //add to group items
          let groupItems = group.items
          groupItems.push(newItemObj.id)
          group.items = groupItems
  
          //sort
          if ((group.groupSort != 'manual') && (group.groupSort != 'auto')){
            group.items = sortGroup(group.items, group.groupSort, jsonData)
          } else if ((group.groupSort == 'auto') && (localStorage.getItem('upStartSettings_groupsSort') != 'manual')) {
            group.items = sortGroup(group.items, localStorage.getItem('upStartSettings_groupsSort'), jsonData)
          }  

          //store
          chrome.storage.local.set({'upStartData': JSON.stringify(jsonData)}, function() { 
            let msg = jsonLanguage.data.sysMessage_itemCreatedMsg.replace('{itemLabel}', '"'+newItemObj.label+'"')
            chrome.notifications.create('', {
              title: jsonLanguage.data.sysMessage_itemCreatedTitle,
              message: msg.replace('{groupLabel}', '"'+groupLabel+'"'),
              iconUrl: 'img/icon64.png',
              type: 'basic'
            })
          })   
        })
      }
      catch (error) {		
        console.log(error)
      }
  }  
}



function sortGroup(groupItems, sort, jsonData) {
  let newOrder = []

  switch(sort) {
    case 'az': case 'za':
      let items = []      
      //array of arrays with key(label) value(id)
      for (i = 0; i < groupItems.length; i++) {            
        items[i] = [jsonData['items'].find(item => item.id == groupItems[i]).label.toLowerCase(), groupItems[i]]
      }        
      //sort array by key(label)
      sort == 'az' ? items.sort() : items.sort().reverse()        
      //get new id order
      for (i = 0; i < items.length; i++) {            
        newOrder.push(items[i][1])
      }        
      break        
    case 'newest': case 'oldest':                  
      //sort array by key(label)
      sort == 'newest' ? groupItems.sort().reverse() : groupItems.sort()        
      newOrder = groupItems
      break
  }
  return newOrder
}





function getDomain(url) {			
  return (url.replace('http://','').replace('https://','').replace('www.','').replace('web.','').split(/[/?#]/)[0])
}


function validUrl(url) {  
  try { return Boolean(new URL(url)); }
  catch(e){ return false; }  
}

async function fetchWithTimeout (url, timeout) {
  return Promise.race([
      fetch(url),
      new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), timeout)
      )
  ])
}



async function getFavIcon(urlString, timeout) {
  if(!timeout) { timeout = 5000 }
  console.log("######"+urlString+"######")
  let rootUrl, Icon
  let next = false
  let base64 = bool(localStorage.getItem('upStartSettings_iconsBase64'))
  
  
  if (validUrl(urlString)) {    
    let url = new URL(urlString)
    rootUrl = url.protocol+'//'+url.hostname
  } else { 
    rootUrl = 'http://'+urlString.split(/[/?#]/)[0]
  }
  
  if (!rootUrl.toLowerCase().match(/^(chrome:\/\/|chrome-extension:\/\/|data:image\/).*/)) {
    console.log("######### DUMP #########: getFavIcon -> rootUrl", rootUrl)
    let domain = getDomain(rootUrl)

    //1: root favicon.ico        
    try {
      
      let url = rootUrl+'/favicon.ico'
      console.log("TRY FAVICON: ",url)
      
//      let response = await fetch(url)
      let response = await fetchWithTimeout(url, timeout)
      if (response.status == 200) { 
        console.log("status ok")

        try {
          if (base64) { Icon = await getBase64Image(url) }
          else { Icon = url }
          next = false
        }
        catch(error) { 
          next = true
          console.log(error) 
        }
      } 
      else { next = true }
    }
    catch(error) { 
      next = true
      console.log(error) 
    }
    
    if (next) {
      //2: fetch page rel icon
      try {
        console.log("TRY LINK REL: ", rootUrl)
        let urlIcon = ''  
        
        setTimeout(async function(){        
          let response = await fetch(rootUrl)         
        
          if (response.status == 200) { 
            console.log("status ok")
            let text = await response.text()             
            
            const parser = new DOMParser()
            const htmlDocument = parser.parseFromString(text, "text/html")
            const links = htmlDocument.documentElement.getElementsByTagName('LINK')
          
            for (i=0;i<links.length;i++) {
            
            
              if (links[i].rel.toLowerCase().includes('icon')) {
                let href = links[i].getAttribute('href')                
                if ( (href.toLowerCase().includes('http')) || (href.toLowerCase().includes('https')) ) { linkUrl = links[i].getAttribute('href') }  
                else if (href.toLowerCase().match(/^\/\/.*/)) {
                  href = href.replace('//',"") //first occurrence
                }
                else { linkUrl = rootUrl+links[i].getAttribute('href') }

                if (linkUrl.includes('128')) {urlIcon = linkUrl}
                else if ((linkUrl.includes('64')) && (!urlIcon.includes('128'))) {urlIcon = linkUrl}
                else if ((linkUrl.includes('48')) && (!urlIcon.includes('128'||'64'))) {urlIcon = linkUrl}
                else if ((linkUrl.includes('32')) && (!urlIcon.includes('128'||'64'||'48'))) {urlIcon = linkUrl}
                else if (!urlIcon.includes('128'||'64'||'48'||'32')) {urlIcon = linkUrl}

              }      
            }
            if (urlIcon != '') {
              try {
                if (base64) { Icon = await getBase64Image(urlIcon) }
                else { Icon = urlIcon }
                next = false
              }
              catch(error) { 
                next = true
                console.log(error) 
              }  
            } else {
              next = true
            }

          } else { next = true }
        }, 5000)
      } 
      catch(error) { 
        next = true
        console.log(error) 
      }  
    }



    if (next) {        
      //3: faviconkit, duckduckgo and google api              
      try {
        console.log("TRY DUCK: ", url)
        let url = 'https://icons.duckduckgo.com/ip3/'+domain+'.ico'

        await fetchWithTimeout(url, timeout).then( async function(response) {
          if (response.status == 200) { 
            console.log("status ok")

            try {
              if (base64) { Icon = await getBase64Image(url) }
              else { Icon = url }
              next = false
            }
            catch(error) { 
              next = true
              console.log(error) 
            }  
          }
        })
      } 
      catch(error) { 
        next = true
        console.log(error) 
      }  
    }

      if (next) {     
      try {
        console.log("TRY GOOGLE: ", url)
        let url = 'https://www.google.com/s2/favicons?domain_url='+domain
        console.log("######### DUMP #########: getFavIcon -> url", url)

        await fetchWithTimeout(url, timeout).then( async function(response) {
          if (response.status == 200) { 
            console.log("status ok")

            try {
              if (base64) { Icon = await getBase64Image(url) }
              else { Icon = url }
              next = false
            }
            catch(error) { 
              next = true
              console.log(error) 
            }  
          }
        })
      } 
      catch(error) { 
        console.log(error) 
      }  
    }
  }  
  return Icon
}


function isOverFlown(e) {
  return e.scrollHeight > e.clientHeight || e.scrollWidth > e.clientWidth
}

function getBase64Image(imgUrl, width, height) {
	return new Promise(function(resolve, reject) {
      		let img = new Image()
          img.src = imgUrl
          if (width) { img.width = width }
          if (height) { img.height = height }      		
      		img.setAttribute('crossOrigin', 'anonymous')

     		img.onload = async function() {
          let canvas = document.createElement("canvas")
          
          //max 1920x1080 
          let ratio = 1    
          if (img.width > 1920) { 
            ratio = img.width/1920
            img.width = 1920
            img.height = img.height/ratio           
          } else if (img.height > 1080) {
            ratio = img.height/1080
            img.height = 1080
            img.width = img.width/ratio
          } 
          
          
          canvas.width = img.width
          canvas.height = img.height

     		  let ctx = canvas.getContext("2d")
          ctx.drawImage(img, 0, 0, img.width, img.height)
           
          //chrome
          let dataURL = await canvas.toDataURL("image/webp")     		  

          //firefox          
          //let dataURL
          //if ((canvas.width == 128) && (canvas.height == 128)) {dataURL = await canvas.toDataURL('image/png')}
          //else {console.log('jpeg');dataURL = await canvas.toDataURL('image/jpeg', 0.8)}
           
          resolve(dataURL)     		  	
     		}
     		img.onerror = function() {
     		 	reject()
     		}
	})
}

function fetchImage(imgUrl) {
	return new Promise(function(resolve, reject) {
      		var img = new Image();  
      		img.src = imgUrl
      		img.setAttribute('crossOrigin', 'anonymous')

     		img.onload = async function() {
     		}
     		img.onerror = function() {
     		 	reject()
     		}
	})
}

function hex2rgb(hex) {
  var arrBuff = new ArrayBuffer(4)
  var vw = new DataView(arrBuff)
  vw.setUint32(0,parseInt(hex, 16),false)
  var arrByte = new Uint8Array(arrBuff)
  return arrByte[1] + "," + arrByte[2] + "," + arrByte[3]
}


function validJson(jsonString) {
  try {JSON.parse(jsonString)}
  catch (e) {return false}
  return true
}


/* message functions */
function saveLayoutMessage () {
  SortableTopNav.options.disabled = true
  iziToast.show({
    icon: 'fa fa-question-circle iziToastFontOpacity',    
    timeout: false,
    progressBar: false,
    closeOnEscape: false,
    close: false,
    drag: false,
    animateInside: false,
    position: 'bottomRight',
    title: jsonLanguage.data.dialog_saveLayoutTitle,
    titleSize: '16',
    transitionIn: 'fadeInLeft',
    transitionOut: 'fadeOutRight',    
    displayMode: 2,
    layout: 1,
    buttons: [
      ['<button style="background-color:#a70e0e;color:white;font-size:14px;">'+jsonLanguage.data.dialog_Cancel+'</button>', function (instance, toast) {
        saveMsg = false
        columnChangedPages = []
        instance.hide({}, toast)
        location.reload()
      }],      
      ['<button style="background-color:#088f13;color:white;font-size:14px;"><b>'+jsonLanguage.data.dialog_Save+'</b></button>', async function (instance, toast) {  
        saveMsg = false

        //process changed page
        for (i=0;i<columnChangedPages.length;i++) {
          let pageID = columnChangedPages[i]

          //distributeGroups only for auto 
          if (jsonDataTmp.pages[pageID].pageColumns == "auto") {
            let result = await chrome.storage.local.get("upStartData")
            let jsonData = JSON.parse(result.upStartData)

            let originalGroupCount = 0       
            let tmpGroupCount = 0

            for (c=0; c<jsonData.pages[pageID].columns.length; c++) {
              originalGroupCount += jsonData.pages[pageID].columns[c].length
            }

            for (c=0; c<jsonDataTmp.pages[pageID].columns.length; c++) {
              tmpGroupCount += jsonDataTmp.pages[pageID].columns[c].length
            }

             ////distributeGroups only for diff group number
            if (originalGroupCount != tmpGroupCount) {            
                jsonDataTmp.pages[pageID].columns = await distributeGroups(jsonDataTmp.pages[pageID])
                jsonDataTmp.pages[pageID].pageAutoColumns = jsonDataTmp.pages[pageID].columns.length            
            }
          }

        }

        await chrome.storage.local.set({"upStartData": JSON.stringify(jsonDataTmp)})
        //sessionStorage.setItem('upStart_saveLayoutCurrentPage', 'true')

        let groups = document.querySelectorAll('.group')
        for (i=0;i<groups.length;i++) {	  		
          groups[i].classList.remove('group-drag')
        }   

        let bookmarks = document.querySelectorAll('.bookmark')
        for (i=0;i<bookmarks.length;i++) {	  		
          bookmarks[i].classList.remove('bookmark-drag')
        }
        sessionStorage.setItem('upStart_lastSuccessMsg', jsonLanguage.data.message_layoutSaved)  
        instance.hide({}, toast)  
        location.reload()      
      },true]
    ]
  })
  
}

function infoMessage (msg, msgPosition) {  
  if (!msgPosition) { msgPosition = 'bottomRight'}
  iziToast.info({       
    timeout: 3000,
    close: false,
    icon: 'fa fa-check-circle iziToastFontOpacity',
    iconColor: 'white',
    message: msg,
    position: msgPosition,
    messageSize: '16',
    messageColor: 'white',
    displayMode: 2,
    layout: 1,
  })
}

function successMessage (msg, msgPosition) {
  if (!msgPosition) { msgPosition = 'bottomRight'}
  iziToast.success({       
    timeout: 3000,
    close: false,
    icon: 'fa fa-check-circle iziToastFontOpacity',
    iconColor: 'white',
    message: msg,
    position: msgPosition,
    messageSize: '16',
    messageColor: 'white',
    displayMode: 2,
    layout: 1,
  })
}

function errorMessage (msg, msgPosition) {
  if (!msgPosition) { msgPosition = 'bottomRight'}
  iziToast.error({       
    timeout: 3000,
    close: false,
    icon: 'fa fa-exclamation-circle iziToastFontOpacity',
    iconColor: 'white',
    message: msg,
    position: msgPosition,
    messageSize: '16',
    messageColor: 'white',
    displayMode: 2,
    layout: 1,
  })
}


function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = res => {
      resolve(res.target.result)
    }
    reader.onerror = err => reject(err)

    reader.readAsText(file)
  })
}


function readFileAsync(file, fileType) {
  if (typeof file === 'undefined' || file === null) {
    return false
  }

  if (file.type.match(fileType)) {  
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader()
      fileReader.onload = () => {
        resolve(fileReader.result)
      }
      fileReader.onerror = reject
      fileReader.readAsDataURL(file)
    })
  } else {
		return false
  }
}

/* dropbox functions */

async function uploadDataToDropbox() {
  //semafaro
  localStorage.setItem("upStart_dbxUploading", 'true')
  console.log('uploading to dbx')

  let dbxResponse = false
  let ACCESS_TOKEN = localStorage.getItem("upStart_dbxToken")
  let dbx = new Dropbox.Dropbox({ fetch:fetch, accessToken: ACCESS_TOKEN })	  
  
  let resultData = await chrome.storage.local.get("upStartData")    
  let resultSettings = await chrome.storage.local.get("upStartSettings")  
  let resultCustomImages = await chrome.storage.local.get("upStartCustomImages")
  
  let file = new File(['{"data":'+resultData.upStartData+',"settings":'+resultSettings.upStartSettings+',"customImages":'+resultCustomImages.upStartCustomImages+'}'], 'upStartDBX.txt', {type: "text/plain;charset=utf-8"})
 
	await dbx.filesUpload({path: '/upStartDBX.txt', contents: file, mode: 'overwrite'})
  .then(function (response) {       
    localStorage.setItem("upStart_dbxServerModified", response.server_modified)
    localStorage.setItem("upStart_dbxLastSync", Date.now().toString())          
    dbxResponse = true
	})		
  .catch( async function (error) {
    console.log(error)
  })

  localStorage.setItem("upStart_dbxUploading", 'false')
  console.log('DONE! uploading to dbx')

  return dbxResponse
}


async function downloadDataFromDropbox(response) {
  let dbxResponse = false

  if (!response) {
    let ACCESS_TOKEN = localStorage.getItem("upStart_dbxToken")
    let dbx = new Dropbox.Dropbox({ fetch:fetch, accessToken: ACCESS_TOKEN })      
    let response = await dbx.filesDownload({path: '/upStartDBX.txt'})
  }

  try {
  let blob = response.fileBlob
  const contents = await readFile(blob)
  let jsonDBX = JSON.parse(contents)
  await loadFromData(JSON.stringify(jsonDBX.data),JSON.stringify(jsonDBX.settings),JSON.stringify(jsonDBX.customImages))              
  localStorage.setItem("upStart_dbxServerModified", response.server_modified)
  localStorage.setItem("upStart_dbxLastSync", Date.now().toString())      
  dbxResponse = true    
  }
  catch(error) {}
  return dbxResponse  
}


//dropbox auto sync
async function dropboxSync(mode) {	
  console.log(localStorage.getItem('upStart_dbxUploading'))


  if (localStorage.getItem('upStart_dbxUploading') == 'false') {

    if (mode != 'bg') {	toggleOverlay(true) }
    if (mode != 'bg') {	document.getElementById("spinner-count").style.visibility = 'hidden' }
    let result = await chrome.storage.local.get("upStartLanguage")
    let jsonLanguage = JSON.parse(result.upStartLanguage) 

    //verify if there is anything to upload    
    console.log("has new changes: ",localStorage.getItem('upStart_newChanges'))

    if (localStorage.getItem('upStart_newChanges') == 'true') {

      if (await uploadDataToDropbox()) {
        localStorage.setItem('upStart_newChanges', 'false')
        if (mode != 'bg') {	successMessage(jsonLanguage.settings.message_dbxSync) }		
        console.log("Dropbox data synchronized")
      } else { 
        if (mode != 'bg') {	errorMessage(jsonLanguage.settings.message_dbxSyncFail) }			
        console.log("Data could not be synchronized.") 
      }

    } else { //get remote changes          
      try {    
        let dbxServerModified = new Date(localStorage.getItem('upStart_dbxServerModified'))
        console.log("LOCALLastModification", dbxServerModified)
        let ACCESS_TOKEN = localStorage.getItem("upStart_dbxToken")  
        let dbx = new Dropbox.Dropbox({ fetch:fetch, accessToken: ACCESS_TOKEN })

        await dbx.filesDownload({path: '/upStartDBX.txt'})
        .then(async function (response) {	
          localStorage.setItem("upStart_dbxLastSyncCheck", Date.now().toString())
          let remoteServerModified = new Date(response.server_modified)  
          console.log("remoteServerModified", remoteServerModified)
          if (remoteServerModified > dbxServerModified) { 				
            if (await downloadDataFromDropbox(response)) {    
              //ignore local changes to prevent conflicts
              localStorage.setItem('upStart_newChanges', false)
              if (mode != 'bg') {	successMessage(jsonLanguage.settings.message_dbxSync) }						
            } else {
              if (mode != 'bg') {	errorMessage(jsonLanguage.settings.message_dbxSyncFail) }
            }	
          } else {
            console.log("Dropbox already synchronized")
            if (mode != 'bg') {	infoMessage(jsonLanguage.settings.message_dbxAlreadySync) }					
          }
        })

      }
      catch(error) { 
        if (mode != 'bg') {	errorMessage(jsonLanguage.settings.message_dbxSyncFail) }		
      }

    }

    if (mode != 'bg') {	toggleOverlay(false) }
    if (mode != 'bg') {	document.getElementById("spinner-count").style.visibility = 'visible' }	

  }	
	
} 