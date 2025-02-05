# EventEmitter

A simple TypeScript EventEmitter implementation.

## Installation

Install the package using npm or yarn:

```bash
npm install eventemitter-ts
# or
yarn add eventemitter-ts
```

## Basic Example

- **Initialize**

```ts
import EventEmitter from 'eventemitter-ts';

interface MyEvents {
    dataReceived: [data: string, timestamp: number];
    error: [message: string];
    complete: [];
}

const emitter = new EventEmitter<MyEvents>();

const dataListener = (data: string, timestamp: number) => {
    console.log("Data received:", data, timestamp);
};

emitter.on("dataReceived", dataListener);
emitter.emit("dataReceived", "Hello", Date.now());

const onceListener = (data: string, timestamp: number) => {
    console.log("Data received once:", data, timestamp);
};

emitter.once("dataReceived", onceListener);
emitter.emit("dataReceived", "Hello", Date.now()); // This will trigger the listener
emitter.emit("dataReceived", "Hello again", Date.now()); // This will not trigger the listener

const specificListener = (data: string, timestamp: number) => {
    console.log("Specific listener:", data, timestamp);
};

emitter.on("dataReceived", specificListener);
emitter.emit("dataReceived", "Hello", Date.now());

const listeners = emitter.getListeners("dataReceived");
console.log(listeners); // Output the set of listeners for the "dataReceived" event

const count = emitter.listenerCount("dataReceived");
console.log(count); // Output the number of listeners for the "dataReceived" event

emitter.removeListener("dataReceived", specificListener); // Remove the specific listener
emitter.emit("dataReceived", "Hello again", Date.now()); // This will not trigger the specific listener

emitter.off("dataReceived"); // Remove all listeners for the "dataReceived" event

emitter.on("error", (message: string) => console.error("Error:", message));
emitter.emit("error", "Something went wrong!");

emitter.removeAllListener(); // Remove all listeners
```

- **Using the Decorator**

```js
import EventEmitter, { emitEvent } from 'eventemitter-ts';

interface MyEvents {
    dataReceived: [data: string, timestamp: number];
}

const emitter = new EventEmitter<MyEvents>();

class MyClass {
    @emitEvent("dataReceived", "Data from method", true)
    myMethod() {
        console.log("Method executed");
        return "Method Result";
    }

    @emitEvent("dataReceived", "Data from another method", false)
    anotherMethod(param: number) {
        console.log("Another method executed with param:", param);
        return param * 2;
    }
}

const myInstance = new MyClass();
myInstance.myMethod(); // Method execution and then emit
myInstance.anotherMethod(5); // Method execution and then emit

emitter.on("dataReceived", (data, timestamp) => {
    console.log("Event emitted:", data, timestamp);
});
```

- **New Decorator Example**

```ts
import { eventEmitter, emit } from 'eventemitter-ts';

interface MyEvents {
    dataReceived: [data: string, timestamp: number];
    error: [message: string];
    complete: [];
}

class MyClass {
    @emit({ eventName: 'dataReceived', eventNameArgs: ['Hello', Date.now()], immediate: true })
    myMethod() {
        console.log('Method executed');
    }
}

const myInstance = new MyClass();
myInstance.myMethod(); // This will emit the "dataReceived" event immediately before executing the method
```

This updated `README.md` file includes examples for the new features such as `once`, `removeListener`, `getListeners`, `listenerCount`, and the decorator usage.
