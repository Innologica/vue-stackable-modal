# Stackable modal

Stackable modals is a library for modal dialogs which can be infinitely stacked. 
The component uses bootstrap for styling the modal but DOES NOT include it by default - 
you need to import it yourself.

When you open a second dialog the first one is scaled to 0.9 and position behind

## Installation

```shell
npm i @innologica/vue-stackable-modal --save
```

or 

```shell
yarn add @innologica/vue-stackable-modal
```

include in project:

## Getting started

```JS
import StackModal from '@innologica/vue-stackable-modal'

Vue.use(StackModal, options)
```

## Example

<StackableModalDemo/>

### Source code
<<< @/docs/.vuepress/components/StackableModalDemo.vue

## Props

| Prop        | Type           | Default  |Description  |
| ------------- |:-------------:| -----:|-----|
| show      | Boolean | false |Shows/hides the modal|
| title      | String |  |The title of the modal shown in .modal-header div. If empty the div is not rendered|
| modalClass      | Object | {} |:class object which is attached to the modal dialog element |
| has_backdrop      | Boolean | true |Whether to display backdrop element for this dialog. It is added to the body with calculated z-index. |
| saveButton      | Object | {  title: 'Save',  visible: true,  btnClass: {'btn btn-primary': true}}| Save button config |
| cancelButton      | Object | {  title: 'Cancel',  visible: true,  btnClass: {'btn btn-outline-secondary': true}}| Cancel button config |
| transition      | String | translate-fade | Transition to use when showing the modal.You need to include scss with the transition |

## Events

| Event | Params | Description |
|-------| --------|------------|
| save |  <i>none</i>| When the save button is pressed
| close |  <i>none</i>| When the cancel button is pressed, or the "x" in the title is clicked, or escape is pressed. <b>Yoo need to close the modal via the show property</b>|

## Slots

### default 
This slot is the content of the modal.

### modal-header

Default value:

```vue
<slot name="modal-header">
    <div class="modal-header" v-if="title">
        <h5 class="modal-title">{{title}}</h5>
        <a class="close" aria-label="Close" @click.stop="$emit('close')">
            <span aria-hidden="true">×</span>
        </a>
    </div>
</slot>
```

The modal header is rendered above the content. If title is empty then it is not rendered

### modal-footer 

Default value:

```vue
<slot name="modal-footer">
    <div class="modal-footer">
        <button
                v-if="saveButtonOptions.visible"
                type="button"
                @click="$emit('save')"
                :class="{ ...saveButtonOptions.btnClass }"
        >{{saveButtonOptions.title}}
        </button>
        <button
                type="button"
                :class="{ ...cancelButtonOptions.btnClass }"
                data-dismiss="modal"
                @click.stop="$emit('close')"
        >{{cancelButtonOptions.title}}
        </button>
    </div>
</slot>
```
This is the modal footer with the 2 buttons.