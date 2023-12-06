import {
    Dictionary,
    EntityState
} from '@reduxjs/toolkit';
import { EntityId } from '@reduxjs/toolkit/dist/entities/models';
import { Model } from '@/models/model';
import Repository from '@/repository/repository';
import { Query } from '@/models/query';
import { RepositoryResponse } from '@/repository/repositoryConfig';

export declare type Registry<M> = { [id: number | string]: M };

export declare type PostAction<I = any, O = any, F = any> = (response: Promise<RepositoryResponse<O, I>>) => F;

export default abstract class StoreRepository<I = any, M = Model | any> {

    public constructor(endpoint: string) {
        this.data = [];
        this.endpoint = endpoint
        this.repository = new Repository<I, M>(this.endpoint);
    }

    public data: M[];
    public declare endpoint: string;
    repository: Repository<I, M>;

    public setToken = (token: string) => this.repository.setToken(token);

    public dataToState = (models?: M[]): EntityState<M> & { loading: string } => {
        if (models == undefined) {
            models = this.data;
        }
        return { ids: this.getEntityIds(models), entities: this.getDictionary(models), loading: "idle" }
    }

    public getEntityIds(models?: M[]): EntityId[] {
        if (models == undefined) {
            models = this.data;
        }
        return this.idMapper(models);;
    }

    public getDictionary(models?: M[]): Dictionary<M> {
        return this.getRegistry(models);
    }

    public getRegistry(models?: M[]): Registry<M> {
        if (models == undefined) {
            models = this.data;
        }
        const reg: Registry<M> = {}
        this.registryMapper(models, reg);
        return reg;
    }

    private idSelector = (s: M) => (s as Model).Id as EntityId;
    private idMapper = (s: M[]) => s.map(e => this.idSelector(e));

    private registryEntry = (s: M, d: { [id: number | string]: M }) => d[(s as Model).Id] = s;
    private registryMapper = (s: M[], d: { [id: number | string]: M }) => s.map(e => this.registryEntry(e, d));

    public remoteAction = (state: EntityState<M> & { loading: string }, action: { payload: { data: I, method: string, postaction?: PostAction<I, M> }, type: string }) => {
        var response = this.repository.send(action.payload.data, action.payload.method);
        if (action.payload.postaction != undefined)
            action.payload.postaction(response);
        return state;
    }

    public remoteActionSet = (state: EntityState<M> & { loading: string }, action: { payload: I[], type: string, postaction?: PostAction<I, M> }) => {
        this.repository.sendSet(action.payload);
        return state;
    }

    public remoteQuery = (state: EntityState<M> & { loading: string }, action: { payload: Query, type: string, postaction?: PostAction<I, M> }) => {
        this.repository.query(action.payload);
        return state;
    }

    public remoteFind = (state: EntityState<M> & { loading: string }, action: { payload: number, type: string, postaction?: PostAction<I, M> }) => {
        this.repository.find(action.payload);
        return state;
    }

    public remoteRange = (state: EntityState<M> & { loading: string }, action: { payload: number[], type: string, postaction?: PostAction<I, M> }) => {
        this.repository.range(action.payload[0], action.payload[1]);
        return state;
    }

    public remoteUpdate = (state: EntityState<M> & { loading: string }, action: { payload: I, type: string, postaction?: PostAction<I, M> }) => {
        this.repository.update(action.payload);
        return state;
    }

    public remoteUpdateSet = (state: EntityState<M> & { loading: string }, action: { payload: I[], type: string, postaction?: PostAction<I, M> }) => {
        this.repository.updateSet(action.payload);
        return state;
    }

    public remoteCreate = (state: EntityState<M> & { loading: string }, action: { payload: I, type: string, postaction?: PostAction<I, M> }) => {
        this.repository.create(action.payload);
        return state;
    }

    public remoteCreateSet = (state: EntityState<M> & { loading: string }, action: { payload: I[], type: string, postaction?: PostAction<I, M> }) => {
        this.repository.createSet(action.payload);
        return state;
    }

    public remoteLoadAll = (state: EntityState<M> & { loading: string }, action: { payload: M[], type: string, postaction?: PostAction<I, M> }) => {
        this.repository.all()
            .then(r => action.payload = this.data = r.data)
            .then(d => state = this.dataToState(d));
        return state;
    }

    public remoteChange = (state: EntityState<M> & { loading: string }, action: { payload: I, type: string, postaction?: PostAction<I, M> }) => {
        this.repository.change(action.payload);
        return state;
    }

    public remoteChangeSet = (state: EntityState<M> & { loading: string }, action: { payload: I[], type: string, postaction?: PostAction<I, M> }) => {
        this.repository.changeSet(action.payload);
        return state;
    }

    public remoteUpsert = (state: EntityState<M> & { loading: string }, action: { payload: I, type: string, postaction?: PostAction<I, M> }) => {
        this.repository.upsert(action.payload);
        return state;
    }

    public remoteUpsertSet = (state: EntityState<M> & { loading: string }, action: { payload: I[], type: string, postaction?: PostAction<I, M> }) => {
        this.repository.upsertSet(action.payload);
        return state;
    }

    public remoteDelete = (state: EntityState<M> & { loading: string }, action: { payload: I, type: string, postaction?: PostAction<I, M> }) => {
        this.repository.remove((action.payload as any).Id, action.payload);
        return state;
    }

    public remoteDeleteSet = (state: EntityState<M> & { loading: string }, action: { payload: I[], type: string, postaction?: PostAction<I, M> }) => {
        this.repository.removeSet(action.payload);
        return state;
    }

}