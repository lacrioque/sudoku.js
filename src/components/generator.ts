import Sudoku from "../main"

export default class SudokuGenerator {
    private instance: Sudoku;

    constructor(instance: Sudoku) {
        this.instance = instance;
    }
    generate (difficulty?: string|number, unique?: boolean) {
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
        difficulty = sudoku._force_range(difficulty, Sudoku.NR_SQUARES + 1,
            Sudoku.MIN_GIVENS);
    
        // Default unique to true
        unique = unique || true;
    
        // Get a set of squares and all possible candidates for each square
        let blank_board = '';
        for (var i = 0; i < NR_SQUARES; ++i) {
          blank_board += '.';
        }
        const candidates = sudoku._get_candidates_map(blank_board);
    
        // For each item in a shuffled list of squares
        const shuffled_squares = sudoku._shuffle(SQUARES);
        for (var si in shuffled_squares) {
          var square = shuffled_squares[si];
    
          // If an assignment of a random chioce causes a contradictoin, give
          // up and try again
          const rand_candidate_idx = sudoku._rand_range(candidates[square].length);
          const rand_candidate = candidates[square][rand_candidate_idx];
          if (!sudoku._assign(candidates, square, rand_candidate)) {
            break;
          }
    
          // Make a list of all single candidates
          const single_candidates = [];
          for (var si in SQUARES) {
            var square = SQUARES[si];
    
            if (candidates[square].length == 1) {
              single_candidates.push(candidates[square]);
            }
          }
    
          // If we have at least difficulty, and the unique candidate count is
          // at least 8, return the puzzle!
          if (single_candidates.length >= difficulty
                        && sudoku._strip_dups(single_candidates).length >= 8) {
            let board = '';
            let givens_idxs = [];
            for (var i in SQUARES) {
              var square = SQUARES[i];
              if (candidates[square].length == 1) {
                board += candidates[square];
                givens_idxs.push(i);
              } else {
                board += sudoku.BLANK_CHAR;
              }
            }
    
            // If we have more than `difficulty` givens, remove some random
            // givens until we're down to exactly `difficulty`
            const nr_givens = givens_idxs.length;
            if (nr_givens > difficulty) {
              givens_idxs = sudoku._shuffle(givens_idxs);
              for (var i = 0; i < nr_givens - difficulty; ++i) {
                const target = parseInt(givens_idxs[i]);
                board = board.substr(0, target) + sudoku.BLANK_CHAR
                                + board.substr(target + 1);
              }
            }
    
            // Double check board is solvable
            // TODO: Make a standalone board checker. Solve is expensive.
            if (sudoku.solve(board)) {
              return board;
            }
          }
        }
    
        // Give up and try a new puzzle
        return sudoku.generate(difficulty);
      };
}