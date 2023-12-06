import {
    EntityState,
    configureStore,
    createEntityAdapter,
    createSlice
} from '@reduxjs/toolkit';
import { EntityId, Update } from '@reduxjs/toolkit/dist/entities/models';
import { Model } from '@/models/model';
import StoreRepository from '@/repository/storeRepository';

export declare type Registry<M> = { [id: number | string]: M };

export abstract class ServiceBase<I = any, M = Model | any> extends StoreRepository {
    public adapter;
    public slice;
    public command;
    public store;
    public selectors;
    public dispatch;
    public state;
    public dataState: EntityState<M> & { loading: string };

    public constructor(endpoint: string) {
        super(endpoint);  
        this.dataState = this.dataToState();
        this.adapter = this.getAdapter();      
        this.slice = this.getSlice();
        this.command = this.slice.actions;
        this.store = this.getStore();
        this.state = this.store.getState().entity;
        this.selectors = this.getSliceSelectors();
        this.dispatch = this.store.dispatch;              
    }
   
    public stateToData(state: EntityState<M> & { loading: string }) {
        let modelSet: M[] = [];
        for (let i of this.iterateEntityState(state))
            modelSet.push(i);
        return modelSet;
    }

    public* iterateEntityState(state: EntityState<M>) {
        for (let e in state.ids)
            yield state.entities[e] as M;
    }

    public getStore() {
        return configureStore({
            reducer: {
                init: this.slice.getInitialState,
                entity: this.slice.reducer,
            },
            middleware:
                (defaults) =>
                    defaults({
                        serializableCheck: {
                            ignoredActionPaths: ['payload.postaction'], //Ignore field paths in actions
                            //ignoredActions: ['entity'], //Ignore these action types                            
                            //ignoredPaths: ['postaction'] //Ignore paths in the state
                        },
                    }),
        })
    }

    public getSliceSelectors() {
        return this.adapter.getSelectors<ReturnType<typeof this.store.getState>>((state) => state.entity)
    }

    public getAdapter() {
        return createEntityAdapter(
            {
                selectId:
                    (e: M | Model | any) =>
                        (e as Model).Id,
                sortComparer:
                    (a, b) =>
                        (a as Model).Label
                            .localeCompare(
                                (b as Model).Label)
            });
    }

    public getSlice() {
        return createSlice({
            name: "entity",
            initialState: this.adapter.getInitialState({ loading: "idle" }),
            reducers: {              
                action: this.remoteAction,              
                actionSet: this.remoteActionSet,
                query: this.remoteQuery,
                find: this.remoteFind,
                range: this.remoteRange,
                remoteUpdate: this.remoteUpdate,
                localUpdate: this.adapter.setOne,
                update: (state, entity: I | any) => {                    
                    this.adapter.setOne(state, entity)
                    this.remoteUpdate(state, { payload: entity as I, type: 'entity/remoteUpdate' })
                },
                remoteUpdateSet: this.remoteUpdateSet,             
                localUpdateSet: this.adapter.setMany,
                updateSet: (state, entity: I[] | any) => {
                    this.adapter.setMany(state, entity)
                    this.remoteUpdateSet(state, { payload: entity as I[], type: 'entity/remoteUpdateSet' })
                },
                remoteCreate: this.remoteCreate,
                localCreate: this.adapter.addOne,
                create: (state, entity: I | any) => {
                    this.adapter.addOne(state, entity)
                    this.remoteCreate(state, { payload: entity as I, type: 'entity/remoteCreate' })
                },
                remoteCreateSet: this.remoteCreateSet,
                localCreateSet: this.adapter.addMany,
                createSet: (state, entity: I[] | any) => {
                    this.adapter.addMany(state, entity)
                    this.remoteCreateSet(state, { payload: entity as I[], type: 'entity/remoteCreateSet' })
                },
                remoteLoadAll: this.remoteLoadAll,
                localLoadAll: this.adapter.setAll,             
                loadAll: (state, action) => {
                    if (state.loading === 'idle') {
                        state.loading = 'pending';   
                    }
                    this.remoteLoadAll(state, action);
                },
                loaded: (state, action) => {
                    if (state.loading === 'pending') {
                        this.adapter.setAll(state, action.payload);
                        state.loading = 'idle';
                    }
                },
                remoteChange: this.remoteChange,
                localChange: this.adapter.updateOne,
                change: (state, update: Update<I> | any) => {
                    let _update = update as Update<I>;
                    let _model = _update.changes as Partial<Model>;
                    _model.Id = _update.id;
                    this.adapter.updateOne(state, _update)
                    this.remoteChange(state, { payload: _model, type: 'entity/remoteChange' })
                },
                remoteChangeSet: this.remoteChangeSet,
                localChangeSet: this.adapter.updateMany,
                changeSet: (state, updates: Update<I>[] | any) => {
                    let _updates = updates as Update<I>[];
                    let fn = (id: number | string, item: Partial<Model>) => { item.Id = id; return item as Partial<I>; }
                    let _models = _updates.map((item) => fn(item.id, item.changes));
                    this.adapter.updateMany(state, _updates)
                    this.remoteChangeSet(state, { payload: _models, type: 'entity/remoteChangeSet' })
                },
                remoteDelete: this.remoteDelete,
                localDelete: this.adapter.removeOne,
                delete: (state, key: EntityId | any) => {
                    let _key = key as EntityId;
                    let _model = state.entities[_key.valueOf()];
                    this.adapter.removeOne(state, _key)
                    this.remoteDelete(state, { payload: _model, type: 'entity/remoteDelete' })
                },
                remoteDeleteSet: this.remoteDeleteSet,
                localDeleteSet: this.adapter.removeMany,
                deleteSet: (state, keys: EntityId[] | any) => {
                    let _keys = keys as EntityId[];
                    let _models:I[] = []
                    _keys.forEach(_key => _models.push(state.entities[_key.valueOf()]));
                    this.adapter.removeMany(state, _keys)
                    this.remoteDeleteSet(state, { payload: _models, type: 'entity/remoteDeleteSet' })
                },
                localTruncate: this.adapter.removeAll,
                remoteUpsert: this.remoteUpsert,                                
                lolcalUpsert: this.adapter.upsertOne,
                upsert: (state, entity: I | any) => {
                    this.adapter.upsertOne(state, entity)
                    this.remoteUpsert(state, { payload: entity as I, type: 'entity/remoteCreate' })
                },
                remoteUpsertSet: this.remoteUpsertSet,
                loclaUpsertSet: this.adapter.upsertMany,
                upsertSet: (state, entity: I[] | any) => {
                    this.adapter.upsertMany(state, entity)
                    this.remoteUpsertSet(state, { payload: entity as I[], type: 'entity/remoteUpsertSet' })
                },
            },
        });
    }
}
