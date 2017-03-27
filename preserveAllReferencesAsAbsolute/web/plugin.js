workspace.addRelativeReferencesResolver("https", function(base, url) {
  // Use absolute URL.
  return url;
});
