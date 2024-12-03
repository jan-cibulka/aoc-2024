use std::{
    fs::File,
    io::{self, Read},
    str::SplitWhitespace,
};

use regex::Regex;

const EXAMPLE_INPUT: &str =
    &"xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))";

const REGEX_MUL: &str = r"mul\(\d{1,3},\d{1,3}\)";
const REGEX_NUMBERS: &str = r"\d{1,3}";
const REGEX_REMOVE: &str = r"(don't\(\)).*?(do\(\))";
const REGEX_REMOVE2: &str = r"(don't\(\)).*?(don't\(\))";

fn read_file_content(filename: &str) -> io::Result<String> {
    let mut file = File::open(filename)?;
    let mut content = String::new();
    file.read_to_string(&mut content)?;
    Ok(content)
}

fn get_match_value(mul_match: &&str) -> Option<i32> {
    let re = Regex::new(REGEX_NUMBERS).expect("Invalid regex");

    let mut matches = re.find_iter(mul_match).take(2).map(|m| m.as_str());

    let val1 = matches.next()?.parse::<i32>().ok()?;
    let val2 = matches.next()?.parse::<i32>().ok()?;

    Some(val1 * val2)
}
fn main() -> io::Result<()> {
    let mut content: String = read_file_content("input.txt")?;
    // let content: String = EXAMPLE_INPUT.to_string();

    // Iterate over all matches

    // Part 1: Summarize numbers
    let sum = get_sum_from_content(&content);
    println!("Part 1 : {:?}", sum);

    // Part 2:
    let re_dont = Regex::new(r"don't\(\)").unwrap(); // Pattern for "don't()"
    let re_do = Regex::new(r"do\(\)").unwrap(); // Pattern for "do()"

    while let Some(dont_pos) = re_dont.find(&content) {
        // Find the first "do()" after the first "don't()"
        if let Some(do_pos) = re_do.find(&content[dont_pos.end()..]) {
            // Adjust the position of "do()" to be absolute in the original string
            let do_pos_absolute = dont_pos.end() + do_pos.start();

            // Remove everything between the first "don't()" and the first "do()", including both
            content.replace_range(dont_pos.start()..=do_pos_absolute, "");
        } else {
            // If no "do()" is found after "don't()", break the loop
            break;
        }
    }

    println!("{:?}", content);

    let sum2 = get_sum_from_content(&content);
    println!("Part 2 : {:?}", sum2);

    Ok(())
}

fn get_sum_from_content(content: &String) -> i32 {
    let re = Regex::new(REGEX_MUL).expect("Invalid regex");
    let matches: Vec<&str> = re.find_iter(content.as_str()).map(|m| m.as_str()).collect();
    let numbers: Vec<Option<i32>> = matches.iter().map(|x| get_match_value(x)).collect();
    let sum: i32 = numbers.iter().filter_map(|x| *x).sum();
    sum
}
