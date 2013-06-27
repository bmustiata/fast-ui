/**
 * Parses a XML template, and finds out what variables need to be filled in into the response,
 * what widgets need to be created, and gets from the XML a HTML template that uses just regular
 * DOM elements, deferring the build of the widges to the {FastUiBuilder}.
 *
 * @constructor
 */
function TemplateParser() {
    this.variables = [];
    this.widgets = [];
    this.htmlContent = "";
}

TemplateParser.prototype.parse = function (xmlContent) {
    var xmlDoc = Y.XML.parse(xmlContent);

    this.traverseElement(xmlDoc.firstChild);

    this.htmlContent = Y.XML.format(xmlDoc.firstChild);

    return {
        variables: this.variables,
        widgetDefinitions: this.widgets,
        htmlContent: this.htmlContent
    };
};

/**
 * Recursively traverses the XML document, binding variables and instantiating widgetDefinitions.
 * @param element Start element.
 */
TemplateParser.prototype.traverseElement = function (element) {
    var i, childElement;

    var configNodes = [];

    for (i = 0; i < element.childNodes.length; i++) {
        childElement = element.childNodes[i];
        // IE up to 8 incorrectly counts comment nodes
        if (childElement.nodeType === 1) {
            // if it's a configuration node, store it for widget config, and remove it from the final template.
            if (this.isConfigElement(childElement)) {
                configNodes.push(childElement);
                element.removeChild( childElement );

                continue; // don't traverse the configuration node.
            }

            this.traverseElement(childElement);
        }
    }


    this.checkVariable(element);
    this.checkWidget(element, configNodes);
};

TemplateParser.prototype.checkVariable = function(element) {
    var uiField = this.getAttribute(element, 'field', 'fastui');

    if (uiField) {
        this.variables[uiField] = this.getId(element);
    }
};

TemplateParser.prototype.isConfigElement = function(element) {
    return element.namespaceURI &&
        element.namespaceURI === "fastui" &&
        element.localName === "config";
};

TemplateParser.prototype.checkWidget = function(element, configNodes) {
    // there is a namespace URI, we need to create a WidgetDefinition
    if (!element.namespaceURI) {
        return;
    }

    var elementName = element.localName || element.baseName,
        placeHolderElement,
        fullClassName = element.namespaceURI + "." + elementName,
        widget = new WidgetDefinition(
            this.getId(element),
            fullClassName,
            WidgetConfig.buildFromElement(element, configNodes)
        );

    placeHolderElement = this.createPlaceHolderElement(element);

    this.widgets.push(widget);

    element.parentNode.replaceChild(placeHolderElement, element);
};


TemplateParser.prototype.getAttribute = function(element, attributeName, namespaceURI) {
    var i, attribute;

    if (!element.attributes) {
        return null;
    }

    namespaceURI = !!namespaceURI ? namespaceURI : null;

    for (i = 0; i < element.attributes.length; i++) {
        attribute = element.attributes[i];

        if (attribute.localName === attributeName &&
            attribute.namespaceURI === namespaceURI) {
            return attribute.value;
        }
    }

    return null;
};

TemplateParser.prototype.getId = function(element) {
    var id = this.getAttribute(element, 'id');

    // if the element does not have an id, we create one
    if (id === null) {
        id = Y.guid('fast-ui-');
        element.setAttribute('id', id);
    }

    return id;
};

TemplateParser.prototype.getElementType = function(element) {
    var srcNodeType = this.getAttribute(element, "srcNode", "fastui");

    return srcNodeType ? srcNodeType : "span";
};

TemplateParser.prototype.createPlaceHolderElement = function(sourceElement) {
    var document = sourceElement.ownerDocument,
        elementType = this.getElementType(sourceElement),
        id = this.getAttribute(sourceElement, 'id'),
        newElement = document.createElement(elementType),
        child;

    newElement.setAttribute('id', id);

    while (!!(child = sourceElement.firstChild)) {
        sourceElement.removeChild(child);
        newElement.appendChild(child);
    }

    return newElement;
};
