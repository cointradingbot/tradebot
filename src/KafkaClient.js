import kafka from 'kafka-node'

export class KafkaClient {
    constructor(kafkaHosts){
        this.client =  new kafka.KafkaClient({kafkaHost: kafkaHosts});
        this._producer = new kafka.Producer(this.client);
    }
    get producer(){
        return this._producer;
    }
}