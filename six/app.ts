import * as fs from 'fs';
import * as path from 'path';
import { cloneDeep, xor } from 'lodash';
import { constants } from 'crypto';

const FILE_NAME = 'example_input.txt';

enum Terrain {
  UNEXPLORED = '.',
  EXPLORED = 'X',
  OBSTACLE = '#',
  GUARD = 'o',
}

enum Direction {
  UP = 'up',
  RIGHT = 'right',
  DOWN = 'down',
  LEFT = 'left',
}

type State = string[][];

type Position = {
  x: number;
  y: number;
};

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

const getInitalState = (lines: string[]): State => {
  let state: State = [];
  lines.forEach((line, lineIndex) => {
    line.split('').forEach((character, characterIndex) => {
      if (!state[characterIndex]) {
        state.push([]);
      }
      state[lineIndex][characterIndex] = character;
    });
  });
  return state;
};

const printOutState = (state: State): void => {
  console.log('----------------------');
  state.forEach((x) => {
    let re = '';
    x.forEach((val) => {
      re += val;
    });
    console.log(re);
  });
};

function readFileContent(filename: string): string {
  return fs.readFileSync(path.resolve(__dirname, filename), 'utf-8');
}

const INITIAL_GUARD_POSITION: Position = {
  x: -1,
  y: -1,
};

const getGuardPosition = (state: State): Position => {
  let position = INITIAL_GUARD_POSITION;

  state.forEach((line, lineIndex) => {
    const indexOfGuard = line.indexOf(Terrain.GUARD);
    if (indexOfGuard >= 0) {
      position = {
        x: lineIndex,
        y: indexOfGuard,
      };
    }
  });
  return position;
};

const getIsInBounds = (state: State, guardPosition: Position) => {
  if (
    state.length &&
    guardPosition.x < state.length &&
    guardPosition.x >= 0 &&
    guardPosition.y < state[0].length &&
    guardPosition.y >= 0
  ) {
    return true;
  }
  return false;
};

const getTerrainAhead = (
  state: State,
  guardPosition: Position,
  guardDirection: Direction
): Terrain => {
  const { x, y } = guardPosition;
  switch (guardDirection) {
    case Direction.UP:
      return state[x - 1]?.[y] as Terrain;
    case Direction.RIGHT:
      return state[x]?.[y + 1] as Terrain;
    case Direction.DOWN:
      return state[x + 1]?.[y] as Terrain;
    case Direction.LEFT:
      return state[x]?.[y - 1] as Terrain;
  }
};

const moveGuard = (
  state: State,
  guardPosition: Position,
  guardDirection: Direction
): { newGuardPosition: Position; newState: State } => {
  const { x, y } = guardPosition;
  let newGuardPosition = { ...guardPosition };
  state[x][y] = Terrain.EXPLORED;
  switch (guardDirection) {
    case Direction.UP:
      newGuardPosition = {
        x: guardPosition.x - 1,
        y: guardPosition.y,
      };
      break;
    case Direction.RIGHT:
      newGuardPosition = {
        x: guardPosition.x,
        y: guardPosition.y + 1,
      };
      break;
    case Direction.DOWN:
      newGuardPosition = {
        x: guardPosition.x + 1,
        y: guardPosition.y,
      };
      break;
    case Direction.LEFT:
      newGuardPosition = {
        x: guardPosition.x,
        y: guardPosition.y - 1,
      };
      break;
  }
  const isInBounds = getIsInBounds(state, newGuardPosition);
  if (!isInBounds) {
    console.log('END!!!!', state, newGuardPosition);
    return { newState: state, newGuardPosition };
  }

  state[newGuardPosition.x][newGuardPosition.y] = Terrain.GUARD;

  return { newState: state, newGuardPosition };
};

const getGuardNextDirection = (
  state: State,
  guardPosition: Position,
  guardDirection: Direction
): Direction => {
  let newDirection = guardDirection;
  let terrainAhead = getTerrainAhead(state, guardPosition, newDirection);
  while (terrainAhead === Terrain.OBSTACLE) {
    newDirection = turn(newDirection);
    terrainAhead = getTerrainAhead(state, guardPosition, newDirection);
  }
  return newDirection;
};
const step = (
  state: State,
  guardPosition: Position,
  guardDirection: Direction
): {
  state: State;
  guardPosition: Position;
  guardDirection: Direction;
  isInBounds: boolean;
} => {
  // Was end condition met
  const isInBounds = getIsInBounds(state, guardPosition);
  if (!isInBounds) {
    console.log('END!');
    return { state, guardDirection, guardPosition, isInBounds };
  }

  // Determine the guard moves
  const newDirection = getGuardNextDirection(
    state,
    guardPosition,
    guardDirection
  );
  guardDirection = newDirection;

  const { newState, newGuardPosition } = moveGuard(
    state,
    guardPosition,
    guardDirection
  );
  printOutState(newState);

  return {
    state: newState,
    guardDirection: newDirection,
    guardPosition: newGuardPosition,
    isInBounds,
  };
};

const countExploredTerrain = (state: State): number =>
  state.flat().filter((x) => x === Terrain.EXPLORED).length;

const main = () => {
  const content = readFileContent(FILE_NAME);
  const newContent = content.replace('^', Terrain.GUARD);
  const lines = newContent.split('\n');

  let isInBounds = true;
  let guardPosition: Position = cloneDeep(INITIAL_GUARD_POSITION);
  let guardDirection = Direction.UP;
  let state = getInitalState(lines);
  guardPosition = getGuardPosition(state);

  // loop
  while (isInBounds) {
    ({ state, guardDirection, guardPosition, isInBounds } = step(
      state,
      guardPosition,
      guardDirection
    ));
  }

  printOutState(state);
  const exploredTerrainCount = countExploredTerrain(state);
  console.log("Part 1 ", exploredTerrainCount)
};

main();
