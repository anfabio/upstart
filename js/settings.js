//set variables
let dbxReload = false
let iziTheme = 'light'
let bgColor = 'white'
if (document.body.getAttribute('data-theme') != 'light') {
  iziTheme = 'dark'
  bgColor = '#192935'
}
let uploadsAssembled = false

let sessionOption = sessionStorage.getItem('upStart_settingsOption')
if (!sessionOption) {sessionOption = 'options'}	



initializeSettings()


//functions
//initialize settings	
async function initializeSettings() {	
  //listen to changes on jsonData
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (changes["upStartSettings"]) {
			if (!dbxReload) {location.reload()}			
		}})

	chrome.extension.isAllowedFileSchemeAccess(function(filesAllowed) {
  console.log("######### DUMP #########: initializeSettings -> filesAllowed", filesAllowed)
		if (filesAllowed) {		
			document.getElementById("files-allowed").style.display = 'none'
		} else {
			document.getElementById("extension-manager-link").addEventListener('click', function() { chrome.tabs.create({url: "chrome://extensions/?id=" + chrome.runtime.id}) })
		}
	})


	try {
		let result = await chrome.storage.local.get("upStartSettings")
		let jsonSettings = JSON.parse(result.upStartSettings)
		
		result = await chrome.storage.local.get("upStartCustomImages")      
		let jsonCustomImages = JSON.parse(result.upStartCustomImages)

		result = await chrome.storage.local.get("upStartBackups")  
		let jsonBackups = JSON.parse(result.upStartBackups)

		result = await chrome.storage.local.get("upStartLanguage")  
		let jsonLanguage = JSON.parse(result.upStartLanguage)
		
    console.log(jsonSettings)
    console.log(jsonCustomImages)
		console.log(jsonBackups)
		console.log(jsonLanguage)


		let style = document.createElement("STYLE");		
		style.innerText = '[lang='+jsonSettings.language+'] {display: block;}'
		document.body.appendChild(style)


		//set theme
		document.body.setAttribute('data-theme', jsonSettings.theme)

		//force theme
		//document.body.setAttribute('data-theme', 'dark')

		//set current values
		//options

		let languageValues = ''
		for (let [key, value] of Object.entries(jsonLanguage.settings.options_languages)) {languageValues += '<option value="'+key+'">'+value+'</option>'}
	 	document.getElementById('language').innerHTML = languageValues			
	 	document.getElementById('language').value = jsonSettings.language

	
		let groupsSortValues = ''
 		for (let [key, value] of Object.entries(jsonLanguage.settings.options_groupsSortValues)) {groupsSortValues += '<option value="'+key+'">'+value+'</option>'}
		document.getElementById('groups-sort').innerHTML = groupsSortValues			
		document.getElementById('groups-sort').value = jsonSettings.groupsSort

		let groupsViewValues = ''
  	for (let [key, value] of Object.entries(jsonLanguage.settings.options_groupsViewValues)) {groupsViewValues += '<option value="'+key+'">'+value+'</option>'}
		document.getElementById('group-view').innerHTML = groupsViewValues			
		document.getElementById('group-view').value = jsonSettings.groupView


    let groupsPageColumnsValues = ''
    for (let [key, value] of Object.entries(jsonLanguage.settings.options_groupsPageColumnsValues)) {groupsPageColumnsValues += '<option value="'+key+'">'+value+'</option>'}
    document.getElementById('page-columns').innerHTML = groupsPageColumnsValues	
		document.getElementById('page-columns').value = jsonSettings.pageColumns
		

		if (bool(jsonSettings.rememberLastPage)) {
		document.getElementById('remember-page-check').checked = true
		document.getElementById('remember-page').classList.add('on')
		}
		if (bool(jsonSettings.openLinksNewTab)) {
			document.getElementById('new-tab-check').checked = true
			document.getElementById('new-tab').classList.add('on')
		}
		if (bool(jsonSettings.showContextMenu)) {
			document.getElementById('context-menu-check').checked = true
			document.getElementById('context-menu').classList.add('on')
		}	
		if (bool(jsonSettings.iconsBase64)) {
			document.getElementById('base64-icons-check').checked = true
			document.getElementById('base64-icons').classList.add('on')
		}

		//bookmarks
		let iconSizeValues = ''
  	for (let [key, value] of Object.entries(jsonLanguage.settings.bookmarks_iconSize)) {iconSizeValues += '<option value="'+key+'">'+value+'</option>'}
		document.getElementById('icon-size').innerHTML = iconSizeValues			
		document.getElementById('icon-size').value = jsonSettings.itemIconSize

		let fontSizeValues = ''
  	for (let [key, value] of Object.entries(jsonLanguage.settings.bookmarks_fontSize)) {fontSizeValues += '<option value="'+key+'">'+value+'</option>'}
		document.getElementById('font-size').innerHTML = fontSizeValues			
		document.getElementById('font-size').value = jsonSettings.itemLabelFontSize

		let fontStyleValues = ''
  	for (let [key, value] of Object.entries(jsonLanguage.settings.bookmarks_fontStyle)) {fontStyleValues += '<option value="'+key+'">'+value+'</option>'}
		document.getElementById('font-style').innerHTML = fontStyleValues	
		document.getElementById('font-style').value = jsonSettings.itemLabelFontStyle	

		let labelAlignValues = ''
  	for (let [key, value] of Object.entries(jsonLanguage.settings.bookmarks_labelAlign)) {labelAlignValues += '<option value="'+key+'">'+value+'</option>'}
		document.getElementById('label-alignment').innerHTML = labelAlignValues	
		document.getElementById('label-alignment').value = jsonSettings.itemLabelAlign
		

		let linesShownValues = ''
  	for (let [key, value] of Object.entries(jsonLanguage.settings.bookmarks_linesShown)) {linesShownValues += '<option value="'+key+'">'+value+'</option>'}
		document.getElementById('label-lines').innerHTML = linesShownValues	
		document.getElementById('label-lines').value = jsonSettings.itemLabelShowLines


		if (bool(jsonSettings.hideItemLabels)) {
			document.getElementById('hide-labels-check').checked = true
			document.getElementById('hide-labels').classList.add('on')
		}

		//appearance
		let themeValues = ''
  	for (let [key, value] of Object.entries(jsonLanguage.settings.appearance_theme)) {themeValues += '<option value="'+key+'">'+value+'</option>'}
		document.getElementById('theme').innerHTML = themeValues	
		document.getElementById('theme').value = jsonSettings.theme		

		//icons
		let pageIconImageValue = jsonSettings.pageIcon
		if ((pageIconImageValue != 'theme') && (pageIconImageValue != "")) { 
			document.getElementById('page-icon-selector').src = pageIconImageValue
		}
		else { 
			pageIconImageValue = "theme"
			document.getElementById('page-icon-selector').src = "img/theme.svg" 
		}
	

		let basePageIconImgHTML = document.getElementById('image-selector-page-icon').innerHTML


		//backgrounds		
		let pageBgImageValue = jsonSettings.pageBgImage
		if ((pageBgImageValue != 'theme') && (pageBgImageValue != "")) { 
			document.getElementById('page-image-selector').src = pageBgImageValue			
		}
		else { 
			pageBgImageValue = "theme"
			document.getElementById('page-image-selector').src = "img/themewide.svg" 
		}

		let basePageBgImgHTML = document.getElementById('image-selector-page-background').innerHTML


		//pickr group background color
		if (jsonSettings.groupBgColor == 'theme') {labelColor = null}
		else {labelColor = jsonSettings.groupBgColor}
		const pickrGroupBg = Pickr.create({
			el: '#group-bg-color-picker',
			theme: 'classic',
			default: labelColor,
			swatches: ['rgba(255, 255, 255, 1)','rgba(255, 255, 255, 0)','rgba(0, 0, 0, 1)','ffff88','b4b5ff','a5d2ff','rgba(204, 204, 221, 1)','eed5b7','9bcd9b','eee0e5','b0c4de','b2b2b2','rgba(255, 255, 221, 1)','rgba(221, 238, 255, 1)','rgba(221, 255, 221, 1)','rgba(255, 165, 165, 1)'],
			components: {preview:true,opacity: true,hue:true,interaction:{hex:true,rgba: true,input: true,clear:true,save: true}}	
			})
			.on('save', (color, instance) => {instance.hide()})

		//pickr group foreground color
		if (jsonSettings.groupFgColor == 'theme') {labelColor = null}
		else {labelColor = jsonSettings.groupFgColor}
		const pickrGroupFg = Pickr.create({
			el: '#group-fg-color-picker',
			theme: 'classic',
			default: labelColor,
			swatches: ['rgba(255, 255, 255, 1)','rgba(255, 255, 255, 0)','rgba(0, 0, 0, 1)','ffff88','b4b5ff','a5d2ff','rgba(204, 204, 221, 1)','eed5b7','9bcd9b','eee0e5','b0c4de','b2b2b2','rgba(255, 255, 221, 1)','rgba(221, 238, 255, 1)','rgba(221, 255, 221, 1)','rgba(255, 165, 165, 1)'],
			components: {preview:true,opacity: true,hue:true,interaction:{hex:true,rgba: true,input: true,clear:true,save: true}}	
			})
			.on('save', (color, instance) => {instance.hide()})


		//pickr page background
		if (jsonSettings.pageBgColor == 'theme') {labelColor = null}
		else {labelColor = jsonSettings.pageBgColor}
		const pickrPageBg = Pickr.create({
			el: '#page-bg-color-picker',
			theme: 'classic',
			default: labelColor,
			swatches: ['rgba(255, 255, 255, 1)','rgba(255, 255, 255, 0)','rgba(0, 0, 0, 1)','ffff88','b4b5ff','a5d2ff','rgba(204, 204, 221, 1)','eed5b7','9bcd9b','eee0e5','b0c4de','b2b2b2','rgba(255, 255, 221, 1)','rgba(221, 238, 255, 1)','rgba(221, 255, 221, 1)','rgba(255, 165, 165, 1)'],
			components: {preview:true,opacity: true,hue:true,interaction:{hex:true,rgba: true,input: true,clear:true,save: true}}	
			})
			.on('save', (color, instance) => {instance.hide()})

		//pickr topnav foreground
		if (jsonSettings.topNavFgColor == 'theme') {labelColor = null}
		else {labelColor = jsonSettings.topNavFgColor}
		const pickrNavFg = Pickr.create({
			el: '#navbar-fg-color-picker',
			theme: 'classic',
			default: labelColor,
			swatches: ['rgba(255, 255, 255, 1)','rgba(255, 255, 255, 0)','rgba(0, 0, 0, 1)','ffff88','b4b5ff','a5d2ff','rgba(204, 204, 221, 1)','eed5b7','9bcd9b','eee0e5','b0c4de','b2b2b2','rgba(255, 255, 221, 1)','rgba(221, 238, 255, 1)','rgba(221, 255, 221, 1)','rgba(255, 165, 165, 1)'],
			components: {preview:true,opacity: true,hue:true,interaction:{hex:true,rgba: true,input: true,clear:true,save: true}}	
		})
		.on('save', (color, instance) => {instance.hide()})


		//pickr topnav background
		if (jsonSettings.topNavBgColor == 'theme') {labelColor = null}
		else {labelColor = jsonSettings.topNavBgColor}
		const pickrNavBg = Pickr.create({
			el: '#navbar-bg-color-picker',
			theme: 'classic',
			default: labelColor,
			swatches: ['rgba(255, 255, 255, 1)','rgba(255, 255, 255, 0)','rgba(0, 0, 0, 1)','ffff88','b4b5ff','a5d2ff','rgba(204, 204, 221, 1)','eed5b7','9bcd9b','eee0e5','b0c4de','b2b2b2','rgba(255, 255, 221, 1)','rgba(221, 238, 255, 1)','rgba(221, 255, 221, 1)','rgba(255, 165, 165, 1)'],
			components: {preview:true,opacity: true,hue:true,interaction:{hex:true,rgba: true,input: true,clear:true,save: true}}	
		})
		.on('save', (color, instance) => {instance.hide()})

		
		//picker language
		let pickersTheme = document.getElementsByClassName('pcr-clear')
		for (i=0;i<pickersTheme.length;i++) {
			pickersTheme[i].value = jsonLanguage.shared.colorPicker_theme
		}
		let pickersSave = document.getElementsByClassName('pcr-save')
		for (i=0;i<pickersSave.length;i++) {
			pickersSave[i].value = jsonLanguage.shared.colorPicker_save
		}


		//import export
		let inputFileElement = document.getElementById('inputFile')
		inputFileElement.addEventListener('change', (e) => {
			if (typeof inputFileElement.files[0] === 'undefined' || inputFileElement.files[0] === null) {
				document.getElementById('inputFileLabel').style.color = 'white'
			} else {
				document.getElementById('inputFileLabel').style.color = '#EBC833'
			}
		})


    //actions


		//uploads
		let inputFileIcon = document.getElementById('input-image-file-icon')
		inputFileIcon.addEventListener('change', (e) => {			
			if (typeof inputFileIcon.files[0] === 'undefined' || inputFileIcon.files[0] === null) {
				document.getElementById('iconFileLabel').style.color = 'white'
			} else {
				document.getElementById('iconFileLabel').style.color = '#EBC833'
			}
		})

		let inputFileBg = document.getElementById('input-image-file-bg')
		inputFileBg.addEventListener('change', (e) => {			
			if (typeof inputFileBg.files[0] === 'undefined' || inputFileBg.files[0] === null) {
				document.getElementById('bgFileLabel').style.color = 'white'
			} else {
				document.getElementById('bgFileLabel').style.color = '#EBC833'
			}
		})

		

		//backups

		let autoTimeValues = ''
  	for (let [key, value] of Object.entries(jsonLanguage.settings.restore_autoTime)) {autoTimeValues += '<option value="'+key+'">'+value+'</option>'}
		document.getElementById('auto-backup-time').innerHTML = autoTimeValues
		document.getElementById('auto-backup-time').value = jsonSettings.autoBkpTime

		let autoMaxValues = ''
  	for (let [key, value] of Object.entries(jsonLanguage.settings.restore_autoMax)) {autoMaxValues += '<option value="'+key+'">'+value+'</option>'}
		document.getElementById('auto-backup-max').innerHTML = autoMaxValues
		document.getElementById('auto-backup-max').value	 = jsonSettings.autoBkpMax

		let manualMaxValues = ''
  	for (let [key, value] of Object.entries(jsonLanguage.settings.restore_manualMax)) {manualMaxValues += '<option value="'+key+'">'+value+'</option>'}
		document.getElementById('manual-backup-max').innerHTML = manualMaxValues
		document.getElementById('manual-backup-max').value = jsonSettings.manualBkpMax
		
		let autoBkp = document.getElementById("container-auto-backups")
		let manualBkp = document.getElementById("container-manual-backups")

		if (jsonBackups.auto.length > 0) { document.getElementById('container-auto-backups').style.display = 'grid'; document.getElementById('no-auto-bkp-message').style.display = 'none' }
		if (jsonBackups.manual.length > 0) { document.getElementById('container-manual-backups').style.display = 'grid'; document.getElementById('no-manual-bkp-message').style.display = 'none' }

    for (i=0;i<jsonBackups.auto.length;i++) { 
			await drawBackup(jsonBackups.auto[i].timestamp, autoBkp, 'auto')
    }
		
		for (i=0;i<jsonBackups.manual.length;i++) { 
			await drawBackup(jsonBackups.manual[i].timestamp, manualBkp, 'manual')
		}
			
    autoBkp.addEventListener('click', async (e) => {
			let locale = localStorage.getItem('upStartSettings_language')
		
			switch (locale) {
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

			let date = new Date(Number(e.target.closest('.backup-actions').dataset.timestamp)) 
			let formattedDate = date.toLocaleString(localeJS, {dateStyle:'full', timeStyle:'medium'})
			
     	if (e.target.closest('.btn-actions-delete')) {
				iziToast.show({
					theme: iziTheme,
					timeout: false,
					progressBar: false,
					overlay: true,
					closeOnEscape: true,
					close: false,
					backgroundColor: bgColor,    
					position: 'center',
					title: jsonLanguage.settings.dialog_deleteBkpTitle,					
					titleSize: '22',
					titleLineHeight: '30',
					titleColor: '#008200',		
					message: '<span class="highlight-text">'+formattedDate+'</span>',
					messageSize: '18',
					messageColor: 'white',		
					messageLineHeight: '20',
					displayMode: 2,
					layout: 9,
					buttons: [
						['<button style="background-color: #a70e0e;">'+jsonLanguage.settings.dialog_Cancel+'</button>', function (instance, toast) {
							instance.hide({ }, toast)
						},true],
						['<button style="background-color: #38A12A;"><b>'+jsonLanguage.settings.dialog_Ok+'</b></button>', async function (instance, toast) {
							let index = e.target.closest('.backup-actions').dataset.index
							let timestamp = e.target.closest('.backup-actions').dataset.timestamp
							jsonBackups.auto.splice(index,1)
							//store
							await chrome.storage.local.set({"upStartBackups": JSON.stringify(jsonBackups)})
							//remove DOM
							document.getElementById('backup-timestamp-'+timestamp).remove()
							document.getElementById('backup-actions-'+timestamp).remove()				
							//message
							successMessage(jsonLanguage.settings.message_bkpDeleted)
							location.reload()
							instance.hide({ }, toast)
						}]
					]
				})
			}
			
			if (e.target.closest('.btn-actions-download')) {				
				let timestamp = e.target.closest('.backup-actions').dataset.timestamp
				let bkpData = JSON.parse(await LZString.decompress(jsonBackups['auto'].find(bkpItem => bkpItem.timestamp == timestamp).backupData))
				exportToFile(JSON.stringify(bkpData.data), JSON.stringify(bkpData.settings), JSON.stringify(bkpData.customImages))
			}		

			if (e.target.closest('.btn-actions-restore')) {				
				let timestamp = e.target.closest('.backup-actions').dataset.timestamp
				restoreBkp(JSON.parse(await LZString.decompress(jsonBackups['auto'].find(bkpItem => bkpItem.timestamp == timestamp).backupData)))
			}

			if (e.target.closest('.btn-actions-preview')) {				
				let timestamp = e.target.closest('.backup-actions').dataset.timestamp
				let bkpData = JSON.parse(await LZString.decompress(jsonBackups['auto'].find(bkpItem => bkpItem.timestamp == timestamp).backupData))
				
				let bkpPreview = document.getElementById('backup-preview')
				let bkpPreviewContent = document.getElementById('preview-content')

				bkpPreviewContent.innerHTML = ''
				bkpPreviewContent.innerHTML += await drawDOM(bkpData.data)

				bkpPreviewContent.addEventListener('click', (e) => { 
					if (e.target.matches('.top-nav-page')) {showPage(e.target.dataset.page)}
				})


				bkpPreview.addEventListener('click', (e) => { 
					if (e.target.matches('.backup-preview')) {
						bkpPreviewContent.style.display = 'none'				
						bkpPreview.style.display = 'none'
					}
				})


				bkpPreviewContent.style.display = 'block'				
				bkpPreview.style.display = 'flex'	
			}		

    })
    
		 manualBkp.addEventListener('click', async (e) => {
			let locale = localStorage.getItem('upStartSettings_language')
		
			switch (locale) {
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

			let date = new Date(Number(e.target.closest('.backup-actions').dataset.timestamp)) 
			let formattedDate = date.toLocaleString(localeJS, {dateStyle:'full', timeStyle:'medium'})

			if (e.target.closest('.btn-actions-delete')) {
				iziToast.show({
					theme: iziTheme,
					timeout: false,
					progressBar: false,
					overlay: true,
					closeOnEscape: true,
					close: false,
					backgroundColor: bgColor,    
					position: 'center',
					title: jsonLanguage.settings.dialog_deleteBkpTitle,					
					titleSize: '22',
					titleLineHeight: '30',
					titleColor: '#008200',		
					message: '<span class="highlight-text">'+formattedDate+'</span>',
					messageSize: '18',
					messageColor: 'white',		
					messageLineHeight: '20',			
					displayMode: 2,
					layout: 9,
					buttons: [
						['<button style="background-color: #a70e0e;">'+jsonLanguage.settings.dialog_Cancel+'</button>', function (instance, toast) {
							instance.hide({ }, toast)
						},true],
						['<button style="background-color: #38A12A;"><b>'+jsonLanguage.settings.dialog_Ok+'</b></button>', async function (instance, toast) {
							let index = e.target.closest('.backup-actions').dataset.index
							let timestamp = e.target.closest('.backup-actions').dataset.timestamp
							jsonBackups.manual.splice(index,1)
							//store
							await chrome.storage.local.set({"upStartBackups": JSON.stringify(jsonBackups)})
							//remove DOM
							document.getElementById('backup-timestamp-'+timestamp).remove()
							document.getElementById('backup-actions-'+timestamp).remove()				
							//message
							successMessage(jsonLanguage.settings.message_bkpDeleted)
							location.reload()
							instance.hide({ }, toast)
						}]						
					]
				})

			}

			if (e.target.closest('.btn-actions-download')) {				
				let timestamp = e.target.closest('.backup-actions').dataset.timestamp
				let bkpData = JSON.parse(await LZString.decompress(jsonBackups['manual'].find(bkpItem => bkpItem.timestamp == timestamp).backupData))
				exportToFile(JSON.stringify(bkpData.data), JSON.stringify(bkpData.settings), JSON.stringify(bkpData.customImages))
			}		

			if (e.target.closest('.btn-actions-restore')) {				
				let timestamp = e.target.closest('.backup-actions').dataset.timestamp
				restoreBkp(JSON.parse(await LZString.decompress(jsonBackups['manual'].find(bkpItem => bkpItem.timestamp == timestamp).backupData)))
			}			 

			if (e.target.closest('.btn-actions-preview')) {				
				let timestamp = e.target.closest('.backup-actions').dataset.timestamp
				let bkpData = JSON.parse(await LZString.decompress(jsonBackups['manual'].find(bkpItem => bkpItem.timestamp == timestamp).backupData))
				
				let bkpPreview = document.getElementById('backup-preview')
				let bkpPreviewContent = document.getElementById('preview-content')

				bkpPreviewContent.innerHTML = ''
				bkpPreviewContent.innerHTML += await drawDOM(bkpData.data)

				bkpPreviewContent.addEventListener('click', (e) => { 
					if (e.target.matches('.top-nav-page')) {showPage(e.target.dataset.page)}
				})


				bkpPreview.addEventListener('click', (e) => { 
					if (e.target.matches('.backup-preview')) {
						bkpPreviewContent.style.display = 'none'				
						bkpPreview.style.display = 'none'
					}
				})


				bkpPreviewContent.style.display = 'block'				
				bkpPreview.style.display = 'flex'	
			}						
				
		 })

		 
		 



		//event listeners
		//set page view event listeners
		document.getElementById("options").addEventListener('click', () => {showContainer("options")})
		document.getElementById("bookmarks").addEventListener('click', () => {showContainer("bookmarks")})
		document.getElementById("appearance").addEventListener('click', () => {showContainer("appearance")})
		document.getElementById("import-export").addEventListener('click', () => {showContainer	("import-export")})
    document.getElementById("actions").addEventListener('click', () => {showContainer("actions")})
    document.getElementById("uploads").addEventListener('click', () => {
      if (uploadsAssembled == false) { assembleUploads() }
      showContainer("uploads")
    })
		document.getElementById("backups").addEventListener('click', () => {showContainer("backups")})
		document.getElementById("sync").addEventListener('click', () => {showContainer("sync")})
		document.getElementById("about").addEventListener('click', () => {showContainer("about")})

		//set on-off fancy toggles event listener
		let inputFancyToggles = document.querySelectorAll('.input-fancy-toggle')
		for (i=0;i<inputFancyToggles.length;i++) { 
			inputFancyToggles[i].addEventListener("click", function(e){	
				e.stopPropagation()		 
				e.target.closest('.option-element').classList.toggle('on')
			 })
		}

		//event listener to hide image selectors
		document.getElementById("appearance-container").addEventListener('click', (e) => {		
    	if (!((e.target.closest('.image-selector-page-background')) || (e.target.closest('.image-selector-page-icon')))){
			let pageBgImg = document.getElementById('image-selector-page-background')			
			pageBgImg.style.overflowY = 'hidden'
			pageBgImg.style.height = '0px'
			setTimeout(function(){				
				pageBgImg.style.visibility = 'hidden'
				document.getElementById('image-selector-page-background').innerHTML = basePageBgImgHTML
			}, 700)
		
			let pageIconImg = document.getElementById('image-selector-page-icon')
			pageIconImg.style.height = '0px'
			pageIconImg.style.overflowY = 'hidden'
			setTimeout(function(){				
				pageIconImg.style.visibility = 'hidden'
				document.getElementById('image-selector-page-icon').innerHTML = basePageIconImgHTML
			}, 700)
			}
		})

		//image selector page background event listener
		document.getElementById('button-page-image-selector').addEventListener("click", async function(e){	
			e.stopPropagation()		
			let pageBgImg = document.getElementById('image-selector-page-background')
			if (pageBgImg.style.height == '450px') {				
				pageBgImg.style.overflowY = 'hidden'
				pageBgImg.style.height = '0px'				
				setTimeout(function(){					
					pageBgImg.style.visibility = 'hidden'
					document.getElementById('image-selector-page-background').innerHTML = basePageBgImgHTML
				}, 700)
			} else {				
				let result = await chrome.storage.local.get("upStartCustomImages")      
				let jsonCustomImages = JSON.parse(result.upStartCustomImages)
				
				for (i=0;i<jsonCustomImages.bgs.length;i++) { 
					let item = '<label data-img="'+jsonCustomImages.bgs[i]+'" data-value="'+jsonCustomImages.bgs[i]+'" class="page-bg-label"><input type="radio" name="pageBgImages" /><img src="'+jsonCustomImages.bgs[i]+'"/><span></span></label>'
					document.getElementById('image-selector-page-background').innerHTML += item
				}

				pageBgImg.style.visibility = 'visible'
				pageBgImg.style.height = '450px'
				setTimeout(function(){					
					pageBgImg.style.overflowY = 'auto'
				}, 700)				
			}
		})

		document.getElementById("image-selector-page-background").addEventListener('click', (e) => {
			if (e.target.closest('.page-bg-label')) {
				document.getElementById("page-image-selector").src = e.target.closest('.page-bg-label').dataset.img
				pageBgImageValue = e.target.closest('.page-bg-label').dataset.value

				let pageBgImg = document.getElementById('image-selector-page-background')
				pageBgImg.style.overflowY = 'hidden'
				pageBgImg.style.height = '0px'				
				setTimeout(function(){					
					pageBgImg.style.visibility = 'hidden'
					document.getElementById('image-selector-page-background').innerHTML = basePageBgImgHTML
				}, 700)
			}
		})

		//image selector page icon event listener
		document.getElementById('button-page-icon-selector').addEventListener("click", async function(e){	
			e.stopPropagation()
			let pageIconImg = document.getElementById('image-selector-page-icon')
			if (pageIconImg.style.height == '450px') {					
				pageIconImg.style.overflowY = 'hidden'
				pageIconImg.style.height = '0px'				
				setTimeout(function(){					
					pageIconImg.style.visibility = 'hidden'
					document.getElementById('image-selector-page-icon').innerHTML = basePageIconImgHTML
				}, 700)				
			} else {

				let result = await chrome.storage.local.get("upStartCustomImages")      
				let jsonCustomImages = JSON.parse(result.upStartCustomImages)
				
				for (i=0;i<jsonCustomImages.icons.length;i++) { 
					let item = '<label data-img="'+jsonCustomImages.icons[i]+'" data-value="'+jsonCustomImages.icons[i]+'" class="page-icon-label"><input type="radio" name="pageIconImages"/><img src="'+jsonCustomImages.icons[i]+'"/><span></span></label>'
					document.getElementById('image-selector-page-icon').innerHTML += item
				}
		
				pageIconImg.style.visibility = 'visible'				
				pageIconImg.style.height = '450px'
				setTimeout(function(){					
					pageIconImg.style.overflowY = 'auto'
				}, 700)
			}
		})

		document.getElementById("image-selector-page-icon").addEventListener('click', (e) => {
			if (e.target.closest('.page-icon-label')) {
				document.getElementById("page-icon-selector").src = e.target.closest('.page-icon-label').dataset.img
				pageIconImageValue = e.target.closest('.page-icon-label').dataset.value				

				let pageIconImg = document.getElementById('image-selector-page-icon')
				pageIconImg.style.overflowY = 'hidden'
				pageIconImg.style.height = '0px'				
				setTimeout(function(){					
					pageIconImg.style.visibility = 'hidden'
					document.getElementById('image-selector-page-icon').innerHTML = basePageIconImgHTML
				}, 700)				
			}
		})		
		
    //buttons event listeners 	
    document.getElementById("button-broken-links").addEventListener('click', brokenLinkIconChange)
		document.getElementById("button-broken-icons").addEventListener('click', brokenIconImgChange)
		document.getElementById("button-convert-icons").addEventListener('click', base64IconConversion)
		document.getElementById("button-import-settings").addEventListener('click', importFromFile)
		document.getElementById("button-export-settings").addEventListener('click', exportToFile)
		document.getElementById("button-browser-import").addEventListener('click', importBookmarks)
		document.getElementById("button-clear-settings").addEventListener('click', clearLoadDefault)


		//backup

		//create manual backup
		document.getElementById("make-backup-button").addEventListener('click', async () =>{
			iziToast.show({
				theme: iziTheme,
				timeout: false,
				progressBar: false,
				overlay: true,
				closeOnEscape: true,
				close: false,
				backgroundColor: bgColor,    
				position: 'center',
				title: jsonLanguage.settings.dialog_bkpCreateTitle,			
				titleSize: '22',
				titleLineHeight: '30',
				titleColor: '#008200',
				message: jsonLanguage.settings.dialog_bkpCreateMsg,
				messageSize: '18',
				messageColor: 'white',		
				messageLineHeight: '20',
				displayMode: 2,
				layout: 9,
				buttons: [
					['<button style="background-color: #a70e0e;">'+jsonLanguage.settings.dialog_Cancel+'</button>', function (instance, toast) {
						instance.hide({ }, toast)
					}],
					['<button style="background-color: #38A12A;"><b>'+jsonLanguage.settings.dialog_Ok+'</b></button>', async function (instance, toast) {
						instance.hide({ }, toast)
						toggleOverlay(true)
						let count = document.getElementById('spinner-count')
						count.style.display = 'none'

						await createBackup('manual')

						count.style.display = 'grid'
						toggleOverlay(false)

						successMessage('Backup created')
						
						location.reload()
					},true]
				]
			})
		})
		 		
		//sync
		document.getElementById("dropbox-save-token").addEventListener('click', dropboxSaveToken)
		document.getElementById("dropbox-disconnect").addEventListener('click', dropboxDisconnect)
		document.getElementById("dropbox-sync").addEventListener('click', dropboxSync)
		

		if ((localStorage.getItem("upStart_dbxToken")) && ((localStorage.getItem("upStart_dbxToken") != ''))) {
			document.getElementById("dropbox-connected-wrapper").style.display = 'block'
			document.getElementById("dropbox-disconnected-wrapper").style.display = 'none'
		}


		//save and load
		document.getElementById("save-settings").addEventListener('click', saveSettings)
		document.getElementById("load-settings").addEventListener('click', loadSettings)

		//adjustments
		//color pickr buttons size
		let pcrButtons = document.querySelectorAll('.pcr-button')
		for (i=0;i<pcrButtons.length;i++) { 
			pcrButtons[i].style.width = '80px'	
			pcrButtons[i].style.height = '80px'
			pcrButtons[i].style.boxShadow = '0px 3px 15px -10px #4a74c9'	
		}


    //show container
    if ((sessionOption == 'uploads') && (uploadsAssembled == false)) { assembleUploads() }
		showContainer(sessionOption)
		

		//show messages
		console.log("upStart_lastSettingsSuccessMsg: "+sessionStorage.getItem('upStart_lastSettingsSuccessMsg'))
		console.log("upStart_lastSettingsErrorMsg: "+sessionStorage.getItem('upStart_lastSettingsErrorMsg'))

		//success message
		if (sessionStorage.getItem('upStart_lastSettingsSuccessMsg')) {
			console.log("success msg")
			successMessage(sessionStorage.getItem('upStart_lastSettingsSuccessMsg'))
			//remove msgs
			sessionStorage.removeItem('upStart_lastSettingsSuccessMsg')
		}
		//error message
		if (sessionStorage.getItem('upStart_lastSettingsErrorMsg')) {
			console.log("error msg")
			errorMessage(sessionStorage.getItem('upStart_lastSettingsErrorMsg'))
			//remove msgs
			sessionStorage.removeItem('upStart_lastSettingsErrorMsg')
		}		


async function assembleUploads() {
		//uploads
		if (jsonCustomImages.icons.length > 0) { document.getElementById('container-item-wrapper-icon').style.display = 'block'; document.getElementById('noicons-message').style.display = 'none' }
		if (jsonCustomImages.bgs.length > 0) { document.getElementById('container-item-wrapper-bg').style.display = 'block'; document.getElementById('nobgs-message').style.display = 'none' }


    //icons
    let iconsGrid = document.getElementById('container-item-wrapper-icon')
    let icons = []

    for (i=0;i<jsonCustomImages.icons.length;i++) { icons.push(jsonCustomImages.icons[i]) }
    let iconsImgSelector = await createImageSelect(icons, false, false, 'icon')    
    iconsGrid.append(iconsImgSelector)

    let iconElements = document.querySelectorAll('.icon')
    for (i=0;i<iconElements.length;i++) { 
      let iconDeleteButton = document.createElement('BUTTON')    
      iconDeleteButton.className = "icon-delete-button"
      iconDeleteButton.id = "icon-delete-button-"+i
      iconDeleteButton.innerHTML = '<i class="context-menu-icon fas fa-trash"></i>'      
      iconElements[i].append(iconDeleteButton)    
    }
    iconsImgSelector.addEventListener('click', async (event) => {
      event.stopPropagation()
      if (!event.target.matches('.icon-img')) {
        deleteCustomImage(event.target.closest('.icon'), 'icon')
      } 
    })


    //icons upload
    document.getElementById('upload-image-icon').addEventListener('click', async (event) => {
      event.stopPropagation() 
      let fileType = /image.*/
      let inputIcon = document.getElementById('input-image-file-icon')

      let contentBuffer = await readFileAsync(inputIcon.files[0], fileType)
      if (contentBuffer) {
				toggleOverlay(true)
				let count = document.getElementById('spinner-count')
				count.style.display = 'none'

        let base64ImageData = await getBase64Image(contentBuffer, 128, 128)
				await addImageSelect(base64ImageData, 'icon', iconsGrid) 
				document.getElementById('noicons-message').style.display = 'none'
				document.getElementById('container-item-wrapper-icon').style.display = 'block'		
				inputIcon.value = null
				document.getElementById('iconFileLabel').style.color = 'white'

				toggleOverlay(false)
				count.style.display = 'grid'

      } else {
        errorMessage(jsonLanguage.shared.imageSelect_msgNofFile)             
      }

    })




    
    //bgs
    let bgsGrid = document.getElementById('container-item-wrapper-bg')    
    let bgs = []

    for (i=0;i<jsonCustomImages.bgs.length;i++) { bgs.push(jsonCustomImages.bgs[i]) }
    let bgsImgSelector = await createImageSelect(bgs, false, false, 'bg')
    bgsGrid.append(bgsImgSelector)

    let bgElements = document.querySelectorAll('.bg')
    for (i=0;i<bgElements.length;i++) { 
      let bgDeleteButton = document.createElement('BUTTON')    
      bgDeleteButton.className = "bg-delete-button"
      bgDeleteButton.id = "bg-delete-button-"+i
      bgDeleteButton.innerHTML = '<i class="context-menu-icon fas fa-trash"></i>'      
      bgElements[i].append(bgDeleteButton)    
    }

    bgsImgSelector.addEventListener('click', async (event) => {
      event.stopPropagation()
      if (!event.target.matches('.bg-img')) {
        deleteCustomImage(event.target.closest('.bg'), 'bg')      
      } 
    })

    //bgs upload
    document.getElementById('upload-image-bg').addEventListener('click', async (event) => {
      event.stopPropagation()
      console.log("ok") 
 
      let fileType = /image.*/
      let inputBg = document.getElementById('input-image-file-bg')

      let contentBuffer = await readFileAsync(inputBg.files[0], fileType)
      if (contentBuffer) {
				toggleOverlay(true)
				let count = document.getElementById('spinner-count')
				count.style.display = 'none'

        let base64ImageData = await getBase64Image(contentBuffer)
				await addImageSelect(base64ImageData, 'bg', bgsGrid)
				document.getElementById('nobgs-message').style.display = 'none'
				document.getElementById('container-item-wrapper-bg').style.display = 'block'
				inputBg.value = null
				document.getElementById('bgFileLabel').style.color = 'white'

				toggleOverlay(false)
				count.style.display = 'grid'

      } else {
        errorMessage(jsonLanguage.shared.imageSelect_msgNofFile)             
      }

    })
    
		uploadsAssembled = true
		



}

		//save settings
		async function saveSettings() {
			//button save active
			document.getElementById("save-settings").classList.add('active-green-button')	
			iziToast.show({
				theme: iziTheme,
				timeout: false,
				progressBar: false,
				overlay: true,
				overlayClose: true,
				closeOnEscape: true,
				close: false,
				backgroundColor: bgColor,    
				position: 'center',
				title: jsonLanguage.settings.dialog_saveSettingsTitle,
				titleSize: '22',
				titleLineHeight: '30',
				titleColor: '#008200',
				message: jsonLanguage.settings.dialog_saveSettingsMsg,
				messageSize: '18',
				messageColor: 'white',		
				messageLineHeight: '20',
				transitionIn: 'fadeIn',
				transitionOut: 'fadeOutDown',
				displayMode: 2,
				layout: 2,
				onClosing: function () { document.getElementById('save-settings').classList.remove('active-green-button') },
				buttons: [
					['<button style="background-color: #a70e0e;">'+jsonLanguage.settings.dialog_Cancel+'</button>', function (instance, toast) {
						document.getElementById("save-settings").classList.remove('active-green-button')
						instance.hide({ }, toast)
					}],
					['<button style="background-color: #38A12A;"><b>'+jsonLanguage.settings.dialog_Save+'</b></button>', async function (instance, toast) {
						//load current settings
						let result = await chrome.storage.local.get("upStartSettings")
						let jsonSettings = JSON.parse(result.upStartSettings)
						//get the changes
						//options
						jsonSettings.language = document.getElementById('language').value
						jsonSettings.groupsSort = document.getElementById('groups-sort').value
						jsonSettings.groupView = document.getElementById('group-view').value
						jsonSettings.pageColumns = document.getElementById('page-columns').value
						jsonSettings.rememberLastPage = document.getElementById('remember-page-check').checked
						jsonSettings.openLinksNewTab = document.getElementById('new-tab-check').checked
						jsonSettings.showContextMenu = document.getElementById('context-menu-check').checked
						jsonSettings.iconsBase64 = document.getElementById('base64-icons-check').checked
						//bookmark
						jsonSettings.itemIconSize = document.getElementById('icon-size').value
						jsonSettings.itemLabelFontSize = document.getElementById('font-size').value
						jsonSettings.itemLabelShowLines = document.getElementById('label-lines').value
						jsonSettings.itemLabelFontStyle = document.getElementById('font-style').value
						jsonSettings.itemLabelAlign = document.getElementById('label-alignment').value
						jsonSettings.hideItemLabels = document.getElementById('hide-labels-check').checked
						//appearance
						jsonSettings.theme = document.getElementById('theme').value
						jsonSettings.pageBgImage = pageBgImageValue
            console.log("pageBgImageValue: ",pageBgImageValue)
						jsonSettings.pageIcon = pageIconImageValue						
            console.log("pageIconImageValue: ",pageIconImageValue)
						if (pickrPageBg.getSelectedColor() == null) {jsonSettings.pageBgColor = 'theme'}
						else {jsonSettings.pageBgColor = pickrPageBg.getSelectedColor().toRGBA().toString(0)}
						if (pickrGroupFg.getSelectedColor() == null) {jsonSettings.groupFgColor = 'theme'}
						else {jsonSettings.groupFgColor = pickrGroupFg.getSelectedColor().toRGBA().toString(0)}												
						if (pickrGroupBg.getSelectedColor() == null) {jsonSettings.groupBgColor = 'theme'}
						else {jsonSettings.groupBgColor = pickrGroupBg.getSelectedColor().toRGBA().toString(0)}						
						if (pickrNavFg.getSelectedColor() == null) {jsonSettings.topNavFgColor = 'theme'}
						else {jsonSettings.topNavFgColor = pickrNavFg.getSelectedColor().toRGBA().toString(0)}
						if (pickrNavBg.getSelectedColor() == null) {jsonSettings.topNavBgColor = 'theme'}
						else {jsonSettings.topNavBgColor = pickrNavBg.getSelectedColor().toRGBA().toString(0)}
						console.log(jsonSettings)						

						//backups
						jsonSettings.autoBkpTime = document.getElementById('auto-backup-time').value
						jsonSettings.autoBkpMax = document.getElementById('auto-backup-max').value
						jsonSettings.manualBkpMax = document.getElementById('manual-backup-max').value

						await chrome.storage.local.set({"upStartSettings": JSON.stringify(jsonSettings)})
						
						document.getElementById("save-settings").classList.remove('active-green-button')
						instance.hide({ }, toast)
					},true]
				]
			})
		}

		async function loadSettings() {
			//button save active
			document.getElementById("load-settings").classList.add('active-red-button')
				
			iziToast.show({
				theme: iziTheme,
				timeout: false,
				progressBar: false,
				overlay: true,
				overlayClose: true,
				closeOnEscape: true,
				close: false,
				backgroundColor: bgColor,    
				position: 'center',
				title: jsonLanguage.settings.dialog_loadSettingsTitle,
				titleSize: '22',
				titleLineHeight: '30',
				titleColor: '#008200',
				message: jsonLanguage.settings.dialog_loadSettingsMsg,
				messageSize: '18',
				messageColor: 'white',		
				messageLineHeight: '20',
				transitionIn: 'fadeIn',
				transitionOut: 'fadeOutDown',
				displayMode: 2,
				layout: 2,
				onClosing: function () { document.getElementById('load-settings').classList.remove('active-red-button') },
				buttons: [
					['<button style="background-color: #a70e0e;">'+jsonLanguage.settings.dialog_Cancel+'</button>', function (instance, toast) {
						document.getElementById("load-settings").classList.remove('active-red-button')
						instance.hide({}, toast)
					},true],
					['<button style="background-color: #38A12A;"><b>'+jsonLanguage.settings.dialog_Load+'</b></button>', async function (instance, toast) {
  					let lang = localStorage.getItem('upStartSettings_language')
              console.log("######### DUMP #########: loadSettings -> lang", lang)
 	
						//jsonSettings
						const jsonDefaultSettings = chrome.runtime.getURL('js/upStartSettings.json')
						await fetch(jsonDefaultSettings)
						.then((response) => response.json())
						.then(async (json) => { 
							json.language = lang
							await chrome.storage.local.set({"upStartSettings": JSON.stringify(json)}) 
						})
						.catch(reason => console.log(reason.message))
					}]
				]
			})
		}



		async function importFromFile() {
			let inputFile = document.getElementById('inputFile')   
			let file = inputFile.files[0]
		
			//test null file
			if (typeof file === 'undefined' || file === null) {
				errorMessage(jsonLanguage.settings.message_selectFile)	
				return false
			}

			switch(file.type) {        
				case 'application/zip':  case 'application/x-zip-compressed':
					try {	
						const zip = await JSZip.loadAsync(inputFile.files[0])		
						let data = await zip.files['data.txt'].async('string')
						let settings = await zip.files['settings.txt'].async('string')
						let customImages = await zip.files['customImages.txt'].async('string')

						if (validJson(settings)) {
							let jsonSettings = JSON.parse(settings)	
							if (jsonSettings.app == "upStart") {
								iziToast.show({
									theme: iziTheme,
									timeout: false,
									progressBar: false,
									overlay: true,
									closeOnEscape: true,
									close: false,
									backgroundColor: bgColor,    
									position: 'center',
									title: jsonLanguage.settings.dialog_importFileTitle,
									titleSize: '22',
									titleLineHeight: '30',
									titleColor: '#008200',
									message: jsonLanguage.settings.dialog_importFileMsg,
									messageSize: '18',
									messageColor: 'white',		
									messageLineHeight: '20',
									image: '../icon/alert.svg',
									imageWidth: 96,
									transitionIn: 'fadeIn',
									transitionOut: 'fadeOutDown',
									displayMode: 2,
									layout: 9,
									buttons: [
										['<button style="background-color: #a70e0e;">'+jsonLanguage.settings.dialog_Cancel+'</button>', function (instance, toast) {
											instance.hide({ }, toast)
											document.getElementById('inputFile').value = ""
										},true],
										['<button style="background-color: #38A12A;"><b>'+jsonLanguage.settings.dialog_Ok+'</b></button>', async function (instance, toast) {
											await loadFromData(data,settings,customImages)	
											instance.hide({ }, toast)
											successMessage(jsonLanguage.settings.message_dataImported)
											location.reload()
										}]
									]
								})
							} else {
								errorMessage(jsonLanguage.settings.message_validBkpFile)
							}
						} else {
							errorMessage(jsonLanguage.settings.message_validBkp)
						}
					}
					catch(error) {
						errorMessage(jsonLanguage.settings.message_validBkp)
					}
				break
				case 'text/plain':
					try {
						let reader = new FileReader(file)		
						reader.onload = async function() {
							if (validJson(reader.result)) { 
								let jsonResult = JSON.parse(reader.result) 
								if (jsonResult.settings.version == "1.6") {									
									iziToast.show({
										theme: iziTheme,
										timeout: false,
										progressBar: false,
										overlay: true,
										closeOnEscape: true,
										close: false,
										backgroundColor: bgColor,    
										position: 'center',
										title: jsonLanguage.settings.dialog_importFileTitle,
										titleSize: '22',
										titleLineHeight: '30',
										titleColor: '#008200',
										message: jsonLanguage.settings.dialog_importFileOldVersionMsg+'<BR><span class="highlight-text">'+jsonLanguage.settings.dialog_importFileOldVersionWarn+'<span>',
										messageSize: '18',
										messageColor: 'white',		
										messageLineHeight: '20',
										image: '../icon/alert.svg',
										imageWidth: 96,
										transitionIn: 'fadeIn',
										transitionOut: 'fadeOutDown',
										displayMode: 2,
										layout: 9,
										buttons: [
											['<button style="background-color: #a70e0e;">'+jsonLanguage.settings.dialog_Cancel+'</button>', function (instance, toast) {
												instance.hide({ }, toast)
												document.getElementById('inputFile').value = ""
											},true],
											['<button style="background-color: #38A12A;"><b>'+jsonLanguage.settings.dialog_Ok+'</b></button>', async function (instance, toast) {
												await importFromOldVersion(jsonResult)
												instance.hide({ }, toast)
												successMessage(jsonLanguage.settings.message_dataImported)
												location.reload()
											}]											
										]
									})							
								} else if ((jsonResult.settings.version == "2.0") && (jsonResult.data) && (jsonResult.customImages)) {									
									iziToast.show({
										theme: iziTheme,
										timeout: false,
										progressBar: false,
										overlay: true,
										closeOnEscape: true,
										close: false,
										backgroundColor: bgColor,    
										position: 'center',
										title: jsonLanguage.settings.dialog_importFileTitle,
										titleSize: '22',
										titleLineHeight: '30',
										titleColor: '#008200',
										message: jsonLanguage.settings.dialog_importFileMsg,
										messageSize: '18',
										messageColor: 'white',		
										messageLineHeight: '20',
										image: '../icon/alert.svg',
										imageWidth: 96,
										transitionIn: 'fadeIn',
										transitionOut: 'fadeOutDown',
										displayMode: 2,
										layout: 9,
										buttons: [
											['<button style="background-color: #a70e0e;">'+jsonLanguage.settings.dialog_Cancel+'</button>', function (instance, toast) {
												instance.hide({ }, toast)
												document.getElementById('inputFile').value = ""
											},true],
											['<button style="background-color: #38A12A;"><b>'+jsonLanguage.settings.dialog_Ok+'</b></button>', async function (instance, toast) {
												console.log ("dbx version")
												await loadFromData(JSON.stringify(jsonResult.data),JSON.stringify(jsonResult.settings),JSON.stringify(jsonResult.customImages))
												instance.hide({ }, toast)
												successMessage(jsonLanguage.settings.message_dataImported)
												location.reload()
											}]											
										]
									})							
								} else {
									errorMessage(jsonLanguage.settings.message_validBkpFile)
								}
							}
							else { errorMessage(jsonLanguage.settings.message_validBkp) }
						}
						reader.readAsText(file)			
					}
					catch(error) {
						console.log(error)
					}
				break
				default:
					errorMessage(jsonLanguage.settings.message_textOrZip)
				break
			} 
		}
		

		async function exportToFile(jsonData,jsonSettings,jsonCustomImages) {
			toggleOverlay(true)
			let count = document.getElementById('spinner-count')
			count.style.display = 'none'

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
				
				//let fileTXT = new File(['{"data":'+jsonData+',"settings":'+jsonSettings+',"customImages":'+jsonCustomImages+'}'], 'upStart-'+formattedDate+'.txt', {type: "text/plain;charset=utf-8"})
				//saveAs(fileTXT)
		
				//compressed data
				//let file = new File([LZString.compressToUTF16('{"data":'+resultData.upStartData+',"settings":'+resultSettings.upStartSettings+',"customImages":'+resultCustomImages.upStartCustomImages+'}')], 'upStart-'+formattedDate+'.data', {type: "text/plain;charset=utf-8"})
				//saveAs(file)
		
				let zip = new JSZip()
				zip.file('data.txt', jsonData)
				zip.file('settings.txt', jsonSettings)
				zip.file('customImages.txt', jsonCustomImages)
				
				zip.generateAsync({type:"blob", compression: "DEFLATE"})
				.then(function(content) { saveAs(content, 'upStart-'+formattedDate+'.zip') })


				toggleOverlay(false)				
				count.style.display = 'grid'
		
				successMessage(jsonLanguage.settings.message_export)
		
			}
			catch (error) {
				console.log(error)
			}
		}


		async function importBookmarks() {
			let jsonData, jsonBookmarks
		 
			iziToast.show({
				id: 'importBookmarks',
				theme: iziTheme,
				backgroundColor: bgColor,
				timeout: false,
				progressBar: false,
				overlay: true,
				overlayClose: true,
				animateInside: true,
				closeOnEscape: true,
				close: false,		
				position: 'center',
				title: jsonLanguage.settings.dialog_importBookmarksTitle,
				titleSize: '22',
				titleLineHeight: '30',
				titleColor: '#008200',
				message: jsonLanguage.settings.dialog_importBookmarksMsg,
				messageSize: '18',
				messageColor: 'white',		
				messageLineHeight: '20',
				displayMode: 2,
				transitionIn: 'fadeIn',
				transitionOut: 'fadeOutDown',
				layout: 9,		
				buttons: [
					['<button style="background-color: #a70e0e;">'+jsonLanguage.settings.dialog_Cancel+'</button>', function (instance, toast) {
						instance.hide({}, toast)
					}],
					['<button style="background-color: #38A12A;"><b>'+jsonLanguage.settings.dialog_Ok+'</b></button>', async function (instance, toast) {	
						instance.hide({}, toast)
									
							let result = await chrome.storage.local.get("upStartData")
							jsonData = JSON.parse(result.upStartData)	
							let resultTree = await chrome.bookmarks.getTree()
							jsonBookmarks = resultTree[0].children
							console.log(jsonBookmarks)
		
							let inputBookmarks = ''
							for (let i=0;i<jsonBookmarks.length;i++) {
								inputBookmarks += '<input id="bookmark-select'+i+'" class="bookmark-select" checked="true" type="checkbox">'+jsonBookmarks[i].title+'</input><BR>'
							}		
		
							inputBookmarks += '<BR><input id="fetch-icons" class="bookmark-select" checked="true" type="checkbox"><span style="color: red">'+jsonLanguage.settings.dialog_importBookmarksSelectFetch+'</span></input>'
							
							//POLISH: IF iconsNotFetched = 0 { NOT NECESSARY }
		
							//message
							iziToast.show({
								theme: iziTheme,
								timeout: false,
								progressBar: false,
								overlay: true,
								close: false,
								backgroundColor: bgColor,    
								position: 'center',
								title: jsonLanguage.settings.dialog_importBookmarksSelectTitle,
								titleSize: '22',
								titleLineHeight: '30',
								titleColor: '#008200',
								message: inputBookmarks,
								messageSize: '18',
								messageColor: 'white',		
								messageLineHeight: '20',
								transitionIn: 'fadeIn',
								transitionOut: 'fadeOutDown',
								displayMode: 2,
								layout: 9,
								buttons: [
									['<button style="background-color: #a70e0e;">'+jsonLanguage.settings.dialog_Cancel+'</button>', function (instance, toast) {
										instance.hide({}, toast)
									}],
									['<button style="background-color: #38A12A;"><b>'+jsonLanguage.settings.dialog_Ok+'</b></button>', async function (instance, toast) {	
										instance.hide({}, toast)
		
										let iconFetch = bool(document.getElementById("fetch-icons").checked)
		
										let selectedBookmarks = []
		
		
										for (let s=0;s<jsonBookmarks.length;s++) {
											console.log(jsonBookmarks[s].title,' is ', document.getElementById("bookmark-select"+s).checked)	
											if (document.getElementById("bookmark-select"+s).checked) {	selectedBookmarks.push(s)	}                  
										}
				
										let baseID = Number(Date.now().toString())
										toggleOverlay(true)
										let count = document.getElementById("spinner-count")
										
		
										for (let s=0;s<selectedBookmarks.length;s++) {
		
												let index = selectedBookmarks[s]

												//create page
												console.log(jsonBookmarks[index].title)									
		
												let newPageObj = new Object()
												newPageObj.pageLabel = jsonBookmarks[index].title
												newPageObj.pageDescription = ""
												newPageObj.pageIcon = "theme"
												newPageObj.pageColumns = "auto"
												newPageObj.pageAutoColumns = "1"
												newPageObj.pageBgImage = "theme"
												newPageObj.pageBgColor  = "theme"
												newPageObj.columns = []
		
												
												
												if (jsonBookmarks[index].children) {                      
													await processBookmarks(jsonBookmarks[index].children, newPageObj.columns, jsonLanguage.settings.importBookmarks_RootGroup)
												}
												
												newPageObj.columns = await distributeGroups(newPageObj)
												newPageObj.pageAutoColumns = newPageObj.columns.length     								
		
												jsonData['pages'].push(newPageObj)	//push page to json
										}
		
		
										async function processBookmarks(bookmarks, column, groupTitle) {
											let newGroupObj
											
												//create group
												newGroupObj = new Object()
		
												newGroupObj.groupLabel = groupTitle
		
												newGroupObj.groupDescription = ""
												newGroupObj.groupIcon = "icon/bookmark.svg"
												newGroupObj.groupBgColor = "theme",
												newGroupObj.groupFgColor = "theme", 
												newGroupObj.groupSort = "auto"
												newGroupObj.groupView = "auto",
												newGroupObj.hideBookmarkLabels = "auto",
												newGroupObj.id = baseID.toString(),
												newGroupObj.items = []
												baseID++
												
											
											jsonData['groups'].push(newGroupObj) //push group to json									
											column.push(newGroupObj.id) //push group to column
		
											
											for (let i=0;i<bookmarks.length;i++) {
												if (bookmarks[i].children) {											
													await processBookmarks(bookmarks[i].children, column, bookmarks[i].title)
												} else {
													//create item
													let newItemObj = new Object()
													newItemObj.label = bookmarks[i].title
													newItemObj.description = ""
													newItemObj.url = bookmarks[i].url
		
													count.innerHTML = jsonLanguage.settings.dialog_countMsg+'<BR><span class="highlight-text">'+newItemObj.label+'</span>'
										
													if (iconFetch) {
														let favicon = await getFavIcon(newItemObj.url)
														if (favicon) { newItemObj.icon = favicon }
														else { newItemObj.icon = "icon/default.svg" }
													} else {
														newItemObj.icon = "icon/default.svg"
													}										
										
													newItemObj.id = baseID.toString()
													baseID++
													
													jsonData['items'].push(newItemObj) //push item to json											
													newGroupObj.items.push(newItemObj.id) //push item to group
												}
											}
										}
		
										console.log(jsonData)
										toggleOverlay(false)
										await chrome.storage.local.set({"upStartData": JSON.stringify(jsonData)})	
										
										successMessage(jsonLanguage.settings.message_dataSaved)
										console.log('Data saved')
									},true]									
								]
							})
					},true]					
				]
			})
		}


		//clear data load default data settings
		async function clearLoadDefault() {  
			console.log(jsonLanguage.settings.dialog_clearLoadMsg)
		  iziToast.show({
		    id: 'cleardefault',
				theme: iziTheme,
				backgroundColor: bgColor,
				timeout: false,
				progressBar: false,
				overlay: true,
				overlayClose: true,
				animateInside: true,
				closeOnEscape: true,
				close: false,		
		    position: 'center',
		    title: jsonLanguage.settings.dialog_clearLoadTitle,
		    titleSize: '22',
		    titleLineHeight: '30',
		    titleColor: '#008200',
		    message: jsonLanguage.settings.dialog_clearLoadMsg,
				messageSize: '18',
				messageColor: 'white',		
				messageLineHeight: '20',
		    displayMode: 2,
				transitionIn: 'fadeIn',
				transitionOut: 'fadeOutDown',
				layout: 9,
				buttons: [
					['<button style="background-color: #a70e0e;">'+jsonLanguage.settings.dialog_Cancel+'</button>', function (instance, 		toast) {
						instance.hide({}, toast)
					},true],
					['<button style="background-color: #38A12A;"><b>'+jsonLanguage.settings.dialog_Ok+'</b></button>', async function (instance, toast) {
							instance.hide({}, toast)		
							//are you sure?
							iziToast.show({
								theme: iziTheme,
								timeout: false,
								progressBar: false,
								overlay: true,
								closeOnEscape: true,
								close: false,
								backgroundColor: bgColor,    
								position: 'center',
								title: jsonLanguage.settings.dialog_areYouSureTitle,
								titleSize: '22',
								titleLineHeight: '30',
								titleColor: '#008200',
								message: jsonLanguage.settings.dialog_cannotRevert,
								messageSize: '18',
								messageColor: 'white',		
								messageLineHeight: '20',
								displayMode: 2,
								transitionIn: 'fadeIn',
								transitionOut: 'fadeOut',						
								layout: 2,
								buttons: [
									['<button style="background-color: #a70e0e;">'+jsonLanguage.settings.dialog_Abort+'</button>', function 		(instance, toast) {
										instance.hide({}, toast)		
									},true],
									['<button style="background-color: #38A12A;"><b>'+jsonLanguage.settings.dialog_Continue+'</b></button>', async 		function (instance, toast) {
										console.log("clear")
										await clearDropbox()
										await loadDefault()
										instance.hide({}, toast)
									}]									
								]
							})	
					}]					
				]
			})
		}

		//broken urls
		async function brokenLinkIconChange() {		
			let urlsFetched = 0
			let urlsNotFetched = 0
			iziToast.show({
			  id: 'brokenlinks',
				theme: iziTheme,
				backgroundColor: bgColor,
				timeout: false,
				progressBar: false,
				overlay: true,
				overlayClose: true,
				animateInside: true,
				closeOnEscape: true,
				close: false,		
			  position: 'center',
			  title: jsonLanguage.settings.dialog_brokenLinkTitle,
			  titleSize: '22',
				titleLineHeight: '30',
				titleColor: '#008200',
			  message: jsonLanguage.settings.dialog_brokenLinkMsg,
			  messageSize: '18',
			  messageColor: 'white',		
				messageLineHeight: '20',    
			  displayMode: 2,
			  image: '../img/broken.svg',
			  imageWidth: 96, 
			  displayMode: 2,
				transitionIn: 'fadeIn',
				transitionOut: 'fadeOutDown',
				layout: 9,		
				buttons: [
					['<button style="background-color: #a70e0e;">'+jsonLanguage.settings.dialog_Cancel+'</button>', function (instance, toast) {
						instance.hide({}, toast)
					}],
					['<button style="background-color: #38A12A;"><b>'+jsonLanguage.settings.dialog_Ok+'</b></button>', async function (instance, toast) {	
						instance.hide({}, toast)
						toggleOverlay(true)
						let count = document.getElementById("spinner-count")

						let jsonData	
						try {
							let result = await chrome.storage.local.get("upStartData")
							jsonData = JSON.parse(result.upStartData)																

							for (i = 0; i < jsonData['items'].length; i++) {
								console.log(jsonData.items[i].label)
								count.innerHTML = jsonLanguage.settings.dialog_countMsg+'<BR><span class="highlight-text">'+jsonData.items[i].label+'</span>'
								let itemUrl = jsonData.items[i].url

								try {
									let response = await fetchWithTimeout(itemUrl, 5000)

									if (response.status == 200) { 
									  urlsFetched++           
									} else {
									  jsonData.items[i].icon = 'img/broken.svg'
										urlsNotFetched++
									}									
								}
								catch (error) {		
									console.log('ERRO: ',error)
			            jsonData.items[i].icon = 'img/broken.svg'
									urlsNotFetched++                  
								}
								
							}				
							toggleOverlay(false)						
						
							if (urlsNotFetched != 0) {

								//message
								iziToast.show({
									theme: iziTheme,
									timeout: false,
									progressBar: false,
									overlay: true,
									closeOnEscape: true,
									close: false,
									backgroundColor: bgColor,    
									position: 'center',
									title: jsonLanguage.settings.dialog_scanComplete,  
									titleSize: '22',
									titleLineHeight: '30',
									titleColor: '#008200',
									message: '<BR><span class="highlight-text">'+urlsFetched+'</span> '+jsonLanguage.settings.dialog_brokenLinkFetched+
													 '<BR><span class="highlight-text">'+urlsNotFetched+'</span> '+jsonLanguage.settings.dialog_brokenLinkNotFetched,
									messageSize: '18',
									messageColor: 'white',		
									messageLineHeight: '20',
									displayMode: 2,
									image: '../img/broken.svg',
									imageWidth: 96, 
									transitionIn: 'fadeIn',
									transitionOut: 'fadeOutDown',
									layout: 2,
									buttons: [
										['<button style="background-color: #a70e0e;">'+jsonLanguage.settings.dialog_Abort+'</button>', function (instance, toast) {
											instance.hide({}, toast)
										}],
										['<button style="background-color: #38A12A;"><b>'+jsonLanguage.settings.dialog_Apply+'</b></button>', async function (instance, toast) {								
											await chrome.storage.local.set({"upStartData": JSON.stringify(jsonData)})	
											instance.hide({}, toast)
											successMessage(jsonLanguage.settings.message_dataSaved)
										},true]
									]
								})
							} else {
								//message
								iziToast.show({
									theme: iziTheme,
									timeout: false,
									progressBar: false,
									overlay: true,
									closeOnEscape: true,
									close: false,
									backgroundColor: bgColor,    
									position: 'center',
									title: jsonLanguage.settings.dialog_noBrokenLinks,  
									titleSize: '22',
									titleLineHeight: '30',
									titleColor: '#008200',
									displayMode: 2,
									transitionIn: 'fadeIn',
									transitionOut: 'fadeOutDown',
									layout: 2,
									buttons: [
										['<button style="background-color: #38A12A;">'+jsonLanguage.settings.dialog_Ok+'</button>', function (instance, toast) {
											instance.hide({}, toast)
										},true]
									]
								})
							}
						}
						catch (error) {
							console.log(error)
						}
					},true]					
				]
			})
		}


		//change broken link icons
		async function brokenIconImgChange() {	
			let iconsFetched = 0
			let iconsNotFetched = 0
		  iziToast.show({
		    id: 'brokenicons',
				theme: iziTheme,
				backgroundColor: bgColor,
				timeout: false,
				progressBar: false,
				overlay: true,
				overlayClose: true,
				animateInside: true,
				closeOnEscape: true,
				close: false,		
		    position: 'center',
		    title: jsonLanguage.settings.dialog_brokenIconTitle,
		    titleSize: '22',
		    titleLineHeight: '30',
				titleColor: 'white',
				titleColor: '#008200',
				message: jsonLanguage.settings.dialog_brokenIconMsg,
				messageSize: '18',
				messageColor: 'white',		
				messageLineHeight: '20',  
		    displayMode: 2,
		    image: '../img/broken-bookmark.svg',
		    imageWidth: 96,    
				transitionIn: 'fadeIn',
				transitionOut: 'fadeOutDown',
				layout: 9,		
				buttons: [
					['<button style="background-color: #a70e0e;">'+jsonLanguage.settings.dialog_Cancel+'</button>', function (instance, toast) {
						instance.hide({}, toast)
					}],
					['<button style="background-color: #38A12A;"><b>'+jsonLanguage.settings.dialog_Ok+'</b></button>', async function (instance, toast) {	
						instance.hide({}, toast)
						toggleOverlay(true)
						let count = document.getElementById("spinner-count")				
						let jsonData	

						try {
							let result = await chrome.storage.local.get("upStartData")
							jsonData = JSON.parse(result.upStartData)																					
													
							for (i = 0; i < jsonData['items'].length; i++) {
								count.innerHTML = jsonLanguage.settings.dialog_countMsg+'<BR><span class="highlight-text">'+jsonData.items[i].label+'</span>'
								let itemIcon = jsonData.items[i].icon								
							
								//verify url								
								if ( (itemIcon == "") || (itemIcon == 'undefined') ) {
									itemIcon = 'icon/default.svg'
								}

								if (itemIcon.toLowerCase().match(/^(icon\/|img\/|http:\/\/|https:\/\/|file:\/\/\/|data:image\/).*/) ) {

									try {
										console.log("######### DUMP #########: brokenIconImgChange -> itemIcon", itemIcon)
										let response = await fetchWithTimeout(itemIcon, 5000)
	
										if (response.status == 200) { 
											iconsFetched++           
										} else {
											jsonData.items[i].icon = 'img/broken-bookmark.svg'
											iconsNotFetched++
										}									
									}
									catch (error) {		
										console.log('ERRO: ',error)
										jsonData.items[i].icon = 'img/broken-bookmark.svg'
										iconsNotFetched++
									}

								} else {
									console.log('ERRO: NO PROTOCOL')
									jsonData.items[i].icon = 'img/broken-bookmark.svg'
									iconsNotFetched++   
								}

							}
		          toggleOverlay(false)
							
							if (iconsNotFetched != 0) {
								//message
								iziToast.show({
									theme: iziTheme,
									timeout: false,
									progressBar: false,
									overlay: true,
									closeOnEscape: true,
									close: false,
									backgroundColor: bgColor,    
									position: 'center',
									title: jsonLanguage.settings.dialog_scanComplete,
									titleSize: '22',
									titleLineHeight: '30',
									titleColor: '#008200',
									message: '<BR><span class="highlight-text">'+iconsFetched+'</span> '+jsonLanguage.settings.dialog_brokenIconFetched+
													 '<BR><span class="highlight-text">'+iconsNotFetched+'</span> '+jsonLanguage.settings.dialog_brokenIconNotFetched,
									messageSize: '18',
									messageColor: 'white',		
									messageLineHeight: '20',
									transitionIn: 'fadeIn',
									transitionOut: 'fadeOutDown',
									displayMode: 2,
									layout: 2,
									buttons: [
										['<button style="background-color: #a70e0e;">'+jsonLanguage.settings.dialog_Cancel+'</button>', function (instance, toast) {
											instance.hide({}, toast)
										}],
										['<button style="background-color: #38A12A;"><b>'+jsonLanguage.settings.dialog_Apply+'</b></button>', async function (instance, toast) {								
											await chrome.storage.local.set({"upStartData": JSON.stringify(jsonData)})	
											instance.hide({}, toast)
											successMessage(jsonLanguage.settings.message_dataSaved)
										},true]										
									]
								})
							} else {
								//message
								iziToast.show({
									theme: iziTheme,
									timeout: false,
									progressBar: false,
									overlay: true,
									closeOnEscape: true,
									close: false,
									backgroundColor: bgColor,    
									position: 'center',
									title: jsonLanguage.settings.dialog_noBrokenIcons,  
									titleSize: '22',
									titleLineHeight: '30',
									titleColor: '#008200',
									displayMode: 2,
									transitionIn: 'fadeIn',
									transitionOut: 'fadeOutDown',
									layout: 2,
									buttons: [
										['<button style="background-color: #38A12A;">'+jsonLanguage.settings.dialog_Ok+'</button>', function (instance, toast) {
											instance.hide({}, toast)
										},true]
									]
								})
							}
						}
						catch (error) {
							console.log(error)
						}
					},true]					
				]
			})
		}




		//convert icons to base64
		async function base64IconConversion() {	
			let iconsConverted = 0
			let iconsNotConverted = 0
			let iconsBase64 = 0
		  iziToast.show({
		    id: 'base64',
				theme: iziTheme,
				timeout: false,
				progressBar: false,
				overlay: true,
				overlayClose: true,
				animateInside: true,
				closeOnEscape: true,
				close: false,
		    backgroundColor: bgColor,    
		    position: 'center',
		    title: jsonLanguage.settings.dialog_convertIconTitle,
		    titleSize: '22',
		    titleLineHeight: '30',
		    titleColor: '#008200',
		    message: jsonLanguage.settings.dialog_convertIconMsg,
				messageSize: '18',
				messageColor: 'white',		
				messageLineHeight: '20',
		    displayMode: 2,
				transitionIn: 'fadeIn',
				transitionOut: 'fadeOutDown',
				layout: 9,
				buttons: [
					['<button style="background-color: #a70e0e;">'+jsonLanguage.settings.dialog_Cancel+'</button>', function (instance, toast) {
						instance.hide({ }, toast)
					}],
					['<button style="background-color: #38A12A;"><b>'+jsonLanguage.settings.dialog_Ok+'</b></button>', async function (instance, toast) {
						instance.hide({ }, toast)
						toggleOverlay(true)
						let count = document.getElementById("spinner-count")
						let jsonData	
						try {
		    			let result = await chrome.storage.local.get("upStartData")
							jsonData = JSON.parse(result.upStartData)							
						
							for (i = 0; i < jsonData['items'].length; i++) {
								count.innerHTML = jsonLanguage.settings.dialog_countMsg+'<BR><span class="highlight-text">'+jsonData.items[i].label+'</span>'
								let itemIcon = jsonData.items[i].icon
							
								//verify url								
								if ( (itemIcon == "") || (itemIcon == 'undefined') ) {
									itemIcon = 'icon/default.svg'
								}


								try {
									if (itemIcon.toLowerCase().match(/^data:image\/.*/)) {            
										iconsBase64++
									} else {
										let base64ImageData = await getBase64Image(itemIcon, 128, 128)
										jsonData.items[i].icon = base64ImageData
										iconsConverted++
									}
								}
								catch (error) {		
									console.log(error)			
									iconsNotConverted++
								}
							}					
							toggleOverlay(false)
						

							if (iconsConverted != 0) {
								//message
								iziToast.show({
									theme: iziTheme,
									timeout: false,
									progressBar: false,
									overlay: true,
									closeOnEscape: true,
									close: false,
									backgroundColor: bgColor,    
									position: 'center',						
									title: jsonLanguage.settings.dialog_convertIconComplete,
									titleSize: '22',
									titleLineHeight: '30',
									titleColor: '#008200',
									message: '<BR><span class="highlight-text">'+iconsConverted+'</span> '+jsonLanguage.settings.dialog_convertIconConverted+
									'<BR><span class="highlight-text">'+iconsNotConverted+'</span> '+jsonLanguage.settings.dialog_convertIconNotConverted+
									'<BR><span class="highlight-text">'+iconsBase64+'</span> '+jsonLanguage.settings.dialog_convertIconAlready64,
									messageSize: '18',
									messageColor: 'white',		
									messageLineHeight: '20',
									transitionIn: 'fadeIn',
									transitionOut: 'fadeOutDown',
									displayMode: 2,
									layout: 2,
									buttons: [
										['<button style="background-color: #a70e0e;">'+jsonLanguage.settings.dialog_Cancel+'</button>', function (instance, toast) {
											instance.hide({ }, toast)
										}],
										['<button style="background-color: #38A12A;"><b>'+jsonLanguage.settings.dialog_Apply+'</b></button>', async function (instance, toast) {								
											await chrome.storage.local.set({"upStartData": JSON.stringify(jsonData)})
											instance.hide({ }, toast)
											successMessage(jsonLanguage.settings.message_dataSaved)
										},true]									
									]
								})
							} else {
								//message
								iziToast.show({
									theme: iziTheme,
									timeout: false,
									progressBar: false,
									overlay: true,
									closeOnEscape: true,
									close: false,
									backgroundColor: bgColor,    
									position: 'center',
									title: jsonLanguage.settings.dialog_noIconsConverted,  
									titleSize: '22',
									titleLineHeight: '30',
									titleColor: '#008200',
									displayMode: 2,
									transitionIn: 'fadeIn',
									transitionOut: 'fadeOutDown',
									layout: 2,
									buttons: [
										['<button style="background-color: #38A12A;">'+jsonLanguage.settings.dialog_Ok+'</button>', function (instance, toast) {
											instance.hide({}, toast)
										},true]
									]
								})
							}
						}
						catch (error) {
							console.log(error)
						}				
					},true]					
				]
			})
		}




		function deleteCustomImage(element, type) {  
			let value = element.dataset.value
			if (type == 'bg') { imgWidth = 80 }
			else { imgWidth = 40 } 
		
			iziToast.show({
				theme: iziTheme,
				timeout: false,
				progressBar: false,
				overlay: true,
				closeOnEscape: true,
				close: false,
				backgroundColor: bgColor,    
				position: 'center',
				title: jsonLanguage.settings.dialog_deleteImageTitle,
				titleSize: '22',
				titleLineHeight: '30',
				titleColor: '#008200',
				image: value,
				imageWidth: imgWidth,
				transitionIn: 'fadeIn',
				transitionOut: 'fadeOutDown',
				displayMode: 2,
				layout: 9,
				buttons: [
					['<button style="background-color: #a70e0e;">'+jsonLanguage.settings.dialog_Cancel+'</button>', function (instance, toast) {
						instance.hide({ }, toast)
					},true],
					['<button style="background-color: #38A12A;"><b>'+jsonLanguage.settings.dialog_Ok+'</b></button>', async function (instance, toast) {
						let resultCustomImg = await chrome.storage.local.get("upStartCustomImages")
						let jsonCustomImages = JSON.parse(resultCustomImg.upStartCustomImages)
		
						if (type == 'bg') { jsonCustomImages.bgs.splice(jsonCustomImages.bgs.findIndex(img => img == value),1)  }
						else { jsonCustomImages.icons.splice(jsonCustomImages.icons.findIndex(img => img == value),1) }
						await chrome.storage.local.set({"upStartCustomImages": JSON.stringify(jsonCustomImages)})
						element.parentNode.removeChild(element)
						instance.hide({ }, toast)
					}]
				]
							})
		}



		function restoreBkp(jsonBkp) {
			iziToast.show({
				theme: iziTheme,
				timeout: false,
				progressBar: false,
				overlay: true,
				closeOnEscape: true,
				close: false,
				backgroundColor: bgColor,    
				position: 'center',
				title: jsonLanguage.settings.dialog_restoreBkpTitle,
				titleSize: '22',
				titleLineHeight: '30',
				titleColor: '#008200',	
				image: '../icon/alert.svg',
				imageWidth: 48,		
				transitionIn: 'fadeIn',
				transitionOut: 'fadeOutDown',
				displayMode: 2,
				layout: 1,
				buttons: [
					['<button style="background-color: #a70e0e;">'+jsonLanguage.settings.dialog_Cancel+'</button>', function (instance, toast) {
						instance.hide({ }, toast)
					},true],
					['<button style="background-color: #38A12A;"><b>'+jsonLanguage.settings.dialog_Ok+'</b></button>', async function (instance, toast) {
						await loadFromData(JSON.stringify(jsonBkp.data),JSON.stringify(jsonBkp.settings),JSON.stringify(jsonBkp.customImages))
						instance.hide({ }, toast)
					}]
				]
			})
		}





		/* DROPBOX */

		async function dropboxSaveToken() {
			let code = document.getElementById("dropbox-code").value

		
			if ((!code) || (code.trim().length < 5)) { errorMessage(jsonLanguage.settings.message_dbxInvalidCode) }
			else { 
				//overlay
				toggleOverlay(true)
				let count = document.getElementById('spinner-count')
				count.style.display = 'none'
			
				let dbxAppKey = 'pb82c8abics6xcp'
				let dbxAppSecret = 'zp6z78ekv7pu6zd'
				let dbxUrl = 'https://api.dropbox.com/oauth2/token'

				let formData = new FormData()
				let headers = new Headers() 

				//push data to form
				formData.append('code', code)
				formData.append('grant_type','authorization_code')
				headers.append('Authorization', 'Basic ' + btoa(dbxAppKey + ":" + dbxAppSecret))

				fetch (dbxUrl, {
				 method: 'POST',
				 headers: headers,
				 body: formData
				})
				.then((response) => response.json())
				.then(async (responseJson) => {
					toggleOverlay(false)
					if (responseJson.error) {				
						errorMessage(jsonLanguage.settings.message_error+': '+responseJson.error+'<br>'+jsonLanguage.settings.message_description+': '+responseJson.error_description) 
					} else if (responseJson.access_token) {
						localStorage.setItem('upStart_dbxToken', responseJson.access_token)
						localStorage.setItem('upStart_newChanges', 'false')		
						document.getElementById("dropbox-connected-wrapper").style.display = 'block'
						document.getElementById("dropbox-disconnected-wrapper").style.display = 'none'  

						successMessage(jsonLanguage.settings.message_dbxConnected) 
						dropboxFirstSync()
					} else {				
						errorMessage(jsonLanguage.settings.message_wrong) 
					}
				})
				.catch((error) => {
					console.error(error)
					toggleOverlay(false)
					errorMessage(jsonLanguage.settings.message_error+': '+error) 
				})
				.finally(() => {
					count.style.display = 'grid'					
				})				
			}  
		}

		
		//dropbox first sync
		async function dropboxFirstSync() { 

			let ACCESS_TOKEN = localStorage.getItem("upStart_dbxToken")
			let dbx = new Dropbox.Dropbox({ fetch:fetch, accessToken: ACCESS_TOKEN })	


			dbxReload = true
		
			await dbx.filesDownload({path: '/upStartDBX.txt'})
			.then(async function (response) {	
				if (await downloadDataFromDropbox(response)) {
					localStorage.setItem('upStart_dbxSync', 'true')			
					successMessage(jsonLanguage.settings.message_dbxSync)
					setTimeout(function(){
						dbxReload = false
						location.reload()
					}, 3000)
				} else {errorMessage(jsonLanguage.settings.message_dbxSyncFail)}					
			})
			.catch(async (error) => {
				try {
					let jsonError = JSON.parse(error.error)
					if (jsonError.error_summary.toLowerCase().includes("not_found")) {
						if (await uploadDataToDropbox()) {
							localStorage.setItem('upStart_dbxSync', 'true')
							successMessage(jsonLanguage.settings.message_dbxDataCreated)							
						} else {
							errorMessage(jsonLanguage.settings.message_dbxSyncFail)
						}
					}
				}
				catch(error) { errorMessage(jsonLanguage.settings.message_dbxSyncFail) }
			})	
		}


		//dropbox disconnect
		async function dropboxDisconnect() {  
		  iziToast.show({
		    id: 'dropboxDisconnect',
				theme: iziTheme,
				backgroundColor: bgColor,
				timeout: false,
				progressBar: false,
				overlay: true,
				overlayClose: true,
				animateInside: true,
				closeOnEscape: true,
				close: false,		
		    position: 'center',
		    title: jsonLanguage.settings.dialog_dbxDisconnectTitle,
		    titleSize: '22',
		    titleLineHeight: '30',
				titleColor: '#008200',
				message: jsonLanguage.settings.dialog_dbxDisconnectMsg,
				messageSize: '18',
				messageColor: 'white',		
				messageLineHeight: '20',
				transitionIn: 'fadeIn',
				transitionOut: 'fadeOutDown',
				displayMode: 2,
				layout: 9,
				buttons: [
					['<button style="background-color: #a70e0e;">'+jsonLanguage.settings.dialog_Cancel+'</button>', function (instance, toast) {
						instance.hide({}, toast)
					},true],
					['<button style="background-color: #38A12A;"><b>'+jsonLanguage.settings.dialog_Ok+'</b></button>', async function (instance, toast) {					
						clearDropbox()
						instance.hide({}, toast)
						successMessage(jsonLanguage.settings.message_dbxDisconnected)		
					}]
				]
			})
		}



		
	}
	catch (error) {
		console.log(error)
	}
}





    

