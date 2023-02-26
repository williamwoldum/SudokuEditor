import type Cell from './Cell'

export enum ConstraintState {
  Broken,
  Uncheckable,
  Okay
}

export class Constraint {
  predicate: (cells: Cell[], params: number[]) => ConstraintState
  cells: Cell[]
  params: number[]
  message: string

  constructor(
    predicate: (cells: Cell[], params: number[]) => ConstraintState,
    cells: Cell[],
    params: number[],
    message: string
  ) {
    this.predicate = predicate
    this.cells = cells
    this.params = params
    this.message = message
  }

  isOkay(): ConstraintState {
    for (const cell of this.cells) {
      if (cell.value === 0) return ConstraintState.Uncheckable
    }
    return this.predicate(this.cells, this.params)
  }
}
