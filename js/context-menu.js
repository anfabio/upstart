//page edit
async function pageEdit(pageID) {

  let pickrPageBgColor
  let oldPageColumns

  try {
    let result = await chrome.storage.local.get("upStartData")
    let jsonData = JSON.parse(result.upStartData)

    let resultCustomImg = await chrome.storage.local.get("upStartCustomImages")
    let jsonCustomImages = JSON.parse(resultCustomImg.upStartCustomImages)

    oldPageColumns = jsonData.pages[pageID].pageColumns
    const { value: formValues } = await Swal.fire({
      title: jsonLanguage.data.dialog_pageEdit,
      html:
        '<span class="swal2-label">'+jsonLanguage.data.dialog_Label+'</span>'+
        '<input id="swal-pageLabel" class="swal2-input" value="'+jsonData.pages[pageID].pageLabel+'">'+
        '<span class="swal2-label">'+jsonLanguage.data.dialog_Description+'</span>'+
        '<input id="swal-pageDescription" class="swal2-input"  value="'+jsonData.pages[pageID].pageDescription+'">'+

        '<span class="swal2-label">'+jsonLanguage.data.dialog_Icon+'</span>'+
        '<div class="swal2-grid-selector">'+
          '<input id="swal-page-icon" class="swal2-input" value="'+jsonData.pages[pageID].pageIcon+'">'+
        '<div class="swal2-icon-button-wrapper"><img id="swal-page-icon-button" class="swal2-icon-button" src=""></div></div>'+
        '</div>'+
        
        '<span class="swal2-label">'+jsonLanguage.data.dialog_Background+'</span>'+
        '<div class="swal2-grid-selector">'+
          '<input id="swal-page-bg" class="swal2-input" value="'+jsonData.pages[pageID].pageBgImage+'">'+
        '<div class="swal2-icon-button-wrapper"><img id="swal-page-bg-button" style="width:55px;height:38px;padding:2px;" class="swal2-icon-button" src=""></div></div>'+
        '</div>'+

        '<div class="swal2-grid">'+
          '<div style="display: block;">'+
            '<span class="swal2-label" style="height: 20px;">'+jsonLanguage.data.dialog_BgColor+'</span>'+
          '<div id="page-bg-color-picker" class="color-picker">'+
            '<button type="button" class="pcr-button" role="button" aria-label="toggle color picker dialog" style="width: 200px; color: rgb(66, 68, 90); ">'+
            '</button>'+
          '</div>'+
        '</div>'+
        '<div class="swal-option" style="display:block;">'+
          '<div class="swal-content-label"><span class="swal2-label">'+jsonLanguage.data.dialog_Columns+'</span></div>'+
          '<div><select class="swal2-select" id="swal-pageColumns" style="display: flex; width: 80px;">'+
            '<option value="auto">Auto</option>'+
            '<option value="1">1</option>'+
            '<option value="2">2</option>'+
            '<option value="3">3</option>'+
            '<option value="4">4</option>'+
            '<option value="5">5</option>'+
          '</select></div>'+
        '</div>'+
        '</div>',
      confirmButtonText: jsonLanguage.data.dialog_Ok,
      cancelButtonText: jsonLanguage.data.dialog_Cancel,
      showClass: {
        popup: 'animated fadeIn faster',
        icon: 'animated heartBeat delay-1s'
      },
      hideClass : {
        popup: 'swal2-hide',
        backdrop: 'swal2-backdrop-hide',
        icon: 'swal2-icon-hide'
      },
      focusConfirm: false,
      showCancelButton: true,
      onOpen: async function() {
        document.getElementById('swal-pageColumns').value = jsonData.pages[pageID].pageColumns
        let pageBgColor
        if (jsonData.pages[pageID].pageBgColor == 'theme') {pageBgColor = null}
        else {pageBgColor = jsonData.pages[pageID].pageBgColor}
        pickrPageBgColor = Pickr.create({
          el: '#page-bg-color-picker',
          theme: 'classic',
          default: pageBgColor,
          swatches: ['rgba(255, 255, 255, 1)','rgba(255, 255, 255, 0)','rgba(0, 0, 0, 1)','ffff88','b4b5ff','a5d2ff','rgba(204, 204, 221, 1)','eed5b7','9bcd9b','eee0e5','b0c4de','b2b2b2','rgba(255, 255, 221, 1)','rgba(221, 238, 255, 1)','rgba(221, 255, 221, 1)','rgba(255, 165, 165, 1)'],
          components: {preview:true,opacity: true,hue:true,interaction:{hex:true,rgba: true,input: true,clear:true,save: true}}	
        })
        .on('save', (color, instance) => {instance.hide()})
        
        //color picker
        let pickr = document.querySelectorAll('.pcr-button')
        for (i=0;i<pickr.length;i++) {
          pickr[i].style.width = '80px'
          pickr[i].style.height = '40px'
          pickr[i].style.boxShadow = '0px 2px 10px -10px #4a74c9'		
          pickr[i].style.marginTop = '25px'
          pickr[i].style.boxShadow = 'var(--sweetalert-box-shadow)'
        }

        //picker language
        let pickersTheme = document.getElementsByClassName('pcr-clear')
        for (i=0;i<pickersTheme.length;i++) {
          pickersTheme[i].value = jsonLanguage.shared.colorPicker_theme
        }
        let pickersSave = document.getElementsByClassName('pcr-save')
        for (i=0;i<pickersSave.length;i++) {
          pickersSave[i].value = jsonLanguage.shared.colorPicker_save
        }
        
        //icon picker        
        let images = ['img/theme.svg','img/block.svg','icon/addressbook.svg','icon/alarmclock.svg','icon/alert.svg','icon/android.svg','icon/bank.svg','icon/bars.svg','icon/basketball.svg','icon/blue-bookmark.svg','icon/board.svg','icon/bookmark.svg','icon/bookshelf.svg','icon/burger.svg','icon/calc.svg','icon/calendar2.svg','icon/checklist.svg','icon/circle-bookmark.svg','icon/clapperboard.svg','icon/creditcard.svg','icon/default.svg','icon/diagram2.svg','icon/diagram.svg','icon/dialog.svg','icon/diamond.svg','icon/document.svg','icon/drop.svg','icon/femaleprofile.svg','icon/file.svg','icon/flashdrive.svg','icon/flask.svg','icon/float.svg','icon/floppydisk.svg','icon/flower.svg','icon/folder.svg','icon/gallery.svg','icon/gameboy.svg','icon/gamepad.svg','icon/headphones.svg','icon/heart.svg','icon/hotdog.svg','icon/house.svg','icon/idcard.svg','icon/idea.svg','icon/key.svg','icon/lollipop.svg','icon/mail.svg','icon/maleprofile.svg','icon/map.svg','icon/medal.svg','icon/money.svg','icon/muffin.svg','icon/music.svg','icon/notes.svg','icon/pencil.svg','icon/picture.svg','icon/piechart.svg','icon/pizza.svg','icon/play.svg','icon/popcorn.svg','icon/presentation.svg','icon/pricetag.svg','icon/red-bookmark.svg','icon/safebox.svg','icon/sandclock.svg','icon/scissors.svg','icon/shield.svg','icon/shopping.svg','icon/shuttle.svg','icon/smartphone.svg','icon/speechbubble.svg','icon/store.svg','icon/sunflower.svg','icon/swissknife.svg','icon/target.svg','icon/teacup.svg','icon/trophy.svg','icon/umbrella.svg','icon/videoplayer.svg']
        
        for (i=0;i<jsonCustomImages.icons.length;i++) { images.push(jsonCustomImages.icons[i]) }
        
        let input = document.getElementById('swal-page-icon')
        let icon = document.getElementById('swal-page-icon-button')
  
        if (jsonData.pages[pageID].pageIcon == 'theme') { icon.src = 'img/theme.svg' }
        else if (jsonData.pages[pageID].pageIcon == '') { icon.src = 'img/block.svg' }
        else { icon.src = jsonData.pages[pageID].pageIcon }
        
        let imgSelector = await createImageSelect(images, input, icon, 'icon')
        input.closest('.swal2-container').append(imgSelector)
  
        document.getElementById('swal-page-icon-button').addEventListener('click', function(event){          
          if (imgSelector.style.width == '300px') {
            imgSelector.style.width = '0px'
            setTimeout(function(){imgSelector.style.visibility = 'hidden'}, 400)
          } else {
            imgSelector.style.visibility = 'visible'
            imgSelector.style.width = '300px'
          }
        })


        
        //background picker        
        let bgImages = ['img/theme.svg','img/block.svg','bg/autumn.jpg','bg/chamomile.jpg','bg/flower.jpg','bg/lemon.jpg','bg/lines.svg','bg/pencils.jpg','bg/stone.jpg','bg/tools.jpg','bg/umbrella.jpg','bg/water.jpg']
        for (i=0;i<jsonCustomImages.bgs.length;i++) { bgImages.push(jsonCustomImages.bgs[i]) }        
        
        let bgInput = document.getElementById('swal-page-bg')
        let bgImg = document.getElementById('swal-page-bg-button')
  
        if (jsonData.pages[pageID].pageBgImage == 'theme') { bgImg.src = 'img/theme.svg' }
        else if (jsonData.pages[pageID].pageBgImage == '') { bgImg.src = 'img/block.svg' }
        else { bgImg.src = jsonData.pages[pageID].pageBgImage }


        let bgImgSelector = await createImageSelect(bgImages, bgInput, bgImg, 'bg')        
        bgInput.closest('.swal2-container').append(bgImgSelector)
  
        document.getElementById('swal-page-bg-button').addEventListener('click', function(event){          
          if (bgImgSelector.style.width == '300px') {
            bgImgSelector.style.width = '0px'
            setTimeout(function(){bgImgSelector.style.visibility = 'hidden'}, 400)
          } else {
            bgImgSelector.style.visibility = 'visible'
            bgImgSelector.style.width = '300px'
          }
        })        
      },
      preConfirm: () => {
        let pageLabel = document.getElementById('swal-pageLabel').value
        let pageDescription = document.getElementById('swal-pageDescription').value
        let pageIcon = document.getElementById('swal-page-icon').value        
        let pageBgImage = document.getElementById('swal-page-bg').value   
        let pageColumns = document.getElementById('swal-pageColumns').value
        let pageBgColor
        if (pickrPageBgColor.getSelectedColor() == null) {pageBgColor = 'theme'}
        else {pageBgColor = pickrPageBgColor.getSelectedColor().toRGBA().toString(0)}

        if ((!pageLabel) || (pageLabel.trim().length==0)) {Swal.showValidationMessage(jsonLanguage.data.dialog_labelEmpty)}
        else {return [pageLabel,pageDescription,pageIcon,pageBgImage,pageColumns,pageBgColor]}
      }
    })

    if (formValues) {
      let pageLabel = formValues[0]
      let pageDescription = formValues[1]
      let pageIcon = formValues[2]
      let pageBgImage = formValues[3]
      let pageColumns = formValues[4]
      let pageBgColor = formValues[5]
      
      jsonData.pages[pageID].pageLabel = pageLabel
      jsonData.pages[pageID].pageDescription = pageDescription
      jsonData.pages[pageID].pageIcon = pageIcon
      jsonData.pages[pageID].pageBgImage = pageBgImage
      jsonData.pages[pageID].pageColumns = pageColumns
      jsonData.pages[pageID].pageBgColor = pageBgColor


      //distribute group into columns
      if (oldPageColumns != pageColumns) {
        jsonData.pages[pageID].columns = await distributeGroups(jsonData.pages[pageID], pageColumns)
        jsonData.pages[pageID].pageAutoColumns = jsonData.pages[pageID].columns.length
      }

      //store
      await chrome.storage.local.set({"upStartData": JSON.stringify(jsonData)})
      //message 
      sessionStorage.setItem('upStart_lastSuccessMsg', jsonLanguage.data.message_pageSaved.replace('{pageLabel}', '<span class="highlight-text">'+pageLabel+'</span>'))
    }  
  }
  catch(error) {
    console.log(error)
  }
}

