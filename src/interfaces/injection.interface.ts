export interface IInjection {
    add(nameOrConstructor: any, getterOrObject: any): any;
    get(nameOrConstructor: any): any;
}