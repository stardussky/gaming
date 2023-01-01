<script setup>
import {
  ref, computed, watch, onMounted, onBeforeUnmount
} from "vue";
import liff from "@line/liff";
import axios from "@/libs/axios";
import data from "./data";

const failureBg = new URL("../../assets/puzzle/failure-bg.png", import.meta.url).href;
const errorBg = new URL("../../assets/puzzle/error-bg.png", import.meta.url).href;

let startTimer;
let timer;
const START_TIME = 5000;
const TIME = 20000;

const userProfile = ref(null);
const isStart = ref(false);
const isStarted = ref(false);
const startCountdownTime = ref(START_TIME);
const countdownTime = ref(TIME);
const isFailure = ref(false);
const isEnded = ref(false);
const stage = ref(0);
const stageAnswers = ref(new Set());

const stageData = computed(() => data[stage.value]);

const endGame = (failure = false) => {
  window.clearInterval(startTimer);
  window.clearTimeout(timer);
  isStarted.value = false;
  isFailure.value = failure;
  isEnded.value = true;
};

watch(
  [() => isStarted.value, () => stage.value],
  ([isStarted, stage], [prevIsStart, prevStage]) => {
    if (isStarted) {
      window.clearTimeout(timer);
      if (stage !== prevStage) {
        countdownTime.value = TIME;
        stageAnswers.value = new Set();
      }

      const startStage = () => {
        timer = window.setTimeout(() => {
          if (countdownTime.value > 0) {
            countdownTime.value -= 1000;
            startStage();
            return;
          }
          endGame(true);
        }, 1000);
      };

      startStage();
    }
  }
);

const startGame = () => {
  if (!userProfile.value) return;

  isStart.value = true;
  isStarted.value = false;
  startCountdownTime.value = START_TIME;
  isFailure.value = false;
  isEnded.value = false;
  stageAnswers.value = new Set();
  if (countdownTime.value === 0) {
    countdownTime.value = TIME;
    stage.value = 0;
    window.clearInterval(startTimer);
    startTimer = window.setInterval(() => {
      startCountdownTime.value -= 1000;
      if (startCountdownTime.value < 1000) {
        isStarted.value = true;
        window.clearInterval(startTimer);
      }
    }, 600);
  } else {
    isStarted.value = true;
  }
};

const submitHandler = () => {
  if (stageData.value.answers.length !== stageAnswers.value.size) {
    endGame(true);
    return;
  }
  for (const answer of stageData.value.answers) {
    if (!stageAnswers.value.has(answer)) {
      endGame(true);
      return;
    }
  }
  if (stage.value < data.length - 1) {
    stage.value += 1;
    return;
  }
  endGame();
};

const submitLineHandler = async () => {
  try {
    const { data: result } = await axios({
      method: "post",
      url: "api/complete",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        userId: userProfile.value.userId,
        gameId: 1,
      },
    });
    window.location.replace("https://liff.line.me/1656724231-RoLkdxzg");
  } catch (e) {
    console.log(e);
  }
};

onMounted(async () => {
  try {
    await liff.init({
      liffId: "1656724231-XRYzO2rR",
    });
    console.log("LIFF init succeeded.");

    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }
    const profile = await liff.getProfile();
    const { data: isRegisteredData } = await axios.get(`api/isRegistered?userId=${profile.userId}`);
    if (!isRegisteredData.isRegistered) {
      console.log("尚未報到");
      window.location.replace("https://liff.line.me/1656724231-24JNLoOE");
      return;
    }
    userProfile.value = profile;
  } catch (e) {
    console.log(`LIFF init failed. ${e}`);
  }
});

onBeforeUnmount(() => {
  endGame();
});

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
          <Number :number="(countdownTime / 1000).toString()" />
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
              @click="stageAnswers.has(question.id)
                ? stageAnswers.delete(question.id)
                : stageAnswers.add(question.id)"
            >
              <img
                :src="question.url"
                alt="question"
              >
              <img
                :class="{
                  '-active': stageAnswers.has(question.id)
                }"
                :src="question.activeUrl"
                alt="question"
              >
            </div>
            <div
              class="puzzle__button"
              @click="submitHandler"
            >
              <img
                src="@/assets/puzzle/button-submit.png"
                alt="button"
              >
            </div>
          </div>
        </div>
      </div>
      <div
        v-show="!isStart"
        class="puzzle__intro"
      >
        <img
          src="@/assets/puzzle/intro-bg.png"
          alt="bg"
        >
        <div
          class="puzzle__button"
          @click="startGame"
        >
          <img
            src="@/assets/puzzle/button-start.png"
            alt="button"
          >
        </div>
      </div>
      <div
        v-show="!isEnded && !isStarted && isStart"
        class="puzzle__countdown"
      >
        <Number
          type="num-3"
          :number="(startCountdownTime / 1000).toString()"
        />
      </div>
      <div
        v-show="isEnded && isFailure"
        class="puzzle__failure"
      >
        <img
          :src="countdownTime === 0
            ? failureBg
            : errorBg"
          alt="bg"
        >
        <div
          class="puzzle__button"
          @click="startGame"
        >
          <img
            src="@/assets/puzzle/button-restart.png"
            alt="button"
          >
        </div>
      </div>
      <div
        v-show="isEnded && !isFailure"
        class="puzzle__success"
      >
        <img
          src="@/assets/puzzle/success-bg.png"
          alt="bg"
        >
        <div
          class="puzzle__success-main"
          :class="{
            '-active': isEnded && !isFailure
          }"
        >
          <img
            src="@/assets/puzzle/line-bg.png"
            alt="bg"
          >
          <div
            class="puzzle__button"
            @click="submitLineHandler"
          >
            <img
              src="@/assets/puzzle/button-ok.png"
              alt="button"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.puzzle {
  @include aspect(1728 / 1080);

  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 480px;

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

  &__countdown {
    @include size(100%);

    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 70%);

    .numbers {
      width: 50%;
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

      .numbers {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(0%, -40%);
        width: 15%;
      }
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

        img {
          &:nth-of-type(2) {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: none;

            &.-active {
              display: block;
            }
          }
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
      opacity: 0;

      @keyframes display {
        0% {
          opacity: 0;
        }

        99% {
          opacity: 0;
        }

        100% {
          opacity: 1;
        }
      }

      &.-active {
        animation: display 3s forwards;
      }

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