function showContainer(item) {
	console.log(item)
	sessionStorage.setItem('upStart_settingsOption', item)

  let itemContents = document.querySelectorAll('.item-content')
  for (i=0;i<itemContents.length;i++) { itemContents[i].style.display = 'none' }

  let sideBarItems = document.querySelectorAll('.sidebar-item')
	for (i=0;i<sideBarItems.length;i++) { sideBarItems[i].classList.remove("active-item") }
	
	document.getElementById(item+'-container').style.display = 'block'
	document.getElementById(item).classList.add("active-item")
	if (item == 'about') {
		treats()
	}
}


function toggleOverlay(status) {
	let overlay = document.getElementById("spinner-wrapper-settings")
	if (status == true) { overlay.style.display = 'grid' }
	else { overlay.style.display = 'none' }
}


function clearDropbox() {
	localStorage.removeItem('upStart_dbxToken')
	localStorage.removeItem('upStart_newChanges')		
	localStorage.removeItem("upStart_dbxServerModified")
	localStorage.removeItem("upStart_dbxLastSync")
	localStorage.setItem("upStart_dbxSync", 'false')
	document.getElementById("dropbox-disconnected-wrapper").style.display = 'block' 
	document.getElementById("dropbox-connected-wrapper").style.display = 'none'	 		
}



