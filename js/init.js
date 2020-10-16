//set global variables for the session
sessionStorage.setItem('upStart_pageChange', 'false')
var jsonDataTmp = false
var saveMsg = false
var iziTheme = 'light'
var iziBgColor = '#fff'
var columnChangedPages = []
var SortableTopNav
var SortableLocked = false

let SortableColumns = []
let SortableGroups = []
let bookmarksDrag
let changePageDrag
let jsonLanguage
let language = localStorage.getItem('upStartSettings_language')
const sessionPage = sessionStorage.getItem('upStart_curPage')
console.log("sessionPage", sessionPage)
const lastPage = localStorage.getItem('upStart_lastPage')
console.log("lastPage", lastPage)

//session page handle
if (sessionPage) {currentPage = sessionPage; console.log("session")}
else if ((localStorage.getItem("upStartSettings_rememberLastPage") == "true") && lastPage) {currentPage = lastPage; console.log("last")}
else {currentPage = 0; console.log("zero")}

const upStartChannel_pageDeleted = new BroadcastChannel('upStartChannel_pageDeleted')

upStartChannel_pageDeleted.onmessage = function(e) {
  console.log("Channel Message")
  console.log(e.data)
  let deletedPage = e.data
  if ( (sessionPage != 0) && (sessionPage >= deletedPage) ) {
    sessionStorage.setItem('upStart_curPage', sessionPage -1)
  }
}


const upStartChannel_reset = new BroadcastChannel('upStartChannel_reset')

upStartChannel_reset.onmessage = function(e) {
  sessionStorage.setItem('upStart_curPage', 0)
  currentPage = 0
  location.reload()
}

//localStorage.setItem('upStart_dbxSync', 'true')
//localStorage.setItem('upStart_dbxUploading', 'false')

function allStorage() {
  console.log("storage variables")
    var values = [],
        keys = Object.keys(localStorage),
        i = keys.length
    while ( i-- ) {;     
      console.log(keys[i]+" : "+localStorage.getItem(keys[i]))
    }
}  
allStorage()

//first time     
if (localStorage.getItem('upStart_firstTime') === null) {     
  console.log("firstTime")

  document.body.setAttribute('data-theme', 'dark')
  document.getElementById('sweetalert2-theme').href = 'css/sweetalert2/dark.min.css'


  firstTime()      
} else {
  initialize(currentPage)
}


//force reload json data
//chrome.storage.local.clear(function() {console.log("Clear")})
//localStorage.clear()
//loadDefault()


