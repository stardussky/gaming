<script setup>
import { ref, computed } from "vue";
import data from "./data";

const stage = ref(2);

const stageData = computed(() => data[stage.value]);

</script>

<template>
  <div class="puzzle">
    <div class="puzzle__main">
      <div
        class="puzzle__gaming"
        :class="`stage-${stage + 1}`"
      >
        <img
          src="@/assets/puzzle/bg.png"
          alt="bg"
        >
        <div class="puzzle__gaming-time">
          <img
            src="@/assets/puzzle/time.png"
            alt="time"
          >
        </div>
        <div
          class="puzzle__gaming-main"
        >
          <div class="puzzle__gaming-answer">
            <img
              :src="stageData.answerUrl"
              alt="answer"
            >
          </div>
          <div class="puzzle__gaming-question">
            <div
              v-for="question in stageData.questions"
              :key="question.id"
              class="puzzle__gaming-question-item"
            >
              <img
                :src="question.url"
                alt="question"
              >
              <img
                class="-active"
                :src="question.activeUrl"
                alt="question"
              >
            </div>
            <div
              class="puzzle__button"
            >
              <img
                src="@/assets/puzzle/button-submit.png"
                alt="button"
              >
            </div>
          </div>
        </div>
      </div>
      <!-- <div
        class="puzzle__intro"
      >
        <img
          src="@/assets/puzzle/intro-bg.png"
          alt="bg"
        >
        <div
          class="puzzle__button"
        >
          <img
            src="@/assets/puzzle/button-start.png"
            alt="button"
          >
        </div>
      </div> -->
      <!-- <div class="puzzle__failure">
        <img
          src="@/assets/puzzle/failure-bg.png"
          alt="bg"
        >
        <div
          class="puzzle__button"
        >
          <img
            src="@/assets/puzzle/button-restart.png"
            alt="button"
          >
        </div>
      </div> -->
      <!-- <div
        class="puzzle__success"
      >
        <img
          src="@/assets/puzzle/success-bg.png"
          alt="bg"
        >
        <div class="puzzle__success-main">
          <img
            src="@/assets/puzzle/line-bg.png"
            alt="bg"
          >
          <div
            class="puzzle__button"
          >
            <img
              src="@/assets/puzzle/button-ok.png"
              alt="button"
            >
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<style lang="scss">
.puzzle {
  @include aspect(1728 / 1080);

  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 1080px;

  > * {
    @include size(100%);

    position: absolute;
    top: 0;
    left: 0;
  }

  &__intro {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    img {
      width: 100%;
    }
  }

  &__button {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 80%;
    transform: translate(-50%, 0);
    cursor: pointer;

    img {
      width: 100%;
    }
  }

  &__gaming {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    img {
      width: 100%;
    }

    &-time {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, 0);
      width: 40%;
    }

    &-answer {
      position: absolute;
      top: 10%;
      left: 50%;
      transform: translate(-50%, 0);
    }

    &-question {
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 80%;
      transform: translate(-50%, 0);

      .puzzle__button {
        position: relative;
        width: 70%;
      }

      .puzzle__gaming.stage-1 & {
        display: flex;
        flex-direction: column;

        .puzzle__gaming-question-item {
          width: 60%;

          &:nth-of-type(2) {
            align-self: flex-end;
          }
        }
      }

      .puzzle__gaming.stage-2 & {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .puzzle__gaming-question-item {
          width: 35%;
        }
      }

      .puzzle__gaming.stage-3 & {
        display: flex;
        flex-wrap: wrap;

        .puzzle__gaming-question-item {
          width: 33.33%;

          img {
            width: 60%;
          }
        }
      }

      &-item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        .-active {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }

  &__failure {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    img {
      width: 100%;
    }
  }

  &__success {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    > img {
      position: relative;
      width: 100%;
    }

    &-main {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;

      .puzzle__button {
        bottom: 7%;
        width: 50%;
      }

      > img {
        position: relative;
        width: 100%;
      }
    }
  }
}
</style>
