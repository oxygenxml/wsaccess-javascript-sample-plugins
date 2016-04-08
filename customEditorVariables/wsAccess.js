function applicationStarted(pluginWorkspaceAccess) {
resolver = {
   	resolveEditorVariables :function (contentWithEditorVariables, currentEditedFileURL) {
    		clipboardVarName = "clipboard";
        	if(contentWithEditorVariables.indexOf("${" + clipboardVarName + "}") != -1){
            	clipboard = Packages.java.awt.Toolkit.getDefaultToolkit().getSystemClipboard();
            	try {
            		return contentWithEditorVariables.replace("${" + clipboardVarName + "}", clipboard.getData(Packages.java.awt.datatransfer.DataFlavor.stringFlavor));
            		Packages.java.lang.System.err.println("\nIN HERE2 " + clipboard.getData(DataFlavor.stringFlavor));
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
