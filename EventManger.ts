
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

    emitEvent<k extends keyof EventMap>(eventName: k, ...arg:EventMap[k] ) {
        const listeners =  this.listeners[eventName] ?? new Set()
        for(const listener of listeners){
            listener(...arg)
        }
    }

    removeListener<k extends keyof EventMap>(eventName: k){
        const cloneListeners = {...this.listeners}
        delete cloneListeners[eventName]
        this.listeners = cloneListeners
    }

    removeAllListener(){
        const cloneEventNames = Object.getOwnPropertyNames(this.listeners)
        cloneEventNames.forEach((eventName)=>{
            this.removeListener(eventName)
        })
    }


}

export const eventEmitter = new EventEmitter()

export function emitEvent(params:{eventName: string, eventNameArgs?: any ,immediate?: boolean })  {
    return function(target: any,propertyKey: string,descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        const {eventName, immediate, eventNameArgs} = params
        descriptor.value = async function(...args: unknown[]) {
           
            if(immediate){
                eventEmitter.emitEvent(eventName, eventNameArgs)
                window.setImmediate(()=>{
                    originalMethod.apply(this, args)
                })
            }else{
                originalMethod.apply(this, args)
                window.setImmediate(()=>{
                    eventEmitter.emitEvent(eventName, eventNameArgs)

                })
            }
        }
    };
  }