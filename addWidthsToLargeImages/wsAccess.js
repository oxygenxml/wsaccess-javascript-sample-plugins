function applicationStarted(pluginWorkspaceAccess) {
    /*Add listener called when right click is performed in the Author editing mode*/
    customizerObj = {
        customizeAuthorPopUpMenu: function (popUp, authorAccess) {
            try {
                mi = new Packages.javax.swing.JMenuItem("Add widths to all images");
                popUp.add(mi);
                actionPerfObj = {
                    actionPerformed: function (e) {
                        documentController = authorAccess.getDocumentController();
                         allImageNodes = documentController.findNodesByXPath("//image", true, true, true);
                         for (i = 0; i< allImageNodes.length;i++){
                           imageNode = allImageNodes[i];
                           if(imageNode.getAttribute("width") == null){
                             //A width attribute is not yet specified on it
                             href = imageNode.getAttribute("href").getValue();
                             location = new Packages.java.net.URL(imageNode.getXMLBaseURL(), href);
                             imageStream = Packages.javax.imageio.ImageIO.createImageInputStream(location.openStream());
                             imageReader = Packages.javax.imageio.ImageIO.getImageReaders(imageStream).next();
                             imageReader.setInput(imageStream, false, false);
                             imgWidth = imageReader.getWidth(0);
                             if(imgWidth > 600){
                               //Impose 600 pixels using the width attribute
                               documentController.setAttribute("width", new Packages.ro.sync.ecss.extensions.api.node.AttrValue("600"), imageNode)
                             }
                           }
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
}