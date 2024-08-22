import SudokuTools from "../src/main";

const sudokuTools = SudokuTools(true);

const newSudoku = sudokuTools.generator.generate(62,true,true);

console.log("##### New sudoku with solution created:");
console.log(newSudoku);

if (typeof newSudoku !== 'string') {
   const candidates = SudokuTools(false).getCandidates.get(newSudoku.board);

   if (candidates) {
      console.log("##### Pencil candidates:");
      candidates.forEach((row) => {
         console.log(row.join(', '));
      });
   }
}