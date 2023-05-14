declare class Sudoku {
  constructor()
  checkAllConstraints(values: number[]): Record<string, Assertion[]>
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
