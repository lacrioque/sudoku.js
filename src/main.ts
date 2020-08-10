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

export default function getSudoku(): SudokuCollection {
    const instance = new Sudoku();
    const generator = new SudokuGenerator(instance);
    const solver = new SudokuSolver(instance);
    const getCandidates = new SudokuGetCandidates(instance);
    
    return {
        instance,
        generator,
        solver,
        getCandidates,
        conversions
    }
}
