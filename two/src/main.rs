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
    let value1 = 0
    let value2 = 0
    Some((value1, value2))
}


fn main() -> io::Result<()> {
    let contents = read_file_contents("input.txt")?;
   

    // Part 1: Use iterators
    
    

    
    
    Ok(())
}
