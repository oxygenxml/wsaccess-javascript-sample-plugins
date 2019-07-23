function applicationStarted(pluginWorkspaceAccess) {
 Packages.java.lang.System.err.println("Application started " + pluginWorkspaceAccess);
 
    /*Add listener called when right click is performed in the text page*/
   customizerObj = {
    customizeTextPopUpMenu: function (popUp, textPage) {
     Packages.java.lang.System.err.println("RIGHT CLICK" + popUp);
      try {
        /*Create absolute reference*/
        mi = new Packages.javax.swing.JMenuItem("Determine Complex Layout Chars");
        popUp.add(mi);
        actionPerfObj = {
         actionPerformed: function (e) {
          try {
              var textStr = textPage.getDocument().getText(0, textPage.getDocument().getLength());
              var text = textStr.toCharArray();
              for(var i = 0; i < text.length; i++){
                var complexLayout = Packages.sun.swing.SwingUtilities2.isComplexLayout(text, i, i + 1);
                if(complexLayout){
                    dpi = new Packages.ro.sync.document.DocumentPositionedInfo(i);
                    dpi.setLength(1);
                    dpi.setMessage(textStr.substr(i, 1));
                    dpi.setSystemID(textPage.getParentEditor().getEditorLocation());
                    Packages.ro.sync.exml.workspace.api.PluginWorkspaceProvider.getPluginWorkspace().getResultsManager().addResult("Complex Layout Chars", dpi, Packages.ro.sync.exml.workspace.api.results.ResultsManager.ResultType.GENERIC, true, false);
                }
              }
          } catch (e1) {
           Packages.java.lang.System.err.println(e1);
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
