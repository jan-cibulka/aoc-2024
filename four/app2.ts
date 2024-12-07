import * as fs from "fs";
import * as path from "path";

const exampleFileName = "example_input.txt";

function readFileContent(filename: string): string {
  return fs.readFileSync(path.resolve(__dirname, filename), "utf-8");
}

const content = readFileContent(exampleFileName);
const lines = content.split("\n");
console.log(lines)

let centers: { x: number; y: number }[] = [];
lines.forEach((line, index) => {
  let lastFoundIndex = 0;
  while (true) {
    const foundIndex = line.indexOf("A", lastFoundIndex);
    if (foundIndex >= 0) { // Fix condition to include index 0
      centers.push({ x: foundIndex, y: index });
      lastFoundIndex = foundIndex + 1;
    } else {
      break;
    }
  }
});

const validCenters = centers.filter((center) => {
  const point1 = lines[center.y + 1]?.[center.x + 1];
  const point2 = lines[center.y + 1]?.[center.x - 1];
  const point3 = lines[center.y - 1]?.[center.x - 1];
  const point4 = lines[center.y - 1]?.[center.x + 1];

  console.log(point1,point2,point3, point4)

  const p1Valid = point1 === "M" || point1 === "S";
  const p2Valid = point2 === "M" || point2 === "S";
  const p3Valid = point3 === "M" || point3 === "S";
  const p4Valid = point4 === "M" || point4 === "S";

  const isValid =
    p1Valid &&
    p2Valid &&
    p3Valid &&
    p4Valid &&
    point1 !== point3 &&
    point2 !== point4;
  return isValid;
});

console.log("Part 2 Answer : ", validCenters.length)
