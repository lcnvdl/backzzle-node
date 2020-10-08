export class RequestToNode {
    id: string;
    url: string;
    data: any = null;
    headers = {};

    constructor() {
    }

    deserialize(data: { id?: string, url?: string, data?: any, headers?: any }) {
        this.id = data.id;
        this.url = data.url;
        this.data = data.data;
        this.headers = data.headers;
        return this;
    }

    toJson() {
        return JSON.stringify(this);
    }
}