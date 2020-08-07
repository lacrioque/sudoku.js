export default {
  // Conversions
  // -------------------------------------------------------------------------
  board_string_to_grid(board_string: string): Array<string> {
    /* Convert a board string to a two-dimensional array
        */
    const rows = [];
    let cur_row = [];
    for (let i in board_string) {
      cur_row.push(board_string[i]);
      if (i % 9 == 8) {
        rows.push(cur_row);
        cur_row = [];
      }
    }
    return rows;
  };

  board_grid_to_string(board_grid: Array<string>): string {
    /* Convert a board grid to a string
        */
    let board_string = '';
    for (let r = 0; r < 9; ++r) {
      for (let c = 0; c < 9; ++c) {
        board_string += board_grid[r][c];
      }
    }
    return board_string;
  };
}