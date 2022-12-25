<script setup>
import {
  ref, computed, watch, onBeforeUnmount
} from "vue";

const props = defineProps({
  fps: {
    type: Number,
    default: 24,
  },
  images: {
    type: Array,
    default: () => [],
  },
  repeat: {
    type: Boolean,
    default: false,
  },
  autoPlay: {
    type: Boolean,
    default: false,
  },
});

const animate = ref();
const imageLoadedNumber = ref(0);

const imageElements = ref([]);
let index = 0;
let reqId = null;
let now;
let then = Date.now();
const interval = 1000 / props.fps;

const imagesLoaded = computed(() => imageLoadedNumber.value === props.images.length);

const stop = () => {
  window.cancelAnimationFrame(reqId);
};

const render = () => {
  reqId = window.requestAnimationFrame(render);

  now = Date.now();
  const delta = now - then;

  if (delta > interval) {
    then = now - (delta % interval);

    if (imageElements.value.length) {
      imageElements.value?.[index]?.classList?.remove?.("-active");

      index = (index - 1 + props.images.length) % props.images.length;

      imageElements.value?.[index]?.classList?.add("-active");

      if (!props.repeat && index === 0) {
        stop();
      }
    }
  }
};

const start = () => {
  render();
};

watch(() => imagesLoaded.value, (value) => {
  if (value) {
    if (props.autoPlay) {
      start();
    }
  }
});

const imageLoadHandler = () => {
  imageLoadedNumber.value += 1;
};

const imageErrorHandler = () => {
  imageLoadedNumber.value += 1;
};

onBeforeUnmount(() => {
  stop();
});

defineExpose({
  stop,
  start,
});
</script>

<template>
  <div
    ref="animate"
    class="animate"
  >
    <img
      v-for="img in images"
      ref="imageElements"
      :key="img"
      :src="img"
      @load="imageLoadHandler"
      @error="imageErrorHandler"
    >
  </div>
</template>

<style lang="scss">
.animate {
  @include size(100%);

  img {
    @include size(100%);

    position: absolute;
    top: 0;
    left: 0;
    display: none;
    pointer-events: none;

    &.-active {
      display: block;
    }
  }
}
</style>
