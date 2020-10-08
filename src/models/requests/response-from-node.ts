import { ResponseType } from "../../enums/response-type.enum";

export class ResponseFromNode {
    token: string;
    type: ResponseType
    data: any;

    deserialize(json: any) {
        Object.assign(this, json);
        return this;
    }
}