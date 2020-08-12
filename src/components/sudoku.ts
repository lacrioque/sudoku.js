import isIn from "../utility/isIn";

export default class Sudoku {
    private debug: boolean;

    public static DIGITS = '123456789'; // Allowed sudoku.DIGITS
    public static ROWS = 'ABCDEFGHI'; // Row lables
    public static COLS = Sudoku.DIGITS; // Column lables
    // Define difficulties by how many squares are given to the player in a new
    // puzzle.
    public static DIFFICULTY = {
      easy: 62,
      medium: 53,
      hard: 44,
      'very-hard': 35,
      insane: 26,
      inhuman: 17,
    };
    // Blank character and board representation
    public static BLANK_CHAR = '.';
    public static BLANK_BOARD = '.'.repeat(81);
    public static MIN_GIVENS = 17; // Minimum number of givens
    public static NR_SQUARES = 81; // Number of squares
    public BLOCKS: Array<string[]> = [];
    public SQUARES: Array<string>|null = null; // Square IDs
    public UNITS: Array<string>|null = null; // All units (row, column, or box)
    public SQUARE_UNITS_MAP: Record<string,unknown>|null = null; // Squares -> units map
    public SQUARE_PEERS_MAP: Record<string,unknown>|null = null; // Squares -> peers map


    constructor(debug=false) {
      this.debug = debug;
      /* Initialize the Sudoku library (invoked after library load)a
        */
      this.SQUARES = this._cross(Sudoku.ROWS, Sudoku.COLS);
      this.UNITS = this._get_all_units(Sudoku.ROWS, Sudoku.COLS);
      this.SQUARE_UNITS_MAP = this._get_square_units_map(this.SQUARES, this.UNITS);
      this.SQUARE_PEERS_MAP = this._get_square_peers_map(this.SQUARES, this.SQUARE_UNITS_MAP);
      this.BLOCKS = [
        this._cross("ABC","123"),
        this._cross("ABC","456"),
        this._cross("ABC","789"),
        this._cross("DEF","123"),
        this._cross("DEF","456"),
        this._cross("DEF","789"),
        this._cross("GHI","123"),
        this._cross("GHI","456"),
        this._cross("GHI","789"),
      ]
    }


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    log(...args: Array<any>): void {
      if(this.debug) {
        console.log.apply(null, args);
      }
    }

    private _cross(a: string, b:string): Array<string> {
      /* Cross product of all elements in `a` and `b`, e.g.,
        sudoku._cross("abc", "123") ->
        ["a1", "a2", "a3", "b1", "b2", "b3", "c1", "c2", "c3"]
        */
      const result: Array<string> = [];
      for (const ai in a.split("")) {
        for (const bi in b.split("")) {
          result.push(a[ai] + b[bi]);
        }
      }
      return result;
    }

    private _get_all_units(rows: string, cols: string): Array<string> {
      /* Return a list of all units (rows, cols, boxes) */
      const units = [];

      // Rows
      for (const ri in rows.split("")) {
        units.push(this._cross(rows[ri], cols));
      }

      // Columns
      for (const ci in cols.split("")) {
        units.push(this._cross(rows, cols[ci]));
      }

      // Boxes
      const row_squares = ['ABC', 'DEF', 'GHI'];
      const col_squares = ['123', '456', '789'];
      for (const rsi in row_squares) {
        for (const csi in col_squares) {
          units.push(this._cross(row_squares[rsi], col_squares[csi]));
        }
      }

      return units;
    }

    private _get_square_units_map(squares: Array<string>, units: Array<string>): Record<string,string> {
      /* Return a map of `squares` and their associated units (row, col, box) */
      const square_unit_map = {};

      // For every square...
      for (const si in squares) {
        const cur_square = squares[si];

        // Maintain a list of the current square's units
        const cur_square_units = [];

        // Look through the units, and see if the current square is in it,
        // and if so, add it to the list of of the square's units.
        for (const ui in units) {
          const cur_unit = units[ui];

          if (cur_unit.indexOf(cur_square) !== -1) {
            cur_square_units.push(cur_unit);
          }
        }

        // Save the current square and its units to the map
        square_unit_map[cur_square] = cur_square_units;
      }

      return square_unit_map;
    }

    // Necessary to overcome the need to define all records completely
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _get_square_peers_map(squares: Array<string>, units_map: any): Record<string,string> {
    /* Return a map of `squares` and their associated peers, i.e., a set of
        other squares in the square's unit.
        */
      const square_peers_map = {};

      // For every square...
      for (const si in squares) {
        const cur_square = squares[si];
        const cur_square_units = units_map[cur_square];

        // Maintain list of the current square's peers
        const cur_square_peers = [];

        // Look through the current square's units map...
        for (const sui in cur_square_units) {
          const cur_unit = cur_square_units[sui];

          for (const ui in cur_unit) {
            const cur_unit_square = cur_unit[ui];

            if (cur_square_peers.indexOf(cur_unit_square) === -1
                            && cur_unit_square !== cur_square) {
              cur_square_peers.push(cur_unit_square);
            }
          }
        }

        // Save the current square an its associated peers to the map
        square_peers_map[cur_square] = cur_square_peers;
      }

      return square_peers_map;
    }

