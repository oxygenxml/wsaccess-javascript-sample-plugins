function applicationStarted(pluginWorkspaceAccess) {
resolver = {
   	resolveEditorVariables :function (contentWithEditorVariables, currentEditedFileURL) {
    		var selectionVarName = "selection";
            try {
               if(contentWithEditorVariables.indexOf("${" + selectionVarName + "}") != -1){
                  var editorAccess = pluginWorkspaceAccess.getCurrentEditorAccess(Packages.ro.sync.exml.workspace.api.PluginWorkspace.MAIN_EDITING_AREA);
                  if(editorAccess != null){
                       var sel = editorAccess.getCurrentPage().getSelectedText();
                       if(sel != null && ! sel.isEmpty()){
                   	  return contentWithEditorVariables.replace("${" + selectionVarName + "}", sel);
                   	}
                  }
               }
            } catch (e) {
                Packages.java.lang.System.err.println("\nError: " + e);
            }
    		return contentWithEditorVariables;
		}
}
pluginWorkspaceAccess.getUtilAccess().addCustomEditorVariablesResolver(new Packages.ro.sync.exml.workspace.api.util.EditorVariablesResolver(resolver));
}
function applicationClosing(pluginWorkspaceAccess) {
}
