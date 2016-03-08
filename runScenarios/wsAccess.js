function applicationStarted(pluginWorkspaceAccess) {
 Packages.java.lang.System.err.println("Application started " + pluginWorkspaceAccess);
 toolbarCustomizer = {
  /*Customize an existing toolbar*/
  customizeToolbar: function (toolbarInfo) {  
   if("Transformation" == toolbarInfo.getToolbarID()){
   Packages.java.lang.System.err.println("\nUsing " + toolbarInfo.getToolbarID());
        original = toolbarInfo.getComponents();
        all = new java.lang.reflect.Array.newInstance(Packages.javax.swing.JComponent, original.length + 1);
        for (i = 0; i < original.length; i++) {
          all[i] = original[i];
        }
        transformToPDF = new Packages.javax.swing.JButton("Transform to PDF");
		actionPerfObj = {
         actionPerformed: function (e) {
			editorAccess = pluginWorkspaceAccess.getCurrentEditorAccess(Packages.ro.sync.exml.workspace.api.standalone.StandalonePluginWorkspace.MAIN_EDITING_AREA);
            try {
			 scenarios = new java.lang.reflect.Array.newInstance(Packages.java.lang.String, 1);
			 scenarios[0] = "DITA PDF";
              editorAccess.runTransformationScenarios(scenarios, null);
            } catch (e1) {
              e1.printStackTrace();
            }
         }
        }
        transformToPDF.addActionListener(new JavaAdapter(Packages.java.awt.event.ActionListener, actionPerfObj));
        all[original.length] = transformToPDF;
        toolbarInfo.setComponents(all);
   }
  }
 }
 toolbarCustomizer = new JavaAdapter(Packages.ro.sync.exml.workspace.api.standalone.ToolbarComponentsCustomizer, toolbarCustomizer);
 pluginWorkspaceAccess.addToolbarComponentsCustomizer(toolbarCustomizer);
}

function applicationClosing(pluginWorkspaceAccess) {
 Packages.java.lang.System.err.println("Application closing " + pluginWorkspaceAccess);
}
