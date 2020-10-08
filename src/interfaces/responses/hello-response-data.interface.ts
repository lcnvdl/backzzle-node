export interface IHelloResponseActionData {
    name: string;
    method: string;
}

export interface IHelloResponseRouterData {
    name: string;
    actions: IHelloResponseActionData[];
}

export interface IHelloResponseServiceData {
    name: string;
    routers: IHelloResponseRouterData[];
}