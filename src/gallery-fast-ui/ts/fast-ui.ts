class FastUi {
    private rootNode: Element;
    private parseResult: ParserResult;
    private bindings: any[];

    constructor(public parent: Element, public xmlContent: string, public msg: string[], globalConfig: Object) {
        var parseResult = new TemplateParser().parse(xmlContent),
            widgetDefinitions = parseResult.widgetDefinitions,
            variables = parseResult.variables,
            htmlContent = parseResult.htmlContent,
            createdWidgets = {},
            newWidget;

        this.parseResult = parseResult;
        this.rootNode = this.createNode(htmlContent, msg);

        if (parent) {
            parent.appendChild(this.rootNode);
        }

        for (var i = widgetDefinitions.length-1; i >= 0; i--) {
            newWidget = this.createWidget(widgetDefinitions[i], globalConfig);
            createdWidgets[widgetDefinitions[i].nodeId] = newWidget;

            this.updateBindings(newWidget);
        }

        // the rest of the variables reference just nodes
        for (var key in variables) {
            var nodeId = variables[key];
            this.bindings[key] = this.rootNode.one('#' + nodeId);
        }
    }

    updateBindings(widget: WidgetDefinition) {
        var variables = this.parseResult.variables;

        for (var key in variables) {
            if (variables[key] === widget.nodeId) {
                this.bindings[key] = widget;
                delete variables[key];
            }
        }
    }

    createNode(htmlContent, msg) {
        var translatedHtml = msg ? Y.Lang.sub(htmlContent, msg) : htmlContent;

        // looks like IE7/8 get confused when creating elements that are not closed.
        translatedHtml = translatedHtml.replace(/<([\w\d]+?)\s+([^>]+?)\/>/gm,"<$1 $2></$1>");

        return Y.Node.create(translatedHtml);
    }

    createWidget(widget: WidgetDefinition, globalConfig: Object) {
        var ClassConstructor = this.getClassConstructor(widget.className),
            classConfig = this.getClassConfig(widget.config, globalConfig),
            classInstance = new ClassConstructor(classConfig);

        // the widget will render it's content on the 'srcNode', if it has one
        if (widget.config.srcNode) {
            classInstance.render();
        } else {
            var placeHolderElement = this.rootNode.one('#' + widget.nodeId);
            classInstance.render(placeHolderElement);
        }

        if (widget.nodeId === this.rootNode.get("id")) {
            this.rootNode = classInstance.get("boundingBox");
        }

        return classInstance;
    }

    getClassConstructor(fullyQualifiedName: string) {
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
    }

    getClassConfig(widgetConfig: WidgetConfig, globalConfig: Object): Object {
        var finalConfig = {};

        // widgetConfig.srcNode gets in
        finalConfig = Y.merge(finalConfig, widgetConfig.properties);

        if (globalConfig && widgetConfig.globalConfigKey) {
            var widgetGlobalConfig = globalConfig[widgetConfig.globalConfigKey];

            finalConfig = Y.merge(finalConfig, widgetGlobalConfig);
        }

        return finalConfig;
    }
}

Y.FastUi = FastUi;