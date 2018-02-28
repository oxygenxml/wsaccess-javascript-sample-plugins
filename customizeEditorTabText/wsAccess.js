function applicationStarted(pluginWorkspaceAccess) {
 Packages.java.lang.System.err.println("Application started " + pluginWorkspaceAccess);
 edChangedListener = {
  /*Called when a document  is opened*/
  editorOpened: function (editorLocation) {
   Packages.java.lang.System.err.println("\nrunning " + editorLocation);
   /*Get the opened editor*/
   editor = pluginWorkspaceAccess.getEditorAccess(editorLocation, Packages.ro.sync.exml.workspace.api.PluginWorkspace.MAIN_EDITING_AREA);
   location = editor.getEditorLocation().toString();
   fileName = pluginWorkspaceAccess.getUtilAccess().getFileName(location);
   //If the location is something like
   //file:///C:/path/to/v17 Branch KD/..../somePath
   //then try to extract the branch version from it and use it as a prefix to the file name.
   prefix = "";
   regexp = /.*\/([vV][0-9.]+)/;
   myArray = regexp.exec(location);
   if(myArray != null && myArray.length > 0){
       prefix = "[" + myArray[1] + "] - ";
   }
   editor.setEditorTabText(prefix + fileName);
  }
 }
 edChangedListener = new JavaAdapter(Packages.ro.sync.exml.workspace.api.listeners.WSEditorChangeListener, edChangedListener);
 pluginWorkspaceAccess.addEditorChangeListener(
 edChangedListener,
 Packages.ro.sync.exml.workspace.api.PluginWorkspace.MAIN_EDITING_AREA);
}

function applicationClosing(pluginWorkspaceAccess) {
 Packages.java.lang.System.err.println("Application closing " + pluginWorkspaceAccess);
}
