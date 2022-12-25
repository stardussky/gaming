import { range, probability } from "./utils";

export default class Mole {
  static RATE_TYPE = Object.freeze({
    R: "r",
    SR: "sr",
    SSR: "ssr",
  });

  static RATE = Object.freeze({
    R: Object.freeze({
      type: Mole.RATE_TYPE.R,
      score: 0,
      life: range(2000, 3000),
    }),
    SR: Object.freeze({
      type: Mole.RATE_TYPE.SR,
      score: 1,
      life: range(1000, 2000),
    }),
    SSR: Object.freeze({
      type: Mole.RATE_TYPE.SSR,
      score: 3,
      life: range(500, 1000),
    }),
  });

  static getMole = () => {
    if (probability(0.5)) return new Mole(Mole.RATE.SR);
    if (probability(0.5)) return new Mole(Mole.RATE.R);
    return new Mole(Mole.RATE.SSR);
  };

  constructor(options) {
    this.options = {
      ...Mole.RATE.R,
      onActiveChanged: () => {},
      ...options,
    };

    this.timer = window.setTimeout(() => {
      this.endLife();
    }, this.options.life);

    this.isActive = true;
    this.isHit = false;
  }

  onHit() {
    this.isHit = true;
    window.clearTimeout(this.timer);
    setTimeout(() => {
      this.endLife();
    }, 500);
  }

  endLife() {
    window.clearTimeout(this.timer);
    this.isActive = false;
    this.options?.onActiveChanged?.(this);
  }
}
