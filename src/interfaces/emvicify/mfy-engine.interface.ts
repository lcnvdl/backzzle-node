export interface IMfyBaseEngine {
    identifier: string;
    prepare(): void;
    serve(): void;
    close(): void;
}
