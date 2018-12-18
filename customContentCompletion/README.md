# Custom Content Completion
Adds an action in the Text page pop-up menu that shows a custom content completion dialog and registers a shortcut key for this action.

Using the displayed dialog you can select a value that will be inserted at the caret position in the current document.
The values from the dialog are loaded from the 'values.xml' file.

The shortcut key can be changed from the **Menu Shortcut Keys**, preferences page. By default, it's **Ctrl+Alt+A** on Windows or **Command+Option+A** on MacOs. 

## Customization
 You can modify some variable in the wsAccess.js for customizing the plugin:
 
 - actionName: For changing the name of the action. This will be presented in the contextual menu, in the title of the dialog and in the shortcut table from the 'Menu Shortcut Keys' preferences page.
 - valuesFilePath: For changing the location of the file that stores the presented values. This path is relative to the plugin's folder.
 - xpathExpression: For setting the XPath expression used to get the values from 'values.xml'.
 - actionKeyStroke: For changing the default shortcut key of the action.
 
## Compatibility
This add-on is compatible with Oxygen XML Editor (or XML Author) version 18 or higher. 

Copyright and License
---------------------
Copyright 2018 Syncro Soft SRL.

This project is licensed under [Apache License 2.0](https://github.com/oxygenxml/wsaccess-javascript-sample-plugins/blob/master/LICENSE)