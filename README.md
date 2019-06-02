# Stackable modal

Stackable modal is a library for modal dialogs which can be stacked by using z-index position. 
The component uses bootstrap for styling the modal but DOES NOT include it by default - 
you need to import it yourself.

When you open a second dialog the first one is scaled to 0.9 and position behind. You have always 3 visible modals.

## Installation

```shell
npm i @innologica/vue-stackable-modal --save
```

or 

```shell
yarn add @innologica/vue-stackable-modal
```

import to use:

```JS
import StackModal from '@innologica/vue-stackable-modal'
```

More info and demo https://innologica.github.io/vue-stackable-modal/
