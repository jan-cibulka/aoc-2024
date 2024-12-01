use std::{fs::File, io::Read};

fn main() {
    let mut file = File::open("input.txt").expect("Can't open file!");
    let mut contents = String::new();

    file.read_to_string(&mut contents)
        .expect("Unable to read to line.");

    let mut list1: Vec<i32> = Vec::new();
    let mut list2: Vec<i32> = Vec::new();

    for line in contents.lines().into_iter().filter(|line| !line.is_empty()) {
        let mut parts = line.split_whitespace();

        let value1 = parts.next();
        let value2 = parts.next();

        match (value1, value2) {
            (Some(v1), Some(v2)) => {
                match v1.parse::<i32>() {
                    Ok(parsed_value1) => list1.push(parsed_value1),
                    Err(_) => println!("Failed to parse value 1."),
                }

                match v2.parse::<i32>() {
                    Ok(parsed_value2) => list2.push(parsed_value2),
                    Err(_) => println!("Failed to parse value 1."),
                }
            }
            _ => {
                println!("Failed to split the string correctly.");
            }
        }
    }
    list1.sort();
    list2.sort();

    // Part 1
    let mut acc: i32 = 0;
    for x in 0..list1.len() {
        let a: i32 = list1[x];
        let b: i32 = list2[x];
        let distance = (a - b).abs();

        acc += distance;
    }
    println!("part 1 answer : {}", acc);

    // Part 2
    let mut acc2: i32 = 0;
    for x in 0..list1.len() {
        let val_x = list1[x];
        let mut count: i32 = 0;
        for y in 0..list2.len() {
            let val_y = list2[y];
            if val_x == val_y {
                count += 1;
            }
        }
        acc2 += (val_x as i32) * count;
    }

    println!("part 2 answer : {}", acc2)
}
