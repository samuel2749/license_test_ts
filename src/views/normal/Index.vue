<template lang="pug">
    .text-center(v-if="!list.length")
        button.btn.btn-primary(disabled)
            span.spinner-border.spinner-border-sm(role="status" aria-hidden="true")
            |Loading...
    .pm.container-fluid(v-else)
        template(v-if="type == 'step1'")
            h1.text-center {{title}}
            .row.h5 選擇題數：
                button.btn.btn-sm.btn-success(@click="onAllTest") 全部
            .form-row.form-inline.mb-2
                .form-group.col-3
                    input.form-control.col(type="tel" v-model.number="startNum")
                .form-group.col-1 到
                .form-group.col-3
                    input.form-control.col(type="tel" v-model.number="endNum")
            .row.h5 模式：
            .form-row.form-inline.mb-2
                .custom-control.custom-radio.custom-control-inline.mr-5
                    input.custom-control-input(type="radio" id="radio-read" name="mode" value="read" v-model="modeType")
                    label.custom-control-label(for="radio-read") 閱讀
                .custom-control.custom-radio.custom-control-inline
                    input.custom-control-input(type="radio" id="radio-test" name="mode" value="test" v-model="modeType")
                    label.custom-control-label(for="radio-test") 測試
            .row.h5 測驗題數：
            .form-row.form-inline(:class="{'form-uncontrol': !isTest}")
                .custom-control.custom-radio.custom-control-inline
                    input.custom-control-input(type="radio" id="radio-all" name="testTotal" value="all" v-model="countType")
                    label.custom-control-label(for="radio-all") 全部
                .col-8.form-inline
                    .custom-control.custom-radio.custom-control-inline
                        input.custom-control-input(type="radio" id="radio-num" name="testTotal" value="limit" v-model="countType")
                        label.custom-control-label(for="radio-num") 題數
                    input.form-control.col-5(type="tel" v-model.number="qNum" :disabled="countType=='all'")
            button.btn.btn-lg.btn-success.my-3(:class="{'btn-block': isMobile}" @click.prevent="onTest") {{startBtnValue}}
        template(v-else-if="type == 'step2'")
            .row
                .h5 {{title}}：
                    button.btn.btn-sm.btn-secondary.ml-2(@click="onBack") 返回
            Practice(v-if="isTest" :questions="testQuestions" :callback="onBack" :total="total")
            Reading(v-else :questions="testQuestions" :callback="onBack")
</template>
<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
import axio from 'axios';
import Practice from '@/components/practice/Index.vue';
import Reading from '@/components/reading/Index.vue';
import QuestionBank from '@/constants/QuestionBank';
import QuestionModel from '@/models/QuestionModel';
import { State, namespace } from 'vuex-class';
const someModule = namespace('test');
@Component({
    components: {
        Practice,
        Reading
    }
})
export default class Normal extends Vue {
    private title = '';
    private list: QuestionModel[] = [];
    private testQuestions: QuestionModel[] = [];
    private type = 'step1';
    private startNum = 1;
    private endNum = 50;
    private countType = 'all';
    private modeType = 'test';
    private qNum = 50;
    private total = 0;
    private test!: Function;
    @Watch('$route', { immediate: true, deep: true })
    onRouteChange() {
        this.checkTestType();
    }
    @State('name') name!: string;
    @someModule.State('menulist') menulist!: [];
    @someModule.Action('saveMenuListFN') saveMenuListFN!: Function;
    @someModule.Action('setName') setName!: Function;
    private get isMobile(): boolean {
        return this.$store.state.isMobile;
    }
    private get isTest(): boolean {
        return this.modeType === 'test';
    }
    private get startBtnValue(): string {
        return this.isTest ? '開始測試' : '開始閱讀';
    }
    private checkTestType() {
        const qb = new QuestionBank(this.$route.params.type);
        if (!qb.title) {
            window.alert('目前沒有該測驗資料，請重新選取！');
            this.$router.push('/');
            return;
        }
        this.title = qb.title;
        this.getJson(qb.jsonPath);
    }
    private getJson(path: string) {
        axio.get(`/json/${path}`).then(response => {
            this.list = [...response.data[0]];
            this.onBack();
        });
    }
    private onAllTest() {
        this.startNum = 1;
        this.endNum = this.list.length;
        this.saveMenuListFN(['123', 456]);
        console.log(this.menulist);
        console.log(this.name);
        this.setName('samuel');
        console.log(this.name);
    }
    private onTest() {
        let qTotal = 0;
        const msg = `數字需介於1~${this.list.length}`;
        if (this.startNum < 1 || this.startNum > this.list.length) {
            window.alert(`開始${msg}}`);
            return;
        }
        if (this.endNum < 1 || this.endNum > this.list.length) {
            window.alert(`結束${msg}}`);
            return;
        }
        this.testQuestions = [];
        for (let tempNum = this.startNum; tempNum <= this.endNum; tempNum++) {
            qTotal += 1;
            this.testQuestions.push(this.list[tempNum - 1]);
        }
        if (this.countType === 'all') {
            this.total = qTotal;
        } else if (this.countType === 'limit') {
            if (this.qNum < 10) {
                window.alert('測試題數必須大於10');
                return;
            }
            if (this.qNum > qTotal) {
                window.alert(`測試題數必須小於${qTotal}`);
                return;
            }
            this.total = this.qNum;
        }
        this.type = 'step2';
    }
    private onBack() {
        this.type = 'step1';
    }
}
</script>
<style lang="scss">
.form-uncontrol {
    position: relative;
    opacity: 0.5;
    &::after {
        content: '';
        position: absolute;
        display: block;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
    }
}
</style>