//page add
async function pageAdd() {
  try {
    const { value: formValues } = await Swal.fire({
      title: jsonLanguage.data.dialog_AddPage,
      html:
        '<span class="swal2-label">'+jsonLanguage.data.dialog_Label+'</span>'+
        '<input id="swal-pageLabel" class="swal2-input">'+
        '<span class="swal2-label">'+jsonLanguage.data.dialog_Description+'</span>'+
        '<input id="swal-pageDescription" class="swal2-input">',
      confirmButtonText: jsonLanguage.data.dialog_Ok,
      cancelButtonText: jsonLanguage.data.dialog_Cancel,
      showClass: {
        popup: 'animated fadeIn faster',
        icon: 'animated heartBeat delay-1s'
      },
      hideClass : {
        popup: 'swal2-hide',
        backdrop: 'swal2-backdrop-hide',
        icon: 'swal2-icon-hide'
      },
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
          let pageLabel = document.getElementById('swal-pageLabel').value
          let pageDescription = document.getElementById('swal-pageDescription').value
          if ((!pageLabel) || (pageLabel.trim().length==0)) {Swal.showValidationMessage(jsonLanguage.data.dialog_labelEmpty)}
          else {return [pageLabel,pageDescription]}
      }
    })

    if (formValues) {
      let result = await chrome.storage.local.get("upStartData")
      let jsonData = JSON.parse(result.upStartData)      

      let pageLabel = formValues[0]
      let pageDescription = formValues[1] 
  
      let newPageObj = new Object()
      newPageObj.pageLabel = pageLabel
      newPageObj.pageDescription = pageDescription
      newPageObj.pageIcon = "theme"
      newPageObj.pageColumns = "auto"
      newPageObj.pageAutoColumns = "1"
      newPageObj.pageBgImage = "theme"
      newPageObj.pageBgColor  = "theme"
      newPageObj.columns = [[]]      

      jsonData['pages'].push(newPageObj)    

      //go to page
      sessionStorage.setItem('upStart_curPage', jsonData['pages'].length - 1)
            
      //store
      await chrome.storage.local.set({"upStartData": JSON.stringify(jsonData)})
      //message
      sessionStorage.setItem('upStart_lastSuccessMsg', jsonLanguage.data.message_pageCreated.replace('{pageLabel}', '<span class="highlight-text">'+pageLabel+'</span>'))
    }
  }
  catch(error) {
    console.log(error)
  }
}


//page copy
async function pageCopy(pageID) {
  try {
    let result = await chrome.storage.local.get("upStartData")
    let jsonData = JSON.parse(result.upStartData)    

    let oldLabel = jsonData.pages[pageID].pageLabel

    const { value: formValues } = await Swal.fire({
      title: jsonLanguage.data.dialog_pageCopy,
      html:
        '<span class="swal2-label">'+jsonLanguage.data.dialog_Label+'</span>'+
        '<input id="swal-pageLabel" class="swal2-input" value="'+jsonData.pages[pageID].pageLabel+'">' +
        '<span class="swal2-label">'+jsonLanguage.data.dialog_Description+'</span>'+
        '<input id="swal-pageDescription" class="swal2-input"  value="'+jsonData.pages[pageID].pageDescription+'">',
      confirmButtonText: jsonLanguage.data.dialog_Ok,
      cancelButtonText: jsonLanguage.data.dialog_Cancel,
      showClass: {
        popup: 'animated fadeIn faster',
        icon: 'animated heartBeat delay-1s'
      },
      hideClass : {
        popup: 'swal2-hide',
        backdrop: 'swal2-backdrop-hide',
        icon: 'swal2-icon-hide'
      },
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
          let pageLabel = document.getElementById('swal-pageLabel').value
          let pageDescription = document.getElementById('swal-pageDescription').value
          if ((!pageLabel) || (pageLabel.trim().length==0)) {Swal.showValidationMessage(jsonLanguage.data.dialog_labelEmpty)}
          else {return [pageLabel,pageDescription]}
      }
    })

    if (formValues) {
      let pageLabel = formValues[0]
      let pageDescription = formValues[1]
      let baseID = Number(Date.now().toString())
      
      let clonePage = JSON.parse(JSON.stringify(jsonData.pages[pageID]))
      clonePage.pageLabel = pageLabel
      clonePage.pageDescription = pageDescription



      //clone groups and items  
      for (columnID=0; columnID<clonePage.columns.length; columnID++) {
        let newGroups = []
        let columnGroups = clonePage.columns[columnID]        

        for (g = 0; g < columnGroups.length; g++) {
          let cloneGroup = JSON.parse(JSON.stringify(jsonData['groups'].find(group => group.id == columnGroups[g])))
          //let cloneGroup = jsonData['groups'].find(group => group.id == columnGroups[g])
          cloneGroup.id = baseID.toString();baseID++
          newGroups.push(cloneGroup.id)

          let newItems = []
          let groupItems = cloneGroup.items

          //bookmarks
          for (let i=0; i<groupItems.length; i++) {
            console.log(cloneGroup.groupLabel)
            console.log(groupItems[i])
            let cloneItem = JSON.parse(JSON.stringify(jsonData['items'].find(item => item.id == groupItems[i])))
            //let cloneItem = jsonData['items'].find(item => item.id == groupItems[i])
            cloneItem.id = baseID.toString()
            baseID++
            newItems.push(cloneItem.id)
            jsonData['items'].push(cloneItem)            
          }
          cloneGroup.items = newItems
          jsonData['groups'].push(cloneGroup)          
        }
        clonePage.columns[columnID] = newGroups
      }      
      jsonData['pages'].push(clonePage)
      console.log(jsonData)

      //go to page
      sessionStorage.setItem('upStart_curPage', jsonData['pages'].length - 1)

      //store
      await chrome.storage.local.set({"upStartData": JSON.stringify(jsonData)})
      //message
      let msg = jsonLanguage.data.message_pageCopied.replace('{oldPageLabel}', '<span class="highlight-text">'+oldLabel+'</span>')      
      sessionStorage.setItem('upStart_lastSuccessMsg', msg.replace('{pageLabel}', '<span class="highlight-text">'+pageLabel+'</span>'))
    }
  }
  catch(error) {
    console.log(error)
  }
}


//page delete
async function pageDelete(pageID) {
  try {
    let result = await chrome.storage.local.get("upStartData")
    let jsonData = JSON.parse(result.upStartData)
    
    if (jsonData ['pages'].length <= 1) {
      swal.fire({
        title: jsonLanguage.data.dialog_pageDeleteLastPageTitle,
        text: jsonLanguage.data.dialog_pageDeleteLastPageMsg,
        icon: 'error',
        confirmButtonText: jsonLanguage.data.dialog_Ok,
      })
    } else {
      let pageLabel = jsonData.pages[pageID].pageLabel
      swal.fire({
        title: jsonLanguage.data.dialog_pageDelete,
        html: jsonLanguage.data.dialog_pageDeleteMsg+'<span class="text-spot"> '+pageLabel+'</span>?',
        icon: 'question',
        showClass: {
        popup: 'animated fadeIn faster',
        icon: 'animated heartBeat delay-1s'
      },
      hideClass : {
        popup: 'swal2-hide',
        backdrop: 'swal2-backdrop-hide',
        icon: 'swal2-icon-hide'
      },
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: jsonLanguage.data.dialog_Ok,
        cancelButtonText: jsonLanguage.data.dialog_Cancel,
      }).then(async (result) => {
        if (result.value) {

          for (columnID=0; columnID<jsonData.pages[pageID].columns.length; columnID++) {
            
            let columnGroups = jsonData.pages[pageID].columns[columnID]

            for (g = 0; g < columnGroups.length; g++) {
              let groupItems = jsonData['groups'].find(group => group.id == columnGroups[g]).items

              for (i = 0; i < groupItems.length; i++) {
                //delete item
                jsonData['items'].splice(jsonData['items'].findIndex(item => item.id == groupItems[i]),1)
                
              }
              //delete group
              jsonData['groups'].splice(jsonData['groups'].findIndex(group => group.id == columnGroups[g]),1)
            }
          }
          //delete page
          jsonData.pages.splice(pageID,1)

          //session page handle
          if ((sessionStorage.getItem('upStart_curPage') != 0) && (sessionStorage.getItem('upStart_curPage') >= pageID)) {
            sessionStorage.setItem('upStart_curPage', sessionStorage.getItem('upStart_curPage') -1)
          }

          //local page handle
          if ((localStorage.getItem('upStart_lastPage') != 0) && (localStorage.getItem('upStart_lastPage') >= pageID)) {
            localStorage.setItem('upStart_lastPage', localStorage.getItem('upStart_lastPage') -1)
          }

          const upStartChannel_pageDeleted = new BroadcastChannel('upStartChannel_pageDeleted')
          upStartChannel_pageDeleted.postMessage(pageID)

          //store
          await chrome.storage.local.set({"upStartData": JSON.stringify(jsonData)})

          //message           
          sessionStorage.setItem('upStart_lastSuccessMsg', jsonLanguage.data.message_pageDeleted.replace('{pageLabel}', '<span class="highlight-text">'+pageLabel+'</span>'))
        }
      })
    }    
  }
  catch(error) {
    console.log(error)
  }
}


