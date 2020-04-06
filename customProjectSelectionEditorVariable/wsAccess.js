function applicationStarted(pluginWorkspaceAccess) {
resolver = {
   	resolveEditorVariables :function (contentWithEditorVariables, currentEditedFileURL) {
    		clipboardVarName = "projectSelectedResources";
        	if(contentWithEditorVariables.indexOf("${" + clipboardVarName + "}") != -1){
            	try {
                   allURLs = "";
                   selectedFiles = pluginWorkspaceAccess.getProjectManager().getSelectedFiles();
                  for (i = 0; i < selectedFiles.length; i++) {
                     allURLs += getSelectedFileAsURL(selectedFiles[i]) + ";";
                    }
            		return contentWithEditorVariables.replace("${" + clipboardVarName + "}", allURLs);
            		Packages.java.lang.System.err.println("\nIN HERE2 " + allURLs);
            	} catch (e) {
            		// error: don't replace variable
            		return contentWithEditorVariables;
            	}
        	}
    		return contentWithEditorVariables;
		}
}
pluginWorkspaceAccess.getUtilAccess().addCustomEditorVariablesResolver(new Packages.ro.sync.exml.workspace.api.util.EditorVariablesResolver(resolver));
}
function applicationClosing(pluginWorkspaceAccess) {
}

function getSelectedFileAsURL(file) {
  if(file.isFile()) {
    return file.toURI().toURL().toString();
  } else if(file.isDirectory()) {
    children = file.listFiles();
    str = "";
    for (i = 0; i < children.length; i++) {
      str += getSelectedFileAsURL(children[i]) + ";";
    }
    return str;
  }
  return "";
}