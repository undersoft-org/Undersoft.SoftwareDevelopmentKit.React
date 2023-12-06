import axios, { AxiosInterceptorManager, AxiosDefaults } from "axios";
import { RepositoryRequest, RepositoryResponse } from "./repositoryConfig";
import { Model } from "@/models/model";

export default class RepositoryInstance<I = Model | any | Model[] | any[], O = Model | any | Model[] | any[]> {

    public defaults?: AxiosDefaults;

    public interceptors!: {
        
        request: AxiosInterceptorManager<RepositoryRequest<I>>;

        response: AxiosInterceptorManager<RepositoryResponse<I, O>>;
    };
    constructor(config?: RepositoryRequest<I>) {
        return axios.create(config);
    }
}