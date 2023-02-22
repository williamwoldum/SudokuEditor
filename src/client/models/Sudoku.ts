import Cell from './Cell'

export default class Sudoku {
  author: string
  description: string
  comment: string
  date: Date
  source: string
  level: string
  url: string
  cells: Cell[]
  selected: number[] = []

  constructor(
    author: string,
    description: string,
    comment: string,
    date: Date,
    source: string,
    level: string,
    url: string,
    cells: Cell[]
  ) {
    this.author = author
    this.description = description
    this.comment = comment
    this.date = date
    this.source = source
    this.level = level
    this.url = url
    this.cells = cells
  }

  static GetEmptySudoku(): Sudoku {
    const emptyCells = []
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        emptyCells.push(new Cell(0, false, y, x))
      }
    }

    return new Sudoku('', '', '', new Date(), '', '', '', emptyCells)
  }
}
