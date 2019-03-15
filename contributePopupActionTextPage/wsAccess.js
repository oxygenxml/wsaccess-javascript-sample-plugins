function applicationStarted(pluginWorkspaceAccess) {
 Packages.java.lang.System.err.println("Application started " + pluginWorkspaceAccess);
 
    /*Add listener called when right click is performed in the text page*/
   customizerObj = {
    customizeTextPopUpMenu: function (popUp, textPage) {
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

    //Add the popup menu customizer.
    pluginWorkspaceAccess.addMenusAndToolbarsContributorCustomizer(new JavaAdapter(Packages.ro.sync.exml.workspace.api.standalone.actions.MenusAndToolbarsContributorCustomizer, customizerObj));
}

function applicationClosing(pluginWorkspaceAccess) {
 Packages.java.lang.System.err.println("Application closing " + pluginWorkspaceAccess);
}
