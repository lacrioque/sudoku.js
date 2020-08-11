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
}

export default function getSudoku(debug=false): SudokuCollection {
    const instance = new Sudoku(debug);
    const generator = new SudokuGenerator(instance,debug);
    const solver = new SudokuSolver(instance,debug);
    const getCandidates = new SudokuGetCandidates(instance,debug);
    
    return {
        instance,
        generator,
        solver,
        getCandidates,
        conversions
    }
}
