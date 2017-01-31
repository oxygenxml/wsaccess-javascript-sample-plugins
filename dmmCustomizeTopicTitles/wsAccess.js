function applicationStarted(pluginWorkspaceAccess) {
 Packages.java.lang.System.err.println("Application started " + pluginWorkspaceAccess);
 edChangedListener = {
  /*Called when a DITA Map is opened*/
  editorOpened: function (editorLocation) {
   Packages.java.lang.System.err.println("\nrunning " + editorLocation);
   /*Get the opened DITA Map*/
   editor = pluginWorkspaceAccess.getEditorAccess(editorLocation, Packages.ro.sync.exml.workspace.api.PluginWorkspace.DITA_MAPS_EDITING_AREA);
   ditaMapPage = editor.getCurrentPage();
   
   
   customizer = {
    customizeComputedTopicrefTitle: function (topicref, targetTopicOrMap, defaultComputedTitle) {
        if("chapter".equals(topicref.getName())){
          parentOfTopicRef = topicref.getParent();
          cnt = 1;
          nodes = parentOfTopicRef.getContentNodes();
          for(i=0; i< nodes.size();i++){
            if(nodes.get(i) == topicref){
                break;
            } else if("chapter".equals(nodes.get(i).getName())){
                cnt=cnt+1;
            }
          }
          return cnt + " - " + defaultComputedTitle;
        } else {
          //Default title
          return defaultComputedTitle;
        }        
    }
   }
    ditaMapPage.addNodeRendererCustomizer(new Packages.ro.sync.exml.workspace.api.editor.page.ditamap.DITAMapNodeRendererCustomizer(customizer));
  }
 }
 edChangedListener = new JavaAdapter(Packages.ro.sync.exml.workspace.api.listeners.WSEditorChangeListener, edChangedListener);
 pluginWorkspaceAccess.addEditorChangeListener(edChangedListener, Packages.ro.sync.exml.workspace.api.PluginWorkspace.DITA_MAPS_EDITING_AREA);
}

function applicationClosing(pluginWorkspaceAccess) {
 Packages.java.lang.System.err.println("Application closing " + pluginWorkspaceAccess);
}
