import Sudoku from "./sudoku"
import SudokuGetCandidates from "./get-candidates";
import SudokuSolver from "./solve";

export default class SudokuGenerator {
    private debug: boolean;
    private instance: Sudoku;
    private getCandidates: SudokuGetCandidates;
    private solver: SudokuSolver;

    constructor(instance: Sudoku, debug=false) {
        this.debug = debug;
        this.instance = instance;
        this.solver = new SudokuSolver(this.instance);
        this.getCandidates = new SudokuGetCandidates(this.instance);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    log(...args: Array<any>): void {
      if(this.debug) {
        console.log.apply(null, args);
      }
    }

    generate (difficulty?: string|number, unique = true, withSolution=false): string|{board: string; solution: string} {
        /* Generate a new Sudoku puzzle of a particular `difficulty`, e.g.,
    
                // Generate an "easy" sudoku puzzle
                sudoku.generate("easy");
    
            Difficulties are as follows, and represent the number of given squares:
    
                    "easy":         61
                    "medium":       52
                    "hard":         43
                    "very-hard":    34
                    "insane":       25
                    "inhuman":      17
    
            You may also enter a custom number of squares to be given, e.g.,
    
                // Generate a new Sudoku puzzle with 60 given squares
                sudoku.generate(60)
    
            `difficulty` must be a number between 17 and 81 inclusive. If it's
            outside of that range, `difficulty` will be set to the closest bound,
            e.g., 0 -> 17, and 100 -> 81.
    
            By default, the puzzles are unique, uless you set `unique` to false.
            (Note: Puzzle uniqueness is not yet implemented, so puzzles are *not*
            guaranteed to have unique solutions)
    
            TODO: Implement puzzle uniqueness
            */
    
        // If `difficulty` is a string or undefined, convert it to a number or
        // default it to "easy" if undefined.
        if (typeof difficulty === 'string' || typeof difficulty === 'undefined') {
          difficulty = Sudoku.DIFFICULTY[difficulty] || Sudoku.DIFFICULTY.easy;
        }

        
        // Force difficulty between 17 and 81 inclusive
        difficulty = this._force_range(difficulty as number, Sudoku.NR_SQUARES + 1,
          Sudoku.MIN_GIVENS);
          
        this.log("Generating game with difficulty of: ", difficulty);
    
        // Get a set of squares and all possible candidates for each square
        let blank_board = '';
        for (let i = 0; i < Sudoku.NR_SQUARES; ++i) {
          blank_board += '.';
        }
        const candidates = this.getCandidates.map(blank_board);
        if(typeof candidates == "boolean") {
          throw new Error(`Cannot define candidates for ${blank_board}`);
        }
        this.log("Candidates for blank board: ", candidates);
        
        // For each item in a shuffled list of squares
        const shuffled_squares = this._shuffle(this.instance.SQUARES);
        this.log("Shuffled squares: ", shuffled_squares);
        for (const si in shuffled_squares) {
          const square = shuffled_squares[si];
    
          // If an assignment of a random chioce causes a contradiction, give
          // up and try again
          const rand_candidate_idx = this._rand_range(candidates[square].length);
          const rand_candidate = candidates[square][rand_candidate_idx];
          this.log("Assigning ranom values: ", {
            rand_candidate_idx, rand_candidate
          });
          if (this.instance.assign(candidates, square, rand_candidate) === false) {
            this.log("Random contradiction found -> exiting");
            break;
          }
    
          // Make a list of all single candidates
          const single_candidates = [];
          for (const si in this.instance.SQUARES) {
            const square = this.instance.SQUARES[si];
    
            if (candidates[square].length == 1) {
              single_candidates.push(candidates[square]);
            }
          }

          this.log("Single candidates found: ", single_candidates);

          // If we have at least difficulty, and the unique candidate count is
          // at least 8, return the puzzle!
          if (single_candidates.length >= difficulty
                        && this._strip_dups(single_candidates).length >= 8) {
            this.log("Difficulty grade reached, creating board");
            let board = '';
            let givens_idxs = [];
            for (const i in this.instance.SQUARES) {
              const square = this.instance.SQUARES[i];
              if (candidates[square].length == 1) {
                board += candidates[square];
                givens_idxs.push(i);
              } else {
                board += Sudoku.BLANK_CHAR;
              }
            }
            this.log("Board created so far: ", board);
    
            // If we have more than `difficulty` givens, remove some random
            // givens until we're down to exactly `difficulty`
            const nr_givens = givens_idxs.length;
            if (nr_givens > difficulty) {
              givens_idxs = this._shuffle(givens_idxs);
              for (let i = 0; i < nr_givens - difficulty; ++i) {
                const target = parseInt(givens_idxs[i]);
                board = board.substr(0, target) + Sudoku.BLANK_CHAR
                                + board.substr(target + 1);
              }
            }

            this.log("Board created after checking difficulty again: ", board);
    
            // Double check board is solvable
            // TODO: Make a standalone board checker. Solve is expensive.
            const solution = this.solver.solve(board);

            if (typeof solution == "string") {
              if(withSolution===true) {
                return {
                  board,
                  solution
                }
              }
              return board;
            }
          }
        }
    
        // Give up and try a new puzzle
        return this.generate(difficulty);
      }

      private _force_range (nr: number, max: number, min: number) {
        /* Force `nr` to be within the range from `min` to, but not including,
            `max`. `min` is optional, and will default to 0. If `nr` is undefined,
            treat it as zero.
            */
        min = min || 0;
        nr = nr || 0;
        if (nr < min) {
          return min;
        }
        if (nr > max) {
          return max;
        }
        return nr;
      }

      private _shuffle (seq: Array<string>) {
        /* Return a shuffled version of `seq`
            */
    
        // Create an array of the same size as `seq` filled with false
        const shuffled = [];
        for (let i = 0; i < seq.length; ++i) {
          shuffled.push(false);
        }
    
        for (const i in seq) {
          let ti = this._rand_range(seq.length);
    
          while (shuffled[ti]) {
            ti = (ti + 1) > (seq.length - 1) ? 0 : (ti + 1);
          }
    
          shuffled[ti] = seq[i];
        }
    
        return shuffled;
      }

      private _rand_range(max: number|string, min: number|string = 0): number {
        /* Get a random integer in the range of `min` to `max` (non inclusive).
            If `min` not defined, default to 0. If `max` not defined, throw an
            error.
        */

        const cleanMin = parseInt(min as string);
        const cleanMax = parseInt(max as string);

        if (cleanMax) {
          return Math.floor(Math.random() * (cleanMax - cleanMin)) + cleanMin;
        }
        throw 'Range undefined';
      }

      _strip_dups(seq: Array<string>): Array<string> {
        /* Strip duplicate values from `seq`
            */
        const seq_set = [];
        const dup_map = {};
        for (const i in seq) {
          const e = seq[i];
          if (!dup_map[e]) {
            seq_set.push(e);
            dup_map[e] = true;
          }
        }
        return seq_set;
      }
}