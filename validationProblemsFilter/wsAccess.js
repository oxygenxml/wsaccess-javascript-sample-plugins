function applicationStarted(pluginWorkspaceAccess) {
 messageContentsList = readConfigFileContents(pluginWorkspaceAccess, "messageContentsToFilter.txt");
 keysToFilter = readConfigFileContents(pluginWorkspaceAccess, "keysToFilter.txt");
 edChangedListener = {
  /*Called when an editor  is opened*/
  editorOpened: function (editorLocation) {
   /*Get the opened editor*/
   editor = pluginWorkspaceAccess.getEditorAccess(editorLocation, Packages.ro.sync.exml.workspace.api.PluginWorkspace.MAIN_EDITING_AREA);
   /*Add validation problems filter*/
   validationProblemsFilter = {
    filterValidationProblems: function (validationProblems) {
     problemsList = validationProblems.getProblemsList();
      if(problemsList != null){
        for (i = problemsList.size() - 1; i >=0; i--) {
        problem = problemsList.get(i);
        remove = false;
        //Filter message fragments
        for (k = 0; k < messageContentsList.size(); k++) {
          if(problem.getMessage() != null && problem.getMessage().contains(messageContentsList.get(k))){
              remove = true;
              break;
          }
        }
        //Filter error keys.
        if(! remove){
          for (k = 0; k < keysToFilter.size(); k++) {
          if(problem.getErrorKey() != null && problem.getErrorKey().equals(keysToFilter.get(k))){
              remove = true;
              break;
          }
         }  
        }
        if(remove){
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
 //
}

//Read contents of the UTF-8 encoded config file, line by line to a list.
function readConfigFileContents(pluginWorkspaceAccess, fileName){
     messageContentsToFilterOutURL = pluginWorkspaceAccess.getUtilAccess().locateFile(jsDirURL) + "/" + fileName;
     reader = new Packages.java.io.BufferedReader(new Packages.java.io.InputStreamReader(new Packages.java.io.FileInputStream(messageContentsToFilterOutURL), "UTF8"));
     list = new Packages.java.util.ArrayList();
    while ((line = reader.readLine()) != null) {
        list.add(line);
    }
    reader.close();
    return list;
}
