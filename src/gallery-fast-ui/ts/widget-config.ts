class WidgetConfig {
    public properties: Object = {};
    public globalConfigKey: string = null;
    public srcNode: string = null;

    public addProperty(name: string, value: string) {
        this.properties[name] = value;
    }

    static buildFromElement(element: Element): WidgetConfig {
        var widgetConfig = new WidgetConfig(),
            attributeName, attributeValue, id;

        for (var i = 0; i < element.attributes.length; i++) {
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
    }
}