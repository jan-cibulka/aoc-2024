import * as fs from "fs";
import * as path from "path";

type Rule = {
  r1: number;
  r2: number;
};

type Update = number[];

const EXAMPLE_FILE_NAME = "example_input.txt";

function readFileContent(filename: string): string {
  return fs.readFileSync(path.resolve(__dirname, filename), "utf-8");
}

const parseRulesAndUpdates = (
  lines: string[]
): {
  rules: Rule[];
  updates: Update[];
} => {
  const rules = lines.filter((line) => line.includes("|")).map(parseRuleNumber);
  const updates = lines
    .filter((line) => line.includes(","))
    .map(parseUpdateNumbers);

  return { rules, updates };
};

const parseRuleNumber = (ruleStr: string): Rule => {
  const [r1, r2] = ruleStr.split("|");
  return { r1: parseInt(r1, 10), r2: parseInt(r2, 10) };
};
const parseUpdateNumbers = (updateStr: string): Update =>
  updateStr.split(",").map((x) => parseInt(x, 10));

const getRulesPerUpdate = (update: Update, rules: Rule[]): Rule[] =>
  rules.filter((rule) => update.includes(rule.r1) && update.includes(rule.r2));

const getIsUpdateValid = (update: Update, rules: Rule[]): boolean =>
  rules.every((rule) => {
    return update.indexOf(rule.r1) < update.indexOf(rule.r2);
  });

const main = () => {
  const content = readFileContent(EXAMPLE_FILE_NAME);
  const lines = content.split("\n");
  const { rules, updates } = parseRulesAndUpdates(lines);

  let acc = 0;
  updates.forEach((update: Update, i) => {
    const middleRuleValue = update.at(update.length / 2) || 0;
    const updateRules = getRulesPerUpdate(update, rules);
    const isUpdateValid = getIsUpdateValid(update, updateRules);
    console.log(i, " : ", isUpdateValid);

    acc += isUpdateValid ? middleRuleValue : 0;
  });

  console.log(acc);
};

const sanitizeUpdate = (invalidUpdate: Update, rules: Rule[]): Update => {
  const updateRules = getRulesPerUpdate(invalidUpdate, rules);
  let newUpdate: Update = [];
  invalidUpdate.forEach((number) => {
    let index = 0;
    while (index <= newUpdate.length) {
      const candidateUpdate = [...newUpdate].splice(index, 0, number);
      const isUpdateValid = getIsUpdateValid(candidateUpdate, updateRules);
      if (isUpdateValid) {
        newUpdate = candidateUpdate;
        break;
      }

      index++;
    }
  });

  return newUpdate;
};

const main2 = () => {
  const content = readFileContent(EXAMPLE_FILE_NAME);
  const lines = content.split("\n");
  const { rules, updates } = parseRulesAndUpdates(lines);

  const invalidUpdates = updates.filter((update) => {
    const updateRules = getRulesPerUpdate(update, rules);
    return !getIsUpdateValid(update, updateRules);
  });

  const sanitizedUpdates = sanitizeUpdate(invalidUpdates[0], rules);

  console.log(sanitizedUpdates);
};

main2();