//https://codepen.io/team/keyframers/pen/wvvoBQW
function treats(){
	//about page treats!
	let width = window.innerWidth
	let height = window.innerHeight
	const body = document.body
	const elButton = document.querySelector(".treat-button")
	const elWrapper = document.querySelector(".treat-wrapper")
	const treatmojis = ["🍬", "🍫", "🍭", "🍡", "🍩", "🍪", "🍒"]
	const treats = []
	const radius = 15	
	const Cd = 0.47 // Dimensionless
	const rho = 1.22 // kg / m^3
	const A = Math.PI * radius * radius / 10000; // m^2
	const ag = 9.81 // m / s^2
	const frameRate = 1 / 60
		
	animationLoop()
		
	elButton.addEventListener("click", addTreats)
	elButton.click()
		
	window.addEventListener("resize", () => {
		width = window.innerWidth
		height = window.innerHeight
	})

	function getRandomArbitrary(min, max) {
		return Math.random() * (max - min) + min
	}
		
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min
	}
		
	
	function createTreat() /* create a treat */ {
		const vx = getRandomArbitrary(-10, 10) // x velocity
		const vy = getRandomArbitrary(-10, 1)  // y velocity
		
		const el = document.createElement("div")
		el.className = "treat"
	
		const inner = document.createElement("span")
		inner.className = "inner"
		inner.innerText = treatmojis[getRandomInt(0, treatmojis.length - 1)]
		el.appendChild(inner)
		
		elWrapper.appendChild(el)
	
		const rect = el.getBoundingClientRect()	
		const lifetime = getRandomArbitrary(2000, 3000)

		el.style.setProperty("--lifetime", lifetime)
	
		const treat = {
			el,
			absolutePosition: { x: rect.left, y: rect.top },
			position: { x: rect.left, y: rect.top },
			velocity: { x: vx, y: vy },
			mass: 0.1, //kg
			radius: el.offsetWidth, // 1px = 1cm
			restitution: -.7,
			
			lifetime,
			direction: vx > 0 ? 1 : -1,
	
			animating: true,
	
			remove() {
				this.animating = false
				this.el.parentNode.removeChild(this.el)
			},
	
			animate() {
				const treat = this
				let Fx =
					-0.5 *
					Cd *
					A *
					rho *
					treat.velocity.x *
					treat.velocity.x *
					treat.velocity.x /
					Math.abs(treat.velocity.x)
				let Fy =
					-0.5 *
					Cd *
					A *
					rho *
					treat.velocity.y *
					treat.velocity.y *
					treat.velocity.y /
					Math.abs(treat.velocity.y)
	
				Fx = isNaN(Fx) ? 0 : Fx
				Fy = isNaN(Fy) ? 0 : Fy
	
				// Calculate acceleration ( F = ma )
				var ax = Fx / treat.mass
				var ay = ag + Fy / treat.mass
				// Integrate to get velocity
				treat.velocity.x += ax * frameRate
				treat.velocity.y += ay * frameRate
	
				// Integrate to get position
				treat.position.x += treat.velocity.x * frameRate * 100
				treat.position.y += treat.velocity.y * frameRate * 100
				
				treat.checkBounds()
				treat.update()
			},
			
			checkBounds() {	
				if (treat.position.y > height - treat.radius) {
					treat.velocity.y *= treat.restitution
					treat.position.y = height - treat.radius
				}
				if (treat.position.x > width - treat.radius) {
					treat.velocity.x *= treat.restitution
					treat.position.x = width - treat.radius
					treat.direction = -1
				}
				if (treat.position.x < treat.radius) {
					treat.velocity.x *= treat.restitution
					treat.position.x = treat.radius
					treat.direction = 1
				}	
			},
	
			update() {
				const relX = this.position.x - this.absolutePosition.x
				const relY = this.position.y - this.absolutePosition.y
	
				this.el.style.setProperty("--x", relX)
				this.el.style.setProperty("--y", relY)
				this.el.style.setProperty("--direction", this.direction)
			}
		}
	
		setTimeout(() => {
			treat.remove()
		}, lifetime)
	
		return treat
	}
	
	function animationLoop() {
		var i = treats.length
		while (i--) {
			treats[i].animate()
	
			if (!treats[i].animating) {
				treats.splice(i, 1)
			}
		}	
		requestAnimationFrame(animationLoop)
	}		
		
	function addTreats() {
		//cancelAnimationFrame(frame)
		if (treats.length > 40) {
			return
		}
		for (let i = 0; i < 10; i++) {
			treats.push(createTreat())
		}
	}
		
}





