function FastUiBuilder(parent, xmlContent, msg, globalConfig) {
    this.parent = !!parent ? Y.one(parent) : null;
    this.xmlContent = xmlContent;
    this.msg = msg;
    this.globalConfig = globalConfig;

    this.bindings = []; // a map between ID of elements in the output HTML, and target widget configs.
}

FastUiBuilder.prototype.parse = function() {
    var parseResult = this.parseXmlTemplate(),
        variables = parseResult.variables,
        widgetDefinitions = parseResult.widgetDefinitions,
        createdWidgets = {},  // so far no widgets are yet created.
        newWidget,
        key,
        node,
        i,
        result;

    this.rootNode = this.createRootNode(parseResult);

    if (this.parent) {
        this.parent.appendChild(this.rootNode);
    }

    result = {
        node : this.getWidgetOrNode( this.rootNode, createdWidgets )
    };

    for (i = widgetDefinitions.length - 1; i >= 0; i--) {
        newWidget = this.createWidget(widgetDefinitions[i]);
        createdWidgets[widgetDefinitions[i].nodeId] = newWidget;

        this.updateBindings(variables, newWidget);
    }

    // the rest of the variables reference just nodes
    for (key in variables) {
        if (variables.hasOwnProperty(key)) {
            node = this.rootNode.one('#' + variables[key]);
            result[key] = this.getWidgetOrNode(node, createdWidgets );
        }
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

    return Y.Node.create( closedNodeHtmlBugFix );
};

FastUiBuilder.prototype.getWidgetOrNode = function(node, createdWidgets) {
    var widget = createdWidgets[node.get("id")];

    return widget ? widget : node;
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

FastUiBuilder.prototype.createNode = function(htmlContent, msg) {
    var translatedHtml = msg ? Y.Lang.sub(htmlContent, msg) : htmlContent;

    // looks like IE7/8 get confused when creating elements that are self-closing.
    translatedHtml = translatedHtml.replace(/<([\w\d]+?)\s+([^>]+?)\/>/gm,"<$1 $2></$1>");

    return Y.Node.create(translatedHtml);
};

FastUiBuilder.prototype.createWidget = function(widget) {
    var ClassConstructor = this.getClassConstructor(widget.className),
        classConfig = this.getClassConfig(widget.config, this.globalConfig),
        classInstance = new ClassConstructor(classConfig),
        placeHolderElement;

    // the widget will render it's content on the 'srcNode', if it has one
    if (widget.config.srcNode) {
        classInstance.render();
    } else {
        placeHolderElement = this.rootNode.one('#' + widget.nodeId);
        classInstance.render(placeHolderElement);
    }

    if (widget.nodeId === this.rootNode.get("id")) {
        this.rootNode = classInstance.get("boundingBox");
    }

    return classInstance;
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

FastUiBuilder.prototype.getClassConfig = function(widgetConfig) {
    var widgetGlobalConfig, finalConfig = {};

    // widgetConfig.srcNode gets in
    finalConfig = Y.merge(finalConfig, widgetConfig.properties);

    if (this.globalConfig && widgetConfig.globalConfigKey) {
        widgetGlobalConfig = this.globalConfig[widgetConfig.globalConfigKey];

        finalConfig = Y.merge(finalConfig, widgetGlobalConfig);
    }

    return finalConfig;
};

Y.fastUi = function(parent, xmlContent, msg, globalConfig) {
    return new FastUiBuilder(parent, xmlContent, msg, globalConfig).parse();
};