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
      has_backdrop: {
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
      transition: {
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

      document.addEventListener("keydown", this.handleEscape)
    },
    destroyed () {
      if (this.show) {
        modals.count--
        this.zIndex = modals.count
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
      handleEscape (e) {
        if (this.show && e.keyCode === 27 && this.zIndex === this.totalModals) {
          this.$emit('close')
        }
      },
      mouseDown (event) {
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
      saveButtonOptions () {
        const saveButtonDefaults = {
          title: 'Save',
          visible: true,
          btnClass: {'btn btn-primary': true}
        }

        return {...saveButtonDefaults, ...this.saveButton}
      },
      cancelButtonOptions () {
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

        if (!value && modals.count === 0) {
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
    .aside {
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