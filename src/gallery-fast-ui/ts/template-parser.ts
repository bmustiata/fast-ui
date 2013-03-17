class TemplateParser {
    public variables: string[];
    public widgets: WidgetDefinition[] = [];
    public htmlContent;

    public parse(xmlContent: string): ParserResult {
        var xmlDoc = Y.XML.parse(xmlContent),
            htmlDoc;

        this.traverseElement(xmlDoc.firstChild);

        this.htmlContent = Y.XML.format(xmlDoc.firstChild);

        return {
            variables : this.variables,
            widgetDefinitions : this.widgets,
            htmlContent : this.htmlContent
        }
    }

    /**
     * Recursively traverses the XML document, binding variables and instantiating widgetDefinitions.
     * @param element Start element.
     */
    private traverseElement(element: HTMLElement) {
        var childElement: HTMLElement;

        for (var i = 0; i < element.childNodes.length; i++) {
            childElement = <HTMLElement> element.childNodes[i];
            // IE up to 8 incorrectly counts comment nodes
            if (childElement.nodeType === 1) {
                this.traverseElement(childElement);
            }
        }


        this.checkVariable(element);
        this.checkWidget(element);
    }

    private checkVariable(element: Element) {
        var uiField = this.getAttribute(element, 'ui-field');

        if (uiField) {
            this.variables[uiField] = this.getId(element);
        }
    }

    private checkWidget(element: Element) {
        // there is a namespace URI, we need to create a WidgetDefinition
        if (!element.namespaceURI)
            return;

        var elementName = element.localName || element.baseName,
            fullClassName = element.namespaceURI + "." + elementName,
            widget = {
                nodeId : this.getId(element),
                className : fullClassName,
                config : WidgetConfig.buildFromElement(element)
            },
            placeHolderElement = this.createPlaceHolderElement(element);;

        this.widgets.push(widget);

        element.parentNode.replaceChild(placeHolderElement, element);
    }

    // TODO replace with element.getAttribute
    private getAttribute(element: Node, attributeName: string) {
        if (!element.attributes) {
            return null;
        }

        for (var i = 0; i < element.attributes.length; i++) {
            if (element.attributes[i].name === attributeName) {
                return element.attributes[i].value;
            }
        }

        return null;
    }

    private getId(element: Element) {
        var id = this.getAttribute(element, 'id');

        // if the element does not have an id, we create one
        if (id === null) {
            id = Y.guid('fast-ui-');
            element.setAttribute('id', id);
        }

        return id;
    }

    private getElementType(element: Element) {
        var srcNodeType = this.getAttribute(element, "ui-src");

        return srcNodeType ? srcNodeType : "span";
    }

    private createPlaceHolderElement(sourceElement: Element) {
        var document = sourceElement.ownerDocument,
            elementType = this.getElementType(sourceElement),
            id = this.getAttribute(sourceElement, 'id'),
            newElement = document.createElement(elementType),
            child;

        newElement.setAttribute('id', id);

        while (child = sourceElement.firstChild) {
            sourceElement.removeChild(child);
            newElement.appendChild(child);
        }

        return newElement;
    }
}