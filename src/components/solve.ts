import Sudoku from "./sudoku";
import SudokuGetCandidates from "./get-candidates";
import isIn from "../utility/isIn";

export default class SudokuSolver {
    private instance: Sudoku;
    private getCandidates: SudokuGetCandidates;

    constructor(instance: Sudoku) {
        this.instance = instance;
        this.getCandidates = new SudokuGetCandidates(instance);
    }

    public solve (board: string, reverse = false): string|boolean {
        /* Solve a sudoku puzzle given a sudoku `board`, i.e., an 81-character
            string of sudoku.DIGITS, 1-9, and spaces identified by '.', representing the
            squares. There must be a minimum of 17 givens. If the given board has no
            solutions, return false.
    
            Optionally set `reverse` to solve "backwards", i.e., rotate through the
            possibilities in reverse. Useful for checking if there is more than one
            solution.
            */
    
        // Assure a valid board
        const report = this.instance.validate_board(board);
        if (report !== true) {
          throw report;
        }
    
        // Check number of givens is at least MIN_GIVENS
        let nr_givens = 0;
        const boardArray = board.split("");
        for (const i in boardArray) {
          if (board[i] !== Sudoku.BLANK_CHAR && isIn(boardArray[i], Sudoku.DIGITS.split(""))) {
            ++nr_givens;
          }
        }
        if (nr_givens < Sudoku.MIN_GIVENS) {
          throw `Too few givens. Minimum givens is ${Sudoku.MIN_GIVENS}`;
        }
    
        const candidates = this.getCandidates.map(board);
        if(typeof candidates !== "boolean") {
            const result = this.search(candidates, reverse);
        
            if (typeof result !== "boolean") {
              let solution = '';
              for (const square in result) {
                solution += result[square];
              }
              return solution;
            }
        }
        return false;
      }

      public search (candidates: Record<string,string>, reverse = false): boolean|Record<string,string> {
        /* Given a map of squares -> candiates, using depth-first search,
           recursively try all possible values until a solution is found, or false
           if no solution exists.
        */
    
        // Return if error in previous iteration
        if (!candidates) {
          return false;
        }
    
        // If only one candidate for every square, we've a solved puzzle!
        // Return the candidates map.
        let max_nr_candidates = 0;
        let max_candidates_square = null;
        for (const si in this.instance.SQUARES) {
          const square = this.instance.SQUARES[si];
    
          const nr_candidates = candidates[square].length;
    
          if (nr_candidates > max_nr_candidates) {
            max_nr_candidates = nr_candidates;
            max_candidates_square = square;
          }
        }
        if (max_nr_candidates === 1) {
          return candidates;
        }
    
        // Choose the blank square with the fewest possibilities > 1
        let min_nr_candidates = 10;
        let min_candidates_square = null;
        for (const si in this.instance.SQUARES) {
          const square = this.instance.SQUARES[si];
          const nr_candidates = candidates[square].length;
    
          if (nr_candidates < min_nr_candidates && nr_candidates > 1) {
            min_nr_candidates = nr_candidates;
            min_candidates_square = square;
          }
        }
    
        // Recursively search through each of the candidates of the square
        // starting with the one with fewest candidates.
    
        // Rotate through the candidates forwards
        const min_candidates = candidates[min_candidates_square].split("");
        if (!reverse) {
          for (const vi in min_candidates) {
            const val = min_candidates[vi];
    
            // TODO: Implement a non-rediculous deep copy function
            const candidates_copy: Record<string,string> = Object.assign({}, candidates);
            const newCandidates = this.instance.assign(candidates_copy, min_candidates_square, val);
            if(typeof newCandidates === "boolean") {
                return false;
            }
            const candidates_next = this.search(newCandidates);
    
            if (candidates_next) {
              return candidates_next;
            }
          }
    
          // Rotate through the candidates backwards
        } else {
          for (let vi = min_candidates.length - 1; vi >= 0; --vi) {
            const val = min_candidates[vi];
    
            // TODO: Implement a non-rediculous deep copy function
            const candidates_copy: Record<string,string> = Object.assign({}, candidates);
            const newCandidates = this.instance.assign(candidates_copy, min_candidates_square, val)
            if(typeof newCandidates === "boolean") {
                return false;
            }
            const candidates_next = this.search(newCandidates,reverse);
    
            if (candidates_next) {
              return candidates_next;
            }
          }
        }
    
        // If we get through all combinations of the square with the fewest
        // candidates without finding an answer, there isn't one. Return false.
        return false;
      }    
    
}