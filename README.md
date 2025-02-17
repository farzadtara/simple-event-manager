# EventeventManager

A simple TypeScript EventeventManager implementation.

## Installation

Install the package using npm or yarn:

```bash
npm i event_container_ts
# or
yarn add event_container_ts
```

## Basic Example

- **Initialize**

```ts
import eventManager from 'event_container_ts';


const dataListener = (data: string, timestamp: number) => {
    console.log("Data received:", data, timestamp);
};

eventManager.on("dataReceived", dataListener);
eventManager.emit("dataReceived", "Hello", Date.now());

const onceListener = (data: string, timestamp: number) => {
    console.log("Data received once:", data, timestamp);
};

eventManager.once("dataReceived", onceListener);
eventManager.emit("dataReceived", "Hello", Date.now()); // This will trigger the listener
eventManager.emit("dataReceived", "Hello again", Date.now()); // This will not trigger the listener

const specificListener = (data: string, timestamp: number) => {
    console.log("Specific listener:", data, timestamp);
};

eventManager.on("dataReceived", specificListener);
eventManager.emit("dataReceived", "Hello", Date.now());

const listeners = eventManager.getListeners("dataReceived");
console.log(listeners); // Output the set of listeners for the "dataReceived" event

const count = eventManager.listenerCount("dataReceived");
console.log(count); // Output the number of listeners for the "dataReceived" event

const hasListeners = eventManager.hasListeners("dataReceived");
console.log(hasListeners); // Output true if there are listeners for the "dataReceived" event

eventManager.removeListener("dataReceived", specificListener); // Remove the specific listener
eventManager.emit("dataReceived", "Hello again", Date.now()); // This will not trigger the specific listener

eventManager.off("dataReceived"); // Remove all listeners for the "dataReceived" event

eventManager.on("error", (message: string) => console.error("Error:", message));
eventManager.emit("error", "Something went wrong!");

eventManager.removeAllListener(); // Remove all listeners
```

- **Using the Decorator**

```js
import  emit, eventManager  from 'event_container_ts';



class MyClass {
    @emit("dataReceived", "Data from method", immediate: true)
    myMethod() {
        console.log("Method executed");
        return "Method Result";
    }

    @emit("dataReceived", "Data from another method", false)
    anotherMethod(param: number) {
        console.log("Another method executed with param:", param);
        return param * 2;
    }
}

const myInstance = new MyClass();
myInstance.myMethod(); // Method execution and then emit
myInstance.anotherMethod(5); // Method execution and then emit

eventManager.on("dataReceived", (data, timestamp) => {
    console.log("Event emitted:", data, timestamp);
});
```

- **New Decorator Example**

```ts
import  eventManager, emit  from 'event_container_ts';


class MyClass {
    @emit({ eventName: 'dataReceived', eventNameArgs: ['Hello', Date.now()] })
    myMethod() {
        console.log('Method executed');
    }
}

const myInstance = new MyClass();
myInstance.myMethod(); // This will emit the "dataReceived" event immediately before executing the method
```

