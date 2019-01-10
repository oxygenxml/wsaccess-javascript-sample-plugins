/**
* The name of the action that will be presented in the contextual menu.
* This can be configurated editing the 'menuItemName' element from the 'config.xml' file.
*/
var menuItemName = ""; 

/**
* The id of the extension action that will be executed on the selected project view file.
* This can be configurated editing the 'authorActionId' element from the 'config.xml' file.
*/
var actionId = "";

/**
* Path to the configuration file.
*/
var configFilePath = "/config.xml";

function applicationStarted(pluginWorkspaceAccess) {
    // Load the configuration form the config.xml
    loadConfiguration(pluginWorkspaceAccess);
 	// Create the abstract action added in the contextual menu.
	var abstractAction = new JavaAdapter(Packages.javax.swing.AbstractAction, Packages.java.awt.event.ActionListener, {
   		actionPerformed: function (e) {
   		   Packages.javax.swing.SwingUtilities.invokeLater(new JavaAdapter(Packages.java.lang.Runnable,{
   		       run: function (){
           		     // Clear result manager
                    var allResults = pluginWorkspaceAccess.getResultsManager().getAllResults(menuItemName);
                    for (var i = 0; i < allResults.size(); i++) {
                        pluginWorkspaceAccess.getResultsManager().removeResult(menuItemName, allResults.get(i));
                    }			 
                    pluginWorkspaceAccess.showStatusMessage("'" + menuItemName +"'" + " in progress");
                    var applied = applyActionToSelectedFiles(pluginWorkspaceAccess, actionId);
                    if(applied){
                      pluginWorkspaceAccess.showStatusMessage("'" + menuItemName +"'" + " finished");
                    } else {
                        pluginWorkspaceAccess.showStatusMessage("'" + menuItemName +"'" + " failed");
                   	}    
   		       }
   		   }));
        }
	});
	abstractAction.putValue(Packages.javax.swing.Action.NAME, menuItemName);
	
	// Mount the action on the contextual menu of the Project view.
    projectPopupMenuCustomizer = {
        customizePopUpMenu: function (popUp) {
            if(popUp instanceof Packages.javax.swing.JPopupMenu) {
			    popUp.add(abstractAction);
		    }	
        }	
    }
    // Add the projectPopupMenuCustomizer.
    projectPopupMenuCustomizer = new JavaAdapter(
        Packages.ro.sync.exml.workspace.api.standalone.project.ProjectPopupMenuCustomizer, projectPopupMenuCustomizer);
    pluginWorkspaceAccess.getProjectManager().addPopUpMenuCustomizer(projectPopupMenuCustomizer);
}

/**
* Apply the extension action with the given Id to all selected files from Project view.
*/
function applyActionToSelectedFiles(pluginWorkspaceAccess, actionId){
	var projectManager = pluginWorkspaceAccess.getProjectManager();
	// Get the selected files.
    var selectedFiles = projectManager.getSelectedFiles();
	var utilAcess = pluginWorkspaceAccess.getUtilAccess();
	var allFiles = new Packages.java.util.ArrayList();
	for (var i = 0; i < selectedFiles.length; i++) {
	   allFiles = getFilesRecursively(allFiles, selectedFiles[i], utilAcess);
	}
	
	var performed = true;
	if (allFiles != null && !allFiles.isEmpty()) {
	   try {
		  var editorComponentProvider = pluginWorkspaceAccess.createEditorComponentProvider(
		              [Packages.ro.sync.exml.editor.EditorPageConstants.PAGE_AUTHOR],
		              Packages.ro.sync.exml.editor.EditorPageConstants.PAGE_AUTHOR);
		  for (var i = 0; i < allFiles.size(); i++) {
		     pluginWorkspaceAccess.showStatusMessage("'" + menuItemName +"'" +" - "+ allFiles.get(i)  + " - in progress");
		     performed &= performActionOnFile(allFiles.get(i), actionId, editorComponentProvider, pluginWorkspaceAccess);;
		  }
		  Packages.ro.sync.ecss.extensions.api.component.AuthorComponentFactory.getInstance().disposeEditorComponentProvider(editorComponentProvider);
		} catch (e) {
		  performed = false;
          Packages.java.lang.System.err.println("Exception: " + e);
        }
	}
	return performed;
}

/* *
 * Recursively get all handled binary file.
 */
function getFilesRecursively(files, dir, utilAccess) {
	if(dir.isDirectory()) {
	  var child = dir.listFiles();
	   for (var i = 0; i < child.length; i++) {
		  getFilesRecursively(files, child[i], utilAccess);
		}
	} else {
	   var dirURL	= dir.toURI().toURL()
	   if(!utilAccess.isUnhandledBinaryResourceURL(dirURL)) {
	       files.add(dir);
	   }
	}
	return files;
} 

/* *
 *  Performe the extension action with the given ID to the given file.
 */
function performActionOnFile(file, actionId, editorComponentProvider, pluginWorkspaceAccess){
   var message = null;
   var performed = true;
   try {
	   editorComponentProvider.load(file.toURI().toURL(), null);
	   var actionProvider = editorComponentProvider.getWSEditorAccess().getCurrentPage().getActionsProvider();
	   var allActionsMap = actionProvider.getAuthorExtensionActions();
	   if(allActionsMap != null) {
	       var replaceReferenceContentAction = allActionsMap.get(actionId);
		   if (replaceReferenceContentAction != null) {
		      actionProvider.invokeAction(replaceReferenceContentAction);
		      editorComponentProvider.save();
		   }
	   }
	} catch (e) {
		message = "Cannot apply action '"+ actionId +"' to file: '"+ file+"'";
		performed = false;
    }
    if(message != null){
     pluginWorkspaceAccess.getResultsManager().addResult(
		              menuItemName,
		              new Packages.ro.sync.document.DocumentPositionedInfo(
		                  Packages.ro.sync.document.DocumentPositionedInfo.SEVERITY_ERROR,
		                  message,
		                  "file:/"+ file.getAbsolutePath()),
		              Packages.ro.sync.exml.workspace.api.results.ResultsManager.ResultType.PROBLEM,
		              true, false);
    }
    return performed;
}

/**
* Load the configuration from the config.xml
*/
function loadConfiguration(pluginWorkspaceAccess){
    var configFileLocation = jsDirURL.toString() + configFilePath;
	var configFile = pluginWorkspaceAccess.getUtilAccess().locateFile(new Packages.java.net.URL(configFileLocation));

	var builderFactory = Packages.javax.xml.parsers.DocumentBuilderFactory.newInstance();
	var builder = builderFactory.newDocumentBuilder();
	var xmlDocument = builder.parse(configFile);
	var xPath = Packages.javax.xml.xpath.XPathFactory.newInstance().newXPath();
	
	var menuItemNameNode = xPath.compile("config/menuItemName").evaluate(xmlDocument, Packages.javax.xml.xpath.XPathConstants.NODE);
    if(menuItemNameNode != null){
      menuItemName =  menuItemNameNode.getTextContent();
    }
    
	var actionIdNode = xPath.compile("config/authorActionId").evaluate(xmlDocument, Packages.javax.xml.xpath.XPathConstants.NODE);
    if(actionIdNode != null){
      actionId = actionIdNode.getTextContent();
    }
}

function applicationClosing(pluginWorkspaceAccess) {
	Packages.java.lang.System.err.println("Application closing " + pluginWorkspaceAccess);
}