    _coordinates_of(index: number): {col: number; row: number} {
      const rowIndex = Math.floor(index/9);
      const colIndex = 9-index%9;
      return {col: colIndex, row: rowIndex}
    }

      
  // Utility
  // -------------------------------------------------------------------------

  public print_board(board: string): void {
    /* Print a sudoku `board` to the console. */

    // Assure a valid board
    const report = this.validate_board(board);
    if (report !== true) {
      throw report;
    }

    const V_PADDING = ' '; // Insert after each square
    const H_PADDING = '\n'; // Insert after each row

    const V_BOX_PADDING = '  '; // Box vertical padding
    const H_BOX_PADDING = '\n'; // Box horizontal padding

    let display_string = '';

    for (const iterator in board.split("")) {
      const i = parseInt(iterator);
      const square = board[i];

      // Add the square and some padding
      display_string += square + V_PADDING;

      // Vertical edge of a box, insert v. box padding
      if (i % 3 === 2) {
        display_string += V_BOX_PADDING;
      }

      // End of a line, insert horiz. padding
      if (i % 9 === 8) {
        display_string += H_PADDING;
      }

      // Horizontal edge of a box, insert h. box padding
      if (i % 27 === 26) {
        display_string += H_BOX_PADDING;
      }
    }

    console.log(display_string);
  }

  validate_board(board: string, errorAsCoordinates = false): boolean|{row: string; col: number} {
    /* Return if the given `board` is valid or not. If it's valid, return
        true. If it's not, return a string of the reason why it's not.
    */

    // Check for empty board
    if (!board) {
      throw new Error('Empty board');
    }

    // Invalid board length
    if (board.length !== Sudoku.NR_SQUARES) {
      throw new Error(`Invalid board size. Board must be exactly ${Sudoku.NR_SQUARES
      } squares.`);
    }

    // Check for invalid characters
    const boardArray = board.split("");
    boardArray.forEach((letter, i) => {
      if (!isIn(boardArray[i], Sudoku.DIGITS.split("")) && boardArray[i] !== Sudoku.BLANK_CHAR) {
        return errorAsCoordinates ? this._coordinates_of(i) : `Invalid board character ${letter} encountered at index ${i
        }: ${boardArray[i]}`;
      }
    });

    // Otherwise, we're good. Return true.
    return true;
  }

  public assign(candidates: Record<string,string>, square: string, val: string): boolean|Record<string,string> {
    /* Eliminate all values, *except* for `val`, from `candidates` at
        `square` (candidates[square]), and propagate. Return the candidates map
        when finished. If a contradiciton is found, return false.

        WARNING: This will modify the contents of `candidates` directly.
    */

    // Grab a list of canidates without 'val'
    const other_vals = candidates[square] ? candidates[square].replace(val, '').split("") : [];

    // Loop through all other values and eliminate them from the candidates
    // at the current square, and propigate. If at any point we get a
    // contradiction, return false.
    for (const ovi in other_vals) {
      const other_val = other_vals[ovi];

      const candidates_next = this.eliminate(candidates, square, other_val);

      if (!candidates_next) {
        // console.log("Contradiction found by _eliminate.");
        return false;
      }
    }

    return candidates;
  }

  public eliminate (candidates:Record<string,string>, square: string, val: string): boolean|Record<string,string> {
    /* Eliminate `val` from `candidates` at `square`, (candidates[square]),
        and propagate when values or places <= 2. Return updated candidates,
        unless a contradiction is detected, in which case, return false.

        WARNING: This will modify the contents of `candidates` directly.
      */

    // If `val` has already been eliminated from candidates[square], return
    // with candidates.
    if (!isIn(val, candidates[square].split(""))) {
      return candidates;
    }

    // Remove `val` from candidates[square]
    candidates[square] = candidates[square].replace(val, '');

    // If the square has only candidate left, eliminate that value from its
    // peers
    const nr_candidates = candidates[square].length;
    if (nr_candidates === 1) {
      const target_val = candidates[square];

      for (const pi in Object.keys(this.SQUARE_PEERS_MAP[square])) {
        const peer = this.SQUARE_PEERS_MAP[square][pi];

        const candidates_new = this.eliminate(candidates, peer, target_val);

        if (!candidates_new) {
          return false;
        }
      }

      // Otherwise, if the square has no candidates, we have a contradiction.
      // Return false.
    } if (nr_candidates === 0) {
      return false;
    }

    // If a unit is reduced to only one place for a value, then assign it
    for (const ui in Object.keys(this.SQUARE_UNITS_MAP[square])) {
      const unit = this.SQUARE_UNITS_MAP[square][ui];

      const val_places = [];
      for (const si in unit) {
        const unit_square = unit[si];
        if (isIn(val, candidates[unit_square].split(""))) {
          val_places.push(unit_square);
        }
      }

      // If there's no place for this value, we have a contradition!
      // return false
      if (val_places.length === 0) {
        return false;

        // Otherwise the value can only be in one place. Assign it there.
      } if (val_places.length === 1) {
        const candidates_new = this.assign(candidates, val_places[0], val);

        if (!candidates_new) {
          return false;
        }
      }
    }

    return candidates;
  

  }

}
