function applicationStarted(pluginWorkspaceAccess) {
    Packages.java.lang.System.err.println("Application started " + pluginWorkspaceAccess);
    imageHandler = {
        canHandle: function (a, b, c) {
        },
        canHandleNamespace: function (ns) {
            return false;
        },
        canHandleNodeContext: function (nodeContext) {
            return "plantuml" == nodeContext.getNodeName() 
		|| ("foreign" == nodeContext.getNodeName() && "embed-plant-uml" == nodeContext.getAttributeValue("outputclass"))
		|| ("programlisting" == nodeContext.getNodeName() && "embed-plant-uml" == nodeContext.getAttributeValue("language"));
        },
        editImage: function (editContext) {
            jta = new Packages.javax.swing.JTextArea(editContext.getImageSerializedContent());
            scrollPane = new Packages.javax.swing.JScrollPane(jta);
            scrollPane.setPreferredSize(new Packages.java.awt.Dimension(500, 300));
            result = Packages.javax.swing.JOptionPane.showConfirmDialog(null, scrollPane,
                "Edit PlantUML Equation", Packages.javax.swing.JOptionPane.OK_CANCEL_OPTION,
                Packages.javax.swing.JOptionPane.PLAIN_MESSAGE);
            if (result == Packages.javax.swing.JOptionPane.YES_OPTION) {
                return jta.getText();
            } else {
                return null;
            }
        },
        canHandleFileType: function (type) {
            return "plantuml" == type;
        },
        clearCache: function () {
        },
        getImageLayoutInformation: function (cp, rc) {
            image = getPlantUMLImage(pluginWorkspaceAccess, cp, rc);
            return new Packages.ro.sync.exml.workspace.api.images.handlers.ImageLayoutInformation(0, 0, image.getWidth(null), image.getHeight(null));
        },
        getImage: function (cp, rc) {
            return getPlantUMLImage(pluginWorkspaceAccess, cp, rc);
        }
    }
    pluginWorkspaceAccess.getImageUtilities().addImageHandler(new JavaAdapter(Packages.ro.sync.exml.workspace.api.images.handlers.XMLImageHandler, imageHandler));
}

function getPlantUMLImage(pluginWorkspaceAccess, cp, rc) {
    plantumlContent = cp.getImageSerializedContent();
    plantumlContent = pluginWorkspaceAccess.getXMLUtilAccess().unescapeAttributeValue(plantumlContent.substring(plantumlContent.indexOf(">") + 1, plantumlContent.lastIndexOf("<")));
    format = new Packages.net.sourceforge.plantuml.FileFormatOption(Packages.net.sourceforge.plantuml.FileFormat.PNG);
    if(cp.getUrl() != null && cp.getUrl().getProtocol().equals("file") && cp.getUrl().toURI() != null){
        newCurrentDir = new Packages.java.io.File(cp.getUrl().toURI()).getParentFile();
        Packages.java.lang.System.setProperty("plantuml.include.path", newCurrentDir.getAbsolutePath());
    }
    reader = new Packages.net.sourceforge.plantuml.SourceStringReader(plantumlContent);
    os = new Packages.java.io.ByteArrayOutputStream();
	// Write the image to "os"
	reader.outputImage(os, format);
	os.close();
	return Packages.javax.imageio.ImageIO.read(new Packages.java.io.ByteArrayInputStream(os.toByteArray()));
}

function applicationClosing(pluginWorkspaceAccess) {
    Packages.java.lang.System.err.println("Application closing " + pluginWorkspaceAccess);
}
