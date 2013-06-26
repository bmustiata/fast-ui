function WidgetConfig(properties, globalConfigKey, srcNode) {
    this.properties = !!properties ? properties : {};
    this.globalConfigKey = globalConfigKey;
    this.srcNode = srcNode;
}

WidgetConfig.prototype.addProperty = function(name, value) {
    this.properties[name] = value;
};

/**
 * Builds a WidgetConfig from the DOM element given.
 */
WidgetConfig.buildFromElement = function(element) {
    var widgetConfig = new WidgetConfig(),
        attributeName, attributeValue, attributeNamespace, id, i;

    for (i = 0; i < element.attributes.length; i++) {
        attributeName = element.attributes[i].localName;
        attributeValue = element.attributes[i].value;
        attributeNamespace = !!element.attributes[i].namespaceURI ? element.attributes[i].namespaceURI : null;

        if (attributeName === "config-key" && attributeNamespace === "fastui") {
            widgetConfig.globalConfigKey = attributeValue;
            continue;
        }

        if (attributeName === "src" && attributeNamespace === "fastui") {
            id = element.getAttribute('id');

            widgetConfig.srcNode = attributeValue;
            widgetConfig.addProperty("srcNode", "#" + id);
            continue;
        }

        if (attributeName === "id" || !!attributeNamespace) {
            continue;
        }

        widgetConfig.addProperty(attributeName, attributeValue);
    }

    return widgetConfig;
};
