import Cell from './Cell'
import { Constraint, ConstraintState } from './Constraint'

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
  constraints: Constraint[]

  constructor(
    author: string,
    description: string,
    comment: string,
    date: Date,
    source: string,
    level: string,
    url: string,
    cells: Cell[],
    constraints: Constraint[]
  ) {
    this.author = author
    this.description = description
    this.comment = comment
    this.date = date
    this.source = source
    this.level = level
    this.url = url
    this.cells = cells
    this.constraints = constraints
  }

  static GetEmptySudoku(): Sudoku {
    const emptyCells: Cell[] = []
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        emptyCells.push(new Cell(0, false, y, x))
      }
    }

    const constraints: Constraint[] = []

    const uniquePredicate = (cells: Cell[], _: number[]): ConstraintState => {
      if (cells[0].value === cells[1].value) return ConstraintState.Broken
      else return ConstraintState.Okay
    }

    const AddUniquePredicateOnCollection = (cells: Cell[]): void => {
      for (let i = 0; i < cells.length; i++) {
        for (let j = i + 1; j < cells.length; j++) {
          constraints.push(
            new Constraint(
              uniquePredicate,
              [cells[i], cells[j]],
              [],
              `${cells[i].name} is not unique to ${cells[j].name}`
            )
          )
        }
      }
    }

    for (let i = 0; i < 9; i++) {
      const row = emptyCells.filter((cell) => cell.row === i)
      const col = emptyCells.filter((cell) => cell.col === i)
      const box = emptyCells.filter((cell) => cell.box === i)
      AddUniquePredicateOnCollection(row)
      AddUniquePredicateOnCollection(col)
      AddUniquePredicateOnCollection(box)
    }

    return new Sudoku(
      '',
      '',
      '',
      new Date(),
      '',
      '',
      '',
      emptyCells,
      constraints
    )
  }
}
