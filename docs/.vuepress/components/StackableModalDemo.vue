<template>
    <div>
        Modal demo

        <button @click="show=true">Open</button>

        <stack-modal
                :show="show"
                title="Modal 1"
                @close="show=false"
        >
            <button @click="show_second=true">Open</button>
        </stack-modal>

        <stack-modal
                :show="show_second"
                @close="show_second=false"
                title="Modal 2"
        >
            <button @click="show_third=true">Open</button>
        </stack-modal>

        <stack-modal
                :show="show_third"
                @close="show_third=false"
                title="Modal 3"
        >
            <button @click="show_third=true">Open</button>
        </stack-modal>

    </div>
</template>

<script>
  import StackModal from '../../../src/components/StackModal'

  export default {
    name: "StackableModalDemo",
    components: { StackModal },
    data () {
      return {
        show: false,
        show_second: false,
        show_third: false,
      }
    },
  }
</script>

<style>
    @import "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css";
</style>

<style lang="scss">
    @import "../../../src/assets/transitions/translate-fade.scss";
</style>