<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { range } from "./utils";
import Mole from "./mole";

const TIME = 30000;
const HOLE_NUM = 8;
const PER_MOUNT = 1;

let moleTimer;
let timeTimer;

const moles = ref(Array.from({ length: HOLE_NUM }, (v, i) => ({
  id: i + 1,
  active: false,
})));
const countdownTime = ref(TIME);
const scores = ref(0);
const isStarted = ref(false);
const isFailure = ref(false);
const isEnded = ref(false);

const rabbitImages = ref(Array.from({ length: 14 }).map(
  (v, i) => new URL(`../../assets/whackAMole/rabbit/${i + 1}.png`, import.meta.url).href
));
const boomImages = ref(Array.from({ length: 41 }).map(
  (v, i) => new URL(`../../assets/whackAMole/boom/${i + 1}.png`, import.meta.url).href
));
const boom = ref(null);
const rabbits = ref([]);

const endGame = (failure = false) => {
  window.clearTimeout(moleTimer);
  window.clearTimeout(timeTimer);
  console.log("end");
  isStarted.value = false;
  isEnded.value = true;
  isFailure.value = failure;
  if (isFailure.value) {
    boom.value.start();
  }
};

const startGame = () => {
  const countingMole = () => {
    moleTimer = window.setTimeout(() => {
      for (let i = 0; i < PER_MOUNT; i += 1) {
        const id = Math.floor(Math.random() * HOLE_NUM);

        if (moles.value[id].active) continue;

        const mole = Mole.getMole();
        mole.options.onActiveChanged = (mole) => {
          moles.value[id].active = false;

          if (mole.isHit) {
            if (mole.options.type === Mole.RATE_TYPE.R) {
              endGame(true);
              return;
            }
            scores.value += mole.options.score;
          }
        };
        moles.value[id].mole = mole;
        moles.value[id].active = true;
      }

      countingMole();
    }, range(1000, 2000));
  };

  const countingTime = () => {
    timeTimer = window.setTimeout(() => {
      countdownTime.value -= 1000;

      if (countdownTime.value > 0) {
        countingTime();
        return;
      }

      endGame();
    }, 1000);
  };

  countingMole();
  countingTime();
  isStarted.value = true;
  isEnded.value = false;
  isFailure.value = false;
  countdownTime.value = TIME;
  scores.value = 0;
  moles.value = Array.from({ length: HOLE_NUM }, (v, i) => ({
    id: i + 1,
    active: false,
  }));
};

const whackMole = (payload, i) => {
  if (payload.active) {
    payload.mole.onHit();
    rabbits.value[i].start();
  }
};

onBeforeUnmount(() => {
  endGame();
});

</script>

<template>
  <div class="whack-a-mole">
    <div class="whack-a-mole__main">
      <div class="whack-a-mole__gaming">
        <img
          src="@/assets/whackAMole/bg.jpg"
          alt="bg"
        >
        <div class="whack-a-mole__gaming-panel">
          <div class="whack-a-mole__gaming-score">
            <img
              src="@/assets/whackAMole/score.png"
              alt="bg"
            >
            <Number :number="scores.toString()" />
          </div>
          <div class="whack-a-mole__gaming-time">
            <img
              src="@/assets/whackAMole/time.png"
              alt="bg"
            >
            <Number :number="(countdownTime / 1000).toString()" />
          </div>
        </div>
        <div class="whack-a-mole__gaming-holes">
          <div
            v-for="(mole, i) in moles"
            :key="mole.id"
            class="whack-a-mole__gaming-hole"
            @click="whackMole(mole, i)"
          >
            <img
              v-show="!mole.active"
              src="@/assets/whackAMole/hole.png"
            >
            <div
              class="whack-a-mole__gaming-hole-main"
              :class="{
                '-active': mole.active
              }"
            >
              <img
                src="@/assets/whackAMole/hole-active.png"
              >
              <div
                class="whack-a-mole__gaming-hole-item"
              >
                <img
                  v-show="mole?.mole?.options?.type === Mole.RATE_TYPE.R"
                  src="@/assets/whackAMole/boom.png"
                >
                <img
                  v-show="mole?.mole?.options?.type === Mole.RATE_TYPE.SR"
                  src="@/assets/whackAMole/item.png"
                >
                <img
                  v-show="mole?.mole?.options?.type === Mole.RATE_TYPE.SSR"
                  src="@/assets/whackAMole/item-2.png"
                >
              </div>
              <div class="whack-a-mole__gaming-rabbit">
                <Animate
                  ref="rabbits"
                  :images="rabbitImages"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-show="!isStarted && !isEnded"
        class="whack-a-mole__intro"
      >
        <img
          src="@/assets/whackAMole/intro-bg.png"
          alt="bg"
        >
        <div
          class="whack-a-mole__button"
          @click="startGame"
        >
          <img
            src="@/assets/whackAMole/button-start.png"
            alt="button"
          >
        </div>
      </div>
      <div
        v-show="isEnded && isFailure"
        class="whack-a-mole__failure"
      >
        <Animate
          ref="boom"
          :images="boomImages"
        />
        <img
          src="@/assets/whackAMole/failure-bg.png"
          alt="bg"
        >
        <div
          class="whack-a-mole__button"
          @click="startGame"
        >
          <img
            src="@/assets/whackAMole/button-restart.png"
            alt="button"
          >
        </div>
      </div>
      <div
        v-show="isEnded && !isFailure"
        class="whack-a-mole__success"
      >
        <img
          src="@/assets/whackAMole/success-bg.png"
          alt="bg"
        >
        <div class="whack-a-mole__success-main">
          <img
            src="@/assets/whackAMole/line-bg.png"
            alt="bg"
          >
          <Number
            type="num-2"
            :number="scores.toString()"
          />
          <div
            class="whack-a-mole__button"
          >
            <img
              src="@/assets/whackAMole/button-ok.png"
              alt="button"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.whack-a-mole {
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
    position: relative;
    width: 100%;

    img {
      width: 100%;
    }

    &-panel {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      justify-content: space-between;
      width: 100%;

      > * {
        flex: 0 0 45%;
      }
    }

    &-score {
      position: relative;

      .numbers {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(0, -40%);
        width: 10%;
      }
    }

    &-time {
      position: relative;

      .numbers {
        position: absolute;
        top: 50%;
        left: 40%;
        transform: translate(0, -40%);
        width: 10%;
      }
    }

    &-holes {
      position: absolute;
      bottom: 0;
      left: 0;
      display: grid;
      grid-template-rows: repeat(5, 1fr);
      grid-template-columns: repeat(3, 1fr);
    }

    &-hole {
      position: relative;
      cursor: pointer;

      &:nth-of-type(2) {
        grid-column: 3;
        grid-row: 1;
      }

      &:nth-of-type(3) {
        grid-column: 2;
        grid-row: 2;
      }

      &:nth-of-type(4) {
        grid-column: 1;
        grid-row: 3;
      }

      &:nth-of-type(5) {
        grid-column: 3;
        grid-row: 3;
      }

      &:nth-of-type(6) {
        grid-column: 2;
        grid-row: 4;
      }

      &:nth-of-type(7) {
        grid-column: 1;
        grid-row: 5;
      }

      &:nth-of-type(8) {
        grid-column: 3;
        grid-row: 5;
      }

      &-main {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;

        &.-active {
          opacity: 1;
          transition: none;

          &:active {
            .whack-a-mole__gaming-rabbit {
              opacity: 1;
              transition: none;
            }
          }
        }
      }

      &-item {
        position: absolute;
        top: 0;
        left: 50%;
        width: 50%;
        transform: translate(-50%, -50%);
      }
    }

    &-rabbit {
      @include aspect(390 / 293);

      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      transform: translate(30%, -50%);
      opacity: 0;
      transition: opacity 0s 0.5s;

      > * {
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }

  &__failure {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    > img {
      position: relative;
      width: 100%;
    }

    .animate {
      @include aspect(1728 / 1080);

      position: absolute;
      top: 0;
      left: 0;
      width: 100%;

      > * {
        position: absolute;
        top: 0;
        left: 0;
      }
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

      .numbers {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, 300%);

        img {
          width: 30%;
        }
      }

      .whack-a-mole__button {
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
