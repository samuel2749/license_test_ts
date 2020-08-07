<template lang="pug">
    .practice.container(v-if="isStart")
        .row
            .col-12.custom-control(v-for="(item, index) in nowQuestion.option" :key="`option${index}`" :class="optionClass")
                input.custom-control-input(
                    v-if="isRadio"
                    type="radio" 
                    name="radio"
                    :id="`answer${index}`" 
                    :value="String(index + 1)" 
                    v-model="answer" 
                    :disabled="!isQuestion")
                input.custom-control-input(
                    v-else
                    type="checkbox"
                    :id="`answer${index}`" 
                    :value="String(index + 1)" 
                    v-model="answers" 
                    :disabled="!isQuestion")
                label.custom-control-label.p-1.custom-style-label(:for="`answer${index}`" :class="getOptionOtherClass(String(index + 1))")
                    span(v-html="item")
                .clearfix
        .row
            button.btn.btn-lg.btn-success(:class="{'btn-block': isMobile}" @click.prevent="checkAnswer" v-if="isQuestion") 確認
            button.btn.btn-lg.btn-info(:class="{'btn-block': isMobile}" @click.prevent="nextQuestion" v-else) {{!isEnd? '下一題': '看結果'}}
    .practice.container(v-else)
        .row
            .h3 總題數 {{total}}
            .h3.text-success 答對 {{correctCount}} 題
            .h3.text-danger 答錯 {{total - correctCount}} 題
        .row
            button.btn.btn-lg.btn-success(:class="{'btn-block': isMobile}" @click.prevent="randomTestList") 再測試一次
            button.btn.btn-lg.btn-success(:class="{'btn-block': isMobile, 'ml-2': !isMobile}" @click.prevent="callback") 返回
        .row.mt-3
            .h3 錯誤題目
            .col-12.mb-1
                span.bg-info.text-white.ml-3.h5 正確答案
                span.text-danger.ml-3.h5 選擇的答案
            .container-fluid
                .card.row.mb-3.border-primary(v-for="(item, index) in reviewQuestions" :key="`rewivew-q-${index}`")
                    .card-body
                        .card-title.text-primary.font-weight-bold(:class="titleFontSize") {{item.question}}
                        .text-center(v-if="item.img")
                            img(:src="`./images/${item.img}`" class="img-fluid")
                        p.card-text(
                            v-for="(option, optionIndex) in item.option"
                            :key="`option-${optionIndex}`"
                            :class="getOtherClass(optionIndex, item.answer, item.wrongAnswer)"
                            )
                                span {{optionIndex+1}}：
                                span(v-html="option")
                .text-right
                    button.btn-secondary(@click="gotoTop") TOP
</template>
<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import { random } from 'lodash';
import VueScrollTo from 'vue-scrollto';
import QuestionModel from '@/models/QuestionModel';
import ReviewQuestionModel from '@/models/ReviewQuestionModel';

@Component
export default class Practice extends Vue {
    @Prop()
    private questions!: QuestionModel[][];
    @Prop() private total!: number;
    @Prop() private callback!: Function;
    private qNum = 0;
    private testLists: QuestionModel[] = [];
    private answer = '';
    private answers: string[] = [];
    private reviewQuestions: ReviewQuestionModel[] = [];
    private nowQuestion: QuestionModel = new QuestionModel();
    private type = 'ans';
    private isStart = false;
    private isCorrect = false;
    private correctCount = 0;
    @Watch('questions', { immediate: true })
    private questionsChange(newValue: QuestionModel[][]) {
        newValue.length > 0 && this.randomTestList();
    }
    private get isMobile(): boolean {
        return this.$store.state.isMobile;
    }
    private get titleFontSize(): string {
        return !this.isMobile ? 'h3' : 'h5';
    }
    private get optionClass(): Record<string, boolean> {
        const classes = {
            h4: !this.isMobile,
            h6: this.isMobile,
            'custom-radio': this.isRadio,
            'custom-checkbox': !this.isRadio
        };
        return classes;
    }
    private get isEnd(): boolean {
        return this.testLists.length === 0;
    }
    private get isQuestion(): boolean {
        return this.type === 'question';
    }
    private get isRadio(): boolean {
        return this.nowQuestion.answer.length === 1;
    }
    private randomTestList(): void {
        const tempArr: number[] = [];
        while (tempArr.length < this.questions.length) {
            tempArr.push(tempArr.length);
        }
        while (this.testLists.length < this.total) {
            const index = random(tempArr.length - 1);
            this.testLists.push(
                Object.assign(
                    new QuestionModel(),
                    this.questions[tempArr[index]]
                )
            );
            tempArr.splice(index, 1);
        }
        this.correctCount = 0;
        this.qNum = 0;
        this.isStart = true;
        this.reviewQuestions = [];
        this.nextQuestion();
    }
    private nextQuestion(): void {
        this.gotoTop();
        if (this.isEnd) {
            this.isStart = false;
            return;
        }
        this.answer = '';
        this.answers = [];
        this.nowQuestion = Object.assign(
            new QuestionModel(),
            this.testLists.shift()
        );
        this.qNum += 1;
        this.type = 'question';
    }
    private checkAnswer(): void {
        this.isCorrect = false;
        if (this.isRadio) {
            if (this.answer === this.nowQuestion.answer[0]) {
                this.isCorrect = true;
            }
        } else {
            let bol = this.answers.length === this.nowQuestion.answer.length;
            bol &&
                this.answers.forEach(item => {
                    if (this.nowQuestion.answer.indexOf(item) === -1) {
                        bol = false;
                    }
                });
            if (bol) {
                this.isCorrect = true;
            }
        }
        if (this.isCorrect) {
            this.correctCount += 1;
        } else {
            this.reviewQuestions.push(
                Object.assign(
                    new ReviewQuestionModel(this.answers),
                    this.nowQuestion
                )
            );
        }
        this.type = 'answer';
    }
    private gotoTop(): void {
        VueScrollTo.scrollTo('body', 500, { easing: 'linear' });
    }
    private getOptionOtherClass(pStr: ''): Record<string, boolean> | boolean {
        if (!this.isQuestion && this.nowQuestion.answer.indexOf(pStr) > -1) {
            const isCorrect = this.isRadio
                ? this.answer === pStr
                : this.answers.indexOf(pStr) > -1;
            const cssObj = {
                'text-white': true,
                'bg-success': isCorrect,
                'bg-danger': !isCorrect
            };
            return cssObj;
        } else {
            return false;
        }
    }
    private getOtherClass(
        index: 0,
        arr: string[],
        wrongArr: string[]
    ): Record<string, boolean> {
        const classObj = {
            h5: !this.isMobile,
            'bg-info': false,
            'text-white': false,
            'text-danger': false
        };
        if (arr.indexOf(index + 1 + '') > -1) {
            classObj['bg-info'] = true;
            classObj['text-white'] = true;
        }
        if (wrongArr.indexOf(index + 1 + '') > -1) {
            classObj['text-danger'] = true;
        }
        return classObj;
    }
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
