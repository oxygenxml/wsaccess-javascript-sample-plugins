/* Example for working with the Author editing mode, started from: https://www.oxygenxml.com/forum/post49889.html#p49886 */
function applicationStarted(pluginWorkspaceAccess) {
    Packages.java.lang.System.err.println("Application started " + pluginWorkspaceAccess);
    
    /*Add listener called when right click is performed in the Author editing mode*/
    customizerObj = {
        customizeAuthorPopUpMenu: function (popUp, authorAccess) {
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
                            if (authorAccess.getEditorAccess().hasSelection()) {
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
                        }
                        catch (e1) {
                            e1.printStackTrace();
                        }
                    }
                }
                mi.addActionListener(new JavaAdapter(Packages.java.awt.event.ActionListener, actionPerfObj));
            }
            catch (e1) {
                Packages.java.lang.System.err.println(e1);
            }
        }
    }
    //Add the popup menu customizer.
    pluginWorkspaceAccess.addMenusAndToolbarsContributorCustomizer(new JavaAdapter(Packages.ro.sync.exml.workspace.api.standalone.actions.MenusAndToolbarsContributorCustomizer, customizerObj));
}

function applicationClosing(pluginWorkspaceAccess) {
    /* The application is closing */
    Packages.java.lang.System.err.println("Application closing " + pluginWorkspaceAccess);
}