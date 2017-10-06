function applicationStarted(pluginWorkspaceAccess) {
  Packages.java.lang.System.err.println("Application started " + pluginWorkspaceAccess);
  
  edChangedListener = {
    // Called when a DITA Map is opened
    editorOpened: function (editorLocation) {
      // Get the opened DITA Map
      editor = pluginWorkspaceAccess.getEditorAccess(editorLocation, Packages.ro.sync.exml.workspace.api.PluginWorkspace.DITA_MAPS_EDITING_AREA);
      ditaMapPage = editor.getCurrentPage();
      
      customizer = {
        // Get rendering information
        getRenderingInformation: function (context) {
          var renderingInfo = null;
          var topicRefTargetInfo = context.getTopicRefTargetInfo();
          if (topicRefTargetInfo) {
            // Get the "class" attribute's value for the current referred topic
            clazz = topicRefTargetInfo.getProperty(Packages.ro.sync.exml.workspace.api.standalone.ditamap.TopicRefTargetInfo.CLASS_VALUE);
            if (clazz) {
              clazz = clazz.trim();
              var inputStream = null;
              var iconPath = null;
              try {
                // Read the properties file to find the icon path
                inputStream = new Packages.java.io.FileInputStream(new Packages.java.io.File(new Packages.java.net.URI(jsDirURL + "/icons.properties")));
                var inputStreamReader = new Packages.java.io.InputStreamReader(inputStream);
                var bufferedReader = new Packages.java.io.BufferedReader(inputStreamReader);
                var line = null;
                while (line = bufferedReader.readLine()) {
                  var items = line.split('=');
                  if (items[0] == clazz) {
                    // Choose the first icon.
                    iconPath = items[1];
                    break;
                  }
                }
              } catch (err) {
                err.printStackTrace();
              } finally {
                if (inputStream) {
                  try {
                    inputStream.close();
                  } catch (err) {
                    err.printStackTrace();
                  }
                }
              }
              
              // Set the custom icon
              try {
                if (iconPath) {
                  var iconFile = new Packages.java.io.File(new Packages.java.net.URI(jsDirURL + "/" + iconPath.toString()));
                  if (iconFile.exists()) {
                    renderingInfo = new Packages.ro.sync.exml.workspace.api.node.customizer.BasicRenderingInformation();
                    renderingInfo.setIconPath(iconFile.getAbsolutePath());
                  }
                }
              } catch (err) {
                err.printStackTrace();
              }
            }
          }
          
          return renderingInfo;
        },
        
        // Customize title
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
      ditaMapPage.addNodeRendererCustomizer(new Packages.ro.sync.exml.workspace.api.editor.page.ditamap.DITAMapNodeRendererCustomizer(customizer));
    }
  }
  edChangedListener = new JavaAdapter(Packages.ro.sync.exml.workspace.api.listeners.WSEditorChangeListener, edChangedListener);
  pluginWorkspaceAccess.addEditorChangeListener(edChangedListener, Packages.ro.sync.exml.workspace.api.PluginWorkspace.DITA_MAPS_EDITING_AREA);
}

function applicationClosing(pluginWorkspaceAccess) {
  Packages.java.lang.System.err.println("Application closing " + pluginWorkspaceAccess);
}
