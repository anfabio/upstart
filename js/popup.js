//set theme
let theme = localStorage.getItem('upStartSettings_theme')
document.body.setAttribute('data-theme', theme)

//iziToast and slider
let iziTheme = 'light'
let iziBgColor = '#fff'
if (theme != 'light') {
	iziTheme = 'dark'
	iziBgColor = '#192935'
}

let lang = localStorage.getItem('upStartSettings_language')

drawPopupDOM()



async function drawPopupDOM () {
	//event listeners
	document.getElementById("popup-sidebar").addEventListener('click', showPopupContainer )
	document.getElementById('save-all-tabs').addEventListener('click', saveAllTabs)
	
	let result = await chrome.storage.local.get("upStartData")
	let jsonData = JSON.parse(result.upStartData)   

	result = await chrome.storage.local.get("upStartLanguage")  
	let jsonLanguage = JSON.parse(result.upStartLanguage)
  console.log("######### DUMP #########: drawPopupDOM -> jsonLanguage", jsonLanguage)

	let mainContent = document.getElementById('main-content')
	let pageList = document.getElementById('page-list')
	

	//language
	let style = document.createElement("STYLE");		
	style.innerText = '[lang='+lang+'] {display: block;}'
	document.body.appendChild(style)
	document.getElementById('new-group').placeholder = jsonLanguage.shared.popup_newGroupPlaceholder

	for (p = 0; p < jsonData['pages'].length; p++) {			
		let pageLabel = jsonData.pages[p].pageLabel			
		let groups = []
		
		//DOM
		let collapse = document.createElement('DIV')  
		collapse.id = 'collapse'+p
		collapse.className = "collapse"

		let collapseLink = document.createElement('A')  
		collapseLink.id = 'collapse-link'+p
		collapseLink.href = '#'+collapse.id
		collapseLink.innerHTML = pageLabel
		//settings page icon
		if (localStorage.getItem("upStartSettings_pageIcon") != "theme") {
		  collapseLink.style.backgroundImage = "url('"+localStorage.getItem("upStartSettings_pageIcon")+"')"
		}				
		//set custom page icon
		if (jsonData.pages[p].pageIcon != "theme") {collapseLink.style.backgroundImage = "url('"+jsonData.pages[p].pageIcon+"')"}
			
		//page list
		pageList.innerHTML += '<option value="'+p+'">'+jsonData.pages[p].pageLabel+'</option>'
		
	
		let content = document.createElement('DIV')  
		content.className = "content"

		let innerContent = document.createElement('DIV')  
		innerContent.className = "inner-content"


		//assemble
		content.appendChild(innerContent)
		collapse.appendChild(collapseLink)
		collapse.appendChild(content)
		mainContent.appendChild(collapse)

		//groups
		for (c=0; c<jsonData.pages[p].columns.length; c++) {
			let columnGroups = jsonData.pages[p].columns[c]
			
			for (g = 0; g < columnGroups.length; g++) {   
				group = jsonData['groups'].find(group => group.id == columnGroups[g])
						
				let groupCollapse = document.createElement('DIV')  
				groupCollapse.id = 'group'+group.id
				groupCollapse.dataset.group = group.id
				groupCollapse.className = "group-collapse"
				groupCollapse.innerHTML = group.groupLabel
				if (group.groupIcon != '' ) { groupCollapse.style.backgroundImage = "url("+group.groupIcon+")"}

				groupCollapse.addEventListener('click', collapseClick)
				

				innerContent.appendChild(groupCollapse)
			}
		} 
	}
	

	function collapseClick(e) {
		console.log(e.target.className)        
		console.log(e)
		saveLink(e.target.closest('.group-collapse').dataset.group)
	}
	
	
	async	function showPopupContainer(e) {
		let container = e.target.closest('.popup-sidebar-item').dataset.container
		
		if (container != 'settings') {
			if (container == 'popup-recover') {
				if (!sessionStorage.getItem('upStart_sessionAssembledBackups')) {
	
					let result = await chrome.storage.local.get("upStartBackups")  		
					let jsonBackups = JSON.parse(result.upStartBackups)  
	
					let bkpAutoList = document.getElementById("auto-backup-list")
					for (i=0;i<jsonBackups.auto.length;i++) { 
						let item = await drawRecover(jsonBackups.auto[i])   					  
						bkpAutoList.append(item)
					}
					//event listeners
					bkpAutoList.addEventListener('click', async (e) => {
						if (e.target.closest('.btn-actions-download')) {				
							let timestamp = e.target.closest('.backup-actions').dataset.timestamp
							let bkpData = JSON.parse(await LZString.decompress(jsonBackups['auto'].find(bkpItem => bkpItem.timestamp == timestamp).backupData))
							exportToFilePopup(JSON.stringify(bkpData.data), JSON.stringify(bkpData.settings), JSON.stringify(bkpData.customImages))
						}		
	
						if (e.target.closest('.btn-actions-restore')) {				
							let timestamp = e.target.closest('.backup-actions').dataset.timestamp
							restoreBkpPopup(JSON.parse(await LZString.decompress(jsonBackups['auto'].find(bkpItem => bkpItem.timestamp == timestamp).backupData)))
						}
					})
	
					let bkpManualList = document.getElementById("manual-backup-list")
					for (i=0;i<jsonBackups.manual.length;i++) { 
						let item = await drawRecover(jsonBackups.manual[i]) 
						bkpManualList.append(item)
					}
					//event listeners
					bkpManualList.addEventListener('click', async (e) => {
						if (e.target.closest('.btn-actions-download')) {				
							let timestamp = e.target.closest('.backup-actions').dataset.timestamp
							let bkpData = JSON.parse(await LZString.decompress(jsonBackups['manual'].find(bkpItem => bkpItem.timestamp == timestamp).backupData))
							exportToFilePopup(JSON.stringify(bkpData.data), JSON.stringify(bkpData.settings), JSON.stringify(bkpData.customImages))
						}		
	
						if (e.target.closest('.btn-actions-restore')) {				
							let timestamp = e.target.closest('.backup-actions').dataset.timestamp
							restoreBkpPopup(JSON.parse(await LZString.decompress(jsonBackups['manual'].find(bkpItem => bkpItem.timestamp == timestamp).backupData)))
						}
					})		
					sessionStorage.setItem('upStart_sessionAssembledBackups', 'true')
				}		
			}
			let containers = document.querySelectorAll('.popup-container')
			for (i=0;i<containers.length;i++) { containers[i].style.display = 'none' }	
			document.getElementById(container).style.display = 'block'
			let sidebarItems = document.querySelectorAll('.popup-sidebar-item')
			for (i=0;i<sidebarItems.length;i++) { sidebarItems[i].classList.remove('popup-sidebar-item-active') }	
			e.target.closest('.popup-sidebar-item').classList.add('popup-sidebar-item-active')		
		} else {
			window.close()
		}
	}
	
	
	
	async function drawRecover(jsonBkp, index) {	
		let date = new Date(Number(jsonBkp.timestamp)) 
		let formattedDate = date.toLocaleString('en-us', {dateStyle:'short', timeStyle:'short'})
	
		let bkpWrapper = document.createElement('DIV')    
		bkpWrapper.className = "backup-wrapper"
		bkpWrapper.id = 'backup-wrapper-'+jsonBkp.timestamp
	
		let bkpDate = document.createElement('DIV')    
		bkpDate.className = "backup-timestamp"
		bkpDate.id = 'backup-timestamp-'+jsonBkp.timestamp
		bkpDate.innerHTML = formattedDate
	
		let bkpActions = document.createElement('DIV')    
		bkpActions.className = "backup-actions"
		bkpActions.id = 'backup-actions-'+jsonBkp.timestamp
		bkpActions.dataset.index = index
		bkpActions.dataset.timestamp = jsonBkp.timestamp
		bkpActions.dataset.date = formattedDate
		
	
		let btnActionsDownload = document.createElement('BUTTON')    
		btnActionsDownload.className = "btn-actions btn-actions-download"
		btnActionsDownload.title = jsonLanguage.settings.restore_btnActionsDownloadTitle
		btnActionsDownload.innerHTML = '<i class="context-menu-icon fas fa-download"></i>'   
		
		let btnActionsRestore = document.createElement('BUTTON')    
		btnActionsRestore.className = "btn-actions btn-actions-restore"
		btnActionsRestore.title = jsonLanguage.settings.restore_btnActionsRestoreTitle
		btnActionsRestore.innerHTML = '<i class="context-menu-icon fas fa-undo-alt"></i>'    
		
		//bkp assemble
		bkpActions.append(btnActionsDownload)
		bkpActions.append(btnActionsRestore)
	
		bkpWrapper.append(bkpDate) 
		bkpWrapper.append(bkpActions) 
		
	
		return bkpWrapper
	
	}
	
	
	
	
	async function exportToFilePopup(jsonData,jsonSettings,jsonCustomImages) {
		try {  
		if (!(jsonData && jsonSettings && jsonCustomImages)) {
			let resultData = await chrome.storage.local.get("upStartData")
			jsonData = resultData.upStartData
			let resultSettings = await chrome.storage.local.get("upStartSettings")
			jsonSettings = resultSettings.upStartSettings
			let resultCustomImages = await chrome.storage.local.get("upStartCustomImages")
			jsonCustomImages = resultCustomImages.upStartCustomImages
		}
			let now = new Date()
			let formattedDate = (now.getMonth() + 1) + '-' + now.getDate() + '-' + now.getFullYear()
	
			var zip = new JSZip()
			zip.file('data.txt', jsonData)
			zip.file('settings.txt', jsonSettings)
			zip.file('customImages.txt', jsonCustomImages)
			
			zip.generateAsync({type:"blob", compression: "DEFLATE"})
			.then(function(content) { 
				saveAs(content, 'upStart-'+formattedDate+'.zip') 
				window.close()		
			})		
		}
		catch (error) {
			console.log(error)
		}
	}			
	
	
	
	
	
	async function saveAllTabs() {	
		let result = await chrome.storage.local.get("upStartData")
		let jsonData = JSON.parse(result.upStartData)   
		let pageID = document.getElementById('page-list').value
		let groupLabel = document.getElementById('new-group').value
	
		if (groupLabel == '') {groupLabel = jsonLanguage.shared.popup_savedTabs}
	
	
		let newGroupObj = new Object()
		newGroupObj.groupLabel = groupLabel
		newGroupObj.groupDescription = ''
		newGroupObj.groupIcon = "icon/bookmark.svg"
		newGroupObj.groupBgColor = "theme",
		newGroupObj.groupFgColor = "theme", 
		newGroupObj.groupSort = "auto"
		newGroupObj.groupView = "auto",
		newGroupObj.hideBookmarkLabels = "auto",
		newGroupObj.id = Date.now().toString(),
		newGroupObj.items = []	
	
		//push group to page
		jsonData.pages[pageID].columns[0].push(newGroupObj.id)
		jsonData.groups.push(newGroupObj)
	
	
		chrome.tabs.query({}, async function(tabs) {
    
	
			for (let i=0;i<tabs.length;i++) {

				let tabURL = tabs[i].url
				let tabLabel = tabs[i].title
				let tabIcon = tabs[i].favIconUrl
				
				console.log('tabCase: ',tabURL.toLowerCase())
	
				if (!tabURL.toLowerCase().match(/^(chrome-extension:\/\/|chrome:\/\/|about:|moz-extension:\/\/).*/)) {
					console.log(tabLabel)
	
					let newItemObj = new Object()
					newItemObj.label = tabLabel
					newItemObj.description = ''					
					newItemObj.icon = 'icon/default.svg'
					if ((tabIcon) && (tabIcon != '') &&  (tabIcon != undefined)) { newItemObj.icon = tabIcon }
					newItemObj.url = tabURL
					newItemObj.id = Date.now().toString()
	
					//base64 icon
					if (localStorage.getItem('upStartSettings_iconsBase64') == 'true') {
						try {
							let base64ImageData = await getBase64Image(newItemObj.icon, 128, 128)
							newItemObj.icon = base64ImageData 
						}
						catch (error) {console.log(error)}
					}
		
					//push item to json
					newGroupObj.items.push(newItemObj.id)
					jsonData.items.push(newItemObj)	          
				}				
			}
	
			console.log("######### DUMP #########: saveAllTabs -> jsonData", jsonData)
			//store
			await chrome.storage.local.set({"upStartData": JSON.stringify(jsonData)})
			//message
			let msg = jsonLanguage.shared.popup_sysMsgTabsSavedMsg.replace('{pageLabel}', '"'+jsonData.pages[pageID].pageLabel+'"')
			chrome.notifications.create('', {
				title: jsonLanguage.shared.popup_sysMsgTabsSaved,
				message: msg.replace('{groupLabel}', '"'+groupLabel+'"'),
				iconUrl: 'img/icon64.png',
				type: 'basic'
			}, function() {window.close()})		
		})
	}
	
	
	
	function saveLink(groupID){
		let jsonData
		console.log(groupID)
	
		chrome.tabs.query({active: true, currentWindow: true}, 
			async function(arrayOfTabs) {
				let activeTab = arrayOfTabs[0];
				tabURL = activeTab.url;
				tabLabel = activeTab.title;
				tabIcon = activeTab.favIconUrl;
	
				//get root domain			
				//let domainName = tabURL.replace('http://','').replace('https://','').replace('www.','').replace('web.','').split(/[/?#]/)[0];
				
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
					let result = await chrome.storage.local.get("upStartData")
					jsonData = JSON.parse(result.upStartData) 
	
					//push item to json
					jsonData.items.push(newItemObj)				
					
					let group = jsonData['groups'].find(group => group.id == groupID)
					let groupLabel = group.groupLabel
		
					//add to group items
					group.items.push(newItemObj.id)

					//sort
          if ((group.groupSort != 'manual') && (group.groupSort != 'auto')){
            group.items = sortGroup(group.items, group.groupSort, jsonData)
          } else if ((group.groupSort == 'auto') && (localStorage.getItem('upStartSettings_groupsSort') != 'manual')) {
            group.items = sortGroup(group.items, localStorage.getItem('upStartSettings_groupsSort'), jsonData)
          }										
		
					//store
					await chrome.storage.local.set({"upStartData": JSON.stringify(jsonData)})
					//message
					let msg = jsonLanguage.data.sysMessage_itemCreatedMsg.replace('{itemLabel}', '"'+newItemObj.label+'"')
					chrome.notifications.create('', {
						title: jsonLanguage.data.sysMessage_itemCreatedTitle,
						message: msg.replace('{groupLabel}', '"'+groupLabel+'"'),
						iconUrl: 'img/icon64.png',
						type: 'basic'
					}, function() {window.close()})
				}
				catch (error) {		
					console.log(error)
				}
			})
	}
	
	
	
	function restoreBkpPopup(jsonBkp) {
		console.log(jsonBkp)
			iziToast.show({
				theme: iziTheme,
				timeout: false,
				progressBar: false,
				closeOnEscape: true,
				close: false,
				backgroundColor: iziBgColor,    
				position: 'topCenter',
				title: jsonLanguage.shared.popup_restorePoint,
				titleSize: '16',
				titleLineHeight: '16',
				titleColor: '#008200',			
				displayMode: 2,
				layout: 2,
				buttons: [
					['<button style="background-color: #DA5234;"><b>'+jsonLanguage.settings.dialog_Ok+'</b></button>', async function (instance, toast) {
						await loadFromDataPopup(JSON.stringify(jsonBkp.data),JSON.stringify(jsonBkp.settings),JSON.stringify(jsonBkp.customImages))
						window.close()
						instance.hide({ }, toast)
					}],
					['<button style="background-color: #38A12A;">'+jsonLanguage.settings.dialog_Cancel+'</button>', function (instance, toast) {
						instance.hide({ }, toast)
					},true]
				]
			})
	}
	
	async function loadFromDataPopup(jsonFileData,jsonFileSettings,jsonFileCustomImages) {   
		const upStartChannel_reset = new BroadcastChannel('upStartChannel_reset')
		upStartChannel_reset.postMessage(0)
	
		await chrome.storage.local.set({"upStartCustomImages": jsonFileCustomImages})
		await chrome.storage.local.set({"upStartData": jsonFileData})
		await chrome.storage.local.set({"upStartSettings": jsonFileSettings})
	}

}




