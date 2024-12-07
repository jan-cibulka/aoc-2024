import * as fs from 'fs';
import * as path from 'path';

const FILE_NAME = 'example_input.txt';

enum Terrain {
  UNEXPLORED = '.',
  EXPLORED = 'X',
  OBSTACLE = '#',
  POSITION = 'o',
}

enum Direction {
  UP = 'up',
  RIGHT = 'right',
  DOWN = 'down',
  LEFT = 'left',
}

const turn = (currentDirection: Direction): Direction => {
  switch (currentDirection) {
    case Direction.UP:
      return Direction.RIGHT;
    case Direction.RIGHT:
      return Direction.DOWN;
    case Direction.DOWN:
      return Direction.LEFT;
    case Direction.LEFT:
    default:
      return Direction.UP;
  }
};

type State = string[][];

const getInitalState= (lines: string[]) : State => {
  let state: State = [];
  lines.forEach((line, lineIndex) => {
    
    line.split("").forEach((character, characterIndex) => {
      if(!state[characterIndex]){
        state.push([])
      }
        state[lineIndex][characterIndex] = character;
    })
  })
  return state;
}

const printOutState = (state:State) :void => {
  state.forEach((x) => {
    let re = "";
    x.forEach((val) => {
        re += val;
    })
    console.log(re)
  })
}

function readFileContent(filename: string): string {
  return fs.readFileSync(path.resolve(__dirname, filename), 'utf-8');
}

const main = () => {
  const content = readFileContent(FILE_NAME);
  const newContent = content.replace('^', Terrain.POSITION);
  const lines = newContent.split('\n');
  
  let state = getInitalState(lines);
  printOutState(state);
};

main();