/******************** PAGE FUNCTIONS END ********************/






/******************** GROUP FUNCTIONS BEGIN ********************/

//group edit
async function groupEdit(groupID) {
 
  try {
    let result = await chrome.storage.local.get("upStartData")
    let jsonData = JSON.parse(result.upStartData)

    let resultCustomImg = await chrome.storage.local.get("upStartCustomImages")
    let jsonCustomImages = JSON.parse(resultCustomImg.upStartCustomImages)

    let group = jsonData['groups'].find(group => group.id == groupID)
    let oldSort = group.groupSort


		let groupsSortValues = ''    
    for (let [key, value] of Object.entries(jsonLanguage.data.dialog_groupsSortValues)) {groupsSortValues += '<option value="'+key+'">'+value+'</option>'}
    
		let groupsViewValues = ''    
    for (let [key, value] of Object.entries(jsonLanguage.data.dialog_groupsViewValues)) {groupsViewValues += '<option value="'+key+'">'+value+'</option>'}
    
		let groupsHideValues = ''    
    for (let [key, value] of Object.entries(jsonLanguage.data.dialog_groupsHideValues)) {groupsHideValues += '<option value="'+key+'">'+value+'</option>'}
    

    const { value: formValues } = await Swal.fire({
      title: jsonLanguage.data.dialog_groupEdit,
      html:
        '<span class="swal2-label">'+jsonLanguage.data.dialog_Label+'</span>'+
        '<input id="swal-groupLabel" value="'+group.groupLabel+'" class="swal2-input">'+
        '<span class="swal2-label">'+jsonLanguage.data.dialog_Description+'</span>'+
        '<input id="swal-groupDescription" value="'+group.groupDescription+'" class="swal2-input">'+
        '<span class="swal2-label">'+jsonLanguage.data.dialog_Icon+'</span>'+
        '<div class="swal2-grid-selector">'+
          '<input id="swal-group-icon" class="swal2-input" value="'+group.groupIcon+'">'+
        '<div class="swal2-icon-button-wrapper"><img id="swal-group-icon-button" class="swal2-icon-button" src=""></div></div>'+
        '</div>'+        
        '<div class="swal2-grid" style="margin-top: 20px; margin-bottom: 20px;">'+
          '<div style="display: block;">'+
            '<span class="swal2-label" style="height: 20px;">'+jsonLanguage.data.dialog_BgColor+'</span>'+
            '<div id="group-bg-color-picker" class="color-picker">'+
            '<button type="button" class="pcr-button" role="button" aria-label="toggle color picker dialog" style="width: 200px; color: rgb(66, 68, 90); ">'+
            '</button>'+            
            '</div>'+
          '</div>'+
          '<div style="display: block;">'+
            '<span class="swal2-label" style="height: 20px;">'+jsonLanguage.data.dialog_FgColor+'</span>'+
            '<div id="group-fg-color-picker" class="color-picker">'+
            '<button type="button" class="pcr-button" role="button" aria-label="toggle color picker dialog" style="width: 200px; color: rgb(66, 68, 90); ">'+
            '</button>'+
            '</div>'+
          '</div>'+
          
        '</div>'+

        '<div class="swal3-grid">'+          
        '<div class="swal-option">'+
          '<div class="swal-content-label"><span>'+jsonLanguage.data.dialog_SortOrder+'</span></div>'+
          '<div><select class="swal2-select" id="swal-groupSort" style="display: flex;">'+groupsSortValues+'</select></div>'+
        '</div>'+
        '<div class="swal-option">'+
          '<div class="swal-content-label"><span>'+jsonLanguage.data.dialog_groupView+'</span></div>'+
          '<div><select class="swal2-select" id="swal-groupView" style="display: flex; width: 80px;">'+groupsViewValues+'</select></div>'+
        '</div>'+
        '<div class="swal-option">'+
        '<div class="swal-content-label"><span>'+jsonLanguage.data.dialog_groupHide+'</span></div>'+
        '<div><select class="swal2-select" id="swal-groupHide" style="display: flex; width: 80px;">'+groupsHideValues+'</select></div>'+
      '</div>'+
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
      focusConfirm: false,
      showCancelButton: true,
      
      confirmButtonText: jsonLanguage.data.dialog_Ok,
      cancelButtonText: jsonLanguage.data.dialog_Cancel,
      onOpen: async function() {
        document.getElementById('swal-groupSort').value = group.groupSort
        document.getElementById('swal-groupView').value = group.groupView
        document.getElementById('swal-groupHide').value = group.hideBookmarkLabels

        let groupBgColor, groupFgColor
        if (group.groupBgColor == 'theme') {groupBgColor = null}
        else {groupBgColor = group.groupBgColor}
        if (group.groupFgColor == 'theme') {groupFgColor = null}
        else {groupFgColor = group.groupFgColor}

        pickrGroupBgColor = Pickr.create({
          el: '#group-bg-color-picker',
          theme: 'classic',
          default: groupBgColor,
          swatches: ['rgba(255, 255, 255, 1)','rgba(255, 255, 255, 0)','rgba(0, 0, 0, 1)','ffff88','b4b5ff','a5d2ff','rgba(204, 204, 221, 1)','eed5b7','9bcd9b','eee0e5','b0c4de','b2b2b2','rgba(255, 255, 221, 1)','rgba(221, 238, 255, 1)','rgba(221, 255, 221, 1)','rgba(255, 165, 165, 1)'],
          components: {preview:true,opacity: true,hue:true,interaction:{hex:true,rgba: true,input: true,clear:true,save: true}}	
        })
        .on('save', (color, instance) => {instance.hide()})

        pickrGroupFgColor = Pickr.create({
          el: '#group-fg-color-picker',
          theme: 'classic',
          default: groupFgColor,
          swatches: ['rgba(255, 255, 255, 1)','rgba(255, 255, 255, 0)','rgba(0, 0, 0, 1)','ffff88','b4b5ff','a5d2ff','rgba(204, 204, 221, 1)','eed5b7','9bcd9b','eee0e5','b0c4de','b2b2b2','rgba(255, 255, 221, 1)','rgba(221, 238, 255, 1)','rgba(221, 255, 221, 1)','rgba(255, 165, 165, 1)'],
          components: {preview:true,opacity: true,hue:true,interaction:{hex:true,rgba: true,input: true,clear:true,save: true}}	
        })
        .on('save', (color, instance) => {instance.hide()})
                  
        //color picker
        let pickr = document.querySelectorAll('.pcr-button')
        for (i=0;i<pickr.length;i++) {
          pickr[i].style.width = '80px'
          pickr[i].style.height = '40px'
          pickr[i].style.boxShadow = '0px 2px 10px -10px #4a74c9'		
          pickr[i].style.marginTop = '25px'
          pickr[i].style.boxShadow = 'var(--sweetalert-box-shadow)'
        }
        
        //picker language
        let pickersTheme = document.getElementsByClassName('pcr-clear')
        for (i=0;i<pickersTheme.length;i++) {
          pickersTheme[i].value = jsonLanguage.shared.colorPicker_theme
        }
        let pickersSave = document.getElementsByClassName('pcr-save')
        for (i=0;i<pickersSave.length;i++) {
          pickersSave[i].value = jsonLanguage.shared.colorPicker_save
        }

        //icon picker        
        let images = ['icon/addressbook.svg','icon/alarmclock.svg','icon/alert.svg','icon/android.svg','icon/bank.svg','icon/bars.svg','icon/basketball.svg','icon/blue-bookmark.svg','icon/board.svg','icon/bookmark.svg','icon/bookshelf.svg','icon/burger.svg','icon/calc.svg','icon/calendar2.svg','icon/checklist.svg','icon/circle-bookmark.svg','icon/clapperboard.svg','icon/creditcard.svg','icon/default.svg','icon/diagram2.svg','icon/diagram.svg','icon/dialog.svg','icon/diamond.svg','icon/document.svg','icon/drop.svg','icon/femaleprofile.svg','icon/file.svg','icon/flashdrive.svg','icon/flask.svg','icon/float.svg','icon/floppydisk.svg','icon/flower.svg','icon/folder.svg','icon/gallery.svg','icon/gameboy.svg','icon/gamepad.svg','icon/headphones.svg','icon/heart.svg','icon/hotdog.svg','icon/house.svg','icon/idcard.svg','icon/idea.svg','icon/key.svg','icon/lollipop.svg','icon/mail.svg','icon/maleprofile.svg','icon/map.svg','icon/medal.svg','icon/money.svg','icon/muffin.svg','icon/music.svg','icon/notes.svg','icon/pencil.svg','icon/picture.svg','icon/piechart.svg','icon/pizza.svg','icon/play.svg','icon/popcorn.svg','icon/presentation.svg','icon/pricetag.svg','icon/red-bookmark.svg','icon/safebox.svg','icon/sandclock.svg','icon/scissors.svg','icon/shield.svg','icon/shopping.svg','icon/shuttle.svg','icon/smartphone.svg','icon/speechbubble.svg','icon/store.svg','icon/sunflower.svg','icon/swissknife.svg','icon/target.svg','icon/teacup.svg','icon/trophy.svg','icon/umbrella.svg','icon/videoplayer.svg']
        
        for (i=0;i<jsonCustomImages.icons.length;i++) { images.push(jsonCustomImages.icons[i]) }

        let input = document.getElementById('swal-group-icon')
        let icon = document.getElementById('swal-group-icon-button')

        icon.src = group.groupIcon

        let imgSelector = await createImageSelect(images, input, icon, 'icon')
        input.closest('.swal2-container').append(imgSelector)

        document.getElementById('swal-group-icon-button').addEventListener('click', function(event){          
  	      if (imgSelector.style.width == '300px') {
		      	imgSelector.style.width = '0px'
		      	setTimeout(function(){imgSelector.style.visibility = 'hidden'}, 500)
		      } else {
		      	imgSelector.style.visibility = 'visible'
		      	imgSelector.style.width = '300px'
          }
        })

      },
      preConfirm: () => {
          let groupLabel = document.getElementById('swal-groupLabel').value
          let groupDescription = document.getElementById('swal-groupDescription').value
          let groupSort = document.getElementById('swal-groupSort').value
          let groupView = document.getElementById('swal-groupView').value
          let groupHide = document.getElementById('swal-groupHide').value
          let groupIcon = document.getElementById('swal-group-icon').value

          let groupBgColor, groupFgColor
          if (pickrGroupBgColor.getSelectedColor() == null) {groupBgColor = 'theme'}
          else {groupBgColor = pickrGroupBgColor.getSelectedColor().toRGBA().toString(0)}

          if (pickrGroupFgColor.getSelectedColor() == null) {groupFgColor = 'theme'}
          else {groupFgColor = pickrGroupFgColor.getSelectedColor().toRGBA().toString(0)}
          
          if ((!groupLabel) || (groupLabel.trim().length==0)) {Swal.showValidationMessage(jsonLanguage.data.dialog_labelEmpty)}
          else {return [groupLabel,groupDescription,groupSort,groupView,groupHide,groupIcon,groupBgColor,groupFgColor]}
      }
    })

    if (formValues) {
      console.log(formValues)
      group.groupLabel = formValues[0]
      group.groupDescription = formValues[1]
      group.groupSort = formValues[2]
      group.groupView = formValues[3]
      group.hideBookmarkLabels = formValues[4]
      group.groupIcon = formValues[5]
      group.groupBgColor = formValues[6]
      group.groupFgColor = formValues[7]

      if (oldSort != group.groupSort) {
        if ((group.groupSort != 'manual') && (group.groupSort != 'auto')){          
          group.items = sortGroup(group.items, group.groupSort, jsonData) 
        } else if ((group.groupSort == 'auto') && (localStorage.getItem('upStartSettings_groupsSort') != 'manual')) {
          group.items = sortGroup(group.items, localStorage.getItem('upStartSettings_groupsSort'), jsonData)
        }
      }  
  
      //store
      await chrome.storage.local.set({"upStartData": JSON.stringify(jsonData)})
      //message
      sessionStorage.setItem('upStart_lastSuccessMsg', jsonLanguage.data.message_groupSaved.replace('{groupLabel}', '<span class="highlight-text">'+formValues[0]+'</span>'))      
    }
  }
  catch(error) {
    console.log(error)
  }
}


