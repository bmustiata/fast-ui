function WidgetConfig(properties, globalConfigKey, srcNode) {
    this.properties = !!properties ? properties : {};
    this.globalConfigKey = globalConfigKey;
    this.srcNode = srcNode;
}

WidgetConfig.prototype.addProperty = function(name, value, type) {
    type = !!type ? type : "string";

    this.properties[name] = new WidgetConfigProperty(name, value, type);
};

/**
 * Builds a WidgetConfig from the DOM element given.
 */
WidgetConfig.buildFromElement = function(element, configNodes) {
    var widgetConfig = new WidgetConfig();

    readConfigFromAttributes(widgetConfig, element);
    readConfigFromElements(widgetConfig, configNodes);

    return widgetConfig;
};

/**
 * Read values that should be passed to the config from the attributes of the element.
 * @param widgetConfig
 * @param element
 */
function readConfigFromAttributes(widgetConfig, element) {
    var attributeName, attributeValue, attributeNamespace, id, i;

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
}

/**
 * Read the values that should be passed to the config from &lt;ui:config&gt; elements.
 * @param widgetConfig
 * @param configNodes
 */
function readConfigFromElements(widgetConfig, configNodes) {
    var configNode, name, value, type, i;

    for (i = 0; i < configNodes.length; i++) {
        configNode = configNodes[i];

        name = configNode.getAttribute("name");
        type = configNode.getAttribute("type");
        type = !!type ? type : "ui"; // the default type for config elements is "ui"

        value = extractContents(configNode, type);

        widgetConfig.addProperty(name, value, type);
    }
}

/**
 * Extract the contents from the element depending on the type of the node.
 */
function extractContents(xmlNode, type) {
    if ("ui" === type) {
        return getUiNodeAsString(xmlNode);
    } else if ("js" === type) {
        return getJsNodeAsString(xmlNode);
    }
    return getStringNodeAsString(xmlNode);
}

/**
 * Returns the contents of the node, and wrap it in a span, since multiple nodes could exist.
 * @param xmlNode
 */
function getUiNodeAsString(xmlNode) {
    var i,
        result = "<span>";

    for (i = 0; i < xmlNode.childNodes.length; i++) {
        result += Y.XML.format(xmlNode.childNodes[i]);
    }

    result += "</span>";

    return result;
}

/**
 * Returns the contents of the JS node as a string.
 * @param xmlNode
 * @returns {*}
 */
function getJsNodeAsString(xmlNode) {
    return xmlNode.textContent;
}

/**
 * Returns the contents of the String node as a string.
 * @param xmlNode
 * @returns {*}
 */
function getStringNodeAsString(xmlNode) {
    return xmlNode.textContent;
}

