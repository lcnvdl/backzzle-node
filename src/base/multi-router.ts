const { AbstractRouter, AmqpRouter, ExpressRouter } = require("emvicify/routers");

export { AbstractRouter };

export class MultiRouter extends AbstractRouter {
    amqpRouter;

    constructor(objects: any) {
        super(objects);

        /** @type {AmqpRouter} */
        this.amqpRouter = null;

        if (this.settings.amqp.enabled) {
            this.amqpRouter = new AmqpRouter(objects)
        }

        /** @type {ExpressRouter} */
        this.expressRouter = null;

        if (this.settings.express.enabled) {
            this.expressRouter = new ExpressRouter(objects)
        }
    }

    registerEngines(engines: any) {
        if (this.expressRouter) {
            this.expressRouter.registerEngines(engines);
        }
        if (this.amqpRouter) {
            this.amqpRouter.registerEngines(engines);
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
    }
}
