function applicationStarted(pluginWorkspaceAccess) {
 Packages.java.lang.System.err.println("Application started " + pluginWorkspaceAccess);
 edChangedListener = {
  /*Called when a DITA Map is opened*/
  editorOpened: function (editorLocation) {
   Packages.java.lang.System.err.println("\nrunning " + editorLocation);
   /*Get the opened DITA Map*/
   editor = pluginWorkspaceAccess.getEditorAccess(editorLocation, Packages.ro.sync.exml.workspace.api.PluginWorkspace.MAIN_EDITING_AREA);
   textPage = editor.getCurrentPage();
   /*Add listener called when right click is performed in the DITA Maps manager view*/
   customizerObj = {
    customizePopUpMenu: function (popUp, textPage) {
     Packages.java.lang.System.err.println("RIGHT CLICK" + popUp);
      try {
        /*Create absolute reference*/
        mi = new Packages.javax.swing.JMenuItem("Uppercase");
        popUp.add(mi);
        actionPerfObj = {
         actionPerformed: function (e) {
          try {
            if(textPage.hasSelection()){
              selectedText = textPage.getSelectedText();
              textPage.deleteSelection();
              textPage.getDocument().insertString(textPage.getCaretOffset(), selectedText.toUpperCase(), null);
            }
          } catch (e1) {
           e1.printStackTrace();
          }
         }
        }
        mi.addActionListener(new JavaAdapter(Packages.java.awt.event.ActionListener, actionPerfObj));
       } catch (e1) {
        Packages.java.lang.System.err.println(e1);
       }
    }
   }
   
   textPage.addPopUpMenuCustomizer(new Packages.ro.sync.exml.workspace.api.editor.page.text.TextPopupMenuCustomizer(customizerObj));
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
