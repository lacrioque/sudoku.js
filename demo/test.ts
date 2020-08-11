import SudokuTools from "../src/main";

const sudokuTools = SudokuTools(true);

const newSudoku = sudokuTools.generator.generate(62,true,true);

console.log("##### New sudoku with solution created:");
console.log(newSudoku);