//group add
async function groupAdd(pageID) {
  try {
    const { value: formValues } = await Swal.fire({
      title: jsonLanguage.data.dialog_AddGroup,
      html:
        '<span class="swal2-label">'+jsonLanguage.data.dialog_Label+'</span>'+
        '<input id="swal-groupLabel" class="swal2-input">' +
        '<span class="swal2-label">'+jsonLanguage.data.dialog_Description+'</span>'+
        '<input id="swal-groupDescription" class="swal2-input">',
      focusConfirm: false,
      confirmButtonText: jsonLanguage.data.dialog_Ok,
      cancelButtonText: jsonLanguage.data.dialog_Cancel,
      showClass: {
        popup: 'animated fadeIn faster',
        icon: 'animated heartBeat delay-1s'
      },
      hideClass : {
        popup: 'swal2-hide',
        backdrop: 'swal2-backdrop-hide',
        icon: 'swal2-icon-hide'
      },
      showCancelButton: true,
      preConfirm: () => {
          let groupLabel = document.getElementById('swal-groupLabel').value
          let groupDescription = document.getElementById('swal-groupDescription').value
          if ((!groupLabel) || (groupLabel.trim().length==0)) {Swal.showValidationMessage(jsonLanguage.data.dialog_labelEmpty)}
          else {return [groupLabel,groupDescription]}
      }
    })

    if (formValues) {
      let result = await chrome.storage.local.get("upStartData")
      let jsonData = JSON.parse(result.upStartData)

      let pageLabel = jsonData.pages[pageID].pageLabel  
      let groupLabel = formValues[0]
      let groupDescription = formValues[1]
  
      let newGroupObj = new Object()
      newGroupObj.groupLabel = groupLabel
      newGroupObj.groupDescription = groupDescription
      newGroupObj.groupIcon = "icon/bookmark.svg"
      newGroupObj.groupBgColor = "theme",
      newGroupObj.groupFgColor = "theme", 
      newGroupObj.groupSort = "auto"
      newGroupObj.groupView = "auto",
      newGroupObj.hideBookmarkLabels = "auto",
      newGroupObj.id = Date.now().toString(),
      newGroupObj.items = []
  
      jsonData.groups.push(newGroupObj)

      //push new group to first column
      jsonData.pages[pageID].columns[0].push(newGroupObj.id)

      //distribute group into columns
      if (jsonData.pages[pageID].pageColumns == "auto") {
        jsonData.pages[pageID].columns = await distributeGroups(jsonData.pages[pageID])
        jsonData.pages[pageID].pageAutoColumns = jsonData.pages[pageID].columns.length
      }

      //store
      await chrome.storage.local.set({"upStartData": JSON.stringify(jsonData)})

      //message
      let msg = jsonLanguage.data.message_groupCreated.replace('{pageLabel}', '<span class="highlight-text">'+pageLabel+'</span>')
      sessionStorage.setItem('upStart_lastSuccessMsg', msg.replace('{groupLabel}', '<span class="highlight-text">'+groupLabel+'</span>'))
    }
  }
  catch(error) {
    console.log(error)
  }
}


//group copy
async function groupCopy(groupID) { 
  try {
    let result = await chrome.storage.local.get("upStartData")
    let jsonData = JSON.parse(result.upStartData)

    let cloneGroup = JSON.parse(JSON.stringify(jsonData['groups'].find(group => group.id == groupID)))
    
    let inputPages = {}
    for (p = 0; p < jsonData['pages'].length; p++) { 
      inputPages[p] = jsonData.pages[p].pageLabel
    }
    let groupLabel = cloneGroup.groupLabel

      const {target: value} = await swal.fire({
      title: jsonLanguage.data.dialog_groupCopy,
      html: jsonLanguage.data.dialog_groupCopyMsg.replace('{groupLabel}', '<span class="highlight-text">'+groupLabel+'</span>')
      ,
      input: 'select',
      confirmButtonText: jsonLanguage.data.dialog_Ok,
      cancelButtonText: jsonLanguage.data.dialog_Cancel,
      showClass: {
        popup: 'animated fadeIn faster',
        icon: 'animated heartBeat delay-1s'
      },
      hideClass : {
        popup: 'swal2-hide',
        backdrop: 'swal2-backdrop-hide',
        icon: 'swal2-icon-hide'
      },
      inputOptions: inputPages,
      inputPlaceholder: jsonLanguage.data.dialog_selectPage,
      showCancelButton: true,
      inputValidator: async (target) => {
        if (!target) { return jsonLanguage.data.dialog_selectOptionError}
        else {
          let pageLabel = jsonData.pages[target].pageLabel 
          let baseID = Date.now().toString()
          cloneGroup.id = baseID;baseID++

          let newItems = []
          let groupItems = cloneGroup.items

          //bookmarks
          for (i = 0; i < groupItems.length; i++) {
            let cloneItem = JSON.parse(JSON.stringify(jsonData['items'].find(item => item.id == groupItems[i])))
            cloneItem.id = baseID.toString();baseID++            
            jsonData['items'].push(cloneItem)
            newItems.push(cloneItem.id)
          }

          cloneGroup.items = newItems
          jsonData.groups.push(cloneGroup)

          //push group
          jsonData.pages[target].columns[0].push(cloneGroup.id)

          //distribute group into columns
          if (jsonData.pages[target].pageColumns == "auto") {
            jsonData.pages[target].columns = await distributeGroups(jsonData.pages[target])
            jsonData.pages[target].pageAutoColumns = jsonData.pages[target].columns.length
          }          
          
          //store
          await chrome.storage.local.set({"upStartData": JSON.stringify(jsonData)})

          //message
          let msg = jsonLanguage.data.message_groupCopied.replace('{pageLabel}', '<span class="highlight-text">'+pageLabel+'</span>')
          sessionStorage.setItem('upStart_lastSuccessMsg', msg.replace('{groupLabel}', '<span class="highlight-text">'+groupLabel+'</span>'))    
        }
      }
    })
  }
  catch(error) {
    console.log(error)
  }
}


