/**
 * @param {Element} parent       Where should the built UI be appended after it's built.
 * @param {string} xmlContent   The UI that is supposed to be built.
 * @param {object} msg          I18N messages, that will be substituted in the XML.
 * @param {object} globalConfig Configuration for various UI elements.
 * @constructor
 */
function FastUiBuilder(parent, xmlContent, msg, globalConfig) {
    this.parent = !!parent ? Y.one(parent) : null;
    this.xmlContent = xmlContent;
    this.msg = msg;
    this.globalConfig = globalConfig;

    this.bindings = []; // a map between ID of elements in the output HTML, and target widget configs.
}

/**
 * Creates all the DOM elements and widgets that were in this.xmlContent.
 *
 * @this {FastUiBuilder}
 * @returns {object} A map of widgets or dom elements that were created, that were marked with the ui:field attribute.
 */
FastUiBuilder.prototype.parse = function() {
    var parseResult = this.parseXmlTemplate(),
        variables = parseResult.variables,
        widgetDefinitions = parseResult.widgetDefinitions,
        createdWidgets = {},  // so far no widgets are yet created.
        newWidget,
        key,
        nodeId,
        i,
        result;

    this.rootNode = this.createRootNode(parseResult);

    result = {};

    for (i = widgetDefinitions.length - 1; i >= 0; i--) {
        newWidget = this.createWidget(widgetDefinitions[i], result);
        createdWidgets[widgetDefinitions[i].nodeId] = newWidget;

        this.updateBindings(variables, newWidget);
    }

    // the rest of the variables reference just nodes
    for (key in variables) {
        if (variables.hasOwnProperty(key)) {
            nodeId = variables[key];
            result[key] = this.getWidgetOrNode(nodeId, createdWidgets );
        }
    }

    result["_rootNode"] = this.rootNode;

    if (this.parent) {
        this.parent.appendChild(this.rootNode);
    } else {
        Y.one("body").removeChild( this.rootNode );
    }

    return result;
};

FastUiBuilder.prototype.parseXmlTemplate = function() {
    var translatedXml = this.msg ? Y.Lang.sub(this.xmlContent, this.msg) : this.xmlContent;

    return new TemplateParser().parse(translatedXml);
};

FastUiBuilder.prototype.createRootNode = function(parseResult) {
    var htmlContent = parseResult.htmlContent,
        closedNodeHtmlBugFix = htmlContent.replace(/<([\w\d]+?)\s+([^>]+?)\/>/gm,"<$1 $2></$1>");

    var rootNode = Y.Node.create(closedNodeHtmlBugFix);

    Y.one("body").appendChild(rootNode);

    return rootNode;
};

FastUiBuilder.prototype.getWidgetOrNode = function(nodeId, createdWidgets) {
    var widget = createdWidgets[nodeId];

    return widget ? widget : this.rootNode.one("#" + nodeId);
};

FastUiBuilder.prototype.updateBindings = function(variables, widget) {
    var key;

    for (key in variables) {
        if (variables[key] === widget.nodeId) {
            this.bindings[key] = widget;
            delete variables[key];
        }
    }
};

FastUiBuilder.prototype.createWidget = function(widget, finalResult) {
    var ClassConstructor = this.getClassConstructor(widget.className),
        classConfig = this.getClassConfig(widget.config, finalResult),
        classInstance = new ClassConstructor(classConfig),
        placeHolderElement;

    // the widget will render it's content on the 'srcNode', if it has one
    if (widget.config.srcNode) {
        classInstance.render();
    } else {
        placeHolderElement = this.findElement(widget.nodeId);
        classInstance.render(placeHolderElement);
    }

    if (widget.nodeId === this.rootNode.get("id")) {
        this.rootNode = classInstance.get("boundingBox");
    }

    return classInstance;
};

FastUiBuilder.prototype.findElement = function(id) {
    if (this.rootNode.get("id") === id) {
        return this.rootNode;
    } else {
        return this.rootNode.one("#" + id);
    }
};

FastUiBuilder.prototype.getClassConstructor = function(fullyQualifiedName) {
    if (/^Y\./.test(fullyQualifiedName)) {
        var matches = /^Y\.((.*)\.)?(.*?)$/.exec(fullyQualifiedName),
            packageName = matches[2],
            className = matches[3];

        if (packageName) {
            return Y.namespace(packageName)[className];
        } else {
            return Y[className];
        }
    }
};

FastUiBuilder.prototype.getClassConfig = function(widgetConfig, finalResult) {
    var widgetGlobalConfig, finalConfig = {};

    // widgetConfig.srcNode gets in
    mix(finalConfig, this.evaluateProperties(widgetConfig.properties, finalResult));

    if (this.globalConfig && widgetConfig.globalConfigKey) {
        widgetGlobalConfig = this.globalConfig[widgetConfig.globalConfigKey];

        mix(finalConfig, widgetGlobalConfig);
    }

    return finalConfig;
};

FastUiBuilder.prototype.evaluateProperties = function(propertiesMap, finalResult) {
    var key,
        result = {};

    for (key in propertiesMap) {
        if (propertiesMap.hasOwnProperty(key)) {
            result[key] = this.evaluatePropertyValue(
                propertiesMap[key],
                null,
                finalResult
            );
        }
    }

    return result;
};

FastUiBuilder.prototype.evaluatePropertyValue = function(widgetConfigProperty, config, resultToUpdate) {
    if ("string" === widgetConfigProperty.type &&
        "srcNode" === widgetConfigProperty.name) {

        return this.rootNode.one(widgetConfigProperty.value);
    }

    if ("string" === widgetConfigProperty.type) {
        return widgetConfigProperty.value;
    } else if ("ui" === widgetConfigProperty.type) {
        var builtUi = Y.fastUi(null, widgetConfigProperty.value, null, config);

        mix(resultToUpdate, builtUi);

        return builtUi._rootNode;
    } else if ("js" === widgetConfigProperty.type) {
        return eval(widgetConfigProperty.value);
    }
};

/**
 * Add one or more items passed as arguments into the target.
 */
function mix(target) {
    var i, key;

    for (i = 1; i < arguments.length; i++) {
        for (key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
                target[key] = arguments[i][key];
            }
        }
    }
}