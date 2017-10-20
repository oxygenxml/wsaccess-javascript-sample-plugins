function applicationStarted(pluginWorkspaceAccess) {
 Packages.java.lang.System.err.println("Application started " + pluginWorkspaceAccess);
 edChangedListener = {
  /*Called when a DITA Map is opened*/
  editorOpened: function (editorLocation) {
   /*Get the opened DITA Map*/
   editor = pluginWorkspaceAccess.getEditorAccess(editorLocation, Packages.ro.sync.exml.workspace.api.PluginWorkspace.DITA_MAPS_EDITING_AREA);
   ditaMapPage = editor.getCurrentPage();
   /*Add listener called when right click is performed in the DITA Maps manager view*/
   customizerObj = {
    customizePopUpMenu: function (popUp, ditaMapDocumentController) {
     tree = ditaMapPage.getDITAMapTreeComponent();
     try {
        mi = new Packages.javax.swing.JMenuItem("Export entire DITA Map to Fluid Topics");
        popUp.add(mi);
        actionPerfObj = {
         actionPerformed: function (e) {
         try{
                tmpDir = new Packages.java.io.File(Packages.java.lang.System.getProperty("java.io.tmpdir"));
                exportFile = new Packages.java.io.File(tmpDir, "fluid-export.zip");
                exportFile.delete();
                updater = {
                    done: function(){
                      try{
                      //TODO below you can find the URL where the ZIP is being uploaded...
                        connection = new Packages.java.net.URL("http://www.google.com").openConnection();
                        // Prepare the URL connection for a "POST" method.
                        connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
                    
                        connection.setRequestMethod("POST");
                        // Prepare the output stream of the URL connection.
                        connection.setDoOutput(true);
                        connection.connect();
                        str = connection.getOutputStream();
                    
                        fis = new Packages.java.io.FileInputStream(exportFile);
                        bytes = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);
                        length = -1;
                        while((length = fis.read(bytes)) != -1){
                          str.write(bytes, 0, length);
                        }
                    
                        // Close the output stream.
                        str.flush();
                        str.close();
                        fis.close();
                     } catch (e1) {
                      Packages.java.lang.System.err.println(e1);
                      Packages.javax.swing.JOptionPane.showMessageDialog(null, e1);
                    }
                }
              }
              Packages.ro.sync.ecss.dita.DITAAccess.exportDITAMap(editor.getEditorLocation(), exportFile.getParentFile(), true, exportFile.getName(), new JavaAdapter(Packages.ro.sync.ecss.dita.mapeditor.actions.export.helper.ExportProgressUpdater, updater))
                
            } catch (e1) {
                Packages.java.lang.System.err.println(e1);
                Packages.javax.swing.JOptionPane.showMessageDialog(null, e1);
           }
         }
        }
        mi.addActionListener(new JavaAdapter(Packages.java.awt.event.ActionListener, actionPerfObj));
       }
       catch (e1) {
        Packages.java.lang.System.err.println(e1);
        Packages.javax.swing.JOptionPane.showMessageDialog(null, e1);
       }
    }
   }
   
   ditaMapPage.setPopUpMenuCustomizer(new Packages.ro.sync.exml.workspace.api.editor.page.ditamap.DITAMapPopupMenuCustomizer(customizerObj));
  }
 }
 edChangedListener = new JavaAdapter(Packages.ro.sync.exml.workspace.api.listeners.WSEditorChangeListener, edChangedListener);
 pluginWorkspaceAccess.addEditorChangeListener(
 edChangedListener,
 Packages.ro.sync.exml.workspace.api.PluginWorkspace.DITA_MAPS_EDITING_AREA);
}

function applicationClosing(pluginWorkspaceAccess) {
 Packages.java.lang.System.err.println("Application closing " + pluginWorkspaceAccess);
}
