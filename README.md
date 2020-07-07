# upStart Browser Extension
A iconized start page extension for chrome and firefox (with a few modifications).
It's available on both Chrome Extensions page and Firefox Add-ons page

![Upstart Screenshot 1](readme_images/upstart0.png?raw=true "Upstart Screenshot")

![Upstart Screenshot 1](readme_images/upstart1.jpg?raw=true "Upstart Screenshot 1")

![Upstart Screenshot 1](readme_images/upstart2.png?raw=true "Upstart Screenshot 2")

![Upstart Screenshot 1](readme_images/upstart3.png?raw=true "Upstart Screenshot 3")

![Upstart Screenshot 1](readme_images/upstart4.png?raw=true "Upstart Screenshot 4")


Chrome: https://chrome.google.com/webstore/detail/upstart/ddalpldcidoajbgohbdlelfmfmjiccga

Firefox: https://addons.mozilla.org/en-US/firefox/addon/upstart/



Changelog:

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
