function applicationStarted(pluginWorkspaceAccess) {
 Packages.java.lang.System.err.println("Application started " + pluginWorkspaceAccess);
 edChangedListener = {
  /*Called when an editor  is opened*/
  editorOpened: function (editorLocation) {
   Packages.java.lang.System.err.println("\nrunning " + editorLocation);
   /*Get the opened editor*/
   editor = pluginWorkspaceAccess.getEditorAccess(editorLocation, Packages.ro.sync.exml.workspace.api.PluginWorkspace.MAIN_EDITING_AREA);
   /*Add validation problems filter*/
   validationProblemsFilter = {
    filterValidationProblems: function (validationProblems) {
     Packages.java.lang.System.err.println("VALIDATE");
     problemsList = validationProblems.getProblemsList();
      if(problemsList != null){
        for (i = problemsList.size() - 1; i >=0; i--) {
        if("dmv.reference.not.exist" == problemsList.get(i).getErrorKey()){
          problemsList.remove(i);
        }
       }
      }
    }
   }
   editor.addValidationProblemsFilter(new JavaAdapter(Packages.ro.sync.exml.workspace.api.editor.validation.ValidationProblemsFilter, validationProblemsFilter));
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
