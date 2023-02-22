import Sudoku from './models/sudoku'

export function parseSdk(sdkText: string): Sudoku {
  return new Sudoku()
}
