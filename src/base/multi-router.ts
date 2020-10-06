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
        throw new Error("Abstract method");
    }

    post(url: string, action: Function, middlewares?: any) {
        if (this.expressRouter) {
            this.expressRouter.post(url, action, middlewares);
        }

        if (this.amqpRouter) {
            this.amqpRouter.registerAction(url, action, middlewares);
        }
    }

    get(url: string, action: Function, middlewares?: any) {
        if (this.expressRouter) {
            this.expressRouter.get(url, action, middlewares);
        }

        if (this.amqpRouter) {
            this.amqpRouter.registerAction(url, action, middlewares);
        }
    }
}
