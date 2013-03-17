interface WidgetDefinition {
    /**
     * The ID in the DOM where the node should be inserted.
     */
    nodeId: string;
    /**
     * The full name of the class to be instantiated, e.g. Y.Button
     */
    // TODO this should be called fully qualifies name
    className: string;
    /**
     * WidgetConfig The configuration for that widget that will be sent on construction.
     */
    config: WidgetConfig;
}