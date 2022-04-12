import { createClient, RedisClientType } from 'redis';

export class Redis {

    private client?: RedisClientType

    public async init(){
        this.client = createClient();
        this.client.on('error', (err) => console.log('Redis Client Error', err));
        this.client.on('ready', () => console.log('Redis Client ready'));
        await this.client.connect();
    }

    /**
     * @param key
     * @param value
     */
    public async set(key: string, value: string| any){
        await this.client!.set(key, value);
    }

    /**
     * @param key
     */
    public async get(key: string){
        return  this.client!.get(key);
    }

    /**
     * @param key
     */
    public async delete(key: string){
        return  this.client!.del(key);
    }
}