//group move
async function groupMove(groupID, columnID, pageID) {  

  try {
    let result = await chrome.storage.local.get("upStartData")
    let jsonData = JSON.parse(result.upStartData)

    let inputPages = {}
    for (p = 0; p < jsonData['pages'].length; p++) { 
      inputPages[p] = jsonData.pages[p].pageLabel
    }

    let groupLabel = jsonData['groups'].find(group => group.id == groupID).groupLabel

      const {target: selectedPage} = await swal.fire({
      title: jsonLanguage.data.dialog_groupMove,
      html: jsonLanguage.data.dialog_groupMoveMsg.replace('{groupLabel}', '<span class="highlight-text">'+groupLabel+'</span>'),
      input: 'select',
      confirmButtonText: jsonLanguage.data.dialog_Ok,
      cancelButtonText: jsonLanguage.data.dialog_Cancel,
      showClass: {
        popup: 'animated fadeIn faster',
        icon: 'animated heartBeat delay-1s'
      },
      hideClass : {
        popup: 'swal2-hide',
        backdrop: 'swal2-backdrop-hide',
        icon: 'swal2-icon-hide'
      },
      inputOptions: inputPages,
      inputPlaceholder: jsonLanguage.data.dialog_selectPage,
      showCancelButton: true,      
      inputValidator: async (target) => {
        if (!target) { return jsonLanguage.data.dialog_selectOptionError }
        else {
          let pageLabel = jsonData.pages[target].pageLabel

          //remove group from source
          jsonData.pages[pageID].columns[columnID].splice(jsonData.pages[pageID].columns[columnID].findIndex(group => group == groupID),1)          
          //distribute group into columns
          if (jsonData.pages[pageID].pageColumns == "auto") {
            jsonData.pages[pageID].columns = await distributeGroups(jsonData.pages[pageID])
            jsonData.pages[pageID].pageAutoColumns = jsonData.pages[pageID].columns.length
          }  

          //push group to target
          jsonData.pages[target].columns[0].push(groupID)
          //distribute group into columns
          if (jsonData.pages[target].pageColumns == "auto") {
            jsonData.pages[target].columns = await distributeGroups(jsonData.pages[target])
            jsonData.pages[target].pageAutoColumns = jsonData.pages[target].columns.length
          }  

          //store
          await chrome.storage.local.set({"upStartData": JSON.stringify(jsonData)})

          //message
          let msg = jsonLanguage.data.message_groupMoved.replace('{pageLabel}', '<span class="highlight-text">'+pageLabel+'</span>')
          sessionStorage.setItem('upStart_lastSuccessMsg', msg.replace('{groupLabel}', '<span class="highlight-text">'+groupLabel+'</span>'))   
        }
      }
    })
  }
  catch(error) {
    console.log(error)
  }
}

//group merge
async function groupMerge(groupID, columnID, pageID) { 
  try {
    let result = await chrome.storage.local.get("upStartData")
    let jsonData = JSON.parse(result.upStartData)   
    
    let sourceGroup = jsonData['groups'].find(group => group.id == groupID)
    let sourceGroupLabel = sourceGroup.groupLabel

    let inputGroups = {}
    for (p = 0; p < jsonData['pages'].length; p++) {
      let pageLabel = jsonData.pages[p].pageLabel
      for (c=0; c<jsonData.pages[p].columns.length; c++) {
        let columnGroups = jsonData.pages[p].columns[c]
        for (g = 0; g<columnGroups.length; g++) {   
          group = jsonData['groups'].find(group => group.id == columnGroups[g]) 
          if (group.id != groupID) {inputGroups[columnGroups[g]] = pageLabel+' :: '+group.groupLabel}
        }
      }      
    }

    const {target: selectedPage} = await swal.fire({
    title: jsonLanguage.data.dialog_groupMerge,
    html: jsonLanguage.data.dialog_groupMergeMsg.replace('{sourceGroupLabel}', '<span class="highlight-text">'+sourceGroupLabel+'</span>'),
    input: 'select',
    confirmButtonText: jsonLanguage.data.dialog_Ok,
    cancelButtonText: jsonLanguage.data.dialog_Cancel,
    inputOptions: inputGroups,
    showClass: {
        popup: 'animated fadeIn faster',
        icon: 'animated heartBeat delay-1s'
      },
      hideClass : {
        popup: 'swal2-hide',
        backdrop: 'swal2-backdrop-hide',
        icon: 'swal2-icon-hide'
      },
    inputPlaceholder: jsonLanguage.data.dialog_selectGroup,
    showCancelButton: true,
    inputValidator: async (target) => {
      if (!target) { return jsonLanguage.data.dialog_selectOptionError}
        else {   
          let targetGroup = jsonData['groups'].find(group => group.id == target)
          let targetGroupLabel = targetGroup.groupLabel

          //push item from source to target group
          for (i = 0; i<sourceGroup.items.length; i++) {   
            targetGroup['items'].push(sourceGroup.items[i])
          }

          //target group label
          targetGroup.groupLabel = sourceGroupLabel+' + '+targetGroup.groupLabel

          //remove group from source page
          jsonData.pages[pageID].columns[columnID].splice(jsonData.pages[pageID].columns[columnID].findIndex(group => group == sourceGroup),1)    
          //remove source group
          jsonData.groups.splice(jsonData.groups.findIndex(group => group.id == sourceGroup.id),1)                
          //distribute group into columns
          if (jsonData.pages[pageID].pageColumns == "auto") {
            jsonData.pages[pageID].columns = await distributeGroups(jsonData.pages[pageID])
            jsonData.pages[pageID].pageAutoColumns = jsonData.pages[pageID].columns.length
          }

          //sort
          if ((targetGroup.groupSort != 'manual') && (targetGroup.groupSort != 'auto')){
            targetGroup.items = sortGroup(targetGroup.items, targetGroup.groupSort, jsonData)
          } else if ((targetGroup.groupSort == 'auto') && (localStorage.getItem('upStartSettings_groupsSort') != 'manual')) {
            targetGroup.items = sortGroup(targetGroup.items, localStorage.getItem('upStartSettings_groupsSort'), jsonData)
          }

          //store
          await chrome.storage.local.set({"upStartData": JSON.stringify(jsonData)})

          //message
          let msg = jsonLanguage.data.message_groupMerged.replace('{targetGroupLabel}', '<span class="highlight-text">'+targetGroupLabel+'</span>')
          sessionStorage.setItem('upStart_lastSuccessMsg', msg.replace('{sourceGroupLabel}', '<span class="highlight-text">'+sourceGroupLabel+'</span>'))
        }
      }
    })
  }
  catch(error) {
    console.log(error)
  }   
}  



//group sort
async function groupSort(groupID) {
  try {
    let result = await chrome.storage.local.get("upStartData")
    let jsonData = JSON.parse(result.upStartData)

    let group = jsonData['groups'].find(group => group.id == groupID)  
    let groupLabel = group.groupLabel

    const {target: selectedSort} = await Swal.fire({
      title: jsonLanguage.data.dialog_groupSort,
      html: jsonLanguage.data.dialog_groupSortMsg.replace('{groupLabel}', '<span class="highlight-text">'+groupLabel+'</span>'),
      input: 'select',
      confirmButtonText: jsonLanguage.data.dialog_Ok,
      cancelButtonText: jsonLanguage.data.dialog_Cancel,
      showClass: {
        popup: 'animated fadeIn faster',
        icon: 'animated heartBeat delay-1s'
      },
      hideClass : {
        popup: 'swal2-hide',
        backdrop: 'swal2-backdrop-hide',
        icon: 'swal2-icon-hide'
      },
      inputOptions: jsonLanguage.data.dialog_groupsNewSortValues,
      inputPlaceholder: jsonLanguage.data.dialog_selectOption,
      showCancelButton: true,      
      inputValidator: async (order) => {
        if (!order) { return jsonLanguage.data.dialog_selectOptionError }
        else { 
          group.groupSort = order

          switch(order) {
            case 'az': case 'za':
              let items = []
              let newOrder = []  
              //array of arrays wiZth key(label) value(id)
              for (i = 0; i < group.items.length; i++) {            
                items[i] = [jsonData['items'].find(item => item.id == group.items[i]).label.toLowerCase(), group.items[i]]
              }  
              //sort array by key(label)
              order == 'az' ? items.sort() : items.sort().reverse()  
              //get new id order
              for (i = 0; i < items.length; i++) {            
                newOrder.push(items[i][1])
              }
              group.items = newOrder
              break
      
            case 'newest': case 'oldest':
              //sort array by key(label)
              order == 'newest' ? group.items.sort().reverse() : group.items.sort()
              break
          }
      
          //store
          await chrome.storage.local.set({"upStartData": JSON.stringify(jsonData)})
      
          //message  
          sessionStorage.setItem('upStart_lastSuccessMsg', jsonLanguage.data.message_groupSorted.replace('{groupLabel}', '<span class="highlight-text">'  +groupLabel+'</span>'))  

        }
      }
    })
  }
  catch(error) {
    console.log(error)
  }
}



//group open
async function groupOpen(groupID) {
  try {
    let result = await chrome.storage.local.get("upStartData")
    let jsonData = JSON.parse(result.upStartData)    
    let group = jsonData['groups'].find(group => group.id == groupID)

    Swal.fire({
      title: jsonLanguage.data.dialog_groupOpen,
      html: jsonLanguage.data.dialog_groupOpenMsg.replace('{groupItemsNumber}', '<span class="highlight-text">'+group.items.length+'</span>'),
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
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: jsonLanguage.data.dialog_Ok,
      cancelButtonText: jsonLanguage.data.dialog_Cancel,
    }).then((result) => {
      if (result.value) {
        for (i = 0; i < group.items.length; i++) {     
          chrome.tabs.create({ active: false, url: jsonData['items'].find(item => item.id == group.items[i]).url})  
        }
      }        
    })
  }
  catch(error) {
    console.log(error)
  }
}





