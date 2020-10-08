import { IHelloResponseServiceData } from "../../interfaces/responses/hello-response-data.interface";
import { ApiService } from "./api-service";

export class ApiMap {
    id = "";
    services: ApiService[] = [];

    add(microService: IHelloResponseServiceData) {
        throw new Error("Method not implemented.");
    }
}