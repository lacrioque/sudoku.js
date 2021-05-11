import Sudoku from "./sudoku";
import isIn from "../utility/isIn";

export default class SudokuGetCandidates {
    private debug: boolean;
    private instance: Sudoku;

    constructor(instance: Sudoku, debug = false) {
        this.debug = debug;
        this.instance = instance;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    log(...args: Array<any>): void {
      if(this.debug) {
        console.log.apply(null, args);
      }
    }

    get(board:string): Array<string[]>|false {
      this.log("Getting all candidates");
        /* Return all possible candidatees for each square as a grid of
            candidates, returnning `false` if a contradiction is encountered.
    
            Really just a wrapper for sudoku._get_candidates_map for programmer
            consumption.
            */
    
        // Assure a valid board
        const report = this.instance.validate_board(board);
        if (report !== true) {
          throw report;
        }
        this.log("Board valid");

        // Get a candidates map
        const candidates_map = this.map(board);
        this.log("Current map: ", candidates_map);

        // If there's an error, return false
        if (!candidates_map) {
          return false;
        }
    
        // Transform candidates map into grid
        const rows: string[][] = [];
        let cur_row = [];
        let i = 0;
        for (const square of Object.keys(candidates_map)) {
          const candidates = candidates_map[square];
          cur_row.push(candidates);
          if (i % 9 == 8) {
            rows.push(cur_row);
            cur_row = [];
          }
          ++i;
        }
        this.log("Returned grid: ", rows);
        return rows;
      }
    
      map(board:string): Record<string,string>|boolean {
        /*  Get all possible candidates for each square as a map in the form
            {square: sudoku.DIGITS} using recursive constraint propagation. Return `false`
            if a contradiction is encountered
        */
    
        // Assure a valid board
        const report = this.instance.validate_board(board);
        if (report !== true) {
          throw report;
        }
    
        const candidate_map = {};
        const squares_values_map = this._get_square_vals_map(board);
    
        // Start by assigning every digit as a candidate to every square
        for (const si in this.instance.SQUARES) {
          candidate_map[this.instance.SQUARES[si]] = Sudoku.DIGITS;
        }
    
        // For each non-blank square, assign its value in the candidate map and
        // propigate.
        for (const square in squares_values_map) {
          const val = squares_values_map[square];
    
          if (isIn(val, Sudoku.DIGITS.split(""))) {
            const new_candidates = this.instance.assign(candidate_map, square, val);
    
            // Fail if we can't assign val to square
            if (!new_candidates) {
              return false;
            }
          }
        }
    
        return candidate_map;
      }

      _get_square_vals_map(board:string): Record<string,string> {
        /* Return a map of squares -> values
            */
        const squares_vals_map = {};
    
        // Make sure `board` is a string of length 81
        if (board.length != this.instance.SQUARES.length) {
          throw 'Board/squares length mismatch.';
        } else {
          for (const i in this.instance.SQUARES) {
            squares_vals_map[this.instance.SQUARES[i]] = board[i];
          }
        }
    
        return squares_vals_map;
      }
    
}