import { AbstractRouter } from "./abstract-router";

const { AmqpRouter, ExpressRouter, JsonFSRouter, JsonArgsRouter } = require("emvicify/routers");

export class MultiRouter extends AbstractRouter {
    amqpRouter: any;
    expressRouter: any;
    jsonFsRouter: any;
    jsonArgsRouter: any;

    constructor(objects: any) {
        super(objects);
        this.initializeRouters(objects);
    }

    registerEngines(engines: any) {
        if (this.expressRouter) {
            this.expressRouter.registerEngines(engines);
        }

        if (this.amqpRouter) {
            this.amqpRouter.registerEngines(engines);
        }

        if (this.jsonFsRouter) {
            this.jsonFsRouter.registerEngines(engines);
        }

        if (this.jsonArgsRouter) {
            this.jsonArgsRouter.registerEngines(engines);
        }
    }

    /**
     * @abstract
     */
    registerActions() {
        throw new Error("Abstract method: registerActions");
    }

    post(url: string, action: Function, middlewares?: any) {
        this.registerAction("post", url, action, middlewares);
    }

    put(url: string, action: Function, middlewares?: any) {
        this.registerAction("put", url, action, middlewares);
    }

    delete(url: string, action: Function, middlewares?: any) {
        this.registerAction("delete", url, action, middlewares);
    }

    get(url: string, action: Function, middlewares?: any) {
        this.registerAction("get", url, action, middlewares);
    }

    private registerAction(method: "post" | "put" | "get" | "delete", url: string, action: Function, middlewares?: any) {
        if (this.expressRouter) {
            this.expressRouter[method](url, action, middlewares);
        }

        if (this.amqpRouter) {
            this.amqpRouter.registerAction(url, action, middlewares);
        }

        if (this.jsonFsRouter) {
            this.jsonFsRouter.registerAction(url, action, middlewares);
        }

        if (this.jsonArgsRouter) {
            this.jsonArgsRouter.registerAction(url, action, middlewares);
        }
    }

    private setDefaultRouterSettings(objects: any) {
        if (!objects.routerSettings) {
            objects.routerSettings = {};
        }

        if (typeof objects.routerSettings.printHandledErrors === "undefined") {
            objects.routerSettings.printHandledErrors = true;
        }
    }

    private initializeRouters(objects: any) {
        this.setDefaultRouterSettings(objects);

        /** @type {JsonFSRouter} */
        this.jsonFsRouter = null;

        if (this.settings.jsonFs && this.settings.jsonFs.enabled) {
            this.jsonFsRouter = new JsonFSRouter(objects)
        }

        /** @type {JsonArgsRouter} */
        this.jsonArgsRouter = null;

        if (this.settings.jsonArgs && this.settings.jsonArgs.enabled) {
            this.jsonArgsRouter = new JsonArgsRouter(objects)
        }

        /** @type {AmqpRouter} */
        this.amqpRouter = null;

        if (this.settings.amqp && this.settings.amqp.enabled) {
            this.amqpRouter = new AmqpRouter(objects)
        }

        /** @type {ExpressRouter} */
        this.expressRouter = null;

        if (this.settings.express && this.settings.express.enabled) {
            this.expressRouter = new ExpressRouter(objects)
        }
    }
}