async function initialize(currentPage) {  
  let result = await chrome.storage.local.get("upStartData")
  let jsonData = JSON.parse(result.upStartData)
  console.log("######### DUMP #########: initialize -> jsonData", jsonData)

  result = await chrome.storage.local.get("upStartSettings")
  let jsonSettings = JSON.parse(result.upStartSettings)
  console.log("######### DUMP #########: initialize -> jsonSettings", jsonSettings)   

  result = await chrome.storage.local.get("upStartLanguage")
  jsonLanguage = JSON.parse(result.upStartLanguage)
  console.log("######### DUMP #########: initialize -> jsonLanguage", jsonLanguage)  
 

  try {
    const domData = await chrome.storage.local.get("upStartDOM")
    console.log("######### DUMP #########: initialize -> domData", domData)
    
    //listen to changes on jsonData
    chrome.storage.onChanged.addListener(function(changes, namespace) {
      //if ((changes["upStartSettings"]) || (changes["upStartData"])) {}//location.reload()}
      //else if(changes["upStartSettings"]) {console.log("settings_changes");location.reload()}
      //location.reload()
      if ((changes["upStartSettings"]) || (changes["upStartDOM"])) {location.reload()}
      
      /*
      else if (changes["upStartDOM"]) {
        console.log(sessionStorage.getItem('upStart_saveLayoutCurrentPage'))
        if ((!sessionStorage.getItem('upStart_saveLayoutCurrentPage')) || (sessionStorage.getItem('upStart_saveLayoutCurrentPage') == 'false')) {             
          location.reload()
        } else {
          sessionStorage.setItem('upStart_saveLayoutCurrentPage', 'false')
        }
      }
      */
    })

    

    
    //set language      
	  let style = document.createElement("STYLE");		
	  style.innerText = '[lang='+jsonSettings.language+'] {display: block;}'
    document.body.appendChild(style)
        //force reDraw
    //console.log("reDraw")
    //let result = await chrome.storage.local.get("upStartData")
    //let jsonData = JSON.parse(result.upStartData)
    //let bodyContentDraw  = await drawDOM(jsonData)
    //document.body.innerHTML = bodyContentDraw

    //get from drawn data
    console.log("from drawn data")
    document.body.innerHTML = domData.upStartDOM
    
    
    console.log("Initial Page: "+currentPage)

    //Sortable NavLinks
    let topNavPages = document.getElementById('top-nav-list')
    SortableTopNav = new Sortable(topNavPages, { 
      group: 'navPages',
      revertOnSpill: true,
      //delay: 100,
      ghostClass: "nav-drag",      
      dragClass: "nav-drag",
      onStart: function (evt) {
        sessionStorage.setItem('upStart_pageChange', 'false')
      },
      onUpdate: function (evt) {
        evt.item.classList.add("nav-drag")
        pageDragSort(evt.item.id, evt.oldIndex, evt.newIndex)
      }
    })


    //Sortable Columns
    let Columns = document.getElementsByClassName("column")
      for (i=0;i<Columns.length;i++) {
        let SortableColumn = new Sortable(Columns[i], { 
        group: 'columns',
        revertOnSpill: true,
        //delay: 50,
        ghostClass: "group-drag",        
        dragClass: "group-drag",
        handle: ".handle",
        onStart: function (evt) {          
          sessionStorage.setItem('upStart_pageChange', 'true')
        },
        onAdd: function (evt) {
          console.log(evt) 
          evt.item.classList.add('group-drag')
          groupDragMove(evt.item.id, evt.from.dataset.page, evt.from.dataset.column, evt.from.children, evt.to.dataset.page, evt.to.dataset.column, evt.to.children)
        },
        onUpdate: function (evt) {
          console.log(evt)
          evt.item.classList.add('group-drag')
          groupDragSort(evt.item.id, evt.from.dataset.page, evt.from.dataset.column, evt.from.children)
        },
        onEnd: function (evt) {
          sessionStorage.setItem('upStart_pageChange', 'false')            
        }
      })
      SortableColumns.push(SortableColumn) 
    }

    //Sortable Bookmarks
    let groupContent = document.getElementsByClassName("group-content")
      for (i=0;i<groupContent.length;i++) {
        let SortableGroup = new Sortable(groupContent[i], { 
        group: 'bookmarks',
        revertOnSpill: true,
        //delay: 10,
        ghostClass: "bookmark-drag",        
        dragClass: "bookmark-drag",
        onStart: function (evt) {          
          sessionStorage.setItem('upStart_pageChange', 'true')
        },
        onAdd: function (evt) {
          evt.item.classList.add('bookmark-drag')
          bookmarkDragMove(evt.item.id, evt.from.dataset.group, evt.to.dataset.group, evt.from.children, evt.to.children)
        },
        onUpdate: function (evt) {
          console.log(evt)
          evt.item.classList.add('bookmark-drag')
          bookmarkDragSort(evt.item.id, evt.from.dataset.group, evt.from.children, evt.oldIndex)
        },
        onEnd: function (evt) {
          sessionStorage.setItem('upStart_pageChange', 'false')
        }
      })
      SortableGroups.push(SortableGroup)
    }


    //options
    setOptions()

    //top nav event listener overflow check
    let resizeTimer = null
    window.addEventListener('resize', function(event){        
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(function () {          
      let topNavList = document.getElementById('top-nav-list')
      if (isOverFlown(topNavList)) {
        document.getElementById('top-nav-scroll-left').style.display = 'inline-block'
        document.getElementById('top-nav-scroll-right').style.display = 'inline-block'
        document.getElementById('top-nav-list').style.width = 'calc(100% - 200px)'
      } else {
        document.getElementById('top-nav-scroll-left').style.display = 'none'
        document.getElementById('top-nav-scroll-right').style.display = 'none'
        document.getElementById('top-nav-list').style.width = 'calc(100% - 150px)'
      }
      isOverFlown(topNavList) ? console.log("overflow topnav") : console.log("nope")
      }, 250)
    })

    document.getElementById("body-content").addEventListener('click', simpleClick)
    document.getElementById("body-content").addEventListener('contextmenu', getContextMenu)
    document.getElementById("top-nav-list").addEventListener('dragover', function(e) { 
      
      console.log(sessionStorage.getItem('upStart_pageChange'))
      //console.log(e.dataTransfer.getData("text"))

      if ( (sessionStorage.getItem('upStart_pageChange') == 'true') && (e.target.matches('.top-nav-page')) ) {showPage(e.target.dataset.page)}
    })

    function simpleClick(e) {
      console.log(e.target.className)        
      console.log(e)
      
      if(e.target.closest('#top-nav-scroll-right')) {
        document.getElementById("top-nav-list").scrollBy(100,0)
      }

      if(e.target.closest('#top-nav-scroll-left')) {
        document.getElementById("top-nav-list").scrollBy(-100,0)
      }

      destroyContextMenus()
      if (e.target.matches('.top-nav-page')) {showPage(e.target.dataset.page)}
      if (e.target.matches('.switch-icon')) {toggleDark()}
      if (e.target.matches('#search')) {search.style.display = 'none'}


      if (e.target.closest('.group-open-button')) {
        if (saveMsg == true) {
          e.preventDefault()
          e.stopPropagation()
          infoMessage(jsonLanguage.data.message_layoutInfo)
        } else {        
          groupOpen(e.target.closest('.group').dataset.group)
        }
      }
      if (e.target.closest('.group-add-button')) {
        if (saveMsg == true) {
          e.preventDefault()
          e.stopPropagation()
          infoMessage(jsonLanguage.data.message_layoutInfo)
        } else {
          itemAdd(e.target.closest('.group').dataset.group)
        }
      }
      if (e.target.closest('.group-dots-button')) {
        if (saveMsg == true) {
          e.preventDefault()
          e.stopPropagation()
          infoMessage(jsonLanguage.data.message_layoutInfo)
        } else {
          e.stopPropagation()
          showMenu('group', e.target.closest('.group').dataset.group, e.target.closest('.column').dataset.column, e.target.closest('.page').dataset.page) 
        }        
      }


      //lock drag and drop
      if(event.target.closest('#lock-icon')) {
        e.stopPropagation()     
        let lockIcon = document.getElementById('lock-icon')   

        if (SortableLocked == false) {
          lockIcon.classList.add('lock-icon-active')
          lockIcon.innerHTML = "<i class='fas fa-lock fa-2x'></i>"

          if(!saveMsg) {SortableTopNav.options.disabled = true}

          for (i=0;i<SortableColumns.length;i++) {
            SortableColumns[i].options.disabled = true
          }

          for (i=0;i<SortableGroups.length;i++) {
            SortableGroups[i].options.disabled = true
          }

          SortableLocked = true
        } else {
          lockIcon.classList.remove('lock-icon-active')
          lockIcon.innerHTML = "<i class='fas fa-lock-open fa-2x'></i>"

          if(!saveMsg) {SortableTopNav.options.disabled = false}

          for (i=0;i<SortableColumns.length;i++) {
            SortableColumns[i].options.disabled = false
          }

          for (i=0;i<SortableGroups.length;i++) {
            SortableGroups[i].options.disabled = false
          }

          SortableLocked = false
        }
      }

      //search options 
      if(event.target.closest('#search-icon')) {
        e.stopPropagation()
        let search = document.getElementById("search")
        let searchInput = document.getElementById("search-input")
        let searchResults = document.getElementById("search-results")
        let bookmarks = document.querySelectorAll('.bookmark')
        let timeout = null

        searchInput.addEventListener('keydown', (evt) => {
          if (evt.keyCode == 27) { search.style.display = 'none' }
        })

        searchInput.addEventListener('input', (event) => {
          let searchString = searchInput.value.toLowerCase()            
          clearTimeout(timeout)
          timeout = setTimeout(function () {
            if (searchString.length >= 2) {
              searchResults.innerHTML = ""                
              for (i=0;i<bookmarks.length;i++) {
                let regex = new RegExp(searchString, 'gi')

                if (bookmarks[i].title.toLowerCase().match(regex)) {
                  let cloneBookmark = bookmarks[i].cloneNode(true)                  
                  cloneBookmark.title = bookmarks[i].closest('.page').dataset.label +' :: '+ bookmarks[i].closest('.group').dataset.label +'\n'+ cloneBookmark.title
                  cloneBookmark.children[0].children[0].classList.remove('bookmark-link-list')
                  cloneBookmark.children[0].children[0].children[0].classList.remove('bookmark-icon-list')
                  cloneBookmark.children[0].children[0].children[1].classList.remove('bookmark-label-list')
                  searchResults.innerHTML += cloneBookmark.outerHTML
                }               
              }
           }
          }, 500)
        })
        
        searchToggle()
      }      

      //create menu
      if(event.target.closest('#create-icon')) {
        if (saveMsg == true) {
          e.preventDefault()
          e.stopPropagation()
          infoMessage(jsonLanguage.data.message_layoutInfo)                                
        } else {
          e.stopPropagation()
          showMenu('plus', sessionStorage.getItem('upStart_curPage'))            
        }
      }

       //open options 
      if(event.target.closest('#settings-icon')) {
        console.log("settings-icon")
        e.stopPropagation()
        chrome.tabs.create({active: true, url: 'settings.html'})          
      }

  

    }

    function getContextMenu(e) {    
      console.log(e.target.className)
      if (saveMsg == true) {
        e.preventDefault()
        infoMessage(jsonLanguage.data.message_layoutInfo)
        e.stopPropagation()                    
      } else {
        switch(true) {
          case e.target.classList.contains('page'): case e.target.classList.contains('column'):
          e.preventDefault()          
          showMenu('page', event.target.closest('.page').dataset.page)
          e.stopPropagation()
          break      
        
          case e.target.classList.contains('group'): case e.target.classList.contains('group-header'): case e.target.classList.contains('group-icon'): case e.target.classList.contains('group-label'): case e.target.classList.contains('group-description'): case e.target.classList.contains('group-content'):
          e.preventDefault()
          console.log(e)
          showMenu('group', e.target.closest('.group').dataset.group, e.target.closest('.column').dataset.column, e.target.closest('.page').dataset.page)
          e.stopPropagation()
          break
        
          case e.target.classList.contains('bookmark'): case e.target.classList.contains('bookmark-content'): case e.target.classList.contains('bookmark-link'): case e.target.classList.contains('bookmark-icon'): case e.target.classList.contains('bookmark-label'):
            e.preventDefault()
            showMenu('item', e.target.closest('.bookmark').dataset.item, e.target.closest('.bookmark').dataset.group)
            e.stopPropagation()
          break
  
          case e.target.classList.contains('top-nav-page'):
          e.preventDefault()
          showMenu('topNavPage', e.target.dataset.page)
          e.stopPropagation()
          break          
  
          default:
          e.preventDefault()
          destroyContextMenus()
          break
        }
      }
    }
    

    showPage(currentPage)


    console.log("upStart_lastSuccessMsg: "+sessionStorage.getItem('upStart_lastSuccessMsg'))
    console.log("upStart_lastErrorMsg: "+sessionStorage.getItem('upStart_lastErrorMsg'))
    console.log("upStart_validLastMsg: "+localStorage.getItem('upStart_validLastMsg'))

    //success message
    if (sessionStorage.getItem('upStart_lastSuccessMsg')) {
      console.log("success msg")
      if (localStorage.getItem('upStart_validLastMsg')) {
        successMessage(sessionStorage.getItem('upStart_lastSuccessMsg'))

        //remove msgs
        sessionStorage.removeItem('upStart_lastSuccessMsg')
        localStorage.removeItem('upStart_validLastMsg')
      }
    }

    //error message
    if (sessionStorage.getItem('upStart_lastErrorMsg')) {
      console.log("error msg")
      errorMessage(sessionStorage.getItem('upStart_lastErrorMsg'))

      //remove msgs
      sessionStorage.removeItem('upStart_lastErrorMsg')

      //if (localStorage.getItem('upStart_validLastMsg')) {       }
    }



    //test top nav overflow
    if (isOverFlown(document.getElementById('top-nav-list'))) {
      document.getElementById('top-nav-scroll-left').style.display = 'inline-block'
      document.getElementById('top-nav-scroll-right').style.display = 'inline-block'
      document.getElementById('top-nav-list').style.width = 'calc(100% - 190px)'
      top-nav-scroll-left
    } else {
      document.getElementById('top-nav-scroll-left').style.display = 'none'
      document.getElementById('top-nav-scroll-right').style.display = 'none'
      document.getElementById('top-nav-list').style.width = 'calc(100% - 120px)'
    }
  }
  catch(error) {
    console.log(error)
  }
}




