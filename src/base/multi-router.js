const { AbstractRouter, AmqpRouter, ExpressRouter } = require("emvicify/routers");

class MultiRouter extends AbstractRouter {
    constructor(objects) {
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

    registerEngines(engines) {
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

    post(url, action, middlewares) {
        if (this.expressRouter) {
            this.expressRouter.post(url, action, middlewares);
        }

        if (this.amqpRouter) {
            this.amqpRouter.registerAction(url, action, middlewares);
        }
    }

    get(url, action, middlewares) {
        if (this.expressRouter) {
            this.expressRouter.get(url, action, middlewares);
        }

        if (this.amqpRouter) {
            this.amqpRouter.registerAction(url, action, middlewares);
        }
    }
}

module.exports = MultiRouter;
