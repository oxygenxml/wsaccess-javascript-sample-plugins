# wsaccess-javascript-sample-plugins

Starting with Oxygen 17.1 you can create a workspace access plugin to contribute custom toolbar and menu actions or custom behaviors using Javascript and the Rhyno engine:
https://www.oxygenxml.com/doc/versions/17.1/ug-editor/#concepts/workspace-access-plugin-js.html

Each of the folders in this repository is a sample plugin which use this technology to alter different behaviors in Oxygen. So if you take each of these folders, copy it to the "OXYGEN_INSTALL_DIR/plugins" folder and start Oxygen, the plugin will start to work.

The sample plugin "runScenarios" (compatible with Oxygen 17.1 and newer) adds a toolbar action called "Transform to PDF". When the button is pressed, it invokes an already defined transformation scenario called "DITA PDF" on the current opened XML document.

The sample plugin "contributePopupActionDMM" (compatible with Oxygen 17.1 and newer) contributes a contextual menu action called "Run Notepad" on the popup menu of the DITA Maps Manager view. When the action is called, it attempts to execute the Notepad.exe process and open the referenced topic with it.

The sample plugin "latex-images-support" (compatible with Oxygen 18.0 and newer) adds support for rendering Latex images in the Author visual editing mode using the open source JLatex library. The image Latex content needs to be in an XML element called "latex"

The sample plugin “impose-options“ (compatible with Oxygen 18.0 and newer) imports a fixed set of options (saved in XML format) in Oxygen when the application  start. You can save global options to XML from Oxygen by using the Options menu->”Export Global Options” action.
