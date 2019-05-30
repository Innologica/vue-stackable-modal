<template>
    <transition :name="transition" appear>
        <div v-if="show" class="modal fade show" :style="getStyle" @mousedown="mouseDown" ref="modal">
            <div class="modal-dialog" role="document" :class="getClass">
                <div class="modal-content">
                    <slot name="modal-header">
                        <div class="modal-header" v-if="title">
                            <h5 class="modal-title">{{title}}</h5>
                            <a v-if="closeButton" class="close" aria-label="Close" @click.stop="$emit('close')">
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
                                    v-if="saveButton"
                                    type="button"
                                    @click="$emit('save')"
                                    :class="{ [saveButtonClass]: true,  loading: saving }"
                            >{{saveButtonTitle}}
                            </button>
                            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal"
                                    @click.stop="$emit('close')">{{closeButtonTitle}}
                            </button>
                        </div>
                    </slot>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
  let modalCount = 0

  export default {
    name: 'StackModal',
    props: {
      show: Boolean,
      title: String,
      modalClass: Object,
      has_backdrop: {
        type: Boolean,
        default: true
      },
      closeButton: {
        type: Boolean,
        default: true
      },
      closeButtonTitle: {
        type: String,
        default: 'Close'
      },
      saveButton: {
        type: Boolean,
        default: true
      },
      saveButtonClass: {
        type: String,
        default: 'btn btn-primary'
      },
      saveButtonTitle: {
        type: String,
        default: 'Save'
      },
      saving: {
        type: Boolean,
        default: false,
      },
      transition: {
        type: String,
        default: 'translate-fade'
      }
    },
    data () {
      return {
        backdrop: null,
        add_class: false,
        zIndex: 0,
        totalModals: 0,
      }
    },
    mounted () {
      if (this.show) {
        modalCount++
        // console.log('mounted shown', modalCount)
        this.zIndex = modalCount
      }
      // this.$bus.$on('modal-count', (val) => {
      //   this.totalModals = val
      // })

      this.checkBackdrop()
      // this.show ? disableScroll() : enableScroll()

      document.addEventListener("keydown", this.handleEscape)
    },
    destroyed () {
      if (this.show) {
        modalCount--
        this.zIndex = modalCount
        // console.log('destroyed', modalCount)
      }

      // this.$bus.$emit('modal-count', modalCount)

      if (this.backdrop && this.show)
        document.body.removeChild(this.backdrop)
      // enableScroll()
      if (/*this.add_class && */modalCount === 0) {
        document.body.classList.remove('modal-open')
        // enableScroll()
      }

      document.removeEventListener("keydown", this.handleEscape)
    },
    methods: {
      handleEscape (e) {
        if (this.show && e.keyCode === 27 && this.zIndex === modalCount) {
          this.$emit('close')
        }
      },
      mouseDown (event) {
        // console.log(event)
        if (this.$refs.modal === event.target) {
          // console.log('close')
          this.$emit('close')
          event.preventDefault()
        }
      },
      checkBackdrop () {
        if (this.show && this.zIndex === 1) {
          // disableScroll()
        } else if (!this.show && this.zIndex === modalCount) {
          // enableScroll()
        }

        if (!this.has_backdrop)
          return

        // console.log(modalCount)

        if (this.show) {
          this.backdrop = document.createElement('div')
          this.backdrop.classList.add('modal-backdrop', 'fade', 'show')
          // if(modalCount > 0)
          this.backdrop.style.zIndex = 1048 + this.zIndex * 2;
          document.body.appendChild(this.backdrop)
          this.add_class = true
        } else {
          if (this.backdrop) {
            document.body.removeChild(this.backdrop)
            document.body.classList.remove('modal-open')
            this.add_class = false
          }
        }
      }
    },
    computed: {
      getStyle () {
        let style = {}
        if (this.show)
          style.display = 'block'
        style['z-index'] = 1048 + this.zIndex * 2 + 1
        return style
      },
      getClass () {
        let classes = {}
        if (this.zIndex !== this.totalModals) {
          let idx =  - this.zIndex + this.totalModals
          classes['modal-stack-' + idx] = true
        }
        classes.aside = this.zIndex !== this.totalModals
        // console.log(classes)
        return {...classes, ...this.modalClass}
      }
    },
    watch: {
      show (value) {
        value ? modalCount++ : modalCount--
        this.zIndex = modalCount

        if (!value && modalCount === 0) {
          document.body.classList.remove('modal-open')
        }
        this.checkBackdrop()
      },
      zIndex (value) {
        // this.$bus.$emit('modal-count', value)
      }
    }
  }
</script>

<style lang="scss" scoped>
    //stack modals effect
    $distance: 40px; /* distance between stacked modals*/
    $modal-translate-z: -60px; /* The first modal translateZ value*/

    @mixin transform($n) {
        transform: scale(0.9) /* rotateY(45deg) translateZ($translateZ)*/ translate(- 2rem * $n, $n * -50px);
        transform-origin: top left;
        /*margin-top: (-$n - 3) * 1.75rem;*/
    }

    @mixin preserve-3d() {
        transform-style: preserve-3d;
    }

    .container {
        margin: 5em auto;
    }

    .modal {
        .modal-dialog {
            .modal-content {
                transition: all 0.15s;
            }

            &.aside {
                /*@include transform($modal-translate-z);*/
                @include preserve-3d();

                &.modal-stack-2 .modal-content{
                    @include transform(1);
                }
                &.modal-stack-3 .modal-content{
                    @include transform(2);
                }
                &.modal-stack-4 .modal-content{
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