//group delete
async function groupDelete(groupID, columnID, pageID) {
  console.log("groupDelete -> groupID, columnID, pageID", groupID, columnID, pageID)
  try {
    let result = await chrome.storage.local.get("upStartData")
    let jsonData = JSON.parse(result.upStartData)
    
    let group = jsonData['groups'].find(group => group.id == groupID)
    let groupLabel = group.groupLabel
    
    swal.fire({
      title: jsonLanguage.data.dialog_groupDelete,
      html: jsonLanguage.data.dialog_groupDeleteMsg.replace('{groupLabel}', '<span class="highlight-text">'+groupLabel+'</span>'),
      icon: 'question',
      showClass: {
        popup: 'animated fadeIn faster',
        icon: 'animated heartBeat delay-1s'
      },
      hideClass : {
        popup: 'swal2-hide',
        backdrop: 'swal2-backdrop-hide',
        icon: 'swal2-icon-hide'
      },
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: jsonLanguage.data.dialog_Ok,
      cancelButtonText: jsonLanguage.data.dialog_Cancel,
    })
    .then(async (result) => {
      if (result.value) {

        //remove bookmarks
        for (i = 0; i < group.items.length; i++) {
          jsonData['items'].splice(jsonData['items'].findIndex(item => item.id == group.items[i]),1)          
        }

        //delete group       
        jsonData['groups'].splice(jsonData['groups'].findIndex(group => group.id == groupID),1)

        //remove group from columns        
        jsonData.pages[pageID].columns[columnID].splice(jsonData.pages[pageID].columns[columnID].findIndex(group => group == groupID),1)

        //distribute group into columns
        if (jsonData.pages[pageID].pageColumns == "auto") {
          jsonData.pages[pageID].columns = await distributeGroups(jsonData.pages[pageID])
          jsonData.pages[pageID].pageAutoColumns = jsonData.pages[pageID].columns.length
        }

        //store
        await chrome.storage.local.set({"upStartData": JSON.stringify(jsonData)})
        //message   
        sessionStorage.setItem('upStart_lastSuccessMsg', jsonLanguage.data.message_groupDeleted.replace('{groupLabel}', '<span class="highlight-text">'+groupLabel+'</span>'))
      }
    })
  }
  catch(error) {
    console.log(error)
  }
}




  
/******************** GROUP FUNCTIONS END ********************/


/******************** ITEM FUNCTIONS BEGIN ********************/


//item add
async function itemAdd(groupID) {
  try {
    let result = await chrome.storage.local.get("upStartData")
    let jsonData = JSON.parse(result.upStartData)    

    let resultCustomImg = await chrome.storage.local.get("upStartCustomImages")
    let jsonCustomImages = JSON.parse(resultCustomImg.upStartCustomImages)

    const { value: formValues } = await Swal.fire({
      title: jsonLanguage.data.dialog_AddItem,
      html:
        '<span class="swal2-label">'+jsonLanguage.data.dialog_Label+'</span>'+
        '<input id="swal-itemLabel" class="swal2-input">' +
        '<span class="swal2-label">'+jsonLanguage.data.dialog_Description+'</span>'+
        '<input id="swal-itemDescription" class="swal2-input">'+
        '<span class="swal2-label">'+jsonLanguage.data.dialog_URL+'</span>'+
        '<input id="swal-itemURL" class="swal2-input">' +
        '<span class="swal2-label">'+jsonLanguage.data.dialog_Icon+'</span>'+
        '<div class="swal2-grid-selector">'+
          '<input id="swal-item-icon" class="swal2-input" value="icon/default.svg">'+
          '<div class="swal2-icon-button-wrapper"><img id="swal-item-icon-button" class="swal2-icon-button" src=""></div>'+
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
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: jsonLanguage.data.dialog_Ok,
      cancelButtonText: jsonLanguage.data.dialog_Cancel,
      onOpen: async function() {
        
        //icon picker        
        let images = ['icon/addressbook.svg','icon/alarmclock.svg','icon/alert.svg','icon/android.svg','icon/bank.svg','icon/bars.svg','icon/basketball.svg','icon/blue-bookmark.svg','icon/board.svg','icon/bookmark.svg','icon/bookshelf.svg','icon/burger.svg','icon/calc.svg','icon/calendar2.svg','icon/checklist.svg','icon/circle-bookmark.svg','icon/clapperboard.svg','icon/creditcard.svg','icon/default.svg','icon/diagram2.svg','icon/diagram.svg','icon/dialog.svg','icon/diamond.svg','icon/document.svg','icon/drop.svg','icon/femaleprofile.svg','icon/file.svg','icon/flashdrive.svg','icon/flask.svg','icon/float.svg','icon/floppydisk.svg','icon/flower.svg','icon/folder.svg','icon/gallery.svg','icon/gameboy.svg','icon/gamepad.svg','icon/headphones.svg','icon/heart.svg','icon/hotdog.svg','icon/house.svg','icon/idcard.svg','icon/idea.svg','icon/key.svg','icon/lollipop.svg','icon/mail.svg','icon/maleprofile.svg','icon/map.svg','icon/medal.svg','icon/money.svg','icon/muffin.svg','icon/music.svg','icon/notes.svg','icon/pencil.svg','icon/picture.svg','icon/piechart.svg','icon/pizza.svg','icon/play.svg','icon/popcorn.svg','icon/presentation.svg','icon/pricetag.svg','icon/red-bookmark.svg','icon/safebox.svg','icon/sandclock.svg','icon/scissors.svg','icon/shield.svg','icon/shopping.svg','icon/shuttle.svg','icon/smartphone.svg','icon/speechbubble.svg','icon/store.svg','icon/sunflower.svg','icon/swissknife.svg','icon/target.svg','icon/teacup.svg','icon/trophy.svg','icon/umbrella.svg','icon/videoplayer.svg']

        for (i=0;i<jsonCustomImages.icons.length;i++) { images.push(jsonCustomImages.icons[i]) }
        
        let input = document.getElementById('swal-item-icon')
        let icon = document.getElementById('swal-item-icon-button')

        icon.src = "icon/default.svg"
        let imgSelector = await createImageSelect(images, input, icon, 'icon')
        input.closest('.swal2-container').append(imgSelector)

        document.getElementById('swal-item-icon-button').addEventListener('click', function(event){          
  	      if (imgSelector.style.width == '300px') {
		      	imgSelector.style.width = '0px'
		      	setTimeout(function(){imgSelector.style.visibility = 'hidden'}, 500)
		      } else {
		      	imgSelector.style.visibility = 'visible'
		      	imgSelector.style.width = '300px'
          }
        })             
      },     
      preConfirm: () => {
          let itemLabel = document.getElementById('swal-itemLabel').value
          let itemDescription = document.getElementById('swal-itemDescription').value
          let itemURL = document.getElementById('swal-itemURL').value
          let itemIcon = document.getElementById('swal-item-icon').value
          
          if ((!itemLabel) || (itemLabel.trim().length == 0)) {Swal.showValidationMessage(jsonLanguage.data.dialog_labelEmpty)}
          else if ((!itemURL) || (itemURL.trim().length == 0)) {Swal.showValidationMessage(jsonLanguage.data.dialog_urlEmpty)}
          else {return [itemLabel,itemDescription,itemURL,itemIcon]}
      }
    })

    if (formValues) {
      let itemLabel = formValues[0]
      let itemDescription = formValues[1]
      let itemURL = formValues[2]
      let itemIcon = formValues[3]
  
      let newItemObj = new Object()
      newItemObj.label = itemLabel
      newItemObj.description = itemDescription
      newItemObj.url = itemURL
      newItemObj.icon = itemIcon
      newItemObj.id = Date.now().toString()
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
      let msg = jsonLanguage.data.message_itemCreated.replace('{groupLabel}', '<span class="highlight-text">'+groupLabel+'</span>')  
      sessionStorage.setItem('upStart_lastSuccessMsg', msg.replace('{itemLabel}', '<span class="highlight-text">'+itemLabel+'</span>'))
    }
  }
  catch(error) {
    console.log(error)
  }
}



