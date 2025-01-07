# EventEmitter.ts

A small and efficient library for event management in JavaScript and TypeScript projects.

[![npm version](https://badge.fury.io/js/eventemitter-ts.svg)](https://badge.fury.io/js/eventemitter-ts)

## Features

*   Strongly typed event management with TypeScript support.
*   Ability to remove specific listeners.
*   Easy clearing of listeners (both for a specific event and all events).
*   Uses `Map` for optimized listener storage.
*   `emitEvent` decorator for simplified usage.

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

emitter.off("dataReceived", dataListener); // Remove a specific listener

emitter.on("error", (message: string) => console.error("Error:", message));
emitter.emit("error", "Something went wrong!");

emitter.removeListeners("error"); // Remove all listeners for the "error" event
emitter.removeListeners(); // Remove all listeners
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
