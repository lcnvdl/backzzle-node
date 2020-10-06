export interface ILogger {
    error(a: any, b?: any): void;
    info(a: any, b?: any): void;
    debug(a: any, b?: any): void;
}