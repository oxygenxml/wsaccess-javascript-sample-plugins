/**
* The name of the action. This will be presented in the contextual menu, in the title of the showed dialog and in the shortcut table from 'Preferences/Menu Shortcut Keys' page.
*/
var actionName = "Custom CC"; 

/**
* Path to file that contains the values that will be loaded in the combobox from the dialog. 
* This path is relative to plugin folder.
*/
var valuesFilePath = "/values.xml";

/**
*	Xpath expression used to get the values loaded in the combobox.
*/
var xpathExpression = "values//value";

/**
* The action key stroke string representation. 
* You can use platform-dependent strokes like "Ctrl Alt X" or platform-independent strokes like "M1 M3 X" where:
* 
*  - M1 represents the Command key on MacOS X, and the Ctrl key on other platforms.
*  - M2 represents the Shift key.
*  - M3 represents the Option key on MacOS X, and the Alt key on other platforms.
*  - M4 represents the Ctrl key on MacOS X, and is undefined on other platforms.
* 
*/
var actionKeyStroke = "M1 M3 A";


function applicationStarted(pluginWorkspaceAccess) {
	var ccValues  = getCCValues(pluginWorkspaceAccess);
    menuCustomizer = {
        customizeTextPopUpMenu: function (popUp, textPage) {
			/*Create the menu item*/
			mi = new Packages.javax.swing.JMenuItem(actionName);
			popUp.add(mi);
			
			// Add an action listener on the new menu item.
			actionPerfObj = {
				 actionPerformed: function (e) {
					showDialogAndInsertText(pluginWorkspaceAccess, ccValues);
				}
			}
			actionPerfObj = new JavaAdapter(Packages.java.awt.event.ActionListener, actionPerfObj)
			mi.addActionListener(actionPerfObj);
			
        }	
    }
    // Add the menu customizer.
    menuCustomizer = new JavaAdapter(Packages.ro.sync.exml.workspace.api.standalone.actions.MenusAndToolbarsContributorCustomizer, menuCustomizer);
    pluginWorkspaceAccess.addMenusAndToolbarsContributorCustomizer(menuCustomizer);
	
 	// Add the shortcut key
	var abstractAction = new JavaAdapter(Packages.javax.swing.AbstractAction, Packages.java.awt.event.ActionListener, {
			actionPerformed: function (e) {
				showDialogAndInsertText(pluginWorkspaceAccess, ccValues);
			}
		});
	abstractAction.putValue(Packages.javax.swing.Action.NAME, actionName);
	
	pluginWorkspaceAccess.getActionsProvider().registerAction("customCCPlugin", abstractAction, actionKeyStroke);
}

/**
* Show the input panel and inset the selected value in the current text document.
*/
function showDialogAndInsertText(pluginWorkspaceAccess, ccValues){
	var selectedValue = Packages.javax.swing.JOptionPane.showInputDialog(
			pluginWorkspaceAccess.getParentFrame(),
			null,
			actionName,
			Packages.javax.swing.JOptionPane.PLAIN_MESSAGE,
			null,
			ccValues,
			null);
																		 
	if (selectedValue != null && !selectedValue.isEmpty()){
		var currentEditorAccess = pluginWorkspaceAccess.getCurrentEditorAccess(Packages.ro.sync.exml.workspace.api.PluginWorkspace.MAIN_EDITING_AREA);
		var currentPage = currentEditorAccess.getCurrentPage();
		if(currentPage instanceof Packages.ro.sync.exml.workspace.api.editor.page.text.WSTextEditorPage) {
			currentPage.getDocument().insertString(currentPage.getCaretOffset(), selectedValue, null);
		}
	}	
}

/**
* Get the CC values from the 'valuesFilePath' document, executing the 'xpathExpression' xPath.
*/
function getCCValues(pluginWorkspaceAccess){
	var fileLocation = jsDirURL.toString() + valuesFilePath;
	var fileWithValues = pluginWorkspaceAccess.getUtilAccess().locateFile(new Packages.java.net.URL(fileLocation));

	var values = [];
	var builderFactory = Packages.javax.xml.parsers.DocumentBuilderFactory.newInstance();
	var builder = builderFactory.newDocumentBuilder();
	var xmlDocument = builder.parse(fileWithValues);
	var xPath = Packages.javax.xml.xpath.XPathFactory.newInstance().newXPath();
	var nodeList = xPath.compile(xpathExpression).evaluate(xmlDocument, Packages.javax.xml.xpath.XPathConstants.NODESET);
		
	for (var i = 0; i < nodeList.getLength(); i++) {
		var node = nodeList.item(i);
		values[i] = node.getTextContent();
	}
	return values;
}

function applicationClosing(pluginWorkspaceAccess) {
	Packages.java.lang.System.err.println("Application closing " + pluginWorkspaceAccess);
}