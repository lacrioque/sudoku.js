import Sudoku from "./components/sudoku";
import SudokuGenerator from "./components/generator";
import SudokuSolver from "./components/solve";
import SudokuGetCandidates from "./components/get-candidates";
import conversions from "./components/conversions";

interface SudokuCollection {
    instance: Sudoku;
    generator: SudokuGenerator;
    solver: SudokuSolver;
    getCandidates: SudokuGetCandidates;
    conversions: typeof conversions;
    statics: Record<string,unknown>;
}

export default function getSudoku(debug=false): SudokuCollection {
    const instance = new Sudoku(debug);
    const generator = new SudokuGenerator(instance,debug);
    const solver = new SudokuSolver(instance,debug);
    const getCandidates = new SudokuGetCandidates(instance,debug);
    const statics = Object.freeze({
        DIGITS: Sudoku.DIGITS,
        ROWS: Sudoku.ROWS,
        COLS: Sudoku.COLS,
        DIFFICULTY: Sudoku.DIFFICULTY,
        BLANK_CHAR: Sudoku.BLANK_CHAR,
        BLANK_BOARD: Sudoku.BLANK_BOARD,
        MIN_GIVENS: Sudoku.MIN_GIVENS,
        NR_SQUARES: Sudoku.NR_SQUARES,
        BLOCKS: instance.BLOCKS
    });
    
    return {
        statics,
        instance,
        generator,
        solver,
        getCandidates,
        conversions
    }
}
