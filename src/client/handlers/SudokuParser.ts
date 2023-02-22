import Cell from '../models/Cell'
import Sudoku from '../models/sudoku'

export function parseSdk(sdkText: string): Sudoku {
  sdkText = sdkText.replaceAll('\r', '')
  const re =
    /^#.+\n#D.+\n#C.+\n#B\d{2}-\d{2}-\d{4}\n#S.+\n#L.+\n#U.+\n([1-9.]{9}\n){8}[1-9.]{9}$/
  const parsed = re.test(sdkText)

  if (!parsed) throw new Error('.sdk file could not pass check syntax here')

  const data = sdkText.split('\n')
  const author = data[0].slice(2)
  const description = data[1].slice(2)
  const comment = data[2].slice(2)
  const date = new Date(data[3].slice(2))
  const source = data[4].slice(2)
  const level = data[5].slice(2)
  const url = data[6].slice(2)
  const cells: Cell[] = []

  for (let y = 0; y < 9; y++) {
    const row = data[7 + y].split('')
    for (let x = 0; x < 9; x++) {
      const val = row[x] === '.' ? 0 : parseInt(row[x])
      const isLocked = val !== 0
      cells.push(new Cell(val, isLocked, y, x))
    }
  }

  return new Sudoku(
    author,
    description,
    comment,
    date,
    source,
    level,
    url,
    cells
  )
}
