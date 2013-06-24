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
        attributeName, attributeValue, id, i;

    for (i = 0; i < element.attributes.length; i++) {
        attributeName = element.attributes[i].name;
        attributeValue = element.attributes[i].value;

        if (attributeName === "ui-config") {
            widgetConfig.globalConfigKey = attributeValue;
            continue;
        }

        if (attributeName === "ui-src") {
            id = element.getAttribute('id');

            widgetConfig.srcNode = attributeValue;
            widgetConfig.addProperty("srcNode", "#" + id);
            continue;
        }

        if (attributeName === "id" || /^ui-/.test(attributeName)) {
            continue;
        }

        widgetConfig.addProperty(attributeName, attributeValue);
    }

    return widgetConfig;
};
