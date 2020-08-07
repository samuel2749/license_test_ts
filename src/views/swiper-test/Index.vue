<template lang="pug">
    swiper(ref='mySwiper' :options='swiperOptions')
        swiper-slide Slide 1
        swiper-slide Slide 2
        swiper-slide Slide 3
        swiper-slide Slide 4
        swiper-slide Slide 5
        .swiper-pagination(slot='pagination')
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import 'swiper/swiper-bundle.css';
@Component({
    components: {
        Swiper,
        SwiperSlide
    }
})
export default class SwiperTest extends Vue {
    swiperOptions = {
        pagination: {
            el: '.swiper-pagination'
        }
        // Some Swiper option/callback...
    };
}
</script>
<style lang="scss"></style>
