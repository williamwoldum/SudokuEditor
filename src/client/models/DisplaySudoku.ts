import DisplayCell from './DisplayCell'

export default class DisplaySudoku {
  cells: DisplayCell[]
  selected: number[] = []

  constructor(cells: DisplayCell[]) {
    if (cells.length !== 81) {
      throw Error()
    }
    this.cells = cells
  }

  public reset(): void {
    this.cells.forEach((cell) => {
      if (!cell.isLocked) cell.value = 0
    })
  }

  public getNums(): number[] {
    return this.cells.map((cell) => cell.value)
  }

  public getNumsGrid(): number[][] {
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

  static getEmpty(): DisplaySudoku {
    const cells: DisplayCell[] = []
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        cells.push(new DisplayCell(0, false, y, x))
      }
    }

    return new DisplaySudoku(cells)
  }

  static set(numGrid: number[][]): DisplaySudoku {
    const cells: DisplayCell[] = []
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        const val = numGrid[y][x]
        const cell = new DisplayCell(val, false, y, x)
        if (val > 0) cell.isLocked = true
        cells.push(cell)
      }
    }

    return new DisplaySudoku(cells)
  }
}
