<template lang="pug">
	.text-center(v-if="!pmData.length")
		button.btn.btn-primary(disabled)
			span.spinner-border.spinner-border-sm(role="status" aria-hidden="true")
			|Loading...
	.pm.container-fluid(v-else)
		template(v-if="type == 'step1'")
			h1.text-center 專案管理
			.row.h5 選擇章節：
				button.btn.btn-sm.btn-success(@click="onAllTest") 全部
			.row.custom-control.custom-checkbox.form-control-lg(v-for="(item, index) in pmData" :key="`question${index}`")
				input.custom-control-input(type="checkbox" :id="`q${index}`" :value="index" v-model="questions")
				label.custom-control-label(:for="`q${index}`") {{`0${index + 1} ${item.length}題`}}
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
					input.form-control.col-5(type="tel" v-model="qNum" :disabled="countType=='all'")
			button.btn.btn-lg.btn-success.my-3(:class="{'btn-block': isMobile}" @click.prevent="onTest") {{startBtnValue}}
		template(v-else-if="type == 'step2'")
			.row
				.h5 專案管理：
					button.btn.btn-sm.btn-secondary.ml-2(@click="onBack") 返回
			Practice(v-if="isTest" :questions="testQuestions" :callback="onBack" :total="total")
			Reading(v-else :questions="testQuestions" :callback="onBack")
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axio from 'axios';
import Practice from '@/components/practice/Index.vue';
import Reading from '@/components/reading/Index.vue';
import QuestionModel from '@/models/QuestionModel';

@Component({
    components: {
        Practice,
        Reading
    }
})
export default class extends Vue {
    private pmData: QuestionModel[][] = [[]];
    private questions: number[] = [];
    private testQuestions: QuestionModel[] = [];
    private type = 'step1';
    private countType = 'al;l';
    private modeType = 'test';
    private qNum = 50;
    private total = 0;
    private get isMobile(): boolean {
        return this.$store.state.isMobile;
    }
    private get isTest(): boolean {
        return this.modeType === 'test';
    }
    private get startBtnValue(): string {
        return this.isTest ? '開始測試' : '開始閱讀';
    }
    private get questionTotal(): number {
        let total = 0;
        this.questions.forEach(index => {
            total += this.pmData[index].length;
        });
        return total;
    }
    public mounted() {
        axio.get('/json/pm.json').then(response => {
            this.pmData = [...response.data];
        });
    }
    private onAllTest() {
        this.questions = [];
        this.pmData.forEach((item, index) => {
            this.questions.push(index);
        });
    }
    private onTest() {
        let qTotal = 0;
        this.testQuestions = [];
        if (this.questions.length === 0) {
            window.alert('請選擇章節!');
            return;
        }
        this.questions.forEach(index => {
            const qArr = this.pmData[index];
            this.testQuestions = this.testQuestions.concat(qArr);
            qTotal += qArr.length;
        });
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
