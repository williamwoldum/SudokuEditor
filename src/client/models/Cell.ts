export default class Cell {
  value: number
  isLocked: boolean
  row: number
  col: number
  idx: number
  neighbors: number[]
  orthogonal: number[]

  constructor(value: number, isLocked: boolean, row: number, col: number) {
    this.value = value
    this.isLocked = isLocked
    this.row = row
    this.col = col
    this.idx = row * 9 + col
    this.neighbors = this.getNeighbors(row, col)
    this.orthogonal = this.getOrthogonal(row, col)
  }

  public checkIfOrthogonal(otherCell: Cell): boolean {
    return this.orthogonal.includes(otherCell.idx)
  }

  public checkIfNeighbors(otherCell: Cell): boolean {
    return this.neighbors.includes(otherCell.idx)
  }

  private getNeighbors(row: number, col: number): number[] {
    const neighbors = []

    for (let y = -1; y < 2; y++) {
      for (let x = -1; x < 2; x++) {
        if (y === 0 && x === 0) continue

        const newCol = col + x
        const newRow = row + y

        if (newCol < 0 || newCol >= 9) continue
        if (newRow < 0 || newRow >= 9) continue

        neighbors.push(newRow * 9 + newCol)
      }
    }
    return neighbors
  }

  private getOrthogonal(row: number, col: number): number[] {
    const neighbors = []

    for (let y = -1; y < 2; y++) {
      for (let x = -1; x < 2; x++) {
        if (y === 0 && x === 0) continue
        if (Math.abs(y) === Math.abs(x)) continue

        const newCol = col + x
        const newRow = row + y

        if (newCol < 0 || newCol >= 9) continue
        if (newRow < 0 || newRow >= 9) continue

        neighbors.push(newRow * 9 + newCol)
      }
    }
    return neighbors
  }
}
