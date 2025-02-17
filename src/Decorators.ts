
import { eventManager } from "./EventManger";

export default function emit(params: { eventName: string, eventNameArgs?: any, immediate?: boolean }) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        const { eventName, immediate, eventNameArgs } = params
        descriptor.value = function (...args: unknown[]) {

            if (immediate) {
                eventManager.emit(eventName, eventNameArgs)
                setTimeout(() => {
                    originalMethod.apply(this, args)
                }, 0)
            } else {
                originalMethod.apply(this, args)
                setTimeout(() => {
                    eventManager.emit(eventName, eventNameArgs)

                }, 0)
            }
        }
    };
}
