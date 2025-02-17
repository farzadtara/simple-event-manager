

export type listeners<T extends Array<any>> = (...arg: T) => void;


export default class EventEmitter<EventMap extends Record<string, Array<any>>>{

    listeners: { [k in keyof EventMap]?: Set<listeners<EventMap[k]>> }

    constructor(){
        this.listeners = {}
    }


    on<k extends keyof EventMap>(eventName: k, callBack: listeners<EventMap[k]>) {
        const listener=  this.listeners[eventName] ?? new Set()
        listener.add(callBack)
        this.listeners[eventName] = listener
    }

    once<k extends keyof EventMap>(eventName: k, callBack: listeners<EventMap[k]>) {
        const onceWrapper = (...args: EventMap[k]) => {
            callBack(...args)
            this.off(eventName)
        }
        this.on(eventName, onceWrapper)
    }

    emit<k extends keyof EventMap>(eventName: k, ...arg:EventMap[k] ) {
        const listeners =  this.listeners[eventName] ?? new Set()
        for(const listener of listeners){
            listener(...arg)
        }
    }

    off<k extends keyof EventMap>(eventName: k){
        const cloneListeners = {...this.listeners}
        delete cloneListeners[eventName]
        this.listeners = cloneListeners
    }

    removeAllListener(){
        const cloneEventNames = Object.getOwnPropertyNames(this.listeners)
        cloneEventNames.forEach((eventName)=>{
            this.off(eventName)
        })
    }
    getListeners<k extends keyof EventMap>(eventName: k): Set<listeners<EventMap[k]>> | undefined {
        return this.listeners[eventName];
    }

    listenerCount<k extends keyof EventMap>(eventName: k): number {
        const listeners = this.listeners[eventName];
        return listeners ? listeners.size : 0;
    }

    hasListeners<k extends keyof EventMap>(eventName: k): boolean {
        const listenerCounts = this.listenerCount(eventName)
        return listenerCounts > 0
    }


}

export const eventManager = new EventEmitter()
