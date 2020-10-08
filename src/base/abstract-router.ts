export class AbstractRouter {
    controllers:any = null;
    middlewares:any = null;
    routerSettings:any = null
    settings:any = null;
    baseUrl = "";

    constructor(objects: any) {
        const { controllers, middlewares, routerSettings, settings } = objects;
        this.controllers = controllers;
        this.middlewares = middlewares;
        this.routerSettings = routerSettings || {};
        this.settings = settings;

        if (settings && settings.baseUrl) {
            this.baseUrl = settings.baseUrl;
        }
        else {
            this.baseUrl = "/";
        }

        if (this.baseUrl && this.baseUrl.length > 0 && this.baseUrl[this.baseUrl.length - 1] !== "/") {
            this.baseUrl += "/";
        }
    }

    register(engines: any) {
        this.registerEngines(engines);
        this.registerActions();
    }

    /**
     * @virtual
     */
    registerEngines(engines: any) {
    }

    /**
     * @abstract
     */
    registerActions() {
        throw new Error("Abstract method");
    }
}
