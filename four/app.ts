import * as fs from "fs";
import * as path from "path";

const exampleFileName = "example_input.txt";

const searchedText = "XMAS";
const searchedReversedText = "SAMX";

const re = new RegExp(searchedText, "g");
const re2 = new RegExp(searchedReversedText, "g");

function readFileContent(filename: string): string {
  return fs.readFileSync(path.resolve(__dirname, filename), "utf-8");
}

const content = readFileContent(exampleFileName);
const lines = content.split("\n");

const countOccurencesInString = (str: string): number => {
  const matches = str.matchAll(re);
  let counter = 0;
  for (const match of matches) {
    counter++;
  }
  const matchesRev = str.matchAll(re2);
  for (const match of matchesRev) {
    counter++;
  }
  return counter;
};

const rotateLines = (lines: string[]): string[] => {
  const newArray = [];
  for (let i = 0; i < lines.length; i++) {
    let newString = "";
    for (let j = 0; j < lines.length; j++) {
      newString += lines[j][i];
    }
    newArray.push(newString);
  }

  return newArray;
};

const makeDiagonalLines = (lines: string[]): string[] => {
  const newArray: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let newString = "";
    let xIndex = i;
    let yIndex = 0;

    while (xIndex >= 0) {
      newString = newString + lines[yIndex]?.[xIndex] || "";
      xIndex -= 1;
      yIndex += 1;
    }
    newArray.push(newString);
  }

  for (let i = 1; i < lines.length; i++) {
    let newString = "";
    let xIndex = lines.length - 1;
    let yIndex = i;

    while (yIndex < lines.length) {
      newString = newString + lines[yIndex]?.[xIndex] || "";
      xIndex -= 1;
      yIndex += 1;
    }
    newArray.push(newString);
  }

  return newArray;
};

const makeCounterDiagonalLines = (lines: string[]): string[] => {
  const newArray: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let newString = "";
    let xIndex = lines.length - i - 1;
    let yIndex = 0;

    while (xIndex < lines.length) {
      newString = newString + lines[yIndex]?.[xIndex] || "";
      xIndex += 1;
      yIndex += 1;
    }
    newArray.push(newString);
  }
  for (let i = 1; i < lines.length; i++) {
    let newString = "";
    let xIndex = 0;
    let yIndex = i;

    while (yIndex < lines.length) {
      newString = newString + lines[yIndex]?.[xIndex] || "";
      xIndex += 1;
      yIndex += 1;
    }
    newArray.push(newString);
  }

  return newArray;
};

const evaluateOccurencesInLines = (lines: string[]): number => {
  // 1. Horizontal lines
  const count1 = lines
    .map(countOccurencesInString)
    .reduce((acc, num) => (acc += num), 0);

  // 2. Vertical lines
  const rotatedLines = rotateLines(lines);
  const count2 = rotatedLines
    .map(countOccurencesInString)
    .reduce((acc, num) => (acc += num), 0);

  // 3. Diagonal lines
  const diagonalLines = makeDiagonalLines(lines);
  const count3 = diagonalLines
    .map(countOccurencesInString)
    .reduce((acc, num) => (acc += num), 0);

  // 4. Backwards Diagonal Lines
  const counterDiagonalLines = makeCounterDiagonalLines(lines);
  const count4 = counterDiagonalLines
    .map(countOccurencesInString)
    .reduce((acc, num) => (acc += num), 0);

  const totalCount = count1 + count2 + count3 + count4;
  return totalCount;
};

const result1 = evaluateOccurencesInLines(lines);

console.log("Part 1 : ", result1);

