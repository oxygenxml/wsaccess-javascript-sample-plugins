# wsaccess-javascript-sample-plugins

Starting with Oxygen 17.1 you can create a workspace access plugin to contribute custom toolbar and menu actions or custom behaviors using Javascript and the Rhino engine:
https://www.oxygenxml.com/doc/ug-editor/topics/workspace-access-plugin-js.html

Each of the folders in this repository is a sample plugin which use this technology to alter different behaviors in Oxygen. So if you take each of these folders, copy it to the **OXYGEN_INSTALL_DIR/plugins** folder and start Oxygen, the plugin will start to work.

The sample plugin **runScenarios** (compatible with Oxygen 17.1 and newer) adds a toolbar action called **Transform to PDF**. When the button is pressed, it invokes an already defined transformation scenario called **DITA PDF** on the current opened XML document.

The sample plugin **contributePopupActionDMM** (compatible with Oxygen 17.1 and newer) contributes a contextual menu action called **Run Notepad** on the popup menu of the DITA Maps Manager view. When the action is called, it attempts to execute the Notepad.exe process and open the referenced topics with it.

The sample plugin **contributePopupActionTextPage** (compatible with Oxygen 17.1 and newer) contributes a contextual menu action called **Uppercase** on the popup menu of the **Text** editing mode. When the action is called, it converts all the selected text content to uppercase.

The sample plugin **latex-images-support** (compatible with Oxygen 18.0 and newer) adds support for rendering Latex images in the Author visual editing mode using the open source JLatex library. The image Latex content needs to be in an XML element called **latex**

The sample plugin **impose-options** (compatible with Oxygen 18.0 and newer) imports a fixed set of options (saved in XML format) in Oxygen when the application  start. You can save global options to XML from Oxygen by using the Options menu->**Export Global Options** action.

The sample plugin **customEditorVariables** (compatible with Oxygen 17.1 and newer) resolves the editor variable **${clipboard}** to the text contents of the clipboard. Editor variables are expanded and can be used in various places from Oxygen:
https://www.oxygenxml.com/doc/versions/17.1/ug-editor/index.html#topics/editor-variables.html

The sample plugin **validationProblemsFilter** (compatible with Oxygen 17.1 and newer) avoids reporting certain validation problems. It has two text configuration files:
   - The **keysToFilter.txt** contains on each line the key of the error which needs to be filtered (the sample configuration does not report a "file not found" problem when a DITA topic has a cross reference to a missing DITA topic).
   - The **messageContentsToFilter.txt** contains on each line part of the message from the error which needs to be filtered (the sample configuration does not report a duplicate ID message for the ID attribute with value "id" in a Docbook 5 document).

The sample plugin **preserveAllReferencesAsAbsolute** forces Oxygen not to resolve any references to other resources as relative. For example if you are working with remote resources via the HTTPS protocol and if you insert a DITA xref or conref to another resource and you want the reference to be inserted as absolute, you can install this plugin to inhibit the regular way in which Oxygen computes relative references.

The sample plugin **dmmCustomizeTopicTitles** (compatible with Oxygen 18.1 and newer) customizes the topic titles presented in the DITA Maps Manager view. If the topicrefs are "chapter" elements, each displayed chapter title will have a counter in front of it.

The sample plugin **urlChooserActionsProvider** (compatible with Oxygen 12.1 and newer) customizes all the URL Chooser dialogs and panels in Oxygen and adds a custom browse action to the drop down button used to browse for target resources.
