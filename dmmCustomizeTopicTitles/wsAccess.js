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
        //Present profiling attributes set on the root element.
         if(targetTopicOrMap.getType() == Packages.ro.sync.ecss.extensions.api.node.AuthorNode.NODE_TYPE_DOCUMENT){
             rootElement = targetTopicOrMap.getRootElement();
             if(rootElement.getType() == Packages.ro.sync.ecss.extensions.api.node.AuthorNode.NODE_TYPE_ELEMENT){
              attrsCount = rootElement.getAttributesCount();
              for (i = 0; i < attrsCount; i++) {
                attrName = rootElement.getAttributeAtIndex(i);
                if(attrName.equals("rev") || attrName.equals("audience") || attrName.equals("platform") || attrName.equals("product") || attrName.equals("props")){
                  //Interesting attribute...
                  defaultComputedTitle = defaultComputedTitle + " [" + attrName + "='" +  rootElement.getAttribute(attrName) + "']";
                }
              }
            }
        }
        //Count chapters and present counter before chapter name.
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
          defaultComputedTitle = cnt + " - " + defaultComputedTitle;
        }        
      return defaultComputedTitle;
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
