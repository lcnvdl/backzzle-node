import { ILogger } from "./logger.interface";

export class DefaultLogger implements ILogger {
    /** @deprecated */
    log(a: any, b?: any) {
        if (typeof b !== "undefined") {
            console.log(a, b);
        }
        else {
            console.log(a);
        }
    }

    debug(a: any, b?: any) {
        if (typeof b !== "undefined") {
            console.log(a, b);
        }
        else {
            console.log(a);
        }
    }

    info(a: any, b?: any) {
        if (typeof b !== "undefined") {
            console.log(a, b);
        }
        else {
            console.log(a);
        }
    }

    error(a: any, b?: any) {
        if (typeof b !== "undefined") {
            console.error(a, b);
        }
        else {
            console.error(a);
        }
    }
}