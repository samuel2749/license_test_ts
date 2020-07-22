<template lang="pug">
    
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class HelloWorld extends Vue {
    @Prop() private questions!: Array<object>;
    @Prop() private total!: number;
    @Prop() private callback!: Function;
    private qNum = 0;
    private name = '';
}
</script>
<style lang="scss">
.practice {
    .custom-control {
        .custom-style-label {
            &::before,
            &::after {
                top: 10px;
            }
        }
    }
    .btn {
        margin-top: 20px;
    }
}
</style>
