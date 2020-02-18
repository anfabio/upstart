// IMPORT/EXPORT FUNCTIONS
function loadDefaultFile() {
    //TEST NULL VARIABLE
    if (typeof json_default === 'undefined' || json_default === null) {
        alert("No default file found!");
        return false;
    }

    //TEST JSON DATA
    if (IsJsonString(json_default)) {
        chrome.storage.local.set({ "jsonUS": json_default }, function(){
            alert("Default data loaded! The page will be refreshed.");
            location.reload();
            });               
        } else {
            alert("Data is not JSON");
            return false;
        }
}

function showMenu(event, type, pageID, groupID, itemID) {

    // Destroy old menus
    $('#contextPageMenu').remove();
    $('#contextTopNavMenu').remove();
    $('#contextGroupMenu').remove();
    $('#contextItemMenu').remove();


    // Create a new menu
    var contextMenu = document.createElement('DIV');
    contextMenu.className = "list-group";
    document.body.appendChild(contextMenu);    

    switch(type) {
    case 'page':
        contextMenu.id = "contextPageMenu";
        contextMenu.innerHTML = 
            '<!-- <a class="list-group-item" href="#" id="contextPageNewTab"><i class="fas fa-external-link-alt"></i>&nbsp;&nbsp; Open in new tab</a> -->'+
            '<a class="list-group-item" href="#" id="contextPageEdit"><i class="fas fa-pencil-alt"></i>&nbsp;&nbsp; Edit</a>' +
            '<a class="list-group-item" href="#" id="contextPageCopy"><i class="fas fa-clone"></i>&nbsp;&nbsp; Copy</a>'+
            '<a class="list-group-item list-group-item-danger" href="#" id="contextPageDelete"><i class="fas fa-trash"></i>&nbsp;&nbsp; Delete</a>'+
            '<hr class="list-group-divider">'+
            '<a class="list-group-item" href="#" id="contextPageNewPage"><i class="fas fa-plus"></i>&nbsp;&nbsp; Add Page</a>'+
            '<a class="list-group-item" href="#" id="contextPageNewGoup"><i class="fas fa-plus"></i>&nbsp;&nbsp; Add Group</a>'+
            '<a class="list-group-item" href="#" id="contextPageNewBookmark"><i class="fas fa-plus"></i>&nbsp;&nbsp; Add Bookmark</a>';

        //document.getElementById("contextPageNewTab").addEventListener('click', function() {$('#contextPageMenu').remove(); openPageNewTab(pageID)});
        document.getElementById("contextPageEdit").addEventListener('click', function() {$('#contextPageMenu').remove(); pageEdit(pageID)});
        document.getElementById("contextPageCopy").addEventListener('click', function() {$('#contextPageMenu').remove(); pageCopy(pageID)});
        document.getElementById("contextPageNewPage").addEventListener('click', function() {$('#contextPageMenu').remove(); pageNew()});
        document.getElementById("contextPageNewGoup").addEventListener('click', function() {$('#contextPageMenu').remove(); groupNew(pageID)});
        document.getElementById("contextPageNewBookmark").addEventListener('click', function() {$('#contextPageMenu').remove(); itemNewNoGroupID(pageID)});       
        document.getElementById("contextPageDelete").addEventListener('click', function() {$('#contextPageMenu').remove(); pageDelete(pageID)});
        break;    
    case 'topbar':
        contextMenu.id = "contextTopNavMenu";
        contextMenu.innerHTML = 
            '<!-- <a class="list-group-item" href="#" id="contextTopNavNewTab"><i class="fas fa-external-link-alt"></i>&nbsp;&nbsp; Open in new tab</a> -->'+
            '<a class="list-group-item" href="#" id="contextTopNavEdit"><i class="fas fa-pencil-alt"></i>&nbsp;&nbsp; Edit</a>'+
            '<a class="list-group-item" href="#" id="contextTopNavCopy"><i class="fas fa-clone"></i>&nbsp;&nbsp; Copy</a>'+
            '<a class="list-group-item list-group-item-danger" href="#" id="contextTopNavDelete"><i class="fas fa-trash"></i>&nbsp;&nbsp; Delete</a>'+        
            '<hr class="list-group-divider">'+
            '<a class="list-group-item" href="#" id="contextTopNavNewPage"><i class="fas fa-plus"></i>&nbsp;&nbsp; Add Page</a>'+
            '<a class="list-group-item" href="#" id="contextTopNavNewGoup"><i class="fas fa-plus"></i>&nbsp;&nbsp; Add Group</a>';

        //document.getElementById("contextTopNavNewTab").addEventListener('click', function() {$('#contextTopNavMenu').remove(); openPageNewTab(pageID)});
        document.getElementById("contextTopNavEdit").addEventListener('click', function() {$('#contextTopNavMenu').remove(); pageEdit(pageID)});
        document.getElementById("contextTopNavCopy").addEventListener('click', function() {$('#contextTopNavMenu').remove(); pageCopy(pageID)});        
        document.getElementById("contextTopNavNewPage").addEventListener('click', function() {$('#contextTopNavMenu').remove(); pageNew()});
        document.getElementById("contextTopNavNewGoup").addEventListener('click', function() {$('#contextTopNavMenu').remove(); groupNew(pageID)});        
        document.getElementById("contextTopNavDelete").addEventListener('click', function() {$('#contextTopNavMenu').remove(); pageDelete(pageID)});
        break;
    case 'group':        
        contextMenu.id = "contextGroupMenu";
        contextMenu.innerHTML = 
            '<a class="list-group-item" href="#" id="contextGroupEdit"><i class="fas fa-pencil-alt"></i>&nbsp;&nbsp; Edit</a>'+
            '<a class="list-group-item" href="#" id="contextGroupCopy"><i class="fas fa-clone"></i>&nbsp;&nbsp; Copy</a>'+
            '<a class="list-group-item" href="#" id="contextGroupMove"><i class="fas fa-arrows-alt"></i>&nbsp;&nbsp; Move</a>'+
            '<a class="list-group-item" href="#" id="contextGroupSort"><i class="fas fa-sort-alpha-down"></i>&nbsp;&nbsp; Sort</a>'+
            '<a class="list-group-item" href="#" id="contextGroupOpenAll"><i class="fas fa-external-link-square-alt"></i>&nbsp;&nbsp; Open</a>'+
            '<a class="list-group-item list-group-item-danger" href="#" id="contextGroupDelete"><i class="fas fa-trash"></i>&nbsp;&nbsp; Delete</a>'+
            '<hr class="list-group-divider">'+
            '<a class="list-group-item" href="#" id="contextNewGoup"><i class="fas fa-plus"></i>&nbsp;&nbsp; Add Group</a>'+
            '<a class="list-group-item" href="#" id="contextGroupAddItem"><i class="fas fa-plus"></i>&nbsp;&nbsp; Add Bookmark</a>';

        document.getElementById("contextGroupEdit").addEventListener('click', function() {$('#contextGroupMenu').remove(); groupEdit(pageID, groupID)});
        document.getElementById("contextGroupCopy").addEventListener('click', function() {$('#contextGroupMenu').remove(); groupCopy(pageID, groupID)});
        document.getElementById("contextGroupMove").addEventListener('click', function() {$('#contextGroupMenu').remove(); groupMove(pageID, groupID)});
        document.getElementById("contextGroupSort").addEventListener('click', function() {$('#contextGroupMenu').remove(); groupSort(pageID, groupID)});
        document.getElementById("contextGroupOpenAll").addEventListener('click', function() {$('#contextGroupMenu').remove(); openAllitens(pageID, groupID)});
        document.getElementById("contextNewGoup").addEventListener('click', function() {$('#contextGroupMenu').remove(); groupNew(pageID)});        
        document.getElementById("contextGroupAddItem").addEventListener('click', function() {$('#contextGroupMenu').remove(); itemNew(pageID, groupID)});
        document.getElementById("contextGroupDelete").addEventListener('click', function() {$('#contextGroupMenu').remove(); groupDelete(pageID, groupID)});    
        break;
    case 'item':
    contextMenu.id = "contextItemMenu";
        contextMenu.innerHTML = 
            '<a class="list-group-item" href="#" id="contextItemNewTab"><i class="fas fa-external-link-alt"></i>&nbsp;&nbsp; Open in new tab</a>'+
            '<a class="list-group-item" href="#" id="contextItemEdit"><i class="fas fa-pencil-alt"></i>&nbsp;&nbsp; Edit</a>'+
            '<a class="list-group-item" href="#" id="contextItemCopy"><i class="fas fa-clone"></i>&nbsp;&nbsp; Copy</a>'+
            '<a class="list-group-item" href="#" id="contextItemMove"><i class="fas fa-arrows-alt"></i>&nbsp;&nbsp; Move</a>'+
            '<a class="list-group-item list-group-item-danger" href="#" id="contextItemDelete"><i class="fas fa-trash"></i>&nbsp;&nbsp; Delete</a>'+
            '<hr class="list-group-divider">'+
            '<a class="list-group-item" href="#" id="contextItemAddItem"><i class="fas fa-plus"></i>&nbsp;&nbsp; Add Bookmark</a>';

        document.getElementById("contextItemNewTab").addEventListener('click', function() {$('#contextItemMenu').remove(); openItemNewTab(pageID, groupID, itemID)});
        document.getElementById("contextItemEdit").addEventListener('click', function() {$('#contextItemMenu').remove(); bookmarkEdit(pageID, groupID, itemID)});
        document.getElementById("contextItemCopy").addEventListener('click', function() {$('#contextItemMenu').remove(); itemCopy(pageID, groupID, itemID)});
        document.getElementById("contextItemMove").addEventListener('click', function() {$('#contextItemMenu').remove(); itemMove(pageID, groupID, itemID)});
        document.getElementById("contextItemAddItem").addEventListener('click', function() {$('#contextItemMenu').remove(); itemNew(pageID, groupID, itemID)});
        document.getElementById("contextItemDelete").addEventListener('click', function() {$('#contextItemMenu').remove(); itemDelete(pageID, groupID, itemID)});
        break;        
    default:
    }
    var posx = event.clientX + window.pageXOffset +'px'; //Left Position of Mouse Pointer
    var posy = event.clientY + window.pageYOffset + 'px'; //Top Position of Mouse Pointer
    contextMenu.style.position = 'absolute';
    contextMenu.style.display = 'inline';
    contextMenu.style.left = posx;
    contextMenu.style.top = posy;
}

function showPlusMenu(event) {

    // Destroy old menus
    $('#contextPageMenu').remove();
    $('#contextTopNavMenu').remove();
    $('#contextGroupMenu').remove();
    $('#contextItemMenu').remove();


    // Create a new menu
    var contextMenu = document.createElement('DIV');
    contextMenu.className = "list-group";
    document.body.appendChild(contextMenu);    

    contextMenu.id = "contextPageMenu";
    contextMenu.innerHTML = 
        '<a class="list-group-item" href="#" id="contextPlusNewPage"><i class="fas fa-plus"></i>&nbsp;&nbsp; Add Page</a>'+
        '<a class="list-group-item" href="#" id="contextPlusNewGroup"><i class="fas fa-plus"></i>&nbsp;&nbsp; Add Group</a>'+
        '<a class="list-group-item" href="#" id="contextPlusNewItem"><i class="fas fa-plus"></i>&nbsp;&nbsp; Add Bookmark</a>';

    document.getElementById("contextPlusNewPage").addEventListener('click', function() {$('#contextPageMenu').remove(); pageNew()});
    document.getElementById("contextPlusNewGroup").addEventListener('click', function() {$('#contextPageMenu').remove(); chrome.storage.local.get("currentPage", function(results) {   
                        groupNew(results.currentPage) }) });
    document.getElementById("contextPlusNewItem").addEventListener('click', function() {$('#contextPageMenu').remove(); chrome.storage.local.get("currentPage", function(results) {   
                        itemNewNoGroupID(results.currentPage) }) });

    var posx = event.clientX + window.pageXOffset - (event.clientX+416-window.innerWidth) + 'px'; //Left Position of Mouse Pointer
    var posy = event.clientY + window.pageYOffset + (42-event.clientY) + 'px'; //Top Position of Mouse Pointer
    contextMenu.style.position = 'absolute';
    contextMenu.style.display = 'inline';
    contextMenu.style.left = posx;
    contextMenu.style.top = posy;

}


