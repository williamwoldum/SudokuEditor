declare class Sudoku {
  constructor()
  checkAllConstraints(values: number[]): constraintsResult
  getExplanations(): Record<string, string>
}

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
interface constraintsResult {
  [key: string]: {
    results: Assertion[]
    errors: string[]
  }
}

declare interface Assertion {
  passed: boolean
  cells: Cell[]
  message: string
}

declare interface Cell {
  row: number
  col: number
  val: number
}
