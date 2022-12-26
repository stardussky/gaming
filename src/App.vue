<script setup>
import liff from "@line/liff";
import { onMounted } from "vue";

onMounted(() => {
  liff
    .init({
      liffId: "",
    })
    .then(() => {
      console.log("LIFF init succeeded.");
    })
    .catch((e) => {
      console.log(`LIFF init failed. ${e}`);
    });
});
</script>

<template>
  <router-view />
</template>

<style lang="scss">

</style>
