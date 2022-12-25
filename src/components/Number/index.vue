<script setup>
import { computed } from "vue";

const props = defineProps({
  type: {
    type: String,
    default: "num",
  },
  number: {
    type: String,
    default: null,
  },
});

const numberImages = computed(() => {
  if (!props.number) return [];
  return props.number.split("").map((n) => new URL(`../../assets/${props.type}/${n}.png`, import.meta.url).href);
});
</script>

<template>
  <div class="numbers">
    <img
      v-for="(num, i) in numberImages"
      :key="i"
      :src="num"
    >
  </div>
</template>

<style lang="scss" scoped>
.numbers {
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
  }
}
</style>
