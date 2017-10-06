function applicationStarted(pluginWorkspaceAccess) {
  Packages.java.lang.System.err.println("Application started " + pluginWorkspaceAccess);
  
  // Read the properties file that stores mappings from DITA class particle (e.g. "task/task") to icon file path
  var inputStream = null;
  var properties = null;
  try {
    inputStream = new Packages.java.io.FileInputStream(new Packages.java.io.File(new Packages.java.net.URI(jsDirURL + "/icons.properties")));
    properties = new Packages.java.util.Properties();
    properties.load(inputStream);
  }
  catch (err) {
    err.printStackTrace();
  }
  finally {
    if (inputStream) {
      try {
        inputStream.close();
      }
      catch (err) {
        err.printStackTrace();
      }
    }
  }
  
  // Editor change listener. Triggered when a DITA Map is opened in the DITA Maps Manager.
  edChangedListener = {
  
    editorOpened: function (editorLocation) {
    
      // Get the opened DITA Map
      editor = pluginWorkspaceAccess.getEditorAccess(editorLocation, Packages.ro.sync.exml.workspace.api.PluginWorkspace.DITA_MAPS_EDITING_AREA);
      ditaMapPage = editor.getCurrentPage();
      
      // DITA map node renderer customizer
      customizer = {
        
        // Get rendering information for the topicrefs in the DITA Maps Manager
        getRenderingInformation: function (context) {
          var renderingInfo = null;
          var topicRefTargetInfo = context.getTopicRefTargetInfo();
          if (topicRefTargetInfo && properties) {
            // Get the "class" attribute's value for the current referred topic
            clazz = topicRefTargetInfo.getProperty(Packages.ro.sync.exml.workspace.api.standalone.ditamap.TopicRefTargetInfo.CLASS_VALUE);
            if (clazz) {
              clazz = clazz.trim();
              var iconPath = null;
              var iterator = properties.keySet().iterator();
              while (iterator.hasNext()) {
                var key = iterator.next();
                if (clazz.indexOf(key) !== -1) {
                  // Keep the first icon
                  iconPath = properties.get(key);
                  break;
                }
              }
              
              // Set the custom icon
              try {
                if (iconPath) {
                  var iconURI = new Packages.java.net.URI(jsDirURL + "/" + iconPath);
                  var iconFile = new Packages.java.io.File(iconURI);
                  if (iconFile.exists()) {
                    renderingInfo = new Packages.ro.sync.exml.workspace.api.node.customizer.BasicRenderingInformation();
                    renderingInfo.setIconPath(iconURI);
                  }
                }
              }
              catch (err) {
                err.printStackTrace();
              }
            }
          }
          
          return renderingInfo;
        },
        
        // Customize the topicref titles
        customizeComputedTopicrefTitle: function (topicref, targetTopicOrMap, defaultComputedTitle) {
          // Present profiling attributes set on the root element.
          if (targetTopicOrMap.getType() == Packages.ro.sync.ecss.extensions.api.node.AuthorNode.NODE_TYPE_DOCUMENT) {
            rootElement = targetTopicOrMap.getRootElement();
            if (rootElement.getType() == Packages.ro.sync.ecss.extensions.api.node.AuthorNode.NODE_TYPE_ELEMENT) {
              attrsCount = rootElement.getAttributesCount();
              for (i = 0; i < attrsCount; i++) {
                attrName = rootElement.getAttributeAtIndex(i);
                if (attrName.equals("rev") || attrName.equals("audience") || attrName.equals("platform") || attrName.equals("product") || attrName.equals("props")) {
                  // Interesting attribute...
                  defaultComputedTitle = defaultComputedTitle + " [" + attrName + "='" + rootElement.getAttribute(attrName) + "']";
                }
              }
            }
          }
          // Count chapters and present counter before chapter name.
          if ("chapter".equals(topicref.getName())) {
            parentOfTopicRef = topicref.getParent();
            cnt = 1;
            nodes = parentOfTopicRef.getContentNodes();
            for (i = 0; i < nodes.size();
            i++) {
              if (nodes. get (i) == topicref) {
                break;
              } else if ("chapter".equals(nodes. get (i).getName())) {
                cnt = cnt + 1;
              }
            }
            defaultComputedTitle = cnt + " - " + defaultComputedTitle;
          }
          // Maybe it's a resource-only topic
          if (topicref.getAttribute("processing-role") != null) {
            processingRoleValue = topicref.getAttribute("processing-role").getValue();
            if (processingRoleValue.equals('resource-only')) {
              defaultComputedTitle = defaultComputedTitle + " [resource-only]";
            }
          }
          return defaultComputedTitle;
        }
      }
      // Add customizer
      ditaMapPage.addNodeRendererCustomizer(new Packages.ro.sync.exml.workspace.api.editor.page.ditamap.DITAMapNodeRendererCustomizer(customizer));
    }
  }
  // Add editor change listener
  edChangedListener = new JavaAdapter(Packages.ro.sync.exml.workspace.api.listeners.WSEditorChangeListener, edChangedListener);
  pluginWorkspaceAccess.addEditorChangeListener(edChangedListener, Packages.ro.sync.exml.workspace.api.PluginWorkspace.DITA_MAPS_EDITING_AREA);
}

function applicationClosing(pluginWorkspaceAccess) {
  Packages.java.lang.System.err.println("Application closing " + pluginWorkspaceAccess);
}
