
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


}

export const eventEmitter = new EventEmitter()

export function emit(params:{eventName: string, eventNameArgs?: any ,immediate?: boolean })  {
    return function(target: any,propertyKey: string,descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        const {eventName, immediate, eventNameArgs} = params
        descriptor.value = async function(...args: unknown[]) {
           
            if(immediate){
                eventEmitter.emit(eventName, eventNameArgs)
                setTimeout(()=>{
                    originalMethod.apply(this, args)
                }, 0)
            }else{
                originalMethod.apply(this, args)
                setTimeout(()=>{
                    eventEmitter.emit(eventName, eventNameArgs)

                }, 0)
            }
        }
    };
  }