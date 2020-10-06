/** @typedef {import("node-essential/src/managers/system/injection.manager")} InjectionManager */

const essential = require("node-essential");
const { start } = require("emvicify");

class Backzzle {
    constructor() {
        /** @type {InjectionManager} */
        this.injection = new essential.Managers.System.InjectionManager();

        this.injection.add("settings", () => this._loadSettings());
        this.injection.add("log", () => new (require("./logger/default-logger"))());
    }

    get settings() {
        return this.injection.get("settings");
    }

    start() {
        const args = this._prepareMfy();

        return new Promise((resolve, reject) => {
            start(process.cwd(), this.settings.express.port, args).then(dependencies => {
                const { modules } = dependencies;

                Object.keys(modules.services).map(k => modules.services[k]).forEach(s => s.injection = this.injection);
                Object.keys(modules.controllers).map(k => modules.controllers[k]).forEach(c => c.injection = this.injection);
                Object.keys(modules.routers).map(k => modules.routers[k]).forEach(r => r.injection = this.injection);

                resolve();
            }, err => {
                reject(err);
            });
        });
    }

    _prepareMfy() {
        const settingsFile = this.settings;

        const expressSettings = {
            json: settingsFile.express.json,
            bodyParserUrlencoded: false,
            bodyParserRaw: false,
            cors: settingsFile.express.cors
        };

        const Engines = require("emvicify").engines;

        const engines = [];

        if (settingsFile.express.enabled) {
            const express = new Engines.ExpressEngine(null, settingsFile.express.port, expressSettings);
            engines.push(express);
        }

        if (settingsFile.amqp.enabled) {
            const amqp = require("amqplib");
            const amqpSettings = settingsFile.amqp;
            const rabbitEngine = new Engines.RabbitMQEngine(amqp, amqpSettings);
            engines.push(rabbitEngine);
        }

        const args = { settingsFile, expressSettings, engines };

        return args;
    }

    _loadSettings() {
        const args = process.argv.slice(2);
        const cwd = process.cwd();
        const path = require("path");

        let settings = "settings.json";

        for (let i = 0; i < args.length; i++) {
            const a = args[i];

            if (a.indexOf(".json") !== -1) {
                settings = a;
            }
            else if (a == "-s" || a === "--settings") {
                settings = args[++i];
            }
        }

        // console.log(`Loading settings from ${settings}`);

        let settingsObject = require(path.join(cwd, settings));

        while (settingsObject.$inherit) {
            const parent = settingsObject.$inherit;
            delete settingsObject.$inherit;
            // console.debug(` - Loading parent settings from ${parent}`);

            let parentObject = require(path.join(cwd, parent));
            settingsObject = Object.assign(parentObject, settingsObject);
        }

        return settingsObject;
    }
}

module.exports = Backzzle;
