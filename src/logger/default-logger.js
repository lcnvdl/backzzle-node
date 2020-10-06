class DefaultLogger {
    /** @deprecated */
    log(a, b) {
        if (typeof b !== "undefined") {
            console.log(a, b);
        }
        else {
            console.log(a);
        }
    }

    debug(a, b) {
        if (typeof b !== "undefined") {
            console.log(a, b);
        }
        else {
            console.log(a);
        }
    }
    
    info(a, b) {
        if (typeof b !== "undefined") {
            console.log(a, b);
        }
        else {
            console.log(a);
        }
    }
    
    error(a, b) {
        if (typeof b !== "undefined") {
            console.error(a, b);
        }
        else {
            console.error(a);
        }
    }
}

module.exports = DefaultLogger;