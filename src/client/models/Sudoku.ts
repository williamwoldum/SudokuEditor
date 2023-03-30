import Cell from './Cell'

export default class Sudoku {
  cells: Cell[]
  selected: number[] = []

  constructor(cells: Cell[]) {
    this.cells = cells
  }

  public reset(): void {
    this.cells.forEach((cell) => {
      if (!cell.isLocked) cell.value = 0
    })
  }

  public getNumGrid(): number[][] {
    const numGrid: number[][] = []
    for (let y = 0; y < 9; y++) {
      const row: number[] = []
      for (let x = 0; x < 9; x++) {
        row.push(this.cells[y * 9 + x].value)
      }
      numGrid.push(row)
    }
    return numGrid
  }

  static set(numGrid: number[][]): Sudoku {
    const cells: Cell[] = []
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        const val = numGrid[y][x]
        const cell = new Cell(val, false, y, x)
        if (val > 0) cell.isLocked = true
        cells.push(cell)
      }
    }

    return new Sudoku(cells)
  }
}
