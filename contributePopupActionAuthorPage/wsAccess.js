/* Example for working with the Author editing mode, started from: https://www.oxygenxml.com/forum/post49889.html#p49886 */
function applicationStarted(pluginWorkspaceAccess) {
 Packages.java.lang.System.err.println("Application started " + pluginWorkspaceAccess);
 var edChangedListener = {
  /*Called when a document  is opened*/
  /*See: https://www.oxygenxml.com/InstData/Editor/SDK/javadoc/ro/sync/exml/plugin/workspace/WorkspaceAccessPluginExtension.html */
  editorOpened: function (editorLocation) {
   Packages.java.lang.System.err.println("\nrunning " + editorLocation);
   /*Get the opened editor, each opened XML document corresponds to "WSEditor" object*/
   /* See: https://www.oxygenxml.com/InstData/Editor/SDK/javadoc/ro/sync/exml/workspace/api/PluginWorkspace.html#getEditorAccess-java.net.URL-int- */
   var editor = pluginWorkspaceAccess.getEditorAccess(editorLocation, Packages.ro.sync.exml.workspace.api.PluginWorkspace.MAIN_EDITING_AREA);
   /* An editor (WSEditor) has three editing modes (Text/Grid/Author) so we need to check that it's opened in the "Author" editing mode */
   /* We can also add listeners to know when end user switches between edit modes  */
   /* WSEditor API: https://www.oxygenxml.com/InstData/Editor/SDK/javadoc/ro/sync/exml/workspace/api/editor/WSEditor.html */
   if(editor.getCurrentPageID() == "Author"){
       //The current editor is opened in the "Author" visual editing mode
       authorPage = editor.getCurrentPage();
       /*Add listener called when right click is performed in the Author editing mode*/
       /* See: https://www.oxygenxml.com/InstData/Editor/SDK/javadoc/ro/sync/exml/workspace/api/editor/page/author/WSAuthorEditorPageBase.html */
       customizerObj = {
        customizePopUpMenu: function (popUp, authorAccess) {
         Packages.java.lang.System.err.println("RIGHT CLICK" + popUp);
          try {
            /*Create menu items, the Javascript plugin creates Swing components (menu items in this case) 
             * because Oxygen is Java Swing based. */
            mi = new Packages.javax.swing.JMenuItem("Wrap In Bold");
            popUp.add(mi);
            actionPerfObj = {
             actionPerformed: function (e) {
              try {
                 /* Check if have selected content */
                if(authorAccess.getEditorAccess().hasSelection()){
                    /* The document controller must be used to manipulate the edited XML content */
                    /* See: https://www.oxygenxml.com/InstData/Editor/SDK/javadoc/ro/sync/ecss/extensions/api/AuthorDocumentController.html */
                    /* It has lots of API to change the document contents but it also has API to obtain
                    /* the document root element: https://www.oxygenxml.com/InstData/Editor/SDK/javadoc/ro/sync/ecss/extensions/api/AuthorDocumentController.html#getAuthorDocumentNode-- */                     
                    /* And it also has API to search for a certain AuthorNode using XPath: "findNodesByXPath" */
                    /* But you can also use the methods in the AuthorDocument node to navigate down in its descendants tree.*/
                  documentController = authorAccess.getDocumentController();
                  /* Any modification to the nodes structure (even setting attribute values) MUST be done using the AuthorDocumentController 
                   * otherwise the modification will not be undoable. */
                  documentController.surroundInFragment("<b/>", 
                    authorAccess.getEditorAccess().getSelectionStart(), authorAccess.getEditorAccess().getSelectionEnd() - 1);
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
      authorPage.addPopUpMenuCustomizer(new Packages.ro.sync.ecss.extensions.api.structure.AuthorPopupMenuCustomizer(customizerObj));
   }
  }
 }
 var edChangedListenerAdapter = new JavaAdapter(Packages.ro.sync.exml.workspace.api.listeners.WSEditorChangeListener, edChangedListener);
 /* Add the editor changed listener */
 pluginWorkspaceAccess.addEditorChangeListener(
 edChangedListenerAdapter,
 Packages.ro.sync.exml.workspace.api.PluginWorkspace.MAIN_EDITING_AREA);
}

function applicationClosing(pluginWorkspaceAccess) {
/* The application is closing */
 Packages.java.lang.System.err.println("Application closing " + pluginWorkspaceAccess);
}
