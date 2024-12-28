# VueTextInsert

The VueTextInsert library is designed to enable the insertion of Vue components into text. This functionality is especially useful for implementing features like mentions or placeholders within text areas.

## Key Features

-   **Insert Vue components:** Dynamically insert and render Vue components within the text based on user input.
-   **Customizable Menu:** Provides a menu system to select and insert components.
-   **Text Parsing:** Converts text input and element selections back into a structured list format.

## Usage <a name="usage"></a>

To illustrate the usage, we assume that we want to mark people with an @ sign in a text.

If you like to learn by doing or looking at code, you may want to check out the [examples](#examples). Otherwise, you need at least three parts.

-   [The editor](#usage-editor)
-   [The insert](#usage-insert)
-   [The menu](#usage-menu)

### The editor <a name="usage-editor"></a>

To integrate the `VueTextInsertEditor` component in your Vue app, add it to your template. You need to provide a v-model with the items you want to render and the options.

#### Items

Items can be divided into two categories: text and inserts. Both require a type and a value. In the object used, the keys do not have to be `type` or `value`; they can be controlled via the options. Only inserts can extend the fields as desired.

```ts
interface InsertItem {
    type: InsertType;
    value: string;
}

interface InsertItemPerson extends InsertItem {
    age: number;
}

enum InsertType {
    Text = "Text",
    Person = "Person",
}
```

> [!NOTE]
> In this example, the `InsertItem` is the base object. This is filled with text. Inserts, like the person, inherit from the `InsertItem` and extend it by any number of fields. It would also be possible to have all inserts and texts in one object. However, this would leave some fields empty, which would quickly become chaotic with many inserts.

#### Options

The options are generic. `T` defines the `InsertItem` (here `InsertItemPerson`)

```ts
interface EditorOptions<T> {
    textType: string;
    typeField: keyof T;
    valueField: keyof T;
    insertOptions: Record<string, InsertOption>;
}
```

| Option          | Explanation                                                                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `textType`      | Value in the `typeField` that identifies the item as a text (here `InsertType.Text`)                                                                 |
| `typeField`     | Key of the item that identifies where the type of the item itself can be found                                                                       |
| `valueField`    | Key of the item that identifies where value of the item itself can be found                                                                          |
| `insertOptions` | Key-value pair that defines which types of inserts are available and how they are configured. (All types except the text type must be defined here.) |

```ts
interface InsertOption {
    trigger: string;
    insertComponent: Component;
    menuComponent: Component;
}
```

| Option            | Explanation                                                                          |
| ----------------- | ------------------------------------------------------------------------------------ |
| `trigger`         | A string denoting the character(s) that activate the insert menu (here `@`)          |
| `insertComponent` | The Vue component representing the `InsertItem`. [How to use](#usage-insert)         |
| `menuComponent`   | The Vue component used as a menu to select a `InsertItem`. [How to use](#usage-menu) |

### The insert <a name="usage-insert"></a>

Each insert component is a Vue component that can render a customized visual representation within your text area.

#### Props

The options are generic. `T` defines the `InsertItem` (here `InsertItemPerson`)

```ts
interface InsertProps<T> {
    item: T;
    destroy: () => void;
}
```

| Prop Name | Explanation                                                                                                     |
| --------- | --------------------------------------------------------------------------------------------------------------- |
| `item`    | The data associated with the `InsertItem`, allowing dynamic rendering based on the content of `item`.           |
| `destroy` | A function that removes the `InsertItem` from the editor, providing a way to clean up and remove the component. |

#### Lifecycle

The `InsertItem` is automatically mounted and unmounted. The lifecycle events can be used here as usual.

> [!WARNING]
> Due to the architecture, it is not possible to react to events of the item itself, e.g. `watch`. If this is changed from outside, the entire editor is re-rendered. This means that all `InsertItems` are remounted.

### The menu <a name="usage-menu"></a>

The menu component allows the user to select an `InsertItem` as soon as the user has entered the `trigger` for it.

#### Props

The props are generic. `T` defines the object of the InsertItem (here `InsertItemPerson`)

```ts
interface MenuProps<T> {
    menu: Ref<MenuValues<T>>;
}

interface MenuValues<T> {
    position: [number, number];
    query: string;
    addInsert: (item: T) => void;
    closeMenu: () => void;
}
```

| Prop Name | Explanation                                                                                                                                          |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `menu`    | A reactive reference to `MenuValues`, encapsulating the state and behavior related to the insert menu, facilitating reactivity and state management. |

`MenuValues` contains the following fields:

| Field Name  | Explanation                                                                                                                                                                                                                          |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `position`  | The coordinates (typically x and y) of the menu, defining where it should appear on the screen.                                                                                                                                      |
| `query`     | The current input string that the user typed, used to filter available `InsertItems` displayed in the menu.                                                                                                                          |
| `addInsert` | A function that accepts an `InsertItem` and adds it as an insert within the editor.                                                                                                                                                  |
| `closeMenu` | A function that closes the menu. Must be called if the user has not selected an `InsertItem` (e.g. the `addInsert` method has not been called) in order to keep the editor state valid and to be able to unmount the menu correctly. |

## Examples <a name="examples"></a>

-   [Vuetify](./packages/examples/vuetify/README.md)
