import { Query } from '@/models/query';
import RepositoryBase from './repositoryBase';
import { RepositoryRequest, RepositoryResponse } from './repositoryConfig';

export default class Repository<I, O> extends RepositoryBase<I | I[], O | O[]> {
    public constructor(endpoint?: string, config?: RepositoryRequest) {
        super(endpoint, config);
        if (endpoint != null)
            this.endpoint = endpoint
    }
    public endpoint = ""

    public uri = (actionUri?: string) => actionUri != undefined
        ? `${this.endpoint}/${actionUri}`
        : `${this.endpoint}`;

    public sendSet = (
        data?: I[],
        actionUri?: string
    ) => {
        return this.post(this.uri(actionUri), data);
    }

    public createSet = (
        data?: I[],
        actionUri?: string
    ) => {
        return this.post(this.uri(actionUri), data);
    }

    public changeSet = (
        data?: I[],
        actionUri?: string
    ) => {
        return this.patch(this.uri(actionUri), data);
    }

    public updateSet = (
        data?: I[],
        actionUri?: string
    ) => {
        return this.put(this.uri(actionUri), data as I[]);
    }

    public removeSet = (
        data?: I[]
    ) => {
        let cfg: any;
        if (this.requestConfig != null) {
            cfg = this.requestConfig;
            cfg.data = data as I[];
        }
        let r = this.delete(cfg);
        cfg.data = null;
        return r;
    }

    public upsertSet = (
        data?: I[],
        actionUri?: string
    ) => {
        return this.put(this.uri(actionUri), data);
    }

    public send = (
        data?: I,
        actionUri?: string
    ): Promise<RepositoryResponse<any, any>> => {
        return this.post(this.uri(actionUri), data);
    }

    public create = (
        data?: I,
        actionUri?: string
    ) => {
        return this.post(this.uri(actionUri), data);
    }

    public change = (
        data?: I,
        actionUri?: string
    ) => {
        return this.patch(this.uri(actionUri), data);
    }

    public update = (
        data?: I,
        actionUri?: string
    ) => {
        return this.put(this.uri(actionUri), data);
    }

    public remove = (
        key: number,
        data?: I
    ) => {
        let cfg: any;
        if (this.requestConfig != null) {
            cfg = this.requestConfig;
            cfg.data = data as I;
        }
        let r = this.delete("/" + key, cfg);
        cfg.data = null;
        return r;
    }

    public upsert = (
        data?: I,
        actionUri?: string
    ) => {
        return this.put(this.uri(actionUri), data);
    }

    public find = (
        id: number,
    ) => {
        return this.get("/" + id);
    }

    public search = (
        keyword: string,
    ) => {
        return this.get("/" + keyword);
    }

    public query = (
        query?: Query | any,
        offset = 0,
        limit = 0
    ) => {
        return this.post(`/query/${offset}/${limit}`, query);
    }

    public all = (
    ) => {
        return this.get();
    }

    public range = (
        offset = 0,
        limit = 0
    ) => {
        return this.get(`/${offset}/${limit}`);
    }

}