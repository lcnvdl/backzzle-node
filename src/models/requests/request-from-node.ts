import { RequestType } from "../../enums/request-type.enum";

export class RequestFromNode {
    token: string;
    type: RequestType;
    data: any;

    deserialize(json: any) {
        Object.assign(this, json);
        return this;
    }
}