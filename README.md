# use-undo-redo

The `useUndoRedo` hook provides a simple and efficient way to manage undo and redo functionality in your React applications. It helps you maintain a history of state changes, allowing users to seamlessly navigate through different states of your application. 

## Demo
https://codesandbox.io/p/sandbox/react-state-history-4wj3mf

## Features

- **Undo and Redo**: Effortlessly navigate backward and forward through the state history.
- **Configurable History Capacity**: Define the maximum number of state changes to keep in memory.
- **Debounce Support**: Optimize performance by controlling the frequency of state history updates.
- **History Management**: Access the full history stack, reset the history, or jump to a specific point.
- **Lightweight and Easy to Integrate**: Minimal setup required to integrate into existing React components.

## Installation

```node
npm i --save use-undo-redo
```

## Basic Usage

```js
//import the hook
import { useUndoRedo } from "use-undo-redo";

//in react component
const state = useState(0);
const [undo, redo] = useUndoRedo(state);
```

### Example add in existing app

You don't need to overhaul your existing state management. This hook can be seamlessly integrated into your code with just a single line addition.

**Original component**

```jsx
import { useState } from "react";

function MyComponent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <div>
        <button onClick={() => setCount(count - 1)}>-</button>
        {count}
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
    </div>
  );
}
```

**Component with `useUndoRedo`**

```jsx
import { useState } from "react";
import { useUndoRedo } from "use-undo-redo";

function MyComponent() {
  const [count, setCount] = useState(0);

  //new line
  const [undo, redo] = useUndoRedo([count, setCount]);

  return (
    <div>
      <div>
        <button onClick={() => setCount(count - 1)}>-</button>
        {count}
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>

      <div>
        <button onClick={undo} disabled={!canUndo}>
          Undo
        </button>
        <button onClick={redo} disabled={!canRedo}>
          Redo
        </button>
      </div>
    </div>
  );
}
```

## useUndoRedo

```ts
useUndoRedo<T>(primaryState: [T, (v: T) => void], options?: Options): Output<T>
```
- **primaryState**: An array containing the state value and the state setter function. This allows the hook to manage the history of this specific state.

- **options**: 
    - **capacity** (optional): The maximum number of state changes to keep in history. Default is 10.
    - **debounce** (optional): The time in milliseconds to debounce history updates. It useful when your state update frequently, ie. when updating state using controlled input. Default is 0 (no debounce).

- **Returns**: An array containing:
    - **undo**: A function to revert to the previous state.
    - **redo**: A function to move forward to the next state.
    - **An object with the following properties**:
        - **canUndo**: A boolean indicating if an undo operation is possible.
        - **canRedo**: A boolean indicating if a redo operation is possible.
        - **reset**: A function to clear the history and reset the pointer.
        - **history**: An array representing the current state history.
jumpTo: A function to jump to a specific point in the history by index.

**Example hook call with full return and options**

```js
const [undo, redo, { canUndo, canRedo, jumpTo, history, pointer, reset }] =
  useUndoRedo([state, setState], {
    debounce: 500,
    capacity: 20,
  });
```
