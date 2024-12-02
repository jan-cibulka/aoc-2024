use std::{
    fs::File,
    io::{self, Read},
    str::SplitWhitespace,
};

const EXAMPLE_INPUT: &str = &"7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9";

fn read_file_content(filename: &str) -> io::Result<String> {
    let mut file = File::open(filename)?;
    let mut content = String::new();
    file.read_to_string(&mut content)?;
    Ok(content)
}

fn parse_line(line: &str) -> Option<Vec<i32>> {
    let mut list: Vec<i32> = Vec::new();
    let parts: SplitWhitespace<'_> = line.split_whitespace();

    for part in parts {
        list.push(part.parse().ok()?);
    }

    Some(list)
}

fn parse_file_content(content: String) -> Vec<Vec<i32>> {
    let mut lines: Vec<Vec<i32>> = Vec::new(); // An empty vector of vectors

    for line in content.lines().filter(|line| !line.is_empty()) {
        if let Some(list) = parse_line(line) {
            lines.push(list);
        }
    }
    lines
}
fn is_floor_safe(floor: &&Vec<i32>) -> bool {
    println!("{:?}", floor);
    let mut is_floor_ascending: bool = false;
    let mut unsafe_diff_encountered: bool = false;
    for x in 0..floor.len() - 1 {
        let curr_val: i32 = floor[x];
        let next_val: i32 = floor[x + 1];
        let is_current_diff_positive = next_val - curr_val > 0;

        if x == 0 {
            is_floor_ascending = is_current_diff_positive;
        }

        if (next_val - curr_val).abs() > 3 || next_val == curr_val {
            unsafe_diff_encountered = true;
        }

        if (unsafe_diff_encountered) {
            println!(
                "floor {:?} is unsafe: unsafe diff, curr_val: {}, next_val: {}",
                floor, curr_val, next_val
            );
            return false;
        }
        if is_floor_ascending != is_current_diff_positive {
            println!("floor {:?} is unsafe: change of direction, is_floor_ascending:{} is_current_diff_positive: {} x:{} ", floor, is_floor_ascending, is_current_diff_positive, x);
            return false;
        }
    }

    true
}

fn main() -> io::Result<()> {
    let content: String = read_file_content("input.txt")?;
    // let lines = parse_file_content(EXAMPLE_INPUT.to_string());
    let lines = parse_file_content(content);

    // Part 1: Evaluate safety
    let safe_floor_count = lines.iter().filter(is_floor_safe).count();

    println!("Part 1 result: {}", safe_floor_count);
    Ok(())
}
