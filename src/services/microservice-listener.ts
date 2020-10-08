import { IBackzzleConfig } from "../interfaces/backzzle-config.interface";
import { IInjection } from "../interfaces/injection.interface";
import { Channel, connect, Connection, ConsumeMessage } from "amqplib";
import { RequestFromNode } from "../models/requests/request-from-node";
import { RequestToNode } from "../models/requests/request-to-node";
import { ResponseFromNode } from "../models/requests/response-from-node";
import { ResponseType } from "../enums/response-type.enum";
import { ApiMap } from "../models/api/api-map";
import { IHelloResponseServiceData } from "../interfaces/responses/hello-response-data.interface";

const broadcastExchangeName = "backzzle-broadcast-exchage";
const answerBroadcastsQueueName = "backzzle-queue";

export class MicroServiceListener {
    private connection: Connection;
    private channel: Channel;
    private apiMap: ApiMap;

    constructor(private injection: IInjection) {
        this.apiMap = new ApiMap();
    }

    private get settings() {
        return this.injection.get("backzzle-settings") as IBackzzleConfig;
    }

    async run() {
        await this.listen();
        await this.sendHello();
    }

    private async sendHello() {
        await this.sendBroadcast(new RequestToNode().deserialize({
            url: "backzzle/hello"
        }));
    }

    private async listen() {
        this.connection = await connect(this.settings.amqp);
        this.channel = await this.connection.createChannel();

        await this.channel.assertQueue(answerBroadcastsQueueName, { durable: false });

        this.channel.consume(answerBroadcastsQueueName, msg => this.processBroadcastMessage(msg), { noAck: true });

        await this.channel.assertExchange(broadcastExchangeName, "fanout", { durable: false });
    }

    private async sendBroadcast(msg: RequestToNode) {
        const answerQueue = await this.channel.assertQueue("", { exclusive: true });

        this.channel.consume(answerQueue.queue, res => this.processBroadcastReply(res, msg), { noAck: true });

        this.channel.publish(
            broadcastExchangeName,
            "",
            Buffer.from(msg.toJson()),
            {
                replyTo: answerQueue.queue,
                correlationId: ""
            });
    }

    private processBroadcastMessage(msg: ConsumeMessage) {
        if (msg.properties.correlationId === this.settings.apikey) {
            const request = new RequestFromNode().deserialize(JSON.parse(msg.content.toString()));
        }
    }

    private processBroadcastReply(msg: ConsumeMessage, original: RequestToNode) {
        const response = new ResponseFromNode().deserialize(JSON.parse(msg.content.toString()));

        switch (response.type) {
            case ResponseType.HelloAnswer:
                this.apiMap.add(response.data as IHelloResponseServiceData);
                break;
            default:
                throw new Error("Unknown response type" + response.type);
        }
    }

    async dispose() {
        if (this.connection) {
            await this.connection.close();
            this.connection = null;
        }
    }
}