function setOptions() {

  //options
  //items sort
  

  //page columns

  //remember page
  //auto

  //links in new tab
  if (localStorage.getItem("upStartSettings_openLinksNewTab") == "true") {
    let bookmarkLinks = document.querySelectorAll('.bookmark-link')
    for (i=0;i<bookmarkLinks.length;i++) {
      bookmarkLinks[i].target = "_blank"
    }
  }


  //drag lock option
  if (localStorage.getItem("upStartSettings_dragLock") == "true") {
    
    let lockIcon = document.getElementById('lock-icon')   
    lockIcon.classList.add('lock-icon-active')
    lockIcon.innerHTML = "<i class='fas fa-lock fa-2x'></i>"
  
    SortableTopNav.options.disabled = true    
    for (i=0;i<SortableColumns.length;i++) {
      SortableColumns[i].options.disabled = true
    }  
    for (i=0;i<SortableGroups.length;i++) {
      SortableGroups[i].options.disabled = true
    }
    SortableLocked = true
  }



  //context menu
  //background functions

  //base64 icons
  //drawDOM and other functions


  //bookmarks
  //icon size
  let iconPixels = localStorage.getItem("upStartSettings_itemIconSize")

  if (iconPixels != '64') {
    iconPixels = Number(iconPixels)

    
    let groupMinHeight = iconPixels+30
    let groupMinWidth = iconPixels+40

    //let columnWidth= iconPixels+35


    let groupContentMinHeight = iconPixels+30+20

    //let groupContentWidth= Number(iconPixels)+20+20


    

    let columnPixels= Number(iconPixels)+30
    
    //let groupContentWidth= Number(iconPixels)+20+20
    //let minHeight = Number(iconPixels)+20
    
    

    let groups = document.querySelectorAll('.group')
    for (g=0;g<groups.length;g++) {
      groups[g].style.minHeight = groupMinHeight+'px'
      groups[g].style.minWidth = groupMinWidth+'px'   
    }          

    let groupsContent = document.querySelectorAll('.group-content')
    for (g=0;g<groupsContent.length;g++) {
      groupsContent[g].style.minHeight = groupContentMinHeight+'px'
      //groupsContent[g].style.minWidth = groupContentWidth+'px'
      groupsContent[g].style.gridTemplateColumns = 'repeat(auto-fit, '+columnPixels+'px)'
    }      

    //let pages = document.querySelectorAll('.page')
    //for (i=0;i<pages.length;i++) {	  		
	  	//pages[i].style.minWidth = ((Number(pages[i].dataset.columns)*columnWidth))+'px'	
    //}

    //let columns = document.querySelectorAll('.column')
    //for (i=0;i<columns.length;i++) {	  		
      //columns[i].style.minHeight = columnPixels+'px'
	  	//columns[i].style.minWidth = columnPixels+'px'
    //}    

    //let bookmarks = document.querySelectorAll('.bookmark-content')
    //for (i=0;i<bookmarks.length;i++) {
    //  if (!bookmarks[i].classList.contains('bookmark-content-list')) {	} //bookmarks[i].style.width = columnPixels+'px' }
    //}

    let icons = document.querySelectorAll('.bookmark-icon')
    console.log("setOptions -> icons", icons)
    for (i=0;i<icons.length;i++) {
	  	icons[i].style.height = iconPixels+'px'
	  	icons[i].style.width = iconPixels+'px'
    }

    let iconsList = document.querySelectorAll('.bookmark-icon-list')
    console.log("setOptions -> icons", iconsList)
    for (i=0;i<iconsList.length;i++) {
      if (iconPixels != '16') {
	  	  iconsList[i].style.height = (iconPixels/2)+'px'
        iconsList[i].style.width = (iconPixels/2)+'px'
      }
    }    
  }

  //label font size
  let fontSize = localStorage.getItem("upStartSettings_itemLabelFontSize")
  if (fontSize != '14') {
    let bookmarkLabels = document.querySelectorAll('.bookmark-label')
    for (i=0;i<bookmarkLabels.length;i++) {
      bookmarkLabels[i].style.fontSize = fontSize+'px'
      bookmarkLabels[i].style.height = (Number(fontSize)+Math.round(Number(fontSize)*0.2))+'px'
    }
  }

  //label font align
  let labelAlign = localStorage.getItem("upStartSettings_itemLabelAlign")
  console.log("setOptions -> labelAlign", labelAlign)
  if (labelAlign != 'center') {
    let bookmarkLabels = document.querySelectorAll('.bookmark-label')
    for (i=0;i<bookmarkLabels.length;i++) {
      bookmarkLabels[i].style.textAlign = labelAlign
    }
  }

  //label font style
  let fontStyle = localStorage.getItem("upStartSettings_itemLabelFontStyle")
  if (fontStyle != 'normal') {
    let bookmarkLabels = document.querySelectorAll('.bookmark-label')
    switch (fontStyle) {
      case 'bold':        
        for (i=0;i<bookmarkLabels.length;i++) {bookmarkLabels[i].style.fontWeight = 'bold'}
        break
      case 'italic':
        for (i=0;i<bookmarkLabels.length;i++) {bookmarkLabels[i].style.fontStyle = 'italic'}
        break
      case 'bolditalic':
        for (i=0;i<bookmarkLabels.length;i++) {
          bookmarkLabels[i].style.fontWeight = 'bold'
          bookmarkLabels[i].style.fontStyle = 'italic'
        }
        break
    }
  }

  //label visible lines
  let visibleLines = localStorage.getItem("upStartSettings_itemLabelShowLines")  
  if (visibleLines != '1') {
    let bookmarkLabels = document.querySelectorAll('.bookmark-label')

    switch (visibleLines) {
      case '2':        
        for (i=0;i<bookmarkLabels.length;i++) {          
          bookmarkLabels[i].style.height = ((Number(fontSize)+Math.round(Number(fontSize)*0.2))*2)+'px'
        }
        break
      case 'all':
        for (i=0;i<bookmarkLabels.length;i++) {
          bookmarkLabels[i].style.height = 'auto'
        }
        break
    }
  }
  
  
  //hide labels
    let bookmarkLabels = document.querySelectorAll('.bookmark-label')
    for (i=0;i<bookmarkLabels.length;i++) {
      if ((bookmarkLabels[i].closest('.group').dataset.hide == 'true') || ((bookmarkLabels[i].closest('.group').dataset.hide == 'auto') && (localStorage.getItem("upStartSettings_hideItemLabels") == 'true'))) {
        bookmarkLabels[i].closest('.bookmark').style.width = 'auto'
        bookmarkLabels[i].closest('.bookmark').style.height = 'min-content'
        bookmarkLabels[i].style.display = 'none'

      }
    }
    

  //appearance
  //theme    
  let theme = localStorage.getItem("upStartSettings_theme")
  if (!theme) {theme = 'dark'}
  
  let sweetalert2Theme
  if (theme != 'light') { sweetalert2Theme = 'dark'} else { sweetalert2Theme = 'light' }

  //document
  document.body.setAttribute('data-theme', theme)
  //document.body.setAttribute('data-theme', 'candy')

  //switch-icon
  if (theme.includes('dark')) {
    document.getElementById('switch-icon').src = '../img/sun.svg'
  }

  //sweetalert
  document.getElementById('sweetalert2-theme').href = 'css/sweetalert2/'+sweetalert2Theme+'.min.css'

  


  //iziToast and slider
  if (theme != 'light') {
    //document.getElementById('slider').checked = "checked"
    iziTheme = 'dark'
    iziBgColor = '#192935'
  }

  //page icon
  //function DrawDOM
 
  //page background
  //function DrawDOM


  //top navigation foreground color  
  let topNavFgColor = localStorage.getItem("upStartSettings_topNavFgColor")
  if (topNavFgColor != "theme") {document.getElementById("top-nav").style.color = topNavFgColor}

  //top navigation background color  
  let topNavBgColor = localStorage.getItem("upStartSettings_topNavBgColor")
  if (topNavBgColor != "theme") {document.getElementById("top-nav").style.backgroundColor = topNavBgColor}
     
}   