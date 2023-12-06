import { RepositoryRequest, RepositoryResponse, getRepositoryConfig } from "./repositoryConfig";
import RepositoryInstance from "./repositoryInstance";
import {
    AxiosError,
} from "axios";

export default class RepositoryBase<I, O> extends RepositoryInstance<I | I[], O | O[]> {
    private token: string;
    public requestConfig;
    public repoConfig;
    public baseUrl?: string = "";
    public endpointUri?: string = "";
    public uri = (actionUri?: string) => actionUri != undefined
        ? `${this.endpointUri}/${actionUri}`
        : `${this.endpointUri}`;

    public constructor(url?: string, config?: RepositoryRequest<I>) {
        super(config);
        const rcfg = getRepositoryConfig<O>();
        if (config != undefined && url != undefined && this.defaults != undefined) {            
            this.requestConfig = this.defaults;
            this.requestConfig.url = url;
        }
        else {           
            if (this.defaults != undefined) {
                this.requestConfig = this.defaults;
                this.requestConfig.baseURL = rcfg.baseURL;
                this.requestConfig.url = url;
                this.requestConfig.headers.common.Accept = rcfg.headers?.Accept;
                this.requestConfig.headers.common["Content-Type"] = rcfg.headers?.["Content-Type"];
                this.requestConfig.headers.common.Pragma = rcfg.headers?.Pragma;
                this.requestConfig.headers.common["Content-Control"] = rcfg.headers?.["Content-Control"];
                this.requestConfig.headers.common["Access-Control-Allow-Origin"] = rcfg.headers?.["Access-Control-Allow-Origin"];
                this.requestConfig.withCredentials = rcfg.withCredentials;
                this.requestConfig.timeout = rcfg.timeout;
            }
        }
        this.baseUrl = this.requestConfig?.baseURL;
        this.endpointUri = this.requestConfig?.url;
        this.repoConfig = rcfg;                   
        this.token = "";    
        this.getUri = this.getUri.bind(this);
        this.request = this.request.bind(this);
        this.get = this.get.bind(this);
        this.options = this.options.bind(this);
        this.delete = this.delete.bind(this);
        this.head = this.head.bind(this);
        this.post = this.post.bind(this);
        this.put = this.put.bind(this);
        this.patch = this.patch.bind(this);     
      

        this.interceptors.request.use((param: RepositoryRequest) => {
            return {
                ...param,
                defaults: {
                    headers: {
                        ...param.headers,
                        "Authorization": `Bearer ${this.getToken()}`
                    },
                }
            }
        }, (error) => {
            console.log(error);
        });
        this.interceptors.response.use((param: RepositoryResponse) => ({
            ...param
        }), (error) =>
        {            
            console.log(error)
        });        
    }

    public getToken = (): string => {
        return `Bearer ${this.token}`;
    }

    public setToken = (token: string): void => {
        this.token = token;
    }

    public getUri = (actionUri?: string): string => {
        return this.getUri() + actionUri;
    }

    public request<R = RepositoryResponse<any, any>>(
        config: RepositoryRequest<any>
    ): Promise<R> { 
        return this.request(config);
    }

    public get<R = RepositoryResponse<any, any>>(
        actionUri?: string,
    ): Promise<R> {
        return this.get(this.uri(actionUri));
    }

    public options<R = RepositoryResponse<any, any>>(
        actionUri?: string,
    ): Promise<R> {
        return this.options(this.uri(actionUri));
    }

    public delete<R = RepositoryResponse<any, any>>(
        actionUri?: string,
        config?: RepositoryRequest<any>
    ): Promise<R> {
        return this.delete(this.uri(actionUri), config);
    }

    public head<R = RepositoryResponse<any, any>>(
        actionUri?: string,
    ): Promise<R> {
        return this.head(this.uri(actionUri));
    }

    public post<R = RepositoryResponse<any, any>>(
        actionUri?: string,
        data?: any,
    ): Promise<R> {
        return this.post(this.uri(actionUri), data);
    }

    public put<R = RepositoryResponse<any, any>>(
        actionUri?: string,
        data?: any,
    ): Promise<R> {
        return this.put(this.uri(actionUri), data);
    }

    public patch<R = RepositoryResponse<any, any>>(
        actionUri?: string,
        data?: any,
    ): Promise<R> {
        return this.patch(this.uri(actionUri), data);
    }    

    public success = (response: RepositoryResponse<any, any>) => {              
        return response.data;
    }

    public error = (error: AxiosError<any, any>): void => {
        throw error;
    }
}