/******************** TOPNAV/PAGE FUNCTIONS BEGIN ********************/

function openPageNewTab(pageID) {
    chrome.storage.local.set({ "currentPage": pageID }, function(){
                });
    chrome.tabs.create({ active: false, url: window.location.href });
}

// PAGE EDIT
async function pageEdit(pageID) {
    var currentPageLabel = json.pages[pageID].pageLabel;
    var currentPageDescription = json.pages[pageID].pageDescription;
    var currentPageBackground = json.pages[pageID].pageBackground;
    var currentPageColor = json.pages[pageID].pageColor;
    var currentPageColumns = json.pages[pageID].pageColumns;
    var defaultBackgroundColor = json['settings'].defaultBackgroundColor;
    var defaultPageBackground = json['settings'].defaultPageBackground;

    var backgroundOptions = '<option data-img-src="bg/none.png" data-img-label="None" value=""></option>';
    for (i = 0; i < jsonImg['backgrounds'].length; i++) {
        var imageLabel = jsonImg.backgrounds[i].label;
        var imageValue = jsonImg.backgrounds[i].value;
        var imageFile = jsonImg.backgrounds[i].file;
        backgroundOptions += '<option data-img-src="'+imageFile+'" data-img-label="'+imageLabel+'" value="'+imageValue+'"></option>';
        }

    var pageLabel;
    var pageDescription;    
    var pageBackground;
    var pageColor
    var pageColumns;
    await swal({
      title: 'Edit Page',
      html:
        '<div style="width:100%; text-align:left;">'+

            '<span style="font-weight: bold;">Label</span><input id="swal-pageLabel" class="swal2-input" value="'+currentPageLabel+'">'+
            '<span style="font-weight: bold;">Description</span><input id="swal-pageDescription" class="swal2-input" value="'+currentPageDescription+'">' +

            '<span style="font-weight: bold;">Background</span><div class="settingsBalloon" alt="You can choose one of the images below or put a URL address of your choice. A local image can be set using <b>file:///</b>.<br>ex:<br>file:///C:/Temp/background.png<br>file:///home/user/background.png"><i class="fas fa-question-circle"></i></div><input id="swal-pageBackground" class="swal2-input" value="'+currentPageBackground+'"><BR><BR>'+
        
            '<span>Number of columns</span><div class="settingsBalloon" alt="Number of columns in each row. This is calculated automatically according to the numbers of groups you have on the page."><i class="fas fa-question-circle"></i></div>'+
            '<div id="pageColumnsSlider" style="display: inline-block">'+
                '<div id="slider-handle-page-columns" class="ui-slider-handle"></div>'+
            '</div>'+
        
        '</div>'+

        '<BR>'+

        '<div class="panel-group" id="accordionPageEdit">'+
            '<div class="panel panel-default">'+
                '<a data-toggle="collapse" data-parent="#accordionPageEdit" href="#background-colors">'+
                    '<div class="panel-heading">              '+
                        '<h4 class="panel-title" style="font-size: 14px; text-align: center;">background color</h4>'+
                    '</div>'+
                '</a>'+
            '<div id="background-colors" class="panel-collapse collapse">'+
                '<div class="panel-body">'+
                    '<BR>'+
                    '<div class="input-group myColorPicker" style="width: 100%">'+
                        '<span class="input-group-addon myColorPicker-preview" id="pageBoxColorPicker-preview">#</span>'+
                        '<input type="text" class="form-control" value="27C3C3" id="pageBoxColorPicker">'+
                    '</div>'+
                    '<ul class="selectableColor" id="selectableColorPage">'+
                        '<li id="pageColor_None" data-color="" title="None"><div style="color:#000000; opacity:0.5"><i class="fas fa-adjust fa-4x"></i></div></li>'+
                        '<li id="pageColor_A5D2FF" data-color="A5D2FF" title="A5D2FF"><div style="color:#A5D2FF"><i class="fas fa-circle fa-4x"></i></div></li>'+
                        '<li id="pageColor_FFA5A5" data-color="FFA5A5" title="FFA5A5"><div style="color:#FFA5A5"><i class="fas fa-circle fa-4x"></i></div></li>'+
                        '<li id="pageColor_9BCD9B" data-color="9BCD9B" title="9BCD9B"><div style="color:#9BCD9B"><i class="fas fa-circle fa-4x"></i></div></li>'+
                        '<li id="pageColor_B0C4DE" data-color="B0C4DE" title="B0C4DE"><div style="color:#B0C4DE"><i class="fas fa-circle fa-4x"></i></div></li>'+
                        '<li id="pageColor_B4B5FF" data-color="B4B5FF" title="B4B5FF"><div style="color:#B4B5FF"><i class="fas fa-circle fa-4x"></i></div></li>'+
                        '<li id="pageColor_FFFF88" data-color="FFFF88" title="FFFF88"><div style="color:#FFFF88"><i class="fas fa-circle fa-4x"></i></div></li>'+  
                        '<li id="pageColor_FFCE84" data-color="FFCE84" title="FFCE84"><div style="color:#FFCE84"><i class="fas fa-circle fa-4x"></i></div></li>'+                        
                        '<li id="pageColor_A9FFA9" data-color="A9FFA9" title="A9FFA9"><div style="color:#A9FFA9"><i class="fas fa-circle fa-4x"></i></div></li>'+
                        '<li id="pageColor_FAEBD7" data-color="FAEBD7" title="FAEBD7"><div style="color:#FAEBD7"><i class="fas fa-circle fa-4x"></i></div></li>'+
                        '<li id="pageColor_CDC673" data-color="CDC673" title="CDC673"><div style="color:#CDC673"><i class="fas fa-circle fa-4x"></i></div></li>'+
                        '<li id="pageColor_808080" data-color="808080" title="808080"><div style="color:#808080"><i class="fas fa-circle fa-4x"></i></div></li>'+
                        '<li id="pageColor_DDFFDD" data-color="DDFFDD" title="DDFFDD"><div style="color:#DDFFDD"><i class="fas fa-circle fa-4x"></i></div></li>'+ 
                        '<li id="pageColor_F5F5F5" data-color="F5F5F5" title="F5F5F5"><div style="color:#F5F5F5"><i class="fas fa-circle fa-4x"></i></div></li>'+
                        '<li id="pageColor_DDEEFF" data-color="DDEEFF" title="DDEEFF"><div style="color:#DDEEFF"><i class="fas fa-circle fa-4x"></i></div></li>'+
                        '<li id="pageColor_FFFFDD" data-color="FFFFDD" title="FFFFDD"><div style="color:#FFFFDD"><i class="fas fa-circle fa-4x"></i></div></li>'+
                        '<li id="pageColor_FFFFFF" data-color="FFFFFF" title="FFFFFF"><div style="color:#FFFFFF"><i class="fas fa-circle fa-4x"></i></div></li>'+
                        '<li id="pageColor_000000" data-color="000000" title="000000"><div style="color:#000000"><i class="fas fa-circle fa-4x"></i></div></li>'+
                    '</ul>'+
                '</div>'+
                '</div>'+
            '</div>'+

            '<div class="panel panel-default">'+
                '<a data-toggle="collapse" data-parent="#accordionPageEdit" href="#background-images">'+
                    '<div class="panel-heading">'+
                        '<h4 class="panel-title" style="font-size: 14px; text-align: center;">background image</h4>'+
                    '</div>'+
                '</a>'+
            '<div id="background-images" class="panel-collapse collapse">'+
                '<div class="panel-body">'+
                '<select class="image-picker show-labels" id="image-picker-backgrounds">'+
                    backgroundOptions +
                '</select>' +
                '</div>'+
                '</div>'+
            '</div>'+
            allowFileAccessMessage+

        '</div>',
        onOpen: function() {

            //COLUMNS
            $( function() {
                var handle = $( "#slider-handle-page-columns" );
                $( "#pageColumnsSlider" ).slider({
                          animate: true,
                          value: currentPageColumns,
                          min: 0,
                          max: 5,
                          step: 1,
                  create: function() {
                    if ($(this).slider("value") == 0) {
                      handle.text('auto');
                    } else {
                      handle.text($(this).slider("value"));
                    }
                    $(this).css( {'width': '335px', 'margin-left': '30px'});
                  },
                  slide: function( event, ui ) {
                    if (ui.value == 0) {
                      handle.text('auto');  
                    } else {
                      handle.text( ui.value );
                    }
                  }
                });
            });

            //COLOR PICKER INPUT
            $('.myColorPicker').colorPickerByGiro({
                preview: '.pageBoxColorPicker-preview',
                showPicker: true,
                format: 'hex',  
                sliderGap: 6,
                cursorGap: 6,  
                text: {
                  close: 'Close',
                  none: 'None'
                }                
            });            
            //SET CURRENT VALUE FOR COLOR PICKER INPUT
            $("input#pageBoxColorPicker").val(currentPageColor);

            //SELECTABLE COLOR LIST
            $( "#selectableColorPage" ).selectable({
                selected: function(event, ui) {
                    $("input#pageBoxColorPicker", pageColor).val($(ui.selected).attr('data-color'));
                    if ($(ui.selected).attr('data-color') != '') {
                        $("#contentPage"+pageID).css('backgroundColor', '#'+$(ui.selected).attr('data-color'));
                    } else {
                        $("#contentPage"+pageID).css('backgroundColor', '#'+defaultBackgroundColor);
                    }
                }
            });
            //SET CURRENT VALUE FOR SELECTABLE COLOR LIST
            $("li#pageColor_"+currentPageColor).addClass('ui-selected');

            //SELECT BACKGROUNDS
            $("select#image-picker-backgrounds").imagepicker({ 
                show_label: true,
                initialized: function(){ $(".image_picker_image").css({"width": "162px"}); },
                selected: function(select){ 
                    var selectedImageValue = select.picker.select[0].value.toString();
                    var currentBGColor = $("#contentPage"+pageID).css('backgroundColor');
                    $("input#swal-pageBackground").val(selectedImageValue);
                    if (selectedImageValue != '') {
                        $("#contentPage"+pageID).css('background', 'url("../bg/'+selectedImageValue+'") no-repeat center center fixed '+currentBGColor);
                        $("#contentPage"+pageID).css('background-size', 'cover');
                    } else {
                        $("#contentPage"+pageID).css('background', '');
                        $("#contentPage"+pageID).css('backgroundColor', currentBGColor);
                    }                    
                }
            });            
            //SET CURRENT VALUE FOR SELECT BACKGROUNDS
            $("select#image-picker-backgrounds").val(currentPageBackground);
            //SYNC SELECT BACKGROUNDS
            $("select#image-picker-backgrounds").data('picker').sync_picker_with_select();

            //BALOONS
            $('.settingsBalloon').balloon({
                position:'top',
                tipSize: 15,      
                html: true,
                css: {
                    position:'top',
                    boxShadow: '2px 2px 5px 1px rgba(0,0,0,0.6)',   
                    borderRadius: '0',
                    border: '1px solid #000',
                    padding: '20px',        
                    textAlign: 'justify',
                    backgroundColor: '#FFF',
                    color: '#595A5F',
                    fontSize: '100%',
                    maxWidth: '300px',
                    fontFamily: 'helvetica, arial, sans-serif',
                    fontSize: '13px',
                    opacity: '1'
                }
            });

            $('.settingsBalloon').balloon({
                position:'left',
                tipSize: 15,      
                html: true,
                css: {
                    boxShadow: '2px 2px 5px 1px rgba(0,0,0,0.6)',   
                    borderRadius: '0',
                    border: '1px solid #000',
                    padding: '20px',        
                    textAlign: 'justify',
                    backgroundColor: '#FFF',
                    color: '#595A5F',
                    fontSize: '100%',
                    maxWidth: '300px',
                    fontFamily: 'helvetica, arial, sans-serif',
                    fontSize: '13px',
                    opacity: '1'
                }
            });

            if (document.getElementById("allowFileAccessMessageWarning")) {
                document.getElementById("allowFileAccessMessageWarning").addEventListener('click', function() { chrome.tabs.create({url: "chrome://extensions/?id=" + chrome.runtime.id}) });
            }            
        },
        focusConfirm: false,
        showCancelButton: true,
        width: '850px',
        preConfirm: () => {
            pageLabel =  document.getElementById('swal-pageLabel').value;            
            return new Promise((resolve) => {      
                if (pageLabel == '') {
                  swal.showValidationError(
                    'The label cannot be empty.'
                  )
                }
                resolve()      
            })
          },  
        }).then((result) => {        
            if (result.dismiss) {
                if (currentPageBackground != '') {
                    $("#contentPage"+pageID).css('background', 'url("../bg/'+currentPageBackground+'") no-repeat center center fixed');
                    $("#contentPage"+pageID).css('background-size', 'cover');
                    } else {
                        $("#contentPage"+pageID).css('background', '');
                        $("#contentPage"+pageID).css('backgroundColor', '#'+currentPageColor);
                    }

                if (currentPageColor = '') {
                    $("#contentPage"+pageID).css('backgroundColor', '#'+defaultPageBackground);
                } else {
                    $("#contentPage"+pageID).css('backgroundColor', '#'+currentPageColor);
                }
                
            } else {
                pageLabel =  document.getElementById('swal-pageLabel').value;            
                pageDescription =  document.getElementById('swal-pageDescription').value;
                pageBackground =  document.getElementById('swal-pageBackground').value;
                pageColor =  $("input#pageBoxColorPicker").val().toString();
                pageColumns =  $("#pageColumnsSlider").slider("value").toString();

                if (isNull(pageLabel)) {
                    swal(
                        'Error',
                        'The label cannot be empty!',
                        'error'
                        )
                } else {                    
                    json.pages[pageID].pageLabel = pageLabel;
                    json.pages[pageID].pageDescription = pageDescription;
                    json.pages[pageID].pageBackground = pageBackground;
                    json.pages[pageID].pageColor = pageColor;
                    json.pages[pageID].pageColumns = pageColumns;                    

                    chrome.storage.local.set({ "jsonUS": JSON.stringify(json) }, function(){
                        document.getElementById('topLink'+pageID).innerHTML = pageLabel;
                        document.getElementById('topLink'+pageID).title = pageDescription;                        
                        
                        //if ( (pageBackground.toLowerCase().startsWith('http')) || (pageBackground.toLowerCase().startsWith('file')) ) {
                        if (pageBackground.toLowerCase().match(/^(http:\/\/|https:\/\/|file:\/\/\/).*/) ) {
                            document.getElementById("contentPage"+pageID).style.background = 'url("'+pageBackground+'") no-repeat center top #'+pageColor;
                        }
                        if (pageColumns != currentPageColumns) { location.reload() } 
                        /*swal({type: 'success', title: 'Page updated'}).then(() => { 
                            if (pageColumns != currentPageColumns) { location.reload() } 
                        })*/

                    });           
                }
            }        
    })   
}

// PAGE COPY
async function pageCopy(pageID) {  
    var pageLabel;
    var pageDescription;
    var nextPageID = json['pages'].length;
    await swal({
      title: 'Copy Page',
      html:
        '<div style="width:100%; text-align:left;">'+
            '<span style="float:left; font-weight: bold;">Label</span><input id="swal-pageLabel" class="swal2-input">' +
            '<span style="float:left; font-weight: bold;">Description</span><input id="swal-pageDescription" class="swal2-input">'+
        '</div>',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            pageLabel =  document.getElementById('swal-pageLabel').value;
            return new Promise((resolve) => {      
                if (pageLabel == '') {
                  swal.showValidationError(
                    'The label cannot be empty.'
                  )
                }
                resolve()      
            })
          },  
        }).then((result) => {        
            if (result.dismiss) {                
            } else {
                pageLabel =  document.getElementById('swal-pageLabel').value;
                pageDescription =  document.getElementById('swal-pageDescription').value;
                if (isNull(pageLabel)) {
                    swal(
                        'Error',
                        'The label cannot be empty!',
                        'error'
                        )
                } else {    
                    var jsonClone = JSON.parse(JSON.stringify(json));
                    json['pages'].push(jsonClone.pages[pageID]);
                    json.pages[nextPageID].pageLabel = pageLabel;
                    json.pages[nextPageID].pageDescription = pageDescription;
                    chrome.storage.local.set({ "jsonUS": JSON.stringify(json) }, function(){});
                    chrome.storage.local.set({ "currentPage": nextPageID }, function(){});
                    location.reload()
                    //swal({type: 'success', title: 'Page copied as "'+pageLabel+'"'}).then(() => { location.reload() })
                }
            }        
    })   
}

// PAGE NEW
async function pageNew() {
    var pageLabel;
    var pageDescription;
    var nextPageID = json['pages'].length;
    await swal({
      title: 'New Page',
      html:
        '<div style="width:100%; text-align:left;">'+
            '<span style="float:left; font-weight: bold;">Label</span><input id="swal-pageLabel" class="swal2-input">' +
            '<span style="float:left; font-weight: bold;">Description</span><input id="swal-pageDescription" class="swal2-input">'+
        '</div>',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            pageLabel =  document.getElementById('swal-pageLabel').value;
            return new Promise((resolve) => {      
                if (pageLabel == '') {
                  swal.showValidationError(
                    'The label cannot be empty.'
                  )
                }
                resolve()      
            })
          },
        }).then((result) => {        
            if (result.dismiss) {
            } else {
                pageLabel =  document.getElementById('swal-pageLabel').value;
                pageDescription =  document.getElementById('swal-pageDescription').value;    
                if (isNull(pageLabel)) {
                    swal(
                        'Error',
                        'The label cannot be empty!',
                        'error'
                        )
                } else {    
                    var newPageObj = new Object();
                    newPageObj.pageLabel = pageLabel;
                    newPageObj.pageDescription = pageDescription;
                    newPageObj.pageColumns = "0",
                    newPageObj.pageBackground = "",
                    newPageObj['groups'] = [];
    
                    json['pages'].push(newPageObj);
                    chrome.storage.local.set({ "jsonUS": JSON.stringify(json) }, function(){});
                    chrome.storage.local.set({ "currentPage": nextPageID }, function(){});     
                    location.reload()        
                    //swal({type: 'success', title: 'Page "'+pageLabel+'" created"'}).then(() => { location.reload() })
                }
            }        
    })   
}

// PAGE DELETE
function pageDelete(pageID) {
    var currentPageLabel = json.pages[pageID].pageLabel;
    swal({
      title: 'Delete page "'+currentPageLabel+'"?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it',
      focusCancel: 'true',
    }).then((result) => {
        if (result.value) {
            if (json['pages'].length <= 1) {
                    swal({
                        title: '"'+currentPageLabel+'" is the last page!',
                        text: "A empty page will be created after this. Continue?",
                        type: 'warning',
                        showCancelButton: true,                                        
                        confirmButtonText: 'Yes'
                    }).then((result) => {
                        if (result.value) {
                            // LAST PAGE. CREATE A EMPTY ONE
                            json.pages.splice(pageID,1);
                   
                            var newPageObj = new Object();
                            newPageObj.pageLabel = 'New Page';
                            newPageObj.pageDescription = '';
                            newPageObj.pageColumns = "0",
                            newPageObj.pageBackground = "",
                            newPageObj['groups'] = [];
            
                            json['pages'].push(newPageObj);
                            
                            chrome.storage.local.set({ "currentPage": '0' }, function(){
                                chrome.storage.local.set({ "jsonUS": JSON.stringify(json) }, function() {
                                    location.reload()
/*                                    swal(
                                      'Page deleted',
                                      'Page "'+currentPageLabel+ '" has been deleted.',
                                      'success'
                                    ).then( location.reload())*/
                                })
                            })
                        }
                    })
            } else {
                json.pages.splice(pageID,1);
                chrome.storage.local.set({ "jsonUS": JSON.stringify(json) }, function() {
                    chrome.storage.local.get("currentPage", function(results) {    
                        if (results.currentPage === pageID) {
                            chrome.storage.local.set({ "currentPage": '0' }, function(){});
                        }
                    location.reload()
                    //swal('Page deleted', 'Page "'+currentPageLabel+ '" was deleted', 'success').then(() => { location.reload() })
                    });
            
                });        

            }
        }
    })
} 
    


/******************** TOPNAV/PAGE FUNCTIONS END ********************/



/******************** GROUP FUNCTIONS BEGIN ********************/


// GROUP EDIT
async function groupEdit(pageID, groupID) {
    var gid = pageID.toString() + groupID.toString();

    var currentGroupLabel = json.pages[pageID].groups[groupID].groupLabel;
    var currentGroupDescription = json.pages[pageID].groups[groupID].groupDescription;
    var currentGroupColor = json.pages[pageID].groups[groupID].groupColor;
    var currentGroupSort = json.pages[pageID].groups[groupID].groupSort;
    var currentGroupIcon = json.pages[pageID].groups[groupID].groupIcon;    
    var currentGroupOpacity = json.pages[pageID].groups[groupID].groupOpacity;
    var defaultBackgroundColor = json['settings'].defaultBackgroundColor;

    var groupIcons;
    for (i = 0; i < jsonImg['groupicons'].length; i++) {
        var imageLabel = jsonImg.groupicons[i].label;
        var imageValue = jsonImg.groupicons[i].value;
        var imageFile = jsonImg.groupicons[i].file;
        groupIcons += '<option data-img-src="'+imageFile+'" data-img-label="'+imageLabel+'" value="'+imageValue+'"></option>';
        }


    var groupLabel;
    var groupDescription; 
    var groupColor;
    var groupSort;
    var groupIcon;   
    var groupOpacity; 

    await swal({
      title: 'Edit Group',
      html:
        '<div style="width:100%; text-align:left;">'+
            '<span style="font-weight: bold;">Label</span><input id="swal-groupLabel" class="swal2-input" value="'+currentGroupLabel+'">' +
            '<span style="font-weight: bold;">Description</span><input id="swal-groupDescription" class="swal2-input" value="'+currentGroupDescription+'">'+

            '<span>Sort order</span><div class="settingsBalloon" alt="The selected sort order will be set for this group and the itens will be saved according. Once saved, the current order will be lost.<br><b>Auto</b>: the group will be sorted according to the default settings.<br><b>Manual</b>: the group will not be sorted."><i class="fas fa-question-circle"></i></div>'+
            '<div style="display: inline-block">'+
                '<select class="form-control" id="swal-groupSort" style="margin-left: 20px;">'+
                   '<option value="auto">Auto</option>'+
                   '<option value="manual">Manual</option>'+
                   '<option value="az">A-Z</option>'+
                   '<option value="za">Z-A</option>'+
                   '<option value="newst">Newst</option>'+
                   '<option value="oldest">Oldest</option>'+
                '</select>'+
            '</div>'+

        '</div>'+

        '<BR>'+

        '<div class="panel-group" id="accordionGroupEdit">'+
            '<div class="panel panel-default">'+
                '<a data-toggle="collapse" data-parent="#accordionGroupEdit" href="#background-colors">'+
                    '<div class="panel-heading">'+
                    '<h4 class="panel-title" style="font-size: 14px; text-align: center;">background color</h4>'+
                    '</div>'+
                '</a>'+
            '<div id="background-colors" class="panel-collapse collapse">'+
                '<div class="panel-body"> '+
                    '<BR>'+
                    '<div class="input-group myColorPicker" style="width: 100%">'+
                        '<span class="input-group-addon myColorPicker-preview" id="groupBoxColorPicker-preview">#</span>'+
                        '<input type="text" class="form-control" value="27C3C3" id="groupBoxColorPicker">'+
                    '</div>'+
                    '<ul class="selectableColor" id="selectableColorGroup">'+
                        '<li id="groupColor_None" data-color="" title="None"><div style="color:#000000; opacity:0.5"><i class="fas fa-adjust fa-4x"></i></div></li>'+
                        '<li id="groupColor_Transparent" data-color="transparent" title="Transparent"><div style="color:#000000; opacity:0.1"><i class="fas fa-adjust fa-4x"></i></div></li>'+
                        '<li id="groupColor_A5D2FF" data-color="A5D2FF" title="A5D2FF"><div style="color:#A5D2FF"><i class="fas fa-circle fa-4x"></i></div></li>'+
                        '<li id="groupColor_FFA5A5" data-color="FFA5A5" title="FFA5A5"><div style="color:#FFA5A5"><i class="fas fa-circle fa-4x"></i></div></li>'+
                        '<li id="groupColor_9BCD9B" data-color="9BCD9B" title="9BCD9B"><div style="color:#9BCD9B"><i class="fas fa-circle fa-4x"></i></div></li>'+
                        '<li id="groupColor_B0C4DE" data-color="B0C4DE" title="B0C4DE"><div style="color:#B0C4DE"><i class="fas fa-circle fa-4x"></i></div></li>'+
                        '<li id="groupColor_B4B5FF" data-color="B4B5FF" title="B4B5FF"><div style="color:#B4B5FF"><i class="fas fa-circle fa-4x"></i></div></li>'+
                        '<li id="groupColor_FFFF88" data-color="FFFF88" title="FFFF88"><div style="color:#FFFF88"><i class="fas fa-circle fa-4x"></i></div></li>'+
                        '<li id="groupColor_FFCE84" data-color="FFCE84" title="FFCE84"><div style="color:#FFCE84"><i class="fas fa-circle fa-4x"></i></div></li>'+
                        '<li id="groupColor_A9FFA9" data-color="A9FFA9" title="A9FFA9"><div style="color:#A9FFA9"><i class="fas fa-circle fa-4x"></i></div></li>'+
                        '<li id="groupColor_FAEBD7" data-color="FAEBD7" title="FAEBD7"><div style="color:#FAEBD7"><i class="fas fa-circle fa-4x"></i></div></li>'+
                        '<li id="groupColor_CDC673" data-color="CDC673" title="CDC673"><div style="color:#CDC673"><i class="fas fa-circle fa-4x"></i></div></li>'+
                        '<li id="groupColor_808080" data-color="808080" title="808080"><div style="color:#808080"><i class="fas fa-circle fa-4x"></i></div></li>'+
                        '<li id="groupColor_DDFFDD" data-color="DDFFDD" title="DDFFDD"><div style="color:#DDFFDD"><i class="fas fa-circle fa-4x"></i></div></li>'+
                        '<li id="groupColor_F5F5F5" data-color="F5F5F5" title="F5F5F5"><div style="color:#F5F5F5"><i class="fas fa-circle fa-4x"></i></div></li>'+
                        '<li id="groupColor_DDEEFF" data-color="DDEEFF" title="DDEEFF"><div style="color:#DDEEFF"><i class="fas fa-circle fa-4x"></i></div></li>'+
                        '<li id="groupColor_FFFFDD" data-color="FFFFDD" title="FFFFDD"><div style="color:#FFFFDD"><i class="fas fa-circle fa-4x"></i></div></li>'+
                        '<li id="groupColor_FFFFFF" data-color="FFFFFF" title="FFFFFF"><div style="color:#FFFFFF"><i class="fas fa-circle fa-4x"></i></div></li>'+
                        '<li id="groupColor_000000" data-color="000000" title="000000"><div style="color:#000000"><i class="fas fa-circle fa-4x"></i></div></li>'+
                    '</ul>'+
                '</div>'+
                '</div>'+
            '</div>'+

            '<div class="panel panel-default">'+
                '<a data-toggle="collapse" data-parent="#accordionGroupEdit" href="#group-icons">'+
                '<div class="panel-heading">'+
                    '<h4 class="panel-title" style="font-size: 14px; text-align: center;">group icon</h4>'+
                    '</div>'+
                '</a>'+
              '<div id="group-icons" class="panel-collapse collapse">'+
                '<div class="panel-body">'+
                '<select class="image-picker show-labels" id="image-picker-group-icons">'+
                    groupIcons +
                '</select>' +
                '</div>'+
                '</div>'+
            '</div>'+
            allowFileAccessMessage+

        '</div>',
        focusConfirm: false,
        showCancelButton: true,
        inputClass: 'form-control',
        onOpen: function() {

            $("#contentGroup"+gid).css('boxShadow', '0px 0px 10px 6px #34cb5a, 0 0 1px #34cb5a');

            $("select#swal-groupSort").val(currentGroupSort);

            //COLOR PICKER INPUT
            $('.myColorPicker').colorPickerByGiro({
                preview: '.groupBoxColorPicker-preview',
                showPicker: true,
                format: 'hex',  
                sliderGap: 6,
                cursorGap: 6,  
                text: {
                  close: 'Close',
                  none: 'None'
                }                
            });            
            //SET CURRENT VALUE FOR COLOR PICKER INPUT
            $("input#groupBoxColorPicker").val(currentGroupColor);

            //SELECTABLE COLOR LIST
            $( "#selectableColorGroup" ).selectable({
                selected: function(event, ui) {                    
                    $("input#groupBoxColorPicker", groupColor).val($(ui.selected).attr('data-color'));
                    if ($(ui.selected).attr('data-color') != '') {
                        if ($(ui.selected).attr('data-color') == 'transparent') {
                            $("#contentGroup"+gid).css('backgroundColor', 'transparent');
                        } else {
                            $("#contentGroup"+gid).css('backgroundColor', '#'+$(ui.selected).attr('data-color'));
                        }
                    } else {
                        $("#contentGroup"+gid).css('backgroundColor', '#'+defaultBackgroundColor);
                    }
                }
            });
            //SET CURRENT VALUE FOR SELECTABLE COLOR LIST
            $("li#groupColor_"+currentGroupColor).addClass('ui-selected');

            //SELECT BACKGROUNDS
            $("select#image-picker-group-icons").imagepicker({ 
                show_label: false,
                initialized: function(){ $(".image_picker_image").css({"width": "30px", "height": "30px"}); },
                selected: function(select){ 
                    var selectedImageValue = select.picker.select[0].value.toString();
                    $("#groupIcon"+gid).css('backgroundImage', 'url("../gicons/'+selectedImageValue+'")');
                    }                    
            });            
            //SET CURRENT VALUE FOR SELECT BACKGROUNDS
            $("select#image-picker-group-icons").val(currentGroupIcon);
            //SYNC SELECT BACKGROUNDS
            $("select#image-picker-group-icons").data('picker').sync_picker_with_select();

            //BALOONS
            $('.settingsBalloon').balloon({
                position:'top',
                tipSize: 15,      
                html: true,
                css: {
                    position:'top',
                    boxShadow: '2px 2px 5px 1px rgba(0,0,0,0.6)',   
                    borderRadius: '0',
                    border: '1px solid #000',
                    padding: '20px',        
                    textAlign: 'justify',
                    backgroundColor: '#FFF',
                    color: '#595A5F',
                    fontSize: '100%',
                    maxWidth: '300px',
                    fontFamily: 'helvetica, arial, sans-serif',
                    fontSize: '13px',
                    opacity: '1'
                }
            });

            $('.settingsBalloon').balloon({
                position:'left',
                tipSize: 15,      
                html: true,
                css: {
                    boxShadow: '2px 2px 5px 1px rgba(0,0,0,0.6)',   
                    borderRadius: '0',
                    border: '1px solid #000',
                    padding: '20px',        
                    textAlign: 'justify',
                    backgroundColor: '#FFF',
                    color: '#595A5F',
                    fontSize: '100%',
                    maxWidth: '300px',
                    fontFamily: 'helvetica, arial, sans-serif',
                    fontSize: '13px',
                    opacity: '1'
                }
            });

            if (document.getElementById("allowFileAccessMessageWarning")) {
                document.getElementById("allowFileAccessMessageWarning").addEventListener('click', function() { chrome.tabs.create({url: "chrome://extensions/?id=" + chrome.runtime.id}) });
            }

        },
        focusConfirm: false,
        showCancelButton: true,
        width: '850px',
        preConfirm: () => {
            groupLabel =  document.getElementById('swal-groupLabel').value;
            return new Promise((resolve) => {      
                if (groupLabel == '') {
                  swal.showValidationError(
                    'The label cannot be empty.'
                  )
                }
                resolve()      
            })
          },
        }).then((result) => {        
            if (result.dismiss) {                
                $("#groupIcon"+gid).css('backgroundImage', 'url("../gicons/'+currentGroupIcon+'")');
                $("contentGroup"+gid).css('backgroundColor', '#'+currentGroupColor);
            } else {
                groupLabel =  document.getElementById('swal-groupLabel').value;
                groupDescription =  document.getElementById('swal-groupDescription').value;
                groupColor = $("input#groupBoxColorPicker").val().toString();
                groupSort = $("select#swal-groupSort").val().toString();
                groupIcon = $("select#image-picker-group-icons").data("picker").selected_values().toString();

                if (isNull(groupLabel)) {
                    swal(
                        'Error',
                        'The label cannot be empty!',
                        'error'
                        )
                } else {    
                    json.pages[pageID].groups[groupID].groupLabel = groupLabel;
                    json.pages[pageID].groups[groupID].groupDescription = groupDescription;
                    json.pages[pageID].groups[groupID].groupColor = groupColor;
                    json.pages[pageID].groups[groupID].groupSort = groupSort;
                    json.pages[pageID].groups[groupID].groupIcon = groupIcon;

                        document.getElementById("groupLabel"+gid).innerHTML = groupLabel;
                        if (groupDescription == '') { 
                            document.getElementById("groupDescription"+gid).style.display = 'none';
                        } else {                            
                            document.getElementById("groupDescription"+gid).innerHTML = groupDescription;
                            document.getElementById("groupDescription"+gid).style.display = 'block';
                        }
                    chrome.storage.local.set({ "jsonUS": JSON.stringify(json) }, function(){});  
                    if (groupColor != currentGroupColor) { location.reload() }     
/*                    swal({type: 'success', title: 'Group updated'}).then(() => { 
                            if (groupColor != currentGroupColor) { location.reload() } 
                        })       */     
                }
            }
            $("#contentGroup"+gid).css('boxShadow', '0px 2px 3px 0.5px rgba(0,0,0,0.2), 0 0 1px 1px rgba(0,0,0,0.05)');    
    })   
}



// GROUP COPY
async function groupCopy(pageID, groupID) {    
    var inputPages = {};
    for (p = 0; p < json['pages'].length; p++) { 
        inputPages[p] = json.pages[p].pageLabel;
    }
    
    var groupLabel = json.pages[pageID].groups[groupID].groupLabel;

    const {value: selectedPage} = await swal({
      title: 'Copy Group',
      input: 'select',
      inputOptions: inputPages,
      type: 'question',
      //text: 'Copy group "'+groupLabel+'" to which page?',
      //inputPlaceholder: 'Target page',
      inputPlaceholder: 'Select a page',
      showCancelButton: true,
      inputClass: 'form-control',
      width: '300px',
      inputValidator: (value) => {
        return new Promise((resolve) => {
            if (!value) {
                resolve('Please select an option.')
            } else {
                var jsonClone = JSON.parse(JSON.stringify(json));
                json.pages[value]['groups'].push(jsonClone.pages[pageID].groups[groupID]);
                chrome.storage.local.set({ "jsonUS": JSON.stringify(json) }, function(){});
                resolve()
            }
        })
      }
    })

    if (selectedPage) {
        location.reload()
        //swal({type: 'success', title: 'Group copied to "'+json.pages[selectedPage].pageLabel+'"'}).then(() => { location.reload() })
    }
}

// GROUP MOVE
async function groupMove(pageID, groupID) {    
    var inputPages = {};
    for (p = 0; p < json['pages'].length; p++) { 
        inputPages[p] = json.pages[p].pageLabel;
    }
    
    var groupLabel = json.pages[pageID].groups[groupID].groupLabel;
    const {value: selectedPage} = await swal({
      title: 'Move Group',
      input: 'select',
      inputOptions: inputPages,
      type: 'question',
      //text: 'Move group "'+groupLabel+'" to which page?',
      //inputPlaceholder: 'Target page',
      inputPlaceholder: 'Select a page',
      inputClass: 'form-control',
      width: '300px',      
      showCancelButton: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
            if (!value) {
                resolve('Please select an option.')
            } else if (value === pageID) {
              resolve('Group already at this page.')
            } else {
              json.pages[value]['groups'].push(json.pages[pageID].groups[groupID]);
              json.pages[pageID].groups.splice(groupID,1);
              chrome.storage.local.set({ "jsonUS": JSON.stringify(json) }, function(){});
              resolve()
            }
        })
      }
    })

    if (selectedPage) {
        location.reload()
        //swal({type: 'success', title: 'Group moved to "'+json.pages[selectedPage].pageLabel+'"'}).then(() => { location.reload() })
    }
}



// GROUP SORT
async function groupSort(pageID, groupID) {
    var inputOpt = {};
    var textOpt = 'Itens will be ordered and saved according to the selected option. This will have no effect if a sort order has been already set for the group';
    
    inputOpt['az'] =  'A-Z';
    inputOpt['za'] =  'Z-A';
    inputOpt['newst'] =  'Newst';
    inputOpt['oldest'] =  'Oldest';    

    const {value: order} = await swal({
      title: 'Sort Group',
      text: textOpt,
      input: 'radio',
      type: 'warning',
      inputOptions: inputOpt,      
      width: '600px',
      showCancelButton: true,      
      inputValidator: (value) => {
        return new Promise((resolve) => {
            if (!value) {
                resolve('Please select an option.')
            }
            switch(value) {          
            case 'az':
                json.pages[pageID].groups[groupID]['itens'].sort(function(a, b) {
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
                resolve()
                break;
            case 'za':
                json.pages[pageID].groups[groupID]['itens'].sort(function(a, b) {
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
                resolve()  
                break;
            case 'oldest':
                json.pages[pageID].groups[groupID]['itens'].sort(function(a, b) {
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
                resolve()
                break;  
            case 'newst':
                json.pages[pageID].groups[groupID]['itens'].sort(function(a, b) {
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
                resolve()  
                break;            
            }
        })
      }
    })

    if (order) {
        location.reload()
        //swal({type: 'success', title: 'Group sorted'}).then(() => { location.reload() })
    }

}



// GROUP OPEN ALL ITENS IN TABS
function openAllitens(pageID, groupID) {

    swal({
      title: 'Open bookmarks',
      text: "Open all "+json.pages[pageID].groups[groupID]['itens'].length+" bookmarks in tabs?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, open them all'
    }).then((result) => {
        if (result.value) { 
            for (i = 0; i < json.pages[pageID].groups[groupID]['itens'].length; i++) {        
                chrome.tabs.create({ active: false, url: json.pages[pageID].groups[groupID].itens[i].url })        
            }
        }        
    })
}

// GROUP NEW
async function groupNew(pageID) {
    var groupLabel;
    var groupDescription;
    var nextGroupID = json.pages[pageID]['groups'].length;
    await swal({
      title: 'New Group',
      html:
        '<div style="width:100%; text-align:left;">'+
            '<div style="width:100%; text-align:left;">'+
                '<span style="font-weight: bold;">Label</span><input    id="swal-groupLabel" class="swal2-input">' +
                '<span style="font-weight: bold;">Description</span><input  id="swal-groupDescription" class="swal2-input">'+
            '</div>'+
        '</div>',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            groupLabel =  document.getElementById('swal-groupLabel').value;
            return new Promise((resolve) => {      
                if (groupLabel == '') {
                  swal.showValidationError(
                    'The label cannot be empty.'
                  )
                }
                resolve()      
            })
          },
        }).then((result) => {        
            if (result.dismiss) {
            } else {
                groupLabel =  document.getElementById('swal-groupLabel').value;
                groupDescription =  document.getElementById('swal-groupDescription').value;
                if (isNull(groupLabel)) {
                    swal(
                        'Error',
                        'The label cannot be empty!',
                        'error'
                        )
                } else {   
                    var newGroupObj = new Object();
                    newGroupObj.groupLabel = groupLabel;
                    newGroupObj.groupDescription = groupDescription;
                    newGroupObj.groupIcon = "";
                    newGroupObj.groupSort = "manual";
                    newGroupObj['itens'] = [];
    
                    json.pages[pageID]['groups'].push(newGroupObj);
                    chrome.storage.local.set({ "jsonUS": JSON.stringify(json) }, function(){});    
                    location.reload()            
                    //swal({type: 'success', title: 'Group "'+groupLabel+'" created"'}).then(() => { location.reload() })
                }
            }        
    })   
}


// GROUP DELETE
function groupDelete(pageID, groupID) {    
    var currentGroupLabel = json.pages[pageID].groups[groupID].groupLabel;
    swal({
      title: 'Delete group "'+currentGroupLabel+'"?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it'
    }).then((result) => {
      if (result.value) {
        json.pages[pageID].groups.splice(groupID,1);
        chrome.storage.local.set({ "jsonUS": JSON.stringify(json) }, function() {
            location.reload()
            //swal('Group deleted', 'Group "'+currentGroupLabel+ '" was deleted', 'success').then(() => { location.reload() })
        });
      }
    })
} 


/******************** GROUP FUNCTIONS END ********************/







/******************** ITEM FUNCTIONS BEGIN ********************/

// ITEM OPEN NEW PAGE
function openItemNewTab(pageID, groupID, itemID) {
    chrome.tabs.create({ active: false, url: json.pages[pageID].groups[groupID].itens[itemID].url });
}





// ITEM EDIT
async function bookmarkEdit(pageID, groupID, itemID) {
    var iid = pageID.toString() + groupID.toString() + + itemID.toString();    
    var currentBookmarkLabel = json.pages[pageID].groups[groupID].itens[itemID].label;
    var currentBookmarkDescription = json.pages[pageID].groups[groupID].itens[itemID].alt;
    var currentBookmarkUrl = json.pages[pageID].groups[groupID].itens[itemID].url;
    var currentBookmarkIcon = json.pages[pageID].groups[groupID].itens[itemID].icon;

    var BookmarkIcon;
    var BookmarkLabel;
    var BookmarkDescription;    
    var BookmarkUrl;

    var bookmarkIcons;
    for (i = 0; i < jsonImg['icons'].length; i++) {
        var imageLabel = jsonImg.icons[i].label;
        var imageValue = jsonImg.icons[i].value;
        var imageFile = jsonImg.icons[i].file;
        bookmarkIcons += '<option data-img-src="'+imageFile+'" data-img-label="'+imageLabel+'" value="'+imageValue+'"></option>';
        }

    await swal({
      title: 'Edit Bookmark',
      html:
        '<div style="width:100%; text-align:left;">'+
            '<span style="font-weight: bold;">Label</span><input id="swal-bookmarkLabel" class="swal2-input" value="'+currentBookmarkLabel+'">' +
            '<span style="font-weight: bold;">Description</span><input id="swal-bookmarkDescription" class="swal2-input" value="'+currentBookmarkDescription+'">'+
            '<span style="font-weight: bold;">URL</span><input id="swal-bookmarkUrl" class="swal2-input" value="'+currentBookmarkUrl+'">'+

            '<span style="font-weight: bold;">Bookmark Icon</span><div class="settingsBalloon" alt="You can choose one of the icons below or put a URL address of your choice. A local image can be set using <b>file:///</b>.<br>ex:<br>file:///C:/Temp/icon.png<br>file:///home/user/icon.png" ><i class="fas fa-question-circle"></i></div><input id="swal-bookmarkIcon" class="swal2-input" value="'+currentBookmarkIcon+'"><BR><BR>'+

        '</div>'+

        '<BR>'+

        '<div class="panel-group" id="accordionBookmarkEdit">'+
            '<div class="panel panel-default">'+
                '<a data-toggle="collapse" data-parent="#accordionBookmarkEdit" href="#bookmark-icons">'+
                '<div class="panel-heading">'+
                    '<h4 class="panel-title" style="font-size: 14px; text-align: center;">bookmark icon</h4>'+
                    '</div>'+
                '</a>'+
              '<div id="bookmark-icons" class="panel-collapse collapse">'+
                '<div class="panel-body">'+
                '<select class="image-picker show-labels" id="image-picker-bookmark-icons" >'+
                    bookmarkIcons +
                '</select>' +
                '</div>'+
                '</div>'+
            '</div>'+
            allowFileAccessMessage+

        '</div>',
        focusConfirm: false,
        showCancelButton: true,
        inputClass: 'form-control',
        onOpen: function() {

            //SELECT ICONS
            $("select#image-picker-bookmark-icons").imagepicker({ 
                show_label: false,
                initialized: function(){ $(".image_picker_image").css({"width": "64px", "height": "64px"}); },
                selected: function(select){ 
                    var selectedImageValue = select.picker.select[0].value.toString();
                    $("input#swal-bookmarkIcon").val(selectedImageValue);
                    $("img#itemIconImage"+iid).src = '"icons/'+selectedImageValue+'"';
                    }                    
            });
            //SET CURRENT VALUE FOR SELECT BACKGROUNDS
            $("select#image-picker-bookmark-icons").val(currentBookmarkIcon);

            //SYNC SELECT BACKGROUNDS
            $("select#image-picker-bookmark-icons").data('picker').sync_picker_with_select();

            //BALOONS
            $('.settingsBalloon').balloon({
                position:'top',
                tipSize: 15,      
                html: true,
                css: {
                    position:'top',
                    boxShadow: '2px 2px 5px 1px rgba(0,0,0,0.6)',   
                    borderRadius: '0',
                    border: '1px solid #000',
                    padding: '20px',        
                    textAlign: 'justify',
                    backgroundColor: '#FFF',
                    color: '#595A5F',
                    fontSize: '100%',
                    maxWidth: '300px',
                    fontFamily: 'helvetica, arial, sans-serif',
                    fontSize: '13px',
                    opacity: '1'
                }
            });

            $('.settingsBalloon').balloon({
                position:'left',
                tipSize: 15,      
                html: true,
                css: {
                    boxShadow: '2px 2px 5px 1px rgba(0,0,0,0.6)',   
                    borderRadius: '0',
                    border: '1px solid #000',
                    padding: '20px',        
                    textAlign: 'justify',
                    backgroundColor: '#FFF',
                    color: '#595A5F',
                    fontSize: '100%',
                    maxWidth: '300px',
                    fontFamily: 'helvetica, arial, sans-serif',
                    fontSize: '13px',
                    opacity: '1'
                }
            });

            if (document.getElementById("allowFileAccessMessageWarning")) {
                document.getElementById("allowFileAccessMessageWarning").addEventListener('click', function() { chrome.tabs.create({url: "chrome://extensions/?id=" + chrome.runtime.id}) });
            }            
        },
        focusConfirm: false,
        showCancelButton: true,
        width: '850px',
        preConfirm: () => {
            bookmarkLabel =  document.getElementById('swal-bookmarkLabel').value;
            return new Promise((resolve) => {      
                if (bookmarkLabel == '') {
                  swal.showValidationError(
                    'The label cannot be empty.'
                  )
                }
                resolve()      
            })
          },
        }).then((result) => {        
            if (result.dismiss) {
                $("img#itemIconImage"+iid).src = '"icons/'+currentBookmarkIcon+'"';
            } else {    			
    			bookmarkLabel = document.getElementById('swal-bookmarkLabel').value;
    			bookmarkDescription = document.getElementById('swal-bookmarkDescription').value;
    			bookmarkUrl = document.getElementById('swal-bookmarkUrl').value;
    			bookmarkIcon = document.getElementById('swal-bookmarkIcon').value;

                if (isNull(bookmarkLabel)) {
                    swal(
                        'Error',
                        'The label cannot be empty!',
                        'error'
                        )

                } else {    
   
					json.pages[pageID].groups[groupID].itens[itemID].label = bookmarkLabel;
					json.pages[pageID].groups[groupID].itens[itemID].alt = bookmarkDescription;
					json.pages[pageID].groups[groupID].itens[itemID].url = bookmarkUrl;
					json.pages[pageID].groups[groupID].itens[itemID].icon = bookmarkIcon;

                    chrome.storage.local.set({ "jsonUS": JSON.stringify(json) }, function(){});
                    location.reload()             
/*                    swal({type: 'success', title: 'Bookmark updated'}).then(() => { 
                            location.reload()  
                        })
*/
                }
            }        
    })   

}

// ITEM COPY
async function itemCopy(pageID, groupID, itemID) {  
    var curGID = pageID.toString() +'.'+ groupID.toString();  
    var inputGroups = {};
    for (p = 0; p < json['pages'].length; p++) { 
        var pageLabel = json.pages[p].pageLabel;        
        for (g = 0; g < json.pages[p]['groups'].length; g++) { 
            var gid = p.toString() +'.'+ g.toString();
            var groupLabel = json.pages[p].groups[g].groupLabel;            
                inputGroups[gid] = pageLabel+' :: '+groupLabel;
        }
    }
    var bookmarkLabel = json.pages[pageID].groups[groupID].itens[itemID].label;
    const {value: selectedGroup} = await swal({
      title: 'Copy Bookmark',
      input: 'select',
      inputOptions: inputGroups,
      type: 'question',
      //text: 'Copy bookmark "'+bookmarkLabel+'" to which group?',
      //inputPlaceholder: 'Target group',
      inputPlaceholder: 'Select a group',
      inputClass: 'form-control',
      width: '400px',
      showCancelButton: true,      
      inputValidator: (value) => {
        return new Promise((resolve) => { 
            if (!value) {
                resolve('Please select an option.')
            } else {                
                var dstPage = value.split('.')[0];
                var dstGroup = value.split('.')[1];
                var jsonClone = JSON.parse(JSON.stringify(json));
                json.pages[dstPage].groups[dstGroup]['itens'].push(jsonClone.pages[pageID].groups[groupID].itens[itemID]);
                chrome.storage.local.set({ "jsonUS": JSON.stringify(json) }, function(){});
                resolve()
            }
        })
      }
    })

    if (selectedGroup) {
        var dstPage = selectedGroup.split('.')[0];
        var dstGroup = selectedGroup.split('.')[1];
        var dstGID =  dstPage.toString() + dstGroup.toString();
        location.reload()
        /*swal({type: 'success', title: 'Bookmark copied to "'+document.getElementById("groupLabel"+dstGID).innerHTML+'"'}).then(() => { location.reload() })*/
    }
}

// ITEM MOVE
async function itemMove(pageID, groupID, itemID) {    
    var curGID = pageID.toString() +'.'+ groupID.toString();
    var inputGroups = {};
    for (p = 0; p < json['pages'].length; p++) { 
        var pageLabel = json.pages[p].pageLabel;        
        for (g = 0; g < json.pages[p]['groups'].length; g++) { 
            var gid = p.toString() +'.'+ g.toString();
            var groupLabel = json.pages[p].groups[g].groupLabel;
            if (gid !=  curGID) {
                inputGroups[gid] = pageLabel+' :: '+groupLabel;
            }
            
        }
    }
    var bookmarkLabel = json.pages[pageID].groups[groupID].itens[itemID].label;
    const {value: selectedGroup} = await swal({
      title: 'Move Bookmark',
      input: 'select',
      inputOptions: inputGroups,
      type: 'question',
      //text: 'Move bookmark "'+bookmarkLabel+'" to which group?',
      //inputPlaceholder: 'Target group',
      inputPlaceholder: 'Select a group',
      inputClass: 'form-control',
      width: '400px',      
      showCancelButton: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {  
            if (!value) {
            	resolve('Please select an option.')
            } else {            
                var dstPage = value.split('.')[0];
                var dstGroup = value.split('.')[1];                
                json.pages[dstPage].groups[dstGroup]['itens'].push(json.pages[pageID].groups[groupID].itens[itemID]);
                json.pages[pageID].groups[groupID].itens.splice(itemID,1);
                chrome.storage.local.set({ "jsonUS": JSON.stringify(json) }, function(){});
                resolve()
            }
        })
      }
    })

    if (selectedGroup) {
        var dstPage = selectedGroup.split('.')[0];
        var dstGroup = selectedGroup.split('.')[1];
        var dstGID =  dstPage.toString() + dstGroup.toString();
        location.reload()
        /*swal({type: 'success', title: 'Item moved to "'+document.getElementById("groupLabel"+dstGID).innerHTML+'"'}).then(() => { location.reload() })*/
    }
}


// ITEM NEW
async function itemNew(pageID, groupID) {

    var BookmarkIcon;
    var BookmarkLabel;
    var BookmarkDescription;    
    var BookmarkUrl;

    var bookmarkIcons;
    for (i = 0; i < jsonImg['icons'].length; i++) {
        var imageLabel = jsonImg.icons[i].label;
        var imageValue = jsonImg.icons[i].value;
        var imageFile = jsonImg.icons[i].file;
        bookmarkIcons += '<option data-img-src="'+imageFile+'" data-img-label="'+imageLabel+'" value="'+imageValue+'"></option>';
        }

    await swal({
      	title: 'New Bookmark',
      	html:
        '<div style="width:100%; text-align:left;">'+
            '<span style="font-weight: bold;">Label</span><input id="swal-bookmarkLabel" class="swal2-input" value="">' +
            '<span style="font-weight: bold;">Description</span><input id="swal-bookmarkDescription" class="swal2-input" value="">'+
            '<span style="font-weight: bold;">URL</span><input id="swal-bookmarkUrl" class="swal2-input" value="">'+

            '<span style="font-weight: bold;">Bookmark Icon</span><div class="settingsBalloon" alt="You can choose one of the icons below or put a URL address of your choice. A local image can be set using <b>file:///</b>.<br>ex:<br>file:///C:/Temp/icon.png<br>file:///home/user/icon.png"><i class="fas fa-question-circle"></i></div><input id="swal-bookmarkIcon" class="swal2-input" value=""><BR><BR>'+

        '</div>'+

        '<BR>'+

        '<div class="panel-group" id="accordionBookmarkEdit">'+
            '<div class="panel panel-default">'+
                '<a data-toggle="collapse" data-parent="#accordionBookmarkEdit" href="#bookmark-icons">'+
                '<div class="panel-heading">'+
                    '<h4 class="panel-title" style="font-size: 14px; text-align: center;">bookmark icon</h4>'+
                    '</div>'+
                '</a>'+
              '<div id="bookmark-icons" class="panel-collapse collapse">'+
                '<div class="panel-body">'+
                '<select class="image-picker show-labels" id="image-picker-bookmark-icons">'+
                    bookmarkIcons +
                '</select>' +
                '</div>'+
                '</div>'+
            '</div>'+            
            allowFileAccessMessage+

        '</div>',
        focusConfirm: false,
        showCancelButton: true,
        inputClass: 'form-control',
        onOpen: function() {

            //SELECT ICONS
            $("select#image-picker-bookmark-icons").imagepicker({ 
                show_label: false,
                initialized: function(){ $(".image_picker_image").css({"width": "64px", "height": "64px"}); },
                selected: function(select){ 
                    $("input#swal-bookmarkIcon").val(select.picker.select[0].value.toString());
                }
            });        	

            //SET CURRENT VALUE FOR SELECT BACKGROUNDS
            $("select#image-picker-bookmark-icons").val('');

            //SYNC SELECT BACKGROUNDS
            $("select#image-picker-bookmark-icons").data('picker').sync_picker_with_select();

            //BALOONS
            $('.settingsBalloon').balloon({
                position:'top',
                tipSize: 15,      
                html: true,
                css: {
                    position:'top',
                    boxShadow: '2px 2px 5px 1px rgba(0,0,0,0.6)',   
                    borderRadius: '0',
                    border: '1px solid #000',
                    padding: '20px',        
                    textAlign: 'justify',
                    backgroundColor: '#FFF',
                    color: '#595A5F',
                    fontSize: '100%',
                    maxWidth: '300px',
                    fontFamily: 'helvetica, arial, sans-serif',
                    fontSize: '13px',
                    opacity: '1'
                }
            });

            $('.settingsBalloon').balloon({
                position:'left',
                tipSize: 15,      
                html: true,
                css: {
                    boxShadow: '2px 2px 5px 1px rgba(0,0,0,0.6)',   
                    borderRadius: '0',
                    border: '1px solid #000',
                    padding: '20px',        
                    textAlign: 'justify',
                    backgroundColor: '#FFF',
                    color: '#595A5F',
                    fontSize: '100%',
                    maxWidth: '300px',
                    fontFamily: 'helvetica, arial, sans-serif',
                    fontSize: '13px',
                    opacity: '1'
                }
            });

            if (document.getElementById("allowFileAccessMessageWarning")) {
                document.getElementById("allowFileAccessMessageWarning").addEventListener('click', function() { chrome.tabs.create({url: "chrome://extensions/?id=" + chrome.runtime.id}) });
            }            
        },
        focusConfirm: false,
        showCancelButton: true,
        width: '850px',
        preConfirm: () => {
            bookmarkLabel =  document.getElementById('swal-bookmarkLabel').value;
            bookmarkUrl = document.getElementById('swal-bookmarkUrl').value;
            return new Promise((resolve) => {      
                if (bookmarkLabel == '') {
                  swal.showValidationError(
                    'The label cannot be empty.'
                  )
                } else if (bookmarkUrl == '') {
                  swal.showValidationError(
                    'The URL cannot be empty.'
                  )
                }                
                resolve()      
            })
          },
        }).then((result) => {        
            if (result.dismiss) {                
            } else {          
          		bookmarkLabel = document.getElementById('swal-bookmarkLabel').value;
          		bookmarkDescription = document.getElementById('swal-bookmarkDescription').value;
          		bookmarkUrl = document.getElementById('swal-bookmarkUrl').value;
          		bookmarkIcon = document.getElementById('swal-bookmarkIcon').value;
          		
                var newBookmarkObj = new Object();
                newBookmarkObj.label = bookmarkLabel;
                newBookmarkObj.url = bookmarkUrl;
                newBookmarkObj.alt = bookmarkDescription;
                newBookmarkObj.icon = bookmarkIcon;
                newBookmarkObj.date = Date.now().toString();

                json.pages[pageID].groups[groupID]['itens'].push(newBookmarkObj);
                chrome.storage.local.set({ "jsonUS": JSON.stringify(json) }, function(){
                    location.reload()
                	/*swal({type: 'success', title: 'Bookmark "'+bookmarkLabel+'" created'}).then(() => { location.reload() })*/
                });                
            }
    })   
}


// ITEM NEW NO GROUPID
async function itemNewNoGroupID(pageID) {

    var BookmarkIcon;
    var BookmarkLabel;
    var BookmarkDescription;    
    var BookmarkUrl;

    var bookmarkIcons;
    for (i = 0; i < jsonImg['icons'].length; i++) {
        var imageLabel = jsonImg.icons[i].label;
        var imageValue = jsonImg.icons[i].value;
        var imageFile = jsonImg.icons[i].file;
        bookmarkIcons += '<option data-img-src="'+imageFile+'" data-img-label="'+imageLabel+'" value="'+imageValue+'"></option>';
        }

    var groupOptions
	for (g = 0; g < json.pages[pageID]['groups'].length; g++) {             
            var groupLabel = json.pages[pageID].groups[g].groupLabel;            
            groupOptions += '<option value="'+g+'">'+groupLabel+'</option>';
        }

    await swal({
      	title: 'New Bookmark',
      	html:
        '<div style="width:100%; text-align:left;">'+
            '<span style="font-weight: bold;">Label</span><input id="swal-bookmarkLabel" class="swal2-input" value="">' +
            '<span style="font-weight: bold;">Description</span><input id="swal-bookmarkDescription" class="swal2-input" value="">'+
            '<span style="font-weight: bold;">URL</span><input id="swal-bookmarkUrl" class="swal2-input" value="">'+
            '<span style="font-weight: bold;">Target group</span><select class="form-control" id="swal-targetGroup" style="margin-top: 10px;">'+groupOptions+'</select>'+

            '<BR><BR>'+      

            '<span style="font-weight: bold;">Bookmark Icon</span><div class="settingsBalloon" alt="You can choose one of the icons below or put a URL address of your choice. A local image can be set using <b>file:///</b>.<br>ex:<br>file:///C:/Temp/icon.png<br>file:///home/user/icon.png"><i class="fas fa-question-circle"></i></div><input id="swal-bookmarkIcon" class="swal2-input" value=""><BR><BR>'+

        '</div>'+

        '<BR>'+

        '<div class="panel-group" id="accordionBookmarkEdit">'+
            '<div class="panel panel-default">'+
                '<a data-toggle="collapse" data-parent="#accordionBookmarkEdit" href="#bookmark-icons">'+
                '<div class="panel-heading">'+
                    '<h4 class="panel-title" style="font-size: 14px; text-align: center;">bookmark icon</h4>'+
                    '</div>'+
                '</a>'+
              '<div id="bookmark-icons" class="panel-collapse collapse">'+
                '<div class="panel-body">'+
                '<select class="image-picker show-labels" id="image-picker-bookmark-icons">'+
                    bookmarkIcons +
                '</select>' +
                '</div>'+
                '</div>'+
            '</div>'+            
            allowFileAccessMessage+

        '</div>',
        focusConfirm: false,
        showCancelButton: true,
        inputClass: 'form-control',
        onOpen: function() {

            //SELECT ICONS
            $("select#image-picker-bookmark-icons").imagepicker({ 
                show_label: false,
                initialized: function(){ $(".image_picker_image").css({"width": "64px", "height": "64px"}); },
                selected: function(select){ 
                    $("input#swal-bookmarkIcon").val(select.picker.select[0].value.toString());
                }
            });        	

            //SET CURRENT VALUE FOR SELECT BACKGROUNDS
            $("select#image-picker-bookmark-icons").val('');

            //SYNC SELECT BACKGROUNDS
            $("select#image-picker-bookmark-icons").data('picker').sync_picker_with_select();

            //BALOONS
            $('.settingsBalloon').balloon({
                position:'top',
                tipSize: 15,      
                html: true,
                css: {
                    position:'top',
                    boxShadow: '2px 2px 5px 1px rgba(0,0,0,0.6)',   
                    borderRadius: '0',
                    border: '1px solid #000',
                    padding: '20px',        
                    textAlign: 'justify',
                    backgroundColor: '#FFF',
                    color: '#595A5F',
                    fontSize: '100%',
                    maxWidth: '300px',
                    fontFamily: 'helvetica, arial, sans-serif',
                    fontSize: '13px',
                    opacity: '1'
                }
            });

            $('.settingsBalloon').balloon({
                position:'left',
                tipSize: 15,      
                html: true,
                css: {
                    boxShadow: '2px 2px 5px 1px rgba(0,0,0,0.6)',   
                    borderRadius: '0',
                    border: '1px solid #000',
                    padding: '20px',        
                    textAlign: 'justify',
                    backgroundColor: '#FFF',
                    color: '#595A5F',
                    fontSize: '100%',
                    maxWidth: '300px',
                    fontFamily: 'helvetica, arial, sans-serif',
                    fontSize: '13px',
                    opacity: '1'
                }
            });

            if (document.getElementById("allowFileAccessMessageWarning")) {
                document.getElementById("allowFileAccessMessageWarning").addEventListener('click', function() { chrome.tabs.create({url: "chrome://extensions/?id=" + chrome.runtime.id}) });
            }            
        },
        focusConfirm: false,
        showCancelButton: true,
        width: '850px',
        preConfirm: () => {
            bookmarkLabel =  document.getElementById('swal-bookmarkLabel').value;
            bookmarkUrl = document.getElementById('swal-bookmarkUrl').value;
            return new Promise((resolve) => {      
                if (bookmarkLabel == '') {
                  swal.showValidationError(
                    'The label cannot be empty.'
                  )
                } else if (bookmarkUrl == '') {
                  swal.showValidationError(
                    'The URL cannot be empty.'
                  )
                }                
                resolve()      
            })
          },
        }).then((result) => {        
            if (result.dismiss) {                
            } else {          
          		bookmarkLabel = document.getElementById('swal-bookmarkLabel').value;
          		bookmarkDescription = document.getElementById('swal-bookmarkDescription').value;
          		bookmarkUrl = document.getElementById('swal-bookmarkUrl').value;
          		bookmarkIcon = document.getElementById('swal-bookmarkIcon').value;
          		var groupID =  document.getElementById('swal-targetGroup').value
          		
                var newBookmarkObj = new Object();
                newBookmarkObj.label = bookmarkLabel;
                newBookmarkObj.url = bookmarkUrl;
                newBookmarkObj.alt = bookmarkDescription;
                newBookmarkObj.icon = bookmarkIcon;
                newBookmarkObj.date = Date.now().toString();

                json.pages[pageID].groups[groupID]['itens'].push(newBookmarkObj);
                chrome.storage.local.set({ "jsonUS": JSON.stringify(json) }, function(){
                    location.reload()
                	//swal({type: 'success', title: 'Bookmark "'+bookmarkLabel+'" created'}).then(() => { location.reload() })
                });                
            }
    })   
}




// ITEM DELETE
function itemDelete(pageID, groupID, itemID) {    
    var curIID = pageID.toString() + groupID.toString() + itemID.toString();
    var currentItemLabel = json.pages[pageID].groups[groupID].itens[itemID].label;
    swal({
      title: 'Delete "'+currentItemLabel+'"?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it'
    }).then((result) => {
      if (result.value) {
        json.pages[pageID].groups[groupID].itens.splice(itemID,1);
        chrome.storage.local.set({ "jsonUS": JSON.stringify(json) }, function() {             
        });
        location.reload()
        //swal({type: 'success', title: 'Bookmark "'+currentItemLabel+'" was deleted"'}).then(() => { location.reload() })
      }
    })
    
} 

/******************** ITEM FUNCTIONS END ********************/




/******************** SUPPORT FUNCTIONS BEGIN ********************/


function selectPage(curPage) {
    var topNav = document.getElementById("topNav");
    
    chrome.storage.local.set({ "currentPage": curPage }, function(){            
        $(".topLink").css({'backgroundColor': '', 'color': '' });
        $(".pageSection").css( { "display":"none" });        
        document.getElementById("pageSection"+curPage).prepend(topNav);    
        document.getElementById("pageSection"+curPage).style.display = "block";
        document.getElementById("topLink"+curPage).style.backgroundColor = '#FFF';
        document.getElementById("topLink"+curPage).style.color = '#2D2D5F'; //BUG
        $('.contentPage').masonry({
            itemSelector: '.contentGroup',
            columnWidth: '.contentGroup',
            percentPosition: true,      
            transitionDuration: 0,        
        });
    });
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function isNull(obj) {
    if ( typeof obj === 'undefined' || obj === null || obj === "" ) {
        return true;
    }
}


function hideElement(element) {
    document.getElementById(element).style.display = 'none'; 
}

function showElement(element) {
    document.getElementById(element).style.display = 'block'; 
}

/*
function responsiveTopBar() {
    var x = document.getElementById("topNav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}
*/

function openCloseNav() {
    var pageSections = document.getElementsByClassName("pageSection");
        
    if (document.getElementById("sideNav").style.width == "0px")
        {
        document.getElementById("sideNav").style.width = "250px";
        for (m = 0; m < pageSections.length; m++) {
            pageSections[m].style.marginLeft = "250px";
            }
        }
    else
        {               
        document.getElementById("sideNav").style.width = "0px";
        for (m = 0; m < pageSections.length; m++) {
            pageSections[m].style.marginLeft = "0px";    
            }
        }    
}



function menuOpen(menu) {
    var pageSections = document.getElementsByClassName("pageSection");
        
    if (document.getElementById(menu).style.width == "0px")
        {
        document.getElementById(menu).style.width = "250px";
        for (m = 0; m < pageSections.length; m++) {
            pageSections[m].style.marginRight = "250px";
            }
        }
    else
        {               
        document.getElementById(menu).style.width = "0px";
        for (m = 0; m < pageSections.length; m++) {
            pageSections[m].style.marginRight = "0px";    
            }
        }    
}




function showSearchResults() {
    searchString = document.getElementById("searchTopBarInput").value;
    if (document.getElementById("groupSectionSearch")) { document.getElementById("groupSectionSearch").remove() };
        
        //GROUP SECTION
        var groupSection = document.createElement('DIV');
        groupSection.className = "groupSection"; 
        groupSection.id = 'groupSectionSearch';

        //CONTENT GROUP 
        var contentGroup = document.createElement('DIV');
        contentGroup.className = "contentGroupSearch";
        contentGroup.id = "contentGroupSearch";

        //GROUP BOOKMARK SECTION
        var bookmarksSection = document.createElement('DIV');
        bookmarksSection.className = "bookmarksSection";
        bookmarksSection.id = "bookmarksSectionSearch";
    
        //GROUP BOOKMARK LIST
        var bookmarksList = document.createElement('UL');
        bookmarksList.className = "bookmarksList";
        bookmarksList.id = "bookmarksListSearch";

        //GROUP ASSEMBLE
        bookmarksSection.appendChild(bookmarksList);
        contentGroup.appendChild(bookmarksSection);
        groupSection.appendChild(contentGroup);

        for (i = 0; i < jsonSearchIndex['itens'].length; i++) {                
            var itemLabelText = jsonSearchIndex.itens[i].label;
            var itemUrl = jsonSearchIndex.itens[i].url;
            var itemAlt = jsonSearchIndex.itens[i].alt;
            var itemIcon = jsonSearchIndex.itens[i].icon; 

            var allString = itemLabelText + ' ' + itemAlt + ' ' + itemUrl;
            regex = new RegExp(searchString, 'gi');
            var strResults = allString.match(regex);
            if (strResults) {

                //GROUP BOOKMARK LIST ITEM
                var bookmarksListItem = document.createElement('LI');
                bookmarksListItem.className = "bookmarksListItemSearch";
                bookmarksListItem.id = "bookmarksListItemSearch"+i;
    
                //CONTENT ITEM
                var contentItem = document.createElement('DIV');
                contentItem.className = "contentItem";
                contentItem.id = "contentItemSearch"+i;        
    
                //ITEM LINK
                var itemLink = document.createElement('A');
                itemLink.className = "itemLinkSearch";
                itemLink.id = "itemLinkSearch"+i;    
                itemLink.href = itemUrl;                
    
                //ITEM ICON IMAGE
                var itemIconImage = document.createElement('IMG');
                itemIconImage.className = "itemIconImage";
                itemIconImage.id = "itemIconImageSearch"+i;
                itemIconImage.title = itemAlt+"\n"+itemUrl;
                //if ( (itemIcon.toLowerCase().startsWith('http')) || (itemIcon.toLowerCase().startsWith('file')) ) {
                if (itemIcon.toLowerCase().match(/^(http:\/\/|https:\/\/|file:\/\/\/).*/) ) {                
                    itemIconImage.src = itemIcon;    
                } else if (itemIcon == '') {
                    itemIconImage.src = 'icons/default.png'; 
                } else {
                    itemIconImage.src = 'icons/'+itemIcon;
                }
                
                //ITEM LABEL
                var itemLabel = document.createElement('DIV');
                itemLabel.className = "itemLabel";   
                itemLabel.id = "itemLabelSearch"+i;         
                itemLabel.innerHTML = itemLabelText;
    

                //ITEM ASSEMBLE
                itemLink.appendChild(contentItem);

                contentItem.appendChild(itemIconImage);
                contentItem.appendChild(itemLabel);

                bookmarksListItem.appendChild(itemLink);
                bookmarksList.appendChild(bookmarksListItem); 

            }  
        }
    document.getElementById("searchResultsBar").appendChild(groupSection);
    searchOpen();
}


function reflowSearchResults(searchString) {
    searchString = document.getElementById("searchTopBarInput").value;  
    if (document.getElementById("groupSectionSearch")) { document.getElementById("groupSectionSearch").remove() };
        
        //GROUP SECTION
        var groupSection = document.createElement('DIV');
        groupSection.className = "groupSection"; 
        groupSection.id = 'groupSectionSearch';

        //CONTENT GROUP 
        var contentGroup = document.createElement('DIV');
        contentGroup.className = "contentGroupSearch";
        contentGroup.id = "contentGroupSearch";
        
        //GROUP BOOKMARK SECTION
        var bookmarksSection = document.createElement('DIV');
        bookmarksSection.className = "bookmarksSection";
        bookmarksSection.id = "bookmarksSectionSearch";
    
        //GROUP BOOKMARK LIST
        var bookmarksList = document.createElement('UL');
        bookmarksList.className = "bookmarksList";
        bookmarksList.id = "bookmarksListSearch";

        //GROUP ASSEMBLE
        bookmarksSection.appendChild(bookmarksList);

        contentGroup.appendChild(bookmarksSection);

        groupSection.appendChild(contentGroup);

   

        for (i = 0; i < jsonSearchIndex['itens'].length; i++) {                
            var itemLabelText = jsonSearchIndex.itens[i].label;
            var itemUrl = jsonSearchIndex.itens[i].url;
            var itemAlt = jsonSearchIndex.itens[i].alt;
            var itemIcon = jsonSearchIndex.itens[i].icon;
            var allString = itemLabelText + ' ' + itemAlt + ' ' + itemUrl;
            regex = new RegExp(searchString, 'gi');
            var strResults = allString.match(regex);
            if (strResults) {
                //GROUP BOOKMARK LIST ITEM
                var bookmarksListItem = document.createElement('LI');
                bookmarksListItem.className = "bookmarksListItemSearch";
                bookmarksListItem.id = "bookmarksListItemSearch"+i;
    
                //CONTENT ITEM
                var contentItem = document.createElement('DIV');
                contentItem.className = "contentItem";
                contentItem.id = "contentItemSearch"+i;        
    
                //ITEM LINK
                var itemLink = document.createElement('A');
                itemLink.className = "itemLinkSearch";
                itemLink.id = "itemLinkSearch"+i;    
                itemLink.href = itemUrl;                
    
                //ITEM ICON IMAGE
                var itemIconImage = document.createElement('IMG');
                itemIconImage.className = "itemIconImage";
                itemIconImage.id = "itemIconImageSearch"+i;
                itemIconImage.title = itemAlt+"\n"+itemUrl;
                //if ( (itemIcon.toLowerCase().startsWith('http')) || (itemIcon.toLowerCase().startsWith('file')) ) {
                if (itemIcon.toLowerCase().match(/^(http:\/\/|https:\/\/|file:\/\/\/).*/) ) {                
                    itemIconImage.src = itemIcon;    
                } else if (itemIcon == '') {
                    itemIconImage.src = 'icons/default.png'; 
                } else {
                    itemIconImage.src = 'icons/'+itemIcon;
                }
                
                //ITEM LABEL
                var itemLabel = document.createElement('DIV');
                itemLabel.className = "itemLabel";   
                itemLabel.id = "itemLabelSearch"+i;         
                itemLabel.innerHTML = itemLabelText;
    

                //ITEM ASSEMBLE
                itemLink.appendChild(contentItem);

                contentItem.appendChild(itemIconImage);
                contentItem.appendChild(itemLabel);

                bookmarksListItem.appendChild(itemLink);
                bookmarksList.appendChild(bookmarksListItem); 

            }  
        }
    document.getElementById("searchResultsBar").appendChild(groupSection);
}



function searchOpen() {
    var pageSections = document.getElementsByClassName("pageSection");
        
    if (document.getElementById("searchResultsBar").style.width == "0px")
        {
        document.getElementById("searchResultsBar").style.width = "240px";
        for (m = 0; m < pageSections.length; m++) {
            pageSections[m].style.marginRight = "240px";
            }
        }
}

function searchClose() {
    var pageSections = document.getElementsByClassName("pageSection");
        
    if (document.getElementById("searchResultsBar").style.width == "240px")
        {
        document.getElementById("searchResultsBar").style.width = "0px";
        for (m = 0; m < pageSections.length; m++) {
            pageSections[m].style.marginRight = "0px";
            }
        }
}


function recreateBrowserContextMenus(currentJSON) {

    chrome.contextMenus.removeAll(function(){

        //PAGE MENUS
        chrome.contextMenus.create({
            "id": "contextMenuPageRoot",
            "title": "upStart! - Add page to",
            "contexts": ["page"]
        });

        //LIK MENUS
        chrome.contextMenus.create({
            "id": "contextMenuLinkRoot",
            "title": "upStart! - Add link to",
            "contexts": ["link"]
        });


        //POPULATE MENUS WITH CURRENT PAGES AND GROUPS
        for (p = 0; p < currentJSON['pages'].length; p++) { 
          var pageLabel = currentJSON.pages[p].pageLabel;

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


          for (g = 0; g < currentJSON.pages[p]['groups'].length; g++) {      
            var groupLabel = currentJSON.pages[p].groups[g].groupLabel;
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

        //if ( (clickData.menuItemId.startsWith('contextMenuPage')) || (clickData.menuItemId.startsWith('contextMenuLink')) ) {
        if (clickData.toLowerCase().match(/^(contextMenuPage|contextMenuLink).*/) ) {
        } else {        
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

                      //LINKMENU EVENT
                      if (contextID == 'Page') {       
                        tabURL = activeTab.url;
                        tabTitle = activeTab.title;   
                      } else { // Link
                        tabURL = clickData.linkUrl;
                        if (clickData.linkUrl.split('/')[2] == '') { tabTitle = clickData.linkUrl.split('/')[3]; } else { tabTitle = clickData.linkUrl.split('/')[2] }
                      }

                      var newItemObj = new Object();
                      newItemObj.label = tabTitle;
                      newItemObj.url = tabURL;
                      newItemObj.alt = '';
                      newItemObj.icon = '';
                      newItemObj.date = Date.now().toString();

                      currentJSON.pages[dstPage].groups[dstGroup]['itens'].push(newItemObj);
                      chrome.storage.local.set({"jsonUS": JSON.stringify(currentJSON)}, function() {
                        if (contextID == 'Page') { 
                          //alert("Page added to "+ currentJSON.pages[dstPage].pageLabel +' - '+currentJSON.pages[dstPage].groups[dstGroup].groupLabel)
                        } else {
                          //alert("Link added to "+ currentJSON.pages[dstPage].pageLabel +' - '+currentJSON.pages[dstPage].groups[dstGroup].groupLabel)
                        }          
                      });
                    });
            });
        }
    });

    });
}





function firstTime() {    
    swal({
      title: 'Welcome!',
      text: "It looks like it\'s your first time here. Do you want to start with a example template?",
      type: 'question',
      showCancelButton: true,      
      confirmButtonColor: '#34CE57',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sure!',
      cancelButtonText: 'No',
    }).then((result) => {
        if (result.value) {
                swal({type: 'success', title: 'Great! Here are some pages, groups and icons. Hope you enjoy.'}).then(() => { 
                    $.getJSON( "js/defaultExample.json", function(JsonData) { 
                        chrome.storage.local.set({ "jsonUS": JSON.stringify(JsonData) }, function(){                            
                        })
                    });
                    $.getJSON( "js/images.json", function(JsonData) { 
                         chrome.storage.local.set({ "jsonIMG": JSON.stringify(JsonData) }, function(){
                         location.reload()
                         })
                    });
                })
            } else if (result.dismiss === 'cancel') {
                swal({type: 'success', title: 'All right! Let\'s start with a empty page then. Hope you enjoy.'}).then(() => { 
                    $.getJSON( "js/blankPage.json", function(JsonData) { 
                        chrome.storage.local.set({ "jsonUS": JSON.stringify(JsonData) }, function(){
                        })                        
                    });
                    $.getJSON( "js/images.json", function(JsonData) { 
                         chrome.storage.local.set({ "jsonIMG": JSON.stringify(JsonData) }, function(){
                         location.reload()
                         })
                    });                    
                })            
            }

    })
}

/******************** SUPPORT FUNCTIONS END ********************/


/******************** JSON FUNCTIONS BEGIN ********************/

/*
function callbackJSON(JsonData) {    
    if (IsJsonString(JsonData.jsonUS) ) {
        json = JSON.parse(JsonData.jsonUS);
        initialize();
    } else {
        firstTime();
    }
}*/




function callbackJSON(JsonData) {
    if (IsJsonString(JsonData.jsonUS)) {
        json = JSON.parse(JsonData.jsonUS);
    } else {
        firstTime();
    }
    //console.log(JSON.stringify(json));
}

function callbackJSONIMG(JsonData) {
    if (IsJsonString(JsonData.jsonIMG)) {
        jsonImg = JSON.parse(JsonData.jsonIMG);        
        initialize();
    } else {
        firstTime();
    }
    //console.log(JSON.stringify(jsonImg));
}


function callbackJSONDefault(JsonData) {    
    if (IsJsonString(JsonData) ) {
        chrome.storage.local.set({ "jsonUS": JSON.stringify(JsonData) }, function(){
            location.reload()
        });
        chrome.storage.local.set({ "jsonIMG": JSON.stringify(JsonData) }, function(){            
        });
    } else {
        alert('Data corrupted!');
    }
}



/******************** JSON FUNCTIONS END ********************/


function hex2rgb(hex) {
  var arrBuff = new ArrayBuffer(4);
  var vw = new DataView(arrBuff);
  vw.setUint32(0,parseInt(hex, 16),false);
  var arrByte = new Uint8Array(arrBuff);

  return arrByte[1] + "," + arrByte[2] + "," + arrByte[3];
}

