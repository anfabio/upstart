

async function createImageSelect(imagesData, input, icon, type) {
 
  let result = await chrome.storage.local.get("upStartLanguage")  
  let jsonLanguage = JSON.parse(result.upStartLanguage)	
  
  let selectGridWrapper = document.createElement('DIV')   
  selectGridWrapper.className = "icon-select-grid-wrapper"
  selectGridWrapper.id = "icon-select-grid-wrapper-"+type
  
  let selectGrid = document.createElement('DIV')                  
  selectGrid.className = "icon-select-grid-"+type
  selectGrid.id = "icon-select-grid-"+type

  for(i=0;i<imagesData.length;i++) {
      let gridElement = document.createElement('DIV')
      gridElement.className = type      
      gridElement.dataset.value = imagesData[i]

      ///select current icon
      if (imagesData[i] == input.value) {gridElement.classList.add("icon-selected")}

      let imgElement = document.createElement('IMG') 
      imgElement.className = type+"-img"
      imgElement.src = imagesData[i]

      //grid assemble
      gridElement.append(imgElement)
      selectGrid.append(gridElement)
  }
  selectGridWrapper.append(selectGrid)



  if (input && icon) {
    


    
    //let parser = new DOMParser()

    //let spinnerString = '<div id="spinner-wrapper-upload" class="spinner-wrapper"><div class="spinner"><div class="curve_top_left"></div><div class="curve_bottom_right"></div><div class="curve_top_right"></div><div class="curve_bottom_left"></div><div class="center_circle"></div></div></div>'


    //let spinner = parser.parseFromString(spinnerString, "text/html")​​



    let spinnerWrapper = document.createElement('DIV')    
    spinnerWrapper.className = "spinner-wrapper"
    spinnerWrapper.id = "spinner-wrapper-upload"
    spinnerWrapper.innerHTML = '<div class="spinner"><div class="curve_top_left"></div><div class="curve_bottom_right"></div><div class="curve_top_right"></div><div class="curve_bottom_left"></div><div class="center_circle"></div></div>'
    
    
    let uploadImgButtons = document.createElement('DIV')    
    uploadImgButtons.className = "upload-image-buttons"
    uploadImgButtons.id = "upload-image-buttons-"+type  
    
    let uploadImg = document.createElement('DIV')   
    uploadImg.className = "upload-image" 
    uploadImg.innerHTML = jsonLanguage.shared.imageSelect_ButtonTitle    
    uploadImg.id = "upload-image-"+type
    
    let inputWrapper = document.createElement('DIV')    
    inputWrapper.className = "input-wrapper"

    let labelImageFile = document.createElement('LABEL')   
    labelImageFile.for = "input-image-file-"+type
    labelImageFile.innerHTML = '<span class="fa fa-upload"></span>'

    let inputImageFile = document.createElement('INPUT')      
    inputImageFile.type = 'file'
    inputImageFile.className = "upload-image"
    inputImageFile.accept = ".gif,.jpg,.png"
    inputImageFile.id = "input-image-file-"+type

    
		inputImageFile.addEventListener('change', (e) => {
			if (typeof inputImageFile.files[0] === 'undefined' || inputImageFile.files[0] === null) {
				labelImageFile.style.color = 'white'
			} else {
				labelImageFile.style.color = '#EBC833'
			}
		})

    
    //upload buttons assemble
    inputWrapper.append(labelImageFile)
    labelImageFile.append(inputImageFile)

    uploadImgButtons.append(uploadImg)
    uploadImgButtons.append(inputWrapper)
    
    selectGridWrapper.append(spinnerWrapper)


    selectGridWrapper.append(uploadImgButtons)


    selectGridWrapper.addEventListener('click', async (event) => {
        event.stopPropagation()

        //select img
        if(event.target.closest('.'+type)) { 
          let element = event.target.closest('.'+type)  
          let value = element.dataset.value
          icon.src = value

          if (value == 'img/theme.svg') { input.value = 'theme' }
          else if (value == 'img/block.svg') { input.value = '' }
          else { input.value = value }

          let iconGrid = document.querySelectorAll('.'+type)        
          for (i=0;i<iconGrid.length;i++) { iconGrid[i].classList.remove("img-selected") }

          element.classList.add("img-selected")                    
        }

        //upload img
        uploadImageID = 'upload-image-'+type

        if (event.target.closest('#'+uploadImageID)) {  
          let fileType = /image.*/
          let inputImg = document.getElementById('input-image-file-'+type)

          let contentBuffer = await readFileAsync(inputImg.files[0], fileType)

          if (contentBuffer) {
            spinnerWrapper.style.display = 'grid'

            let base64ImageData
            if (type == 'bg') { base64ImageData = await getBase64Image(contentBuffer) }
            else { base64ImageData = await getBase64Image(contentBuffer, 128, 128) }
            addImageSelect(base64ImageData, type)

            inputImg.value = null            
            labelImageFile.style.color = 'white'

            spinnerWrapper.style.display = 'none'


          } else {
            errorMessage(jsonLanguage.shared.imageSelect_msgNofFile, 'topRight')             
          }

        }
    })
  }
  return selectGridWrapper
}

async function addImageSelect(newImageData, type, gridEl) { 
  let resultLanguage = await chrome.storage.local.get("upStartLanguage")
  let jsonLanguage = JSON.parse(resultLanguage.upStartLanguage)

  if (gridEl) { gridElement = gridEl}
  let resultCustomImg = await chrome.storage.local.get("upStartCustomImages")
  let jsonCustomImages = JSON.parse(resultCustomImg.upStartCustomImages)
  let duplicate = false
  let images

  if (type == 'bg') { images = jsonCustomImages.bgs }
  else { images = jsonCustomImages.icons }
  
  for (i=0;i<images.length;i++) {    
    if (newImageData == images[i]) {
      errorMessage(jsonLanguage.shared.imageSelect_msgAlreadyUp, 'topRight') 
      duplicate = true
      return false
      break
    }
  }

  if (!duplicate) {
    let selectGrid

    images.push(newImageData)
    selectGrid = document.getElementById('icon-select-grid-'+type)        
    for (i=0;i<selectGrid.children.length;i++) { selectGrid.children[i].classList.remove("img-selected") }

    let gridElement = document.createElement('DIV')
    gridElement.className = type
    gridElement.dataset.value = newImageData  
      
    let imgElement = document.createElement('IMG')  
    imgElement.className = type+"-img"
    imgElement.src = newImageData
  
    //grid assemble
    gridElement.append(imgElement)
    

    if (gridEl) {
      let deleteButton = document.createElement('BUTTON')    
      deleteButton.className = type+"-delete-button"
      deleteButton.innerHTML = '<i class="context-menu-icon fas fa-trash"></i>'      
      gridElement.append(deleteButton)    
    }


    selectGrid.append(gridElement)

    
        
    await chrome.storage.local.set({"upStartCustomImages": JSON.stringify(jsonCustomImages)})
    
  }
}