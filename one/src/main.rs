use std::{
    fs::File,
    io::{self, Read},
};

fn read_file_contents(filename: &str) -> io::Result<String> {
    let mut file = File::open(filename)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}

fn parse_line(line: &str) -> Option<(i32, i32)> {
    let mut parts = line.split_whitespace();
    let value1 = parts.next()?.parse::<i32>().ok()?;
    let value2 = parts.next()?.parse::<i32>().ok()?;
    Some((value1, value2))
}

fn create_lists(contents: String) -> (Vec<i32>, Vec<i32>) {
    let mut list1: Vec<i32> = Vec::new();
    let mut list2: Vec<i32> = Vec::new();

    for line in contents.lines().filter(|line| !line.is_empty()) {
        if let Some((v1, v2)) = parse_line(line) {
            list1.push(v1);
            list2.push(v2);
        }
    }

    list1.sort();
    list2.sort();

    (list1, list2)
}

fn main() -> io::Result<()> {
    let contents = read_file_contents("input.txt")?;
    let (list1, list2) = create_lists(contents);

    // Part 1: Use iterators
    let acc: i32 = list1
        .iter()
        .zip(list2.iter())
        .map(|(a, b)| (a - b).abs())
        .sum();
    println!("part 1 answer : {}", acc);

    // Part 2
    let mut acc2: i32 = 0;
    for &val_x in &list1 {
        let mut count: i32 = 0;
        for &val_y in &list2 {
            if val_x == val_y {
                count += 1;
            }
        }
        acc2 += val_x * count;
    }

    println!("part 2 answer : {}", acc2);
    Ok(())
}
