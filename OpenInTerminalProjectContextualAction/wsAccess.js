function applicationStarted(pluginWorkspaceAccess) {
 Packages.java.lang.System.err.println("Application started " + pluginWorkspaceAccess);
 var projectController = pluginWorkspaceAccess.getProjectManager();
 var  popupMenuCustomizer = {
     customizePopUpMenu: function (popupMenu){
         selectedFiles = projectController.getSelectedFiles();
         if (selectedFiles != null && selectedFiles.length == 1) {
            if(selectedFiles[0].isDirectory()){
                var mi = new Packages.javax.swing.JMenuItem("Open Terminal ");
                popupMenu.add(mi);
                var actionPerfObj = {
                 actionPerformed: function (e) {
                     var params = java.lang.reflect.Array.newInstance(java.lang.String, 4);
                     params[0] = "/usr/bin/open";
                     params[1] = "-a";
                     params[2] = "Terminal";
                     params[3] = selectedFiles[0].getAbsolutePath();
                     Packages.java.lang.Runtime.getRuntime().exec(params);
                 }
                }
                mi.addActionListener(new JavaAdapter(Packages.java.awt.event.ActionListener, actionPerfObj));
            }
         }
     }
 }
 projectController.addPopUpMenuCustomizer(popupMenuCustomizer);
}

function applicationClosing(pluginWorkspaceAccess) {
 Packages.java.lang.System.err.println("Application closing " + pluginWorkspaceAccess);
}
