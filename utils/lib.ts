export class Hex {
  q: number // x
  r: number // z
  s: number // y
  constructor(q: number, r: number, s: number) {
      this.q = q;
      this.r = r;
      this.s = s;
      if (Math.round(q + r + s) !== 0)
          throw "q + r + s must be 0";
  }
  subtract(b: { q: number, r: number, s: number }) {
      return new Hex(this.q - b.q, this.r - b.r, this.s - b.s);
  }
  len() {
      return (Math.abs(this.q) + Math.abs(this.r) + Math.abs(this.s)) / 2;
  }
}