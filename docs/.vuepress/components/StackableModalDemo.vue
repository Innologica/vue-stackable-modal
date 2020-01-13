<template>
    <div class="py-4">
        <p>I have added some demo css classes in order to demonstrate some of the possibilities of the component - <a href="#sample-css">source here</a> </p>
        <div class="d-flex">
            <div>
                <button class="btn btn-primary" @click="show=true">Open modal</button>
            </div>
            <div class="d-flex align-items-center mx-3">
                <label>Modal class</label>
            </div>
            <div class="d-flex align-items-center">
                <select v-model="modalClass" class="form-control">
                    <option value="">none</option>
                    <option value="modal-fullscreen">modal-fullscreen</option>
                    <option value="modal-xl">modal-xl</option>
                    <option value="modal-xxl">modal-xxl</option>
                    <option value="modal-90per">modal-90per</option>
                    <option value="modal-border-0">modal-border-0</option>
                </select>
            </div>
        </div>

        <stack-modal
                :show="show"
                title="Modal #1"
                @close="show=false"
                :modal-class="{ [modalClass]: true }"
        >
            <button class="btn btn-info" @click="show_second=true">Open modal 2</button>
        </stack-modal>

        <stack-modal
                :show="show_second"
                @close="show_second=false"
        >
            <p>I have no title so the modal-header is missing.</p>

            <button class="btn btn-warning" @click="show_third=true">Open modal 3</button>
        </stack-modal>

        <stack-modal
                :show="show_third"
                @close="show_third=false"
                title="Last modal"
                :close-on-escape="false"
        >
            <p>This is the last modal. This modal has closeOnEscape set to false so you cannot close it via ESC key.</p>
        </stack-modal>

    </div>
</template>

<script>
  import StackModal from '../../../src/components/StackModal'

  export default {
    name: "StackableModalDemo",
    components: {StackModal},
    data () {
      return {
        show: false,
        show_second: false,
        show_third: false,
        modalClass: ''
      }
    },
  }
</script>

<style>
    @import "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css";
</style>

<style lang="scss">
    @import "../../../src/assets/transitions/translate-fade.scss";
    @import "../../../src/assets/modal";
</style>