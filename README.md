# upStart

upStart is a replacement of new tab page with quick access to your bookmarked pages.
Keep your bookmarks organized into groups and pages.
Look & Fell highly customizable.

• Easily add bookmarks from any page or save all open tabs
• Intuitive and easy to customize
• Features like check for broken links and import bookmarks from the browser
• Synchronization with other devices through Dropbox
• Easily import and export your data
• Use your own icons and images
• Create restore points to revert changes
• Search bookmarks easily
• Themes
• Made with vanilla JS for better performance


![Main Page](screenshots/1.png?raw=true "Main Page")

![Icon Picker](screenshots/2.jpg?raw=true "Icon Picker")

![Popup Menu and Layout Changes](screenshots/3.png?raw=true "Popup Menu and Layout Changes")

![Example Page](screenshots/4.png?raw=true "Example Page")

![Settings](screenshots/5.png?raw=true "Settings")
![Bookmarks Importer](screenshots/6.png?raw=true "Bookmarks Importer")


Chrome: https://chrome.google.com/webstore/detail/upstart/ddalpldcidoajbgohbdlelfmfmjiccga

Firefox: https://addons.mozilla.org/en-US/firefox/addon/upstart/








Libraries

Chrome Extension Async
https://github.com/KeithHenry/chromeExtensionAsync

Dropbox for JavaScript
https://www.dropbox.com/developers/documentation/javascript

FileSaver.js
https://github.com/eligrey/FileSaver.js/

Font Awesome
https://fontawesome.com

iziToast
https://izitoast.marcelodolza.com/

JSZip
https://stuk.github.io/jszip/

lz-string
https://github.com/pieroxy/lz-string

Pickr
https://github.com/Simonwep/pickr

SortableJS
https://github.com/SortableJS/sortablejs

SweetAlert2
https://sweetalert2.github.io




Code

Treats
https://codepen.io/team/keyframers/pen/wvvoBQW

On/Off Toggle Switch
https://codepen.io/agoodwin/pen/JBvBPr



Changelog:

Version 2.0
- Application refactored from the ground with a lot of new features.
- Some of the older options will have to be replaced
- Complete new set of icons and Backgrounds
- Multiple language support. Right now we have only English and Portuguese
- Synchronization with Dropbox
- Sorry, but there are too many changes to list

Version 1.6.1
- Fix font color when group is colored

Version 1.6
- New experimental Dark mode
- You can now use "data:image" icons
- Convert any bookmark icon into "data:image"
- Option to convert all bookmarks into "data:image"
- Convert into "data:image" new bookmarks by default
- Minor bug fixes

Version 1.5.2
- fix the database update

Version 1.5.1
- Fix the "ERR_UNKNOWN_URL_SCHEME" error again :(

Version 1.5
- Removed most of confirmation dialogues for better usability
- Added tons of icons for groups and bookmarks
- Backgrounds added and some removed
- New icon for blank and undefined bookmarks
- New option to scan broken icons and replace by a nicer one
- New dialog to update the version
- User data now is separeted from the images data. The settings backup should be considerable smaller now
- Others minor bugs corrected

Version 1.4
- Just a minor update to fix the "ERR_UNKNOWN_URL_SCHEME" error on Chrome 71 and above

Version 1.3
- added the option to make groups color transparent
- added a global font color option
- upon adding a new bookmark from the menu it tries to fetch the built-in icon. If it fails it will try to use the favicon of the page.
