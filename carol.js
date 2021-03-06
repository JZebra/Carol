const Board = class {
  constructor(carol) {
    this.boardSize = 9;
    this.beepers = new Map();
  }

  beeperCount(xpos, ypos) {
    return this.beepers.get(`${xpos},${ypos}`) || 0;
  }

  pick(xpos, ypos) {
    if (!this.beeperCount(xpos, ypos)) {
      throw Error(`No beepers on ${xpos}, ${ypos}`);
    }
    this.beepers.set(`${xpos},${ypos}`, this.beeperCount(xpos, ypos) - 1);
  }

  drop(xpos, ypos) {
    this.beepers.set(`${xpos},${ypos}`, this.beeperCount(xpos, ypos) + 1);
  }

  hasBeeper(xpos, ypos) {
    return this.beeperCount(xpos, ypos) > 0;
  }

  render(carolX, carolY, carolDir) {
    // init variables
    const radius = Math.floor(this.boardSize / 2);
    const BLANK = '.';
    let board = [];

    // create board
    for (let i = 0; i < this.boardSize; i++) {
      board.push(Array(this.boardSize).fill(BLANK));
    }

    // render
    const borderLeft = carolX - radius;
    const borderTop = carolY - radius;
    const borderRight = carolX + radius;
    const borderBottom = carolY + radius;
    for (let y = borderTop; y < borderBottom; y++) {
      for (let x = borderLeft; x < borderRight; x++) {
        // render carol
        if (x === carolX && y === carolY) {
          process.stdout.write(carolDir);
          continue;
        }

        // render beeperCount
        if (this.hasBeeper(x, y)) {
          process.stdout.write(String(this.beeperCount(x, y)));
        } else {
          process.stdout.write(BLANK);
        }
      }
      process.stdout.write('\n');
    }
  }
}


const Carol = class {
  constructor() {
    this.directions = ['N', 'E', 'S', 'W'];
    this.xpos = 0;
    this.ypos = 0;
    this.directionIdx = 0;
    this.board = new Board();
    const readline = require('readline');
    this.interface = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.subroutines = new Map();
  }

  toString() {
    return `Carol is at x:${this.xpos}, y:${this.ypos}, and facing ${this.getDirection()}`;
  }

  getDirection() {
    return this.directions[this.directionIdx];
  }

  move() {
    if (this.directionIdx === 0) {
      this.ypos -= 1;
    } else if (this.directionIdx === 1) {
      this.xpos += 1;
    } else if (this.directionIdx === 2) {
      this.ypos += 1;
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

  hasBeeper() {
    const beeper = this.board.hasBeeper(this.xpos, this.ypos);
    return beeper;
  }

  render() {
    this.board.render(this.xpos, this.ypos, this.getDirection());
  }

  runCommand(command) {
    // check for subroutines first
    // TODO: maybe this should be in the default block?
    if (this.subroutines.has(command)) {
      const subroutine = this.subroutines.get(command);
      subroutine.split(';').forEach(command => {this.runCommand(command)});
      return
    }

    switch (command) {
      case 'move':
        this.move();
      break;
      case 'turn':
        this.turn();
      break;
      case 'pick':
        this.pick();
      break;
      case 'drop':
        this.drop();
      break;
      case 'beeper?':
        this.hasBeeper();
      break;
      case 'if':
        return new Promise((res, rej) => {
          this.interface.question("if beeper? command:else command", (line) => {
            const [ ifCommand, elseCommand ] = line.split(':');
            if (this.hasBeeper()) {
              res(ifCommand);
            } else {
              res(elseCommand);
            }
          });
        }).then(command => {
          this.runCommand.bind(this)(command);
          this.tick();
        });
      break;
      case 'while':
        return new Promise((res, rej) => {
          this.interface.question("while beeper? command", (command) => {
            res(command);
          });
        }).then(command => {
          while (this.hasBeeper.bind(this)()) {
            this.runCommand(command);
          }
          this.tick();
        });
      break;
      case 'def':
      // TODO: run validations so we don't set harmful subroutines
        this.askFnName().then(this.askFnDef.bind(this)).then(([name, fnLine]) => {
          this.subroutines.set(name, fnLine);
          console.log(`set subroutine ${name} to ${fnLine}`);
          this.tick();
        });
      break;
      default:
        console.log('invalid command');
      }
  }

  askFnName() {
    return new Promise((res, rej) => {
      this.interface.question("new command name? ", name => { res(name) });
    });
  }

  // pass down the fnName from the previous promise
  askFnDef(fnName) {
    return new Promise((res, rej) => {
      this.interface.question("enter new function as one line split by semicolons ", line => { res([fnName, line]) });
    });
  }

  tick() {
    this.render();
    return new Promise((res, rej) => {
      this.interface.question("Command? ", (command) => {
        res(command);
      });
      }).then(command => {
        this.runCommand(command);
        this.tick();
    });
  }
}


const c = new Carol();
// c.move()
// console.log(String(c))
// c.render();
// c.turn()
// console.log(String(c))
// c.move()
// c.move()
// console.log(String(c))
// c.drop()
// c.drop()
// c.move()
// console.log(String(c))
// c.drop()
// c.move()
// console.log(String(c))
// console.log(c.hasBeeper())
// console.log(String(c))
// c.render()
c.run = async () => {
  c.tick();
}
c.run();
