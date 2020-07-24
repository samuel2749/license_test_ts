<template lang="pug">
	.reading.container
		.card.row.mb-3.border-primary(v-for="(item, index) in questions" :key="`q-${index}`")
			.card-header
				.row(:class="titleFontSize")
					.font-weight-bold.col-6 {{index + 1}}:
					.col-6.text-right
						button.btn-secondary(@click="gotoTop") TOP
			.card-body
				.card-title.text-primary.font-weight-bold(:class="titleFontSize") {{item.question}}
				.text-center(v-if="item.img")
					img(:src="`./images/${item.img}`" class="img-fluid")
				p.card-text(
					v-for="(option, optionIndex) in item.option"
					:key="`option-${optionIndex}`"
					:class="getOtherClass(item.answer, optionIndex)"
					)
						span {{optionIndex+1}}：
						span(v-html="option")
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import VueScrollTo from 'vue-scrollto';
import QuestionModel from '@/models/QuestionModel';

@Component
export default class extends Vue {
    @Prop()
    private questions!: QuestionModel[][];
    private get isMobile() {
        return this.$store.state.isMobile;
    }
    private get titleFontSize(): string {
        return !this.isMobile ? 'h3' : 'h5';
    }
    private gotoTop() {
        VueScrollTo.scrollTo('body', 500, { easing: 'linear' });
    }
    private getOtherClass(
        arr: string[],
        index: number
    ): Record<string, boolean> {
        const classObj = {
            h5: !this.isMobile,
            'bg-info': false,
            'text-white': false
        };
        if (arr.indexOf(String(index + 1)) > -1) {
            classObj['bg-info'] = true;
            classObj['text-white'] = true;
        }
        return classObj;
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
