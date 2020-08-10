import Sudoku from "./sudoku";

  const board_string_to_grid = (board_string: string): Array<string> => {
    /* Convert a board string to a two-dimensional array  */
    const rows = [];
    const boardStringArray = board_string.split("");
    let cur_row = [];
    for (const i in boardStringArray) {
      cur_row.push(boardStringArray[i]);
      if (parseInt(i) % 9 == 8) {
        rows.push(cur_row);
        cur_row = [];
      }
    }
    return rows;
  };
  const board_grid_to_string = (board_grid: Array<string>): string => {
    /* Convert a board grid to a string */
    let board_string = '';
    for (let r = 0; r < 9; ++r) {
      for (let c = 0; c < 9; ++c) {
        board_string += board_grid[r][c];
      }
    }
    return board_string;
  }
  const board_string_to_object = (board_string: string): Record<string,string> => {
    /* Convert a board object from a string */
    const boardStringArray = board_string.split("");
    const boardObject = {};
    let boardStringIterator = 0;
    Sudoku.ROWS.split("").forEach((row) => {
      Sudoku.COLS.split("").forEach(col => {
        boardObject[`${row}${col}`] = boardStringArray[boardStringIterator];
        boardStringIterator++;
      });
    });
    return boardObject;
  }
  const board_object_to_string = (boardObject: Record<string,string>): string => {
    /* Convert a board object from a string */
    const boardStringArray = []
    let boardStringIterator = 0;
    Sudoku.ROWS.split("").forEach((row) => {
      Sudoku.COLS.split("").forEach(col => {
        boardStringArray[boardStringIterator] = boardObject[`${row}${col}`];
        boardStringIterator++;
      });
    });
    return boardStringArray.join("");
  }

export {board_string_to_grid, board_grid_to_string, board_string_to_object, board_object_to_string};

export default {
  stringToGrid: board_string_to_grid,
  gridToString: board_grid_to_string,
  stringToObject: board_string_to_object,
  objectToString: board_object_to_string
}