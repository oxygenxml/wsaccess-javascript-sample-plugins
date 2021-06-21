function applicationStarted(pluginWorkspaceAccess) {
 Packages.java.lang.System.err.println("Application started " + pluginWorkspaceAccess);
 
 var editorListener = {
     editorOpened : function (editorLocation) {
        var editorAccess = pluginWorkspaceAccess.getEditorAccess(editorLocation, Packages.ro.sync.exml.workspace.api.PluginWorkspace.MAIN_EDITING_AREA);
        
        if (editorAccess.getCurrentPageID() == "Text") {
            var textPage = editorAccess.getCurrentPage();
            var textComponent = textPage.getTextComponent();
            
            var mouseListener = {
                mouseClicked: function(event) {
                    Packages.java.lang.System.err.println("Mouse clicked");
                },
                mousePressed: function(event) {
                    Packages.java.lang.System.err.println("Mouse pressed");
                },
                mouseReleased: function(event) {
                    Packages.java.lang.System.err.println("Mouse released");
                }
            }
            
          textComponent.addMouseListener(new JavaAdapter(Packages.java.awt.event.MouseListener, mouseListener));
        }
     }
 };
 
  pluginWorkspaceAccess.addEditorChangeListener(new JavaAdapter(Packages.ro.sync.exml.workspace.api.listeners.WSEditorChangeListener, editorListener), Packages.ro.sync.exml.workspace.api.PluginWorkspace.MAIN_EDITING_AREA);
  
}

function applicationClosing(pluginWorkspaceAccess) {
 Packages.java.lang.System.err.println("Application closing " + pluginWorkspaceAccess);
}
