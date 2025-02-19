

export type listeners<T extends Array<any>> = (...arg: T) => void;
export type Options = {
    wildcard?: boolean;
    namespaces?: boolean;
    priorities?: boolean;
    cancellation?: boolean;
    buffering?: boolean;
    filtering?: boolean;
    transformation?: boolean;
    logging?: boolean;
    metrics?: boolean;
    asyncHandling?: boolean;
    errorHandling?: boolean;
    testing?: boolean;
}


export default class EventEmitter<EventMap extends Record<string | number | symbol, Array<any>>> {

    listeners: { [k in keyof EventMap]?: Set<listeners<EventMap[k]>> }
    regexListeners: Set<{ regex: RegExp, callBack: listeners<any[]> }>;


    constructor() {
        this.listeners = {}
        this.regexListeners = new Set();
    }


    on<k extends keyof EventMap>(eventName: k | RegExp | '*', callBack: listeners<EventMap[k]>, options: Options = {}) {

        if (eventName instanceof RegExp) {

            this.regexListeners.add({ regex: eventName, callBack });
            
        } else if (eventName === '*') {

            this.regexListeners.add({ regex: /\.*/, callBack }); // Equivalent to old wildcard

        } else {

            const listener = this.listeners[eventName] ?? new Set()
            listener.add(callBack)
            this.listeners[eventName] = listener

        }


    }

    once<k extends keyof EventMap>(eventName: k, callBack: listeners<EventMap[k]>, options: Options = {}) {
        const onceWrapper = (...args: EventMap[k]) => {
            callBack(...args)
            this.off(eventName)
        }
        this.on(eventName, onceWrapper, options)
    }

    emit<k extends keyof EventMap>(eventName: k, ...args: EventMap[k]) {
        const listeners = this.listeners[eventName];
        if (listeners) {
            for (const listener of listeners) {
                listener(...args);
            }
        }

        for (const { regex, callBack } of this.regexListeners) {
            if (regex.test(String(eventName))) { // Important: Convert eventName to string
                callBack(eventName, ...args);
            }
        }
    }

    off<k extends keyof EventMap>(eventName:  k | RegExp ) {
        if(eventName instanceof RegExp){
            const cloneListeners = { ...this.regexListeners }
            for(const listener of cloneListeners){
                if(listener.regex.test(String(eventName))){
                    this.regexListeners.delete(listener)
                }
            }

        }else{
            const cloneListeners = { ...this.listeners }
            delete cloneListeners[eventName]
            this.listeners = cloneListeners
        }
    }

    removeAllListener() {
        const cloneEventNames = Object.getOwnPropertyNames(this.listeners)
        cloneEventNames.forEach((eventName) => {
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

    // Wildcard Events
    private onWildcard<k extends keyof EventMap>(event: string | number | symbol, listener: listeners<EventMap[k]>) {


    }


}

export const eventManager = new EventEmitter()
