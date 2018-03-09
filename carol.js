const Board = class {
  constructor(carol) {
    this.boardSize = 9;
    // this.carol = carol;
    // beeper = [xpos, ypos, count];
    // this.beepers.set('xpos,ypos', count)
    this.beepers = new Map();
  }

  pick(xpos, ypos) {
    const beeperCount = this.beepers.get(`${xpos},${ypos}`);
    if (!beeperCount) {
      throw Error(`No beepers on ${xpos}, ${ypos}`);
    }
    this.beepers.set(`${xpos},${ypos}`, beeperCount - 1);
  }

  drop(xpos, ypos) {
    const beeperCount = this.beepers.get(`${xpos},${ypos}`) || 0;
    this.beepers.set(`${xpos},${ypos}`, beeperCount + 1);
  }

  render(xpos, ypos, direction) {
    const center = Math.floor(this.boardSize / 2);
    const BLANK = '.';
    let board = [];
    for (let i = 0; i < this.boardSize; i++) {
      board.push(Array(this.boardSize).fill(BLANK));
    }

    board[center][center] = direction;
    console.log(board);
  }
}


const Carol = class {
  constructor() {
    this.directions = ['N', 'E', 'S', 'W'];
    this.xpos = 0;
    this.ypos = 0;
    this.directionIdx = 0;
    this.board = new Board();
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
    this.board.pick(this.xpos, this.ypos);
  }

  drop() {
    this.board.drop(this.xpos, this.ypos);
  }

  render() {
    this.board.render(this.xpos, this.ypos, this.getDirection());
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