//item add from create icon
async function itemAddPlus(pageID) {
  try {
    let result = await chrome.storage.local.get("upStartData")
    let jsonData = JSON.parse(result.upStartData)        

    let resultCustomImg = await chrome.storage.local.get("upStartCustomImages")
    let jsonCustomImages = JSON.parse(resultCustomImg.upStartCustomImages)

    //groups
    let inputGroups

    for (c=0; c<jsonData.pages[pageID].columns.length; c++) {
      for (g = 0; g<jsonData.pages[pageID].columns[c].length; g++) {          
        group = jsonData['groups'].find(group => group.id == jsonData.pages[pageID].columns[c][g])
        inputGroups += '<option value="'+group.id+'">'+group.groupLabel+'</option>'        
      } 
    }  

    if (!inputGroups) {errorMessage("Please create a group first")}
    else {

      const { value: formValues } = await Swal.fire({
        title: jsonLanguage.data.dialog_AddItem,
        html:
          '<span class="swal2-label">'+jsonLanguage.data.dialog_Label+'</span>'+
          '<input id="swal-itemLabel" class="swal2-input">' +
          '<span class="swal2-label">'+jsonLanguage.data.dialog_Description+'</span>'+
          '<input id="swal-itemDescription" class="swal2-input">'+
          '<span class="swal2-label">'+jsonLanguage.data.dialog_URL+'</span>'+
          '<input id="swal-itemURL" class="swal2-input">' +


          '<span class="swal2-label">'+jsonLanguage.data.dialog_Icon+'</span>'+
          '<div class="swal2-grid-selector">'+
            '<input id="swal-item-icon" class="swal2-input" value="icon/default.svg">'+
            '<div class="swal2-icon-button-wrapper"><img id="swal-item-icon-button" class="swal2-icon-button" src=""></div>'+
          '</div>'+
          


          '<span class="swal2-label">'+jsonLanguage.data.menu_groupHeader+'</span>'+            
          '<select class="swal2-select" id="swal-groupID" style="display: flex;"><option value="" disabled="" selected>'+jsonLanguage.data.dialog_selectGroup+'</option>'+inputGroups+'</select>',
        showClass: {
          popup: 'animated fadeIn faster',
          icon: 'animated heartBeat delay-1s'
        },
        hideClass : {
          popup: 'swal2-hide',
          backdrop: 'swal2-backdrop-hide',
          icon: 'swal2-icon-hide'
        },
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: jsonLanguage.data.dialog_Ok,
        cancelButtonText: jsonLanguage.data.dialog_Cancel,
        onOpen: async function() {
          
          //icon picker        
          let images = ['icon/addressbook.svg','icon/alarmclock.svg','icon/alert.svg','icon/android.svg','icon/bank.svg','icon/bars.svg','icon/basketball.svg','icon/blue-bookmark.svg','icon/board.svg','icon/bookmark.svg','icon/bookshelf.svg','icon/burger.svg','icon/calc.svg','icon/calendar2.svg','icon/checklist.svg','icon/circle-bookmark.svg','icon/clapperboard.svg','icon/creditcard.svg','icon/default.svg','icon/diagram2.svg','icon/diagram.svg','icon/dialog.svg','icon/diamond.svg','icon/document.svg','icon/drop.svg','icon/femaleprofile.svg','icon/file.svg','icon/flashdrive.svg','icon/flask.svg','icon/float.svg','icon/floppydisk.svg','icon/flower.svg','icon/folder.svg','icon/gallery.svg','icon/gameboy.svg','icon/gamepad.svg','icon/headphones.svg','icon/heart.svg','icon/hotdog.svg','icon/house.svg','icon/idcard.svg','icon/idea.svg','icon/key.svg','icon/lollipop.svg','icon/mail.svg','icon/maleprofile.svg','icon/map.svg','icon/medal.svg','icon/money.svg','icon/muffin.svg','icon/music.svg','icon/notes.svg','icon/pencil.svg','icon/picture.svg','icon/piechart.svg','icon/pizza.svg','icon/play.svg','icon/popcorn.svg','icon/presentation.svg','icon/pricetag.svg','icon/red-bookmark.svg','icon/safebox.svg','icon/sandclock.svg','icon/scissors.svg','icon/shield.svg','icon/shopping.svg','icon/shuttle.svg','icon/smartphone.svg','icon/speechbubble.svg','icon/store.svg','icon/sunflower.svg','icon/swissknife.svg','icon/target.svg','icon/teacup.svg','icon/trophy.svg','icon/umbrella.svg','icon/videoplayer.svg']
  
          for (i=0;i<jsonCustomImages.icons.length;i++) { images.push(jsonCustomImages.icons[i]) }
          
          let input = document.getElementById('swal-item-icon')
          let icon = document.getElementById('swal-item-icon-button')
  
          icon.src = "icon/default.svg"
          let imgSelector = await createImageSelect(images, input, icon, 'icon')
          input.closest('.swal2-container').append(imgSelector)
  
          document.getElementById('swal-item-icon-button').addEventListener('click', function(event){          
            if (imgSelector.style.width == '300px') {
              imgSelector.style.width = '0px'
              setTimeout(function(){imgSelector.style.visibility = 'hidden'}, 500)
            } else {
              imgSelector.style.visibility = 'visible'
              imgSelector.style.width = '300px'
            }
          })               
        },
        preConfirm: () => {
            let itemLabel = document.getElementById('swal-itemLabel').value
            let itemDescription = document.getElementById('swal-itemDescription').value
            let itemURL = document.getElementById('swal-itemURL').value
            let itemIcon = document.getElementById('swal-item-icon').value
            let groupID = document.getElementById('swal-groupID').value
            console.log("itemAddPlus -> groupID", groupID)

            if ((!itemLabel) || (itemLabel.trim().length == 0)) {Swal.showValidationMessage(jsonLanguage.data.dialog_labelEmpty)}
            else if ((!itemURL) || (itemURL.trim().length == 0)) {Swal.showValidationMessage(jsonLanguage.data.dialog_urlEmpty)}
            else if ((!groupID) || (groupID.trim().length == 0)) {Swal.showValidationMessage(jsonLanguage.data.dialog_selectGroup)}
            else {return [itemLabel,itemDescription,itemURL,itemIcon,groupID]}
        }
      })

      if (formValues) {
        let itemLabel = formValues[0]
        let itemDescription = formValues[1]
        let itemURL = formValues[2]
        let itemIcon = formValues[3]
        let groupID = formValues[4]

        let newItemObj = new Object()
        newItemObj.label = itemLabel
        newItemObj.description = itemDescription
        newItemObj.url = itemURL
        newItemObj.icon = itemIcon
        newItemObj.id = Date.now().toString()
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
        let msg = jsonLanguage.data.message_itemCreated.replace('{groupLabel}', '<span class="highlight-text">'+groupLabel+'</span>')  
        sessionStorage.setItem('upStart_lastSuccessMsg', msg.replace('{itemLabel}', '<span class="highlight-text">'+itemLabel+'</span>'))
      }
    }
  }
  catch(error) {
    console.log(error)
  }
}




//item open in new tab
async function openItemNewTab(itemID) {
  try {
    let result = await chrome.storage.local.get("upStartData")
    let jsonData = JSON.parse(result.upStartData)
    let string = jsonData['items'].find(item => item.id == itemID).url

    navigator.clipboard.writeText(string)
    .then(() => {
      console.log(string)
    })
    .catch(err => {
    })     
    chrome.tabs.create({ active: false, url: jsonData['items'].find(item => item.id == itemID).url })
  }
  catch(error) {
    console.log(error)
  }
}



//copy url to clipboard
async function copyUrlToClipboard(itemID) {
  try {
    let result = await chrome.storage.local.get("upStartData")
    let jsonData = JSON.parse(result.upStartData)
    navigator.clipboard.writeText(jsonData['items'].find(item => item.id == itemID).url)
  }
  catch(error) {
    console.log(error)
  }
}

//item edit
async function itemEdit(itemID, groupID) { 
  try {
    let result = await chrome.storage.local.get("upStartData")
    let jsonData = JSON.parse(result.upStartData)
  
    let resultCustomImg = await chrome.storage.local.get("upStartCustomImages")
    let jsonCustomImages = JSON.parse(resultCustomImg.upStartCustomImages)

    let item = jsonData['items'].find(item => item.id == itemID)
    let group = jsonData['groups'].find(group => group.id == groupID)

    const { value: formValues } = await Swal.fire({
      title: jsonLanguage.data.dialog_itemEdit,
      html:
        '<span class="swal2-label">'+jsonLanguage.data.dialog_Label+'</span>'+
        '<input id="swal-itemLabel" value="'+item.label+'" class="swal2-input">' +
        '<span class="swal2-label">'+jsonLanguage.data.dialog_Description+'</span>'+
        '<input id="swal-itemDescription" value="'+item.description+'" class="swal2-input">'+
        '<span class="swal2-label">'+jsonLanguage.data.dialog_URL+'</span>'+
        '<input id="swal-itemURL" value="'+item.url+'" class="swal2-input">' +

        '<span class="swal2-label">'+jsonLanguage.data.dialog_Icon+'</span>'+
        '<div class="swal2-grid-selector">'+
          '<input id="swal-item-icon" class="swal2-input" value="'+item.icon+'">'+
        '<div class="swal2-icon-button-wrapper"><img id="swal-item-icon-button" class="swal2-icon-button" src=""></div></div>'+
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
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: jsonLanguage.data.dialog_Ok,
      cancelButtonText: jsonLanguage.data.dialog_Cancel,
      onOpen: async function() {
        
        //icon picker        
        let images = ['icon/addressbook.svg','icon/alarmclock.svg','icon/alert.svg','icon/android.svg','icon/bank.svg','icon/bars.svg','icon/basketball.svg','icon/blue-bookmark.svg','icon/board.svg','icon/bookmark.svg','icon/bookshelf.svg','icon/burger.svg','icon/calc.svg','icon/calendar2.svg','icon/checklist.svg','icon/circle-bookmark.svg','icon/clapperboard.svg','icon/creditcard.svg','icon/default.svg','icon/diagram2.svg','icon/diagram.svg','icon/dialog.svg','icon/diamond.svg','icon/document.svg','icon/drop.svg','icon/femaleprofile.svg','icon/file.svg','icon/flashdrive.svg','icon/flask.svg','icon/float.svg','icon/floppydisk.svg','icon/flower.svg','icon/folder.svg','icon/gallery.svg','icon/gameboy.svg','icon/gamepad.svg','icon/headphones.svg','icon/heart.svg','icon/hotdog.svg','icon/house.svg','icon/idcard.svg','icon/idea.svg','icon/key.svg','icon/lollipop.svg','icon/mail.svg','icon/maleprofile.svg','icon/map.svg','icon/medal.svg','icon/money.svg','icon/muffin.svg','icon/music.svg','icon/notes.svg','icon/pencil.svg','icon/picture.svg','icon/piechart.svg','icon/pizza.svg','icon/play.svg','icon/popcorn.svg','icon/presentation.svg','icon/pricetag.svg','icon/red-bookmark.svg','icon/safebox.svg','icon/sandclock.svg','icon/scissors.svg','icon/shield.svg','icon/shopping.svg','icon/shuttle.svg','icon/smartphone.svg','icon/speechbubble.svg','icon/store.svg','icon/sunflower.svg','icon/swissknife.svg','icon/target.svg','icon/teacup.svg','icon/trophy.svg','icon/umbrella.svg','icon/videoplayer.svg']

        for (i=0;i<jsonCustomImages.icons.length;i++) { images.push(jsonCustomImages.icons[i]) }
        
        let input = document.getElementById('swal-item-icon')
        let icon = document.getElementById('swal-item-icon-button')

        icon.src = item.icon
        let imgSelector = await createImageSelect(images, input, icon, 'icon')
        input.closest('.swal2-container').append(imgSelector)

        document.getElementById('swal-item-icon-button').addEventListener('click', function(event){          
  	      if (imgSelector.style.width == '300px') {
		      	imgSelector.style.width = '0px'
		      	setTimeout(function(){imgSelector.style.visibility = 'hidden'}, 500)
		      } else {
		      	imgSelector.style.visibility = 'visible'
		      	imgSelector.style.width = '300px'
          }
        })
             
      },      
      preConfirm: () => {
          let itemLabel = document.getElementById('swal-itemLabel').value
          let itemDescription = document.getElementById('swal-itemDescription').value
          let itemURL = document.getElementById('swal-itemURL').value
          let itemIcon = document.getElementById('swal-item-icon').value
          
          if ((!itemLabel) || (itemLabel.trim().length == 0)) {Swal.showValidationMessage(jsonLanguage.data.dialog_labelEmpty)}
          else if ((!itemURL) || (itemURL.trim().length == 0)) {Swal.showValidationMessage(jsonLanguage.data.dialog_urlEmpty)}
          else {return [itemLabel,itemDescription,itemURL,itemIcon]}
      }
    })

    if (formValues) {
      console.log(formValues)
      item.label = formValues[0]
      item.description = formValues[1]
      item.url = formValues[2]
      item.icon = formValues[3]

      //sort
      if ((group.groupSort != 'manual') && (group.groupSort != 'auto')){
        group.items = sortGroup(group.items, group.groupSort, jsonData)   
      } else if ((group.groupSort == 'auto') && (localStorage.getItem('upStartSettings_groupsSort') != 'manual')) {
        group.items = sortGroup(group.items, localStorage.getItem('upStartSettings_groupsSort'), jsonData)
      }
      
      //store
      await chrome.storage.local.set({"upStartData": JSON.stringify(jsonData)})
      //message
      sessionStorage.setItem('upStart_lastSuccessMsg', jsonLanguage.data.message_itemSaved.replace('{itemLabel}', '<span class="highlight-text">'+formValues[0]+'</span>'))
    }
  }
  catch(error) {
    console.log(error)
  }   
}



