var Y:any;

class TemplateParser {
    public variables;
    public widgets;

    public parse(xmlContent: string) {
        var xmlDoc = Y.XML.parse(xmlContent);
    }

    private traverseElement(element: Element) {
        var i: number;

        for (i = 0; i < element.childNodes.length; i++) {
            this.traverseElement(element.childNodes[i]);
        }

        this.checkVariable(element);

        // there is a namespace URI, thus I need to create a custom object
        if (element.namespaceURI) {
            this.checkWidget(element);
        }
    }

    private checkVariable(element: Element) {
        var uiField = this.getAttribute(element, 'ui-field');

        if (uiField) {
            this.variables[uiField] = this.getId(element);
        }
    }

    private checkWidget(element: Element) {
        var widget = new CustomWidget(
                this.getId(element), // node ID
                element.namespaceURI + "." + (element.localName || element.baseName), // full class
                // TODO replace the config element
                CustomWidgetConfig.buildFromElement(element) // configuration
            ),
            placeHolderElement = this.createPlaceHolderElement(element);;

        this.widgets.push(widget);

        element.parentNode.replace(placeHolderElement, element);
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

        if (id === null) {
            id = Y.guid('fast-ui-');
            element.setAttribute('id', id);
        }

        return id;
    }

    private getElementType(element: Element) {
        var srcNodeType = getAttribute(element, "ui-src");

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
    }
}