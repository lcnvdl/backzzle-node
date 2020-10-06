import path from "path";
import fs from "fs";
import { DefaultLogger } from "./logger/default-logger";
import * as amqplib from "amqplib";
import { ILogger } from "./logger/logger.interface";

const essential = require("node-essential");
const { start } = require("emvicify");

export class Backzzle {
    injection: any = null;

    constructor() {
        /** @type {InjectionManager} */
        this.injection = new essential.Managers.System.InjectionManager();

        this.injection.add("settings", () => this.loadSettings());
        this.injection.add("log", () => new DefaultLogger());
    }

    get settings() {
        return this.injection.get("settings");
    }

    get logger(): ILogger {
        return this.injection.get("log");
    }

    set logger(v: ILogger) {
        this.injection.add("log", () => v);
    }

    start() {
        const args = this.prepareMfy();

        return new Promise((resolve, reject) => {
            start(process.cwd(), this.settings.express.port, args).then((dependencies: any) => {
                const { modules } = dependencies;

                Object.keys(modules.services).map(k => modules.services[k]).forEach(s => s.injection = this.injection);
                Object.keys(modules.controllers).map(k => modules.controllers[k]).forEach(c => c.injection = this.injection);
                Object.keys(modules.routers).map(k => modules.routers[k]).forEach(r => r.injection = this.injection);

                resolve();
            }, (err: any) => {
                reject(err);
            });
        });
    }

    private prepareMfy() {
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
            const amqpSettings = settingsFile.amqp;
            const rabbitEngine = new Engines.RabbitMQEngine(amqplib, amqpSettings);
            engines.push(rabbitEngine);
        }

        const args = { settingsFile, expressSettings, engines };

        return args;
    }

    private loadSettings() {
        const args = process.argv.slice(2);
        const cwd = process.cwd();

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

        let settingsObject = JSON.parse(fs.readFileSync(path.join(cwd, settings), "utf8"));

        while (settingsObject.$inherit) {
            const parent = settingsObject.$inherit;
            delete settingsObject.$inherit;
            // console.debug(` - Loading parent settings from ${parent}`);

            let parentObject = JSON.parse(fs.readFileSync(path.join(cwd, parent), "utf8"));
            settingsObject = Object.assign(parentObject, settingsObject);
        }

        return settingsObject;
    }
}