//item copy
async function itemCopy(itemID) { 
  console.log("real")
  try {
    let result = await chrome.storage.local.get("upStartData")
    let jsonData = JSON.parse(result.upStartData)   

    let cloneItem = JSON.parse(JSON.stringify(jsonData['items'].find(item => item.id == itemID)))
    let itemLabel = cloneItem.label

    let inputGroups = {}

    for (p = 0; p < jsonData['pages'].length; p++) {
      let pageLabel = jsonData.pages[p].pageLabel
      for (c=0; c<jsonData.pages[p].columns.length; c++) {
        let columnGroups = jsonData.pages[p].columns[c]


        for (g = 0; g<columnGroups.length; g++) {   
          group = jsonData['groups'].find(group => group.id == columnGroups[g])          
          inputGroups[columnGroups[g]] = pageLabel+' :: '+group.groupLabel
        }
      }      
    }  

    const {target: selectedPage} = await swal.fire({
    title: jsonLanguage.data.dialog_itemCopy,
    html: jsonLanguage.data.dialog_itemCopyMsg.replace('{itemLabel}', '<span class="highlight-text">'+itemLabel+'</span>'),
    input: 'select',
    inputOptions: inputGroups,
    showClass: {
        popup: 'animated fadeIn faster',
        icon: 'animated heartBeat delay-1s'
      },
      hideClass : {
        popup: 'swal2-hide',
        backdrop: 'swal2-backdrop-hide',
        icon: 'swal2-icon-hide'
      },
    inputPlaceholder: jsonLanguage.data.dialog_selectGroup,
    showCancelButton: true,
    confirmButtonText: jsonLanguage.data.dialog_Ok,
    cancelButtonText: jsonLanguage.data.dialog_Cancel,
    inputValidator: async (target) => {
      if (!target) { return jsonLanguage.data.dialog_selectOptionError}
        else {   
          cloneItem.id = Date.now().toString()
          jsonData.items.push(cloneItem)
          
          let group = jsonData['groups'].find(group => group.id == target)
          let groupLabel = group.groupLabel     

          //add to group items
          group.items.push(cloneItem.id)

          //sort
          if ((group.groupSort != 'manual') && (group.groupSort != 'auto')){
            group.items = sortGroup(group.items, group.groupSort, jsonData)
          } else if ((group.groupSort == 'auto') && (localStorage.getItem('upStartSettings_groupsSort') != 'manual')) {
            group.items = sortGroup(group.items, localStorage.getItem('upStartSettings_groupsSort'), jsonData)
          }

          //store
          await chrome.storage.local.set({"upStartData": JSON.stringify(jsonData)})

          //message
          let msg = jsonLanguage.data.message_itemCopied.replace('{groupLabel}', '<span class="highlight-text">'+groupLabel+'</span>')  
          sessionStorage.setItem('upStart_lastSuccessMsg', msg.replace('{itemLabel}', '<span class="highlight-text">'+itemLabel+'</span>'))
        }
      }
    })
  }
  catch(error) {
    console.log(error)
  }   
}     



//item move
async function itemMove(itemID, groupID) { 
  try {
    let result = await chrome.storage.local.get("upStartData")
    let jsonData = JSON.parse(result.upStartData)   

    let item = jsonData['items'].find(item => item.id == itemID)
    let itemLabel = item.label    
    let inputGroups = {}

    for (p = 0; p < jsonData['pages'].length; p++) {
      let pageLabel = jsonData.pages[p].pageLabel
      for (c=0; c<jsonData.pages[p].columns.length; c++) {
        let columnGroups = jsonData.pages[p].columns[c]


        for (g = 0; g<columnGroups.length; g++) {   
          group = jsonData['groups'].find(group => group.id == columnGroups[g]) 
          if (group.id != groupID) {inputGroups[columnGroups[g]] = pageLabel+' :: '+group.groupLabel}
        }
      }      
    }

    const {target: selectedPage} = await swal.fire({
    title: jsonLanguage.data.dialog_itemMove,
    html: jsonLanguage.data.dialog_itemMoveMsg.replace('{itemLabel}', '<span class="highlight-text">'+itemLabel+'</span>'),
    input: 'select',
    inputOptions: inputGroups,
    showClass: {
        popup: 'animated fadeIn faster',
        icon: 'animated heartBeat delay-1s'
      },
      hideClass : {
        popup: 'swal2-hide',
        backdrop: 'swal2-backdrop-hide',
        icon: 'swal2-icon-hide'
      },
    inputPlaceholder: jsonLanguage.data.dialog_selectOption,
    showCancelButton: true,
    confirmButtonText: jsonLanguage.data.dialog_Ok,
    cancelButtonText: jsonLanguage.data.dialog_Cancel,
    inputValidator: async (target) => {
      if (!target) { return jsonLanguage.data.dialog_selectOptionError}
        else {   
          


          let sourceGroup = jsonData['groups'].find(group => group.id == groupID)

          let group = jsonData['groups'].find(group => group.id == target)
          let groupLabel = group.groupLabel

          //remove from source group items
          sourceGroup.items.splice(sourceGroup.items.findIndex(item => item == itemID),1)

          //add to group items
          group.items.push(item.id)

          //sort
          if ((group.groupSort != 'manual') && (group.groupSort != 'auto')){
            group.items = sortGroup(group.items, group.groupSort, jsonData)
          } else if ((group.groupSort == 'auto') && (localStorage.getItem('upStartSettings_groupsSort') != 'manual')) {
            group.items = sortGroup(group.items, localStorage.getItem('upStartSettings_groupsSort'), jsonData)
          }

          //store
          await chrome.storage.local.set({"upStartData": JSON.stringify(jsonData)})
          //message
          let msg = jsonLanguage.data.message_itemMoved.replace('{groupLabel}', '<span class="highlight-text">'+groupLabel+'</span>')  
          sessionStorage.setItem('upStart_lastSuccessMsg', msg.replace('{itemLabel}', '<span class="highlight-text">'+itemLabel+'</span>'))
        }
      }
    })
  }
  catch(error) {
    console.log(error)
  }   
}  




//item convert icon
async function itemConvertIcon(itemID) {
  try {
    let result = await chrome.storage.local.get("upStartData")
    let jsonData = JSON.parse(result.upStartData)

    let item = jsonData['items'].find(item => item.id == itemID)
    let itemLabel = item.label

    swal.fire({
      title: jsonLanguage.data.dialog_itemConvert,
      html: jsonLanguage.data.dialog_itemConvertMsg.replace('{itemLabel}', '<span class="highlight-text">'+itemLabel+'</span>'),
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
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: jsonLanguage.data.dialog_Ok,
      cancelButtonText: jsonLanguage.data.dialog_Cancel,
    }).then(async (result) => {
      if (result.value) {
        let itemIcon = item.icon

				//verify url								
				if ( (itemIcon == "") || (itemIcon == 'undefined') ) {
					itemIcon = 'icon/default.svg'
        }
        
				try {
					if (itemIcon.toLowerCase().match(/^data:image\/.*/)) {    
            console.log("base64")                  
						errorMessage(jsonLanguage.data.message_itemAlready64)
					} else {
            console.log("try base64")          
            let base64ImageData = await getBase64Image(itemIcon, 128, 128)
            console.log("itemConvertIcon -> base64ImageData", base64ImageData)
            item.icon = base64ImageData
          
            //message            
            sessionStorage.setItem('upStart_lastSuccessMsg', jsonLanguage.data.message_itemConverted)

        	  //store
            await chrome.storage.local.set({"upStartData": JSON.stringify(jsonData)})
					}
				}
				catch (error) {		
					errorMessage(jsonLanguage.data.message_itemNotConverted+'<span class="iziPage">'+error+'</span>')
				}        
      }
    }) 
  }
  catch(error) {
    console.log(error)
  }   
}



//item delete
async function itemDelete(itemID, groupID) { 
  console.log("itemDelete -> itemID, groupID", itemID, groupID)
  try {
    let result = await chrome.storage.local.get("upStartData")
    let jsonData = JSON.parse(result.upStartData)

    let item = jsonData['items'].find(item => item.id == itemID)
    let itemLabel = item.label

    console.log(itemLabel)
    swal.fire({
      title: jsonLanguage.data.dialog_itemDelete,
      html: jsonLanguage.data.dialog_itemDeleteMsg.replace('{itemLabel}', '<span class="highlight-text">'+itemLabel+'</span>'),
      icon: 'question',
      showClass: {
        popup: 'animated fadeIn faster',
        icon: 'animated heartBeat delay-1s'
      },
      hideClass : {
        popup: 'swal2-hide',
        backdrop: 'swal2-backdrop-hide',
        icon: 'swal2-icon-hide'
      },
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: jsonLanguage.data.dialog_Ok,
      cancelButtonText: jsonLanguage.data.dialog_Cancel,
    }).then(async (result) => {
      if (result.value) {

        let group = jsonData['groups'].find(group => group.id == groupID)

        //remove from group items
        group.items.splice(group.items.findIndex(item => item == itemID),1)

        //delete item       
        jsonData['items'].splice(jsonData['items'].findIndex(item => item.id == itemID),1)
        

        //store
        await chrome.storage.local.set({"upStartData": JSON.stringify(jsonData)})

        //message       
        sessionStorage.setItem('upStart_lastSuccessMsg', jsonLanguage.data.message_itemDeleted.replace('{itemLabel}', '<span class="highlight-text">'+itemLabel+'</span>'))


        console.log('que merda')
      }
    })
  }
  catch(error) {
    console.log(error)
  }
}