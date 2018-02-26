var jsonOptions;
var jsonDefault;
var allowFileAccessMessage = '';

chrome.extension.isAllowedFileSchemeAccess(function(isAllowedAccess) {
  if (isAllowedAccess) { allowFileAccessMessage = '' }
  else { allowFileAccessMessage = '<div style="background-color: rgba(0,0,0, 0.1); width: 100%; height: 50px; margin-top: 10px; padding:10px; display: inline-flex; font-weight: normal;"><div style="color: red; display: inline-block; margin-right:20px;"><i class="fas fa-exclamation-triangle fa-2x"></i></div><div "style="display: inline-block;">If you want to use local URLs, icons and images, please check the option "Allow access to file URLs" at the <span id="extensionManagerLink"><b>Extensions Manager Page.</span></div>' }
  document.getElementById("allowFileAccessMessageWarning").innerHTML = allowFileAccessMessage;
  document.getElementById("allowFileAccessMessageWarning").addEventListener('click', function() { chrome.tabs.create({url: "chrome://extensions/?id=" + chrome.runtime.id}) });
});




//load links json
chrome.storage.local.get("jsonUS", callbackJSONOptions);


function initOptions() {
    //LISTENERS
    document.getElementById("saveOptions").addEventListener('click', function() { saveOptions() });
    document.getElementById("importSettingsButton").addEventListener('click', function() { importSettingsFromFile() });
    document.getElementById("exportSettingsButton").addEventListener('click', function() { exportSettingsToFile() });
    document.getElementById("importDefaultSettings").addEventListener('click', function() { importDefaultSettings() });    
    document.getElementById("resetDefaultValuesGeneralOptions").addEventListener('click', function() { resetDefaultValuesGeneralOptions() });
    document.getElementById("resetDefaultValuesBookmarks").addEventListener('click', function() { resetDefaultValuesBookmarks() });
    document.getElementById("resetDefaultValuesAppearance").addEventListener('click', function() { resetDefaultValuesAppearance() });

    $('.optBalloon').balloon({
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
    
    $('.optBalloonButton').balloon({
      position:'top',
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

    $('.optBalloonRight').balloon({
      position:'right',
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

    /*************** LOAD SETTINGS FROM JSON *********************/
    //OPTIONS
    var defaultPageColumns = jsonOptions.settings.defaultPageColumns;
    var defaultItensSort = jsonOptions.settings.defaultItensSort;
    var remeberLastPage = jsonOptions.settings.remeberLastPage;
    var openLinksNewTab = jsonOptions.settings.openLinksNewTab;
    var showBrowserContextMenu = jsonOptions.settings.showBrowserContextMenu;

    //BOOKMARKS
    var itemIconMargin = parseInt(jsonOptions.settings.itemIconMargin);
    var itemIconSize = parseInt(jsonOptions.settings.itemIconSize);  
    var itemIconRadius = jsonOptions.settings.itemIconRadius;
    var itemLabelFontSize = jsonOptions.settings.itemLabelFontSize;
    var itemLabelFontColor = jsonOptions.settings.itemLabelFontColor;
    var itemIconLabelTextAlign = jsonOptions.settings.itemIconLabelTextAlign;
    var itemIconLabelLinesShown = jsonOptions.settings.itemLabelShowLines;
    var itemIconLabelFontFamily = jsonOptions.settings.itemIconLabelFontFamily;
    var itemIconLabelFontStyle = jsonOptions.settings.itemIconLabelFontStyle;
    var itemIconLabelFontWeight = jsonOptions.settings.itemIconLabelFontWeight;

    //APPEARANCE
    var defaultBackgroundColor = jsonOptions['settings'].defaultBackgroundColor;
    var defaultPageBackground = jsonOptions['settings'].defaultPageBackground;






/********************** OPTIONS BEGIN **********************/

$( function() {
    var handle = $( "#slider-handle-default-page-columns" );
    $( "#defaultPageColumnsSlider" ).slider({
              animate: true,
              value: defaultPageColumns,
              min: 0,
              max: 5,
              step: 1,
      create: function() {
        if ($(this).slider("value") == 0) {
          handle.text('auto');
        } else {
          handle.text($(this).slider("value"));
        }
        $(this).css('width', '300px');
      },
      slide: function( event, ui ) {
        if (ui.value == 0) {
          handle.text('auto');  
        } else {
          handle.text( ui.value );
        }
      }
    });
  } );


  $("select#defaultItensSortSelect").val(defaultItensSort);
  $("select#defaultItensSortSelect").css('width', '120px');

  if ( remeberLastPage == 'true') { $('#remeberLastPageToggle').bootstrapToggle('on') } else { $('#remeberLastPage').bootstrapToggle('off') }

	if ( openLinksNewTab == 'true') { $('#openLinksNewTabToggle').bootstrapToggle('on') } else { $('#openLinksNewTabToggle').bootstrapToggle('off') }    

	if ( showBrowserContextMenu == 'true') { $('#showBrowserContextMenuToggle').bootstrapToggle('on') } else { $('#showBrowserContextMenuToggle').bootstrapToggle('off') }    	

  //BROWSER CONTEXTMENU
  if (jsonOptions.settings.showBrowserContextMenu == 'false') {chrome.contextMenus.removeAll()} else {
        recreateBrowserContextMenus(jsonOptions);        
      }

/********************** OPTIONS BEGIN **********************/



 /********************** BOOKMARKS BEGIN **********************/

  if (jsonOptions.settings.noItemLabels == 'true') { $('#noItemLabelsToggle').bootstrapToggle('on'); $('.iconLabelExample').css("display", "none"); }

  $('#noItemLabelsToggle').on('change', function() {
    if ( $(this).prop('checked').toString() === 'true') { 
        $('.iconLabelExample').css("display", "none"); 
    } else {
        $('.iconLabelExample').css("display", "block");
    }
  })

$( function() {
    var handle = $( "#slider-handle-icon-size" );
    $( "#iconSizeSlider" ).slider({
              animate: true,
              value: itemIconSize,
              min: 32,
              max: 256,
              step: 1,              
      create: function() {
        handle.text($(this).slider("value"));
        $(this).css('width', '90%');
        $("#iconImgExample").css({'width': itemIconSize+'px', 'height': itemIconSize+'px' });     
        $("#itemListExample").css({'max-width': itemIconSize+10+'px', 'max-height': itemIconSize+50+'px' });
      },
      slide: function( event, ui ) {
        handle.text( ui.value );
        $("#iconImgExample").css({'width': ui.value+'px', 'height': ui.value+'px' });     
        $("#itemListExample").css({'max-width': ui.value+10+'px', 'max-height': ui.value+50+'px' });
      }
    });
  } );


$( function() {
    var handle = $( "#slider-handle-icon-margin" );
    $( "#iconMarginSlider" ).slider({
              animate: true,
              value: itemIconMargin,
              min: 0,
              max: 20,
              step: 1,
      create: function() {
        handle.text($(this).slider("value"));
        $(this).css('width', '90%');
        $(".itemListExample").css({'margin': itemIconMargin+'px' });
      },
      slide: function( event, ui ) {
        handle.text(ui.value);
        $(".itemListExample").css({'margin': ui.value+'px' });
      }
    });
  } );

$( function() {
    var handle = $( "#slider-handle-icon-radius" );
    $( "#iconRadiusSlider" ).slider({
              animate: true,
              value: itemIconRadius,
              min: 0,
              max: 5,
              step: 1,
      create: function() {
        handle.text($(this).slider("value"));
        $(this).css('width', '90%');
        $(".itemListExample").css({'border-radius': itemIconRadius+'px' });
      },
      slide: function( event, ui ) {
        handle.text(ui.value);
        $(".itemListExample").css({'border-radius': ui.value+'px' });
      }
    });
  } );

$( function() {
    var handle = $( "#slider-handle-icon-label-font-size" );
    $( "#itemLabelFontSizeSlider" ).slider({
              animate: true,
              value: itemLabelFontSize,
              min: 2,
              max: 32,
              step: 1,
      create: function() {
        handle.text($(this).slider("value"));
        $(this).css('width', '90%');
        $(".iconLabelExample").css({'font-size': itemLabelFontSize+'px' });
      },
      slide: function( event, ui ) {
        handle.text(ui.value);
        $(".iconLabelExample").css({'font-size': ui.value+'px' });
      }
    });
  } );


    $("select#itemIconLabelLinesShownSelect").val(itemIconLabelLinesShown);
        
    $("select#itemIconLabelLinesShownSelect").on('change', function() {
      switch (this.value) {
        case '1': 
          $('#iconLabelExample').css({ 'max-height': '1.2em' });
          break;        
        case '2': 
          $('#iconLabelExample').css({ 'max-height': '2.6em' });
          break;
        case 'all': 
          $('#iconLabelExample').css({ 'max-height': 'none'});
          break;
         }
     });
    
    $("select#itemIconLabelLinesShownSelect").css('width', '120px');

    $("select#itemIconLabelTextAlignSelect").val(itemIconLabelTextAlign);
    $(".iconLabelExample").css({'text-align': itemIconLabelTextAlign });    
    $("select#itemIconLabelTextAlignSelect").on('change', function() { $(".iconLabelExample").css({'text-align': this.value }); });
    $("select#itemIconLabelTextAlignSelect").css('width', '120px');

    $("select#itemIconLabelFontFamilySelect").val(itemIconLabelFontFamily);
    $(".iconLabelExample").css({'font-family': itemIconLabelFontFamily });
    $("select#itemIconLabelFontFamilySelect").on('change', function() {  $(".iconLabelExample").css({'font-family': this.value }); });
    $("select#itemIconLabelFontFamilySelect").css('width', '120px');

    $("select#itemIconLabelFontStyleSelect").val(itemIconLabelFontStyle);
    $(".iconLabelExample").css({'font-style': itemIconLabelFontStyle });
    $("select#itemIconLabelFontStyleSelect").on('change', function() {  $(".iconLabelExample").css({'font-style': this.value }); });
    $("select#itemIconLabelFontStyleSelect").css('width', '120px');

    $("select#itemIconLabelFontWeightSelect").val(itemIconLabelFontWeight);
    $(".iconLabelExample").css({'font-weight': itemIconLabelFontWeight });
    $("select#itemIconLabelFontWeightSelect").on('change', function() {  $(".iconLabelExample").css({'font-weight': this.value }); });
    $("select#itemIconLabelFontWeightSelect").css('width', '120px');


/********************** BOOKMARKS END **********************/


/********************** APPEARANCE BEGIN **********************/

    //BACKGROUNDS
    var backgroundOptions = '<option data-img-src="bg/none.png" data-img-label="None" value=""></option>';
    for (i = 0; i < jsonOptions['backgrounds'].length; i++) {
        var imageLabel = jsonOptions.backgrounds[i].label;
        var imageValue = jsonOptions.backgrounds[i].value;
        var imageFile = jsonOptions.backgrounds[i].file;
        backgroundOptions += '<option data-img-src="'+imageFile+'" data-img-label="'+imageLabel+'" value="'+imageValue+'"></option>';
        }

    document.getElementById("image-picker-default-backgrounds").innerHTML = backgroundOptions;

    //BACKGROUNDS
    $("select#image-picker-default-backgrounds").imagepicker({ 
        show_label: true,
        initialized: function(){ $(".image_picker_image").css({"width": "182px", "height": "100px"}); },
        selected: function(select){                
            $("input#customBackgroundURL").val(select.picker.select[0].value.toString());             
        }
    }); 
    //SET CURRENT VALUE FOR BACKGROUND
    $("select#image-picker-default-backgrounds").val(defaultPageBackground);
    //SYNC BACKGROUND
    $("select#image-picker-default-backgrounds").data('picker').sync_picker_with_select();    

    //SET CURRENT BACKGROUND VALUE
    $("input#customBackgroundURL").val(defaultPageBackground);


    $(document).ready(function () {        

        $('.myColorPicker').colorPickerByGiro({
          // a valid CSS selector / a DOM element / a jQuery-jqLite collection
          preview: '.myColorPicker-preview',
          // show the color picker
          showPicker: true,
          // hsl, hsla, rgb, rgba and hex
          format: 'hex',  
          // spaces in pixels
          sliderGap: 6,
          cursorGap: 6,  
          // internationalization
          text: {
            close: 'Close',
            none: 'None'
          }  
        });

    $("input#itemLabelFontColor").val(jsonOptions['settings'].itemLabelFontColor);
    $("span#itemLabelFontColor-preview").css('background-color', '#'+jsonOptions['settings'].itemLabelFontColor);


    $("input#colorsTopnavBackgroundColor").val(jsonOptions['settings'].colorsTopnavBackgroundColor);
    $("span#colorsTopnavBackgroundColor-preview").css('background-color', '#'+jsonOptions['settings'].colorsTopnavBackgroundColor);

    $("input#colorsTopnavColor").val(jsonOptions['settings'].colorsTopnavColor);
    $("span#colorsTopnavColor-preview").css('background-color', '#'+jsonOptions['settings'].colorsTopnavColor);
    
    $("input#defaultBackgroundColor").val(jsonOptions['settings'].defaultBackgroundColor);
    $("span#defaultBackgroundColor-preview").css('background-color', '#'+jsonOptions['settings'].defaultBackgroundColor);

	/********************** APPEARANCE END **********************/


    });
}


function saveOptions() {

	/*************** OPTIONS *******************/

    jsonOptions['settings'].defaultPageColumns = $("#defaultPageColumnsSlider").slider("value").toString();
    jsonOptions['settings'].defaultItensSort = $("#defaultItensSortSelect").val();    
    jsonOptions['settings'].remeberLastPage = $('#remeberLastPageToggle').prop('checked').toString();
    jsonOptions['settings'].openLinksNewTab = $('#openLinksNewTabToggle').prop('checked').toString();
    jsonOptions['settings'].showBrowserContextMenu = $('#showBrowserContextMenuToggle').prop('checked').toString();


    /*************** ITEM THEME *******************/

    jsonOptions['settings'].noItemLabels = $('#noItemLabelsToggle').prop('checked').toString();
    jsonOptions['settings'].itemIconSize = $("#iconSizeSlider").slider("value").toString();
    jsonOptions['settings'].itemIconMargin = $("#iconMarginSlider").slider("value").toString();
    jsonOptions['settings'].itemIconRadius = $("#iconRadiusSlider").slider("value").toString();
    jsonOptions['settings'].itemLabelFontSize = $("#itemLabelFontSizeSlider").slider("value").toString();
    jsonOptions['settings'].itemIconLabelTextAlign = $("#itemIconLabelTextAlignSelect").val();
    jsonOptions['settings'].itemLabelShowLines = $("#itemIconLabelLinesShownSelect").val();    
    jsonOptions['settings'].itemIconLabelFontFamily = $("#itemIconLabelFontFamilySelect").val();
    jsonOptions['settings'].itemIconLabelFontStyle = $("#itemIconLabelFontStyleSelect").val();
    jsonOptions['settings'].itemIconLabelFontWeight = $("#itemIconLabelFontWeightSelect").val();
    jsonOptions['settings'].itemLabelFontColor = $("#itemLabelFontColor").val();


    /*************** APPEARANCE *******************/

    jsonOptions['settings'].colorsTopnavBackgroundColor = $("input#colorsTopnavBackgroundColor").val().toString();
    jsonOptions['settings'].colorsTopnavColor = $("input#colorsTopnavColor").val().toString();
    jsonOptions['settings'].defaultBackgroundColor = $("input#defaultBackgroundColor").val().toString();

    customBackgroundURL = $("input#customBackgroundURL").val().toString();
    jsonOptions['settings'].defaultPageBackground = customBackgroundURL;
 

    /*************** SAVE SETTINGS *******************/
    chrome.storage.local.set({ "jsonUS": JSON.stringify(jsonOptions) }, function(){
        swal('Done', 'Options saved successfully!','success').then(() => {window.close()})
            
        });
}


function exportSettingsToFile(){
    var now = new Date();
    var formattedDate = (now.getMonth() + 1) + '-' + now.getDate() + '-' + now.getFullYear();
    var blob = new Blob([JSON.stringify(jsonOptions)], {type: "text/plain;charset=utf-8"});
    saveAs(blob, 'upStart-export-'+formattedDate+'.txt');
}

function importSettingsFromFile() {
    var inputFile = document.getElementById('inputFile');    
    var file = inputFile.files[0];    
    var textType = /text.*/;

    //TEST NULL FILE
    if (typeof file === 'undefined' || file === null) {
        swal('Error', 'No file selected!','error');
        return false;
    }

    if (file.type.match(textType)) {
        var reader = new FileReader();
        reader.onload = function(e) {
            //TEST JSON DATA
            if (IsJsonString(reader.result)) {
                chrome.storage.local.set({ "jsonUS": reader.result }, function(){
                    chrome.storage.local.set({ "currentPage": 0 }, function(){
                      swal('Done', 'Settings loaded successfully!','success').then(() => {location.reload()})
                    });                    
                });               
              } else {
                    swal('Error', 'Not a JSON file!','error');
                    return false;
              }
            }
            reader.readAsText(file);
        } else {
            swal('Error', 'File not supported!','error')
        }
}

function importDefaultSettings() {
    swal({
      title: 'Load default settings?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, load it!'
    }).then((result) => {
        if (result.value) {
            $.getJSON( "js/defaultExample.json", function(JsonData) { callbackJSONDefaultSettings(JsonData) })
            .fail(function() { alert('Default data corrupted!'); })
        }
    })
}


function resetDefaultValuesGeneralOptions() {

    $("#defaultPageColumnsSlider").slider("value", 0);
    $("#slider-handle-default-page-columns").text('auto');

    $("select#defaultItensSortSelect").val('manual');

    $('#remeberLastPageToggle').bootstrapToggle('on');

    $('#openLinksNewTabToggle').bootstrapToggle('off');

    $('#showBrowserContextMenuToggle').bootstrapToggle('on');
}

function resetDefaultValuesBookmarks() {

	$('#noItemLabelsToggle').bootstrapToggle('off')

    $( "#iconSizeSlider" ).slider( "value", 64 );
    $( "#slider-handle-icon-size").text(64);
    $(".iconImgExample").css({'width': '64px', 'height': '64px' });

    $( "#iconMarginSlider" ).slider( "value", 0 );
    $( "#slider-handle-icon-margin").text(0);
    $(".itemListExample").css({'margin': '0px' });

    $( "#iconRadiusSlider" ).slider( "value", 0 );
    $( "#slider-handle-icon-radius").text(0);
    $(".itemListExample").css({'border-radius': '0px' });

    $( "#itemLabelFontSizeSlider" ).slider( "value", 13 );
    $( "#slider-handle-icon-label-font-size").text(13);
    $(".iconLabelExample").css({'font-size': '13px' });

    $("select#itemIconLabelLinesShownSelect").val('1');
    //$(".iconLabelExample").css({'text-align': 'center' }); FAZER

    $("select#itemIconLabelTextAlignSelect").val('center');
    $(".iconLabelExample").css({'text-align': 'center' });

    $("select#itemIconLabelFontFamilySelect").val("'Helvetica', 'Helvetica Nueue', sans-serif");
    $(".iconLabelExample").css({'font-family': "'Helvetica', 'Helvetica Nueue', sans-serif" });

    $("select#itemIconLabelFontStyleSelect").val('normal');
    $(".iconLabelExample").css({'font-style': 'normal' });

    $("select#itemIconLabelFontWeightSelect").val('normal');
    $(".iconLabelExample").css({'font-weight': 'normal' });
 
    $("input#itemLabelFontColor").val('');
}

function resetDefaultValuesAppearance() {

    $("select#image-picker-default-backgrounds").val('');    
    $("select#image-picker-default-backgrounds").data('picker').sync_picker_with_select();

    $("input#customBackgroundURL").val('');    

    $("input#defaultBackgroundColor").val('F6F6F9');
    $("input#colorsTopnavBackgroundColor").val('2D2D5F');
    $("input#colorsTopnavColor").val('FFFFFF');

}

function callbackJSONOptions(JsonData) {
    if (IsJsonString(JsonData.jsonUS) ) {
        jsonOptions = JSON.parse(JsonData.jsonUS);
        initOptions();
    } else {
        //alert('No data found on Chrome Storage. Loading default data!');
        $.getJSON( "js/defaultExample.json", function(JsonData) { callbackJSONDefaultOptions(JsonData) })
        .fail(function() { alert('Default data corrupted!'); })
    }
}

function callbackJSONDefaultOptions(JsonData) {   
    jsonOptions = JsonData;
    initOptions();    
}

function callbackJSONDefaultSettings(JsonData) {
    chrome.storage.local.set({ "jsonUS": JSON.stringify(JsonData) }, function(){
        chrome.storage.local.set({ "currentPage": 0 }, function(){
            swal('Done', 'Settings loaded successfully!','success').then(() => {location.reload()})
          });        
        });
}