import kafka from 'kafka-node'

export class KafkaClient {
    constructor(kafkaHosts) {
        this._client = new kafka.KafkaClient({
            kafkaHost: kafkaHosts
        });
        this._producer = new kafka.Producer(this.client);
    }
    get producer() {
        return this._producer;
    }
    get client() {
        return this._client;
    }
}