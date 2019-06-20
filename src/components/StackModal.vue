<template>
    <transition :name="transition" appear>
        <div v-if="show" class="modal fade show" :style="getStyle" @mousedown="mouseDown" ref="modal">
            <div class="modal-dialog" role="document" :class="getClass">
                <div class="modal-content">
                    <slot name="modal-header">
                        <div class="modal-header" v-if="title">
                            <h5 class="modal-title">{{title}}</h5>
                            <a class="close" aria-label="Close" @click.stop="$emit('close')">
                                <span aria-hidden="true">×</span>
                            </a>
                        </div>
                    </slot>
                    <div class="modal-body">
                        <slot></slot>
                    </div>
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
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
  // import Vue from 'vue'


  /**
   * I think you've done a good job with this modal. I'm opening this PR just to share some thoughts,
   * because I do believe this can be improved and used later on. Hopefully considered as a friendly gesture :)
   * 
   * 1. Relying on `document` is a bit shaky. This won't work on nuxt or anything that lacks it. More over it could lead to errors.
   *    While I get the reason behind it, I would add special methods for all document related calls.
   *    Then I'd check if it's present and only call it if so. Also allow receiving external methods to do
   *    what is needed (overriding document related tasks).
   * 
   * 2. The previous point is problematic mainly because of having the backdrops added/removed at document's DOM level from here.
   *    A good approach is to have the backdrop *inside* the modal itself. This way you can show/hide it, as well as listen
   *    for it's own click events (eliminates document addEventListener calls).
   *    It would also allow styling of the backdrop, as it can be inside a slot. Now `checkBackdrop` creates it and
   *    there is no way this can be overriden/modified.
   *    Probably the entire complex z-index calculation could be removed - adding a few modals one after another in the markup
   *    would force the browser's internal system to increase their z-index :) If thei contain the backdrops inside, it would automatically work.
   * 
   * 3. Global class toggle on body is handled internally, without the option to be toggled/customized.
   *    Pass props for class name and/or enabling the feature whatsoever.
   * 
   * 4. Enumeration - all event names are hardcoded ($emit('show')). While this serves the purpose, it's not easily extendable.
   *    It would be great if those names are enumerated in external file, and used here. This way you'll allow users to actually
   *    import the enumeration file, and use it in their owh code that listens for modal's events.
   *    Having this would allow "easily" changing event names in the future ;)
   * 
   * 5. Listening on document for key events - this can be done on modal level as events should bubble up. Document might have other plans :)
   */

  /**
   * I'd put this into a separate file, as it's purpose is to serve as a global state.
   * While this works because of ESM, I think it's logically incorrect to put it inside here.
   */
  const modals = {count: 0}
  // const modals = Vue.observable({count: 0})

  export default {
    name: 'StackModal',
    props: {
      /* Shows/hides the modal */
      show: Boolean,
      /* The title of the modal shown in .modal-header div. If empty title is not rendered */
      title: String,
      /* :class object which is attached to the modal dialog element */
      modalClass: Object,
      /* Whether to display backdrop element for this dialog. It is added to the body with calculated z-index.*/
      has_backdrop: { // camel case / snake case?
        type: Boolean,
        default: true
      },
      /* Save button config */
      saveButton: {
        type: Object,
        default: () => ({})
      },
      /* Cancel button config */
      cancelButton: {
        type: Object,
        default: () => ({})
      },
      /*
      * Transition to use when showing the modal.
      * You need to include scss @innologica/vue-stackable-modal/src/assets/transitions/translate-fade.scss
      * */
      transition: { // transitionName?
        type: String,
        default: 'translate-fade'
      }
    },
    data () {
      return {
        backdrop: null,
        zIndex: 0,
        modals
      }
    },
    mounted () {
      if (this.show) {
        modals.count++
        this.zIndex = modals.count
        this.$emit('show', true, this.zIndex, modals.count)
      }

      this.checkBackdrop()

      document.addEventListener("keydown", this.handleEscape) // single quotes, double quotes
    },
    destroyed () {
      if (this.show) {
        modals.count--
        this.zIndex = modals.count
        // emit hide? having the same event for both would ask the user to have if-else in his handler
        this.$emit('show', false, this.zIndex, modals.count)
      }

      if (this.backdrop && this.show)
        document.body.removeChild(this.backdrop)
      if (modals.count === 0) {
        document.body.classList.remove('modal-open')
      }

      document.removeEventListener("keydown", this.handleEscape)
    },
    methods: {
      handleEscape (e) { // would be lovely it this can be toggled (sometimes there are other actions on esc key)
        if (this.show && e.keyCode === 27 && this.zIndex === this.totalModals) {
          this.$emit('close')
        }
      },
      mouseDown (event) {
        /**
         * If the backdrop was inside you wouldn't need to make this check.
         * Currently you require reference, and because you play around with backrop's z-index,
         * you are able to click around it.
         * 
         * What I would do is something along the lines of:
         * 
         * <!-- top level element, representing backdrop if needed -->
         * <div class="modal" @click="close">
         * 
         *   <!--
         *     this means if I click anywhere *inside* the box, the event is stopped,
         *     so the modal does not get automatically closed (as it's parent has this functionality)
         *   -->
         *   <div class="box" @click.stop>
         *     <div class="close-button" @click="close"> <!-- enable close handler on specific elements, like X button -->
         */
        if (this.$refs.modal === event.target) {
          this.$emit('close')
          event.preventDefault()
        }
      },
      checkBackdrop () {
        if (!this.has_backdrop)
          return

        if (this.show && this.zIndex === 1) {
          document.body.classList.add('modal-open')
        } else if (!this.show && this.zIndex === this.totalModals) {
          // enableScroll()
        }

        if (this.show) {
          // as mentioned above - completely isolated and not modifiable at all
          this.backdrop = document.createElement('div')
          this.backdrop.classList.add('modal-backdrop', 'fade', 'show')
          this.backdrop.style.zIndex = 1048 + this.zIndex * 2;
          document.body.appendChild(this.backdrop)
        } else {
          if (this.backdrop) {
            document.body.removeChild(this.backdrop)
            document.body.classList.remove('modal-open')
          }
        }
      }
    },
    computed: {
      totalModals () {
        //global static variable :)
        return modals.count
      },
      getStyle () {
        let style = {}
        if (this.show)
          style.display = 'block'
        style['z-index'] = 1048 + this.zIndex * 2 + 1
        return style
      },
      getClass () {
        let classes = {}
        // if (this.zIndex !== this.totalModals) {
          let idx = this.totalModals - this.zIndex
          classes['modal-stack-' + idx] = true
          classes['modal-order-' + this.zIndex] = true
        // }
        classes.aside = this.zIndex !== this.totalModals
        return {...classes, ...this.modalClass}
      },
      saveButtonOptions () { // this could go to data - nothing is actually able to change here, right?
        const saveButtonDefaults = {
          title: 'Save',
          visible: true,
          btnClass: {'btn btn-primary': true}
        }

        return {...saveButtonDefaults, ...this.saveButton}
      },
      cancelButtonOptions () { // same as the above, not actually computing anything
        const cancelButtonDefaults = {
          title: 'Cancel',
          visible: true,
          btnClass: {'btn btn-outline-secondary': true}
        }

        return {...cancelButtonDefaults, ...this.cancelButton}
      }
    },
    watch: {
      show (value) {
        value ? modals.count++ : modals.count--
        this.zIndex = modals.count
        this.$emit('show', value, this.zIndex, modals.count)

        if (!value && modals.count === 0) { // code duplication
          document.body.classList.remove('modal-open')
        }
        this.checkBackdrop()
      }
    }
  }
</script>

<style lang="scss" scoped>
    //stack modals effect
    $distance: 40px; /* distance between stacked modals*/
    $modal-translate-z: -60px; /* The first modal translateZ value*/

    @mixin transform($n) {
        transform: scale(0.9) /* rotateY(45deg) translateZ($translateZ)*/
        translate(- 2rem * $n, $n * -50px);
        transform-origin: top left;
        /*margin-top: (-$n - 3) * 1.75rem;*/
    }

    @mixin preserve-3d() {
        transform-style: preserve-3d;
    }

    .modal {
        .modal-dialog {
            .modal-content {
                transition: all 0.15s;
            }

            &.aside {
                @include preserve-3d();

                &.modal-stack-1 .modal-content {
                    @include transform(1);
                }

                &.modal-stack-2 .modal-content {
                    @include transform(2);
                }

                &.modal-stack-3 .modal-content {
                    @include transform(3);
                }
            }
        }
    }
</style>

<style lang="scss">
    .aside { // this is extremely risky, as it overrides the global scope and might lead to extreme problems :) at least scope down (nest)
        .modal-visible-aside {
            display: block;
        }

        .modal-invisible-aside {
            display: none;
        }
    }

    .modal-visible-aside {
        display: none;
    }

</style>