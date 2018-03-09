
const Carol = class {
  constructor() {
    this.directions = ['N', 'E', 'S', 'W'];
    this.xpos = 0;
    this.ypos = 0;
    this.directionIdx = 0;
    // beeper = [xpos, ypos, count];
    // this.beepers.set('xpos,ypos', count)
    this.beepers = new Map();
  }

  toString() {
    return `Carol is at x:${this.xpos}, y:${this.ypos}, and facing ${this.getDirection()}`;
  }

  getDirection() {
    return this.directions[this.directionIdx];
  }

  move() {
    if (this.directionIdx === 0) {
      this.ypos += 1;
    } else if (this.directionIdx === 1) {
      this.xpos += 1;
    } else if (this.directionIdx === 2) {
      this.ypos -= 1;
    } else if (this.directionIdx === 3) {
      this.xpos -= 1;
    }
  }

  turn() {
    this.directionIdx = (this.directionIdx + 1) % 4;
  }

  pick() {
    const beeperCount = this.beepers.get(`${this.xpos},${this.ypos}`);
    if (!beeperCount) {
      throw Error(`No beepers on ${this.xpos}, ${this.ypos}`);
    }
    this.beepers.set(`${this.xpos},${this.ypos}`, beeperCount - 1);
  }

  drop() {
    const beeperCount = this.beepers.get(`${this.xpos},${this.ypos}`) || 0;
    this.beepers.set(`${this.xpos},${this.ypos}`, beeperCount + 1);
  }

  render() {
    const boardSize = 9;
    const center = Math.floor(boardSize / 2);
    const BLANK = '.';
    const CAROL = this.getDirection();
    let board = []
    for (let i = 0; i < boardSize; i++) {
      board.push(Array(boardSize).fill(BLANK));
    }

    board[center][center] = CAROL;
    console.log(board);
  }
}

const c = new Carol();
c.move()
console.log(String(c))
c.render();
c.turn()
c.move()
c.move()
c.drop()
c.drop()
c.pick()
console.log(String(c))
c.render()
