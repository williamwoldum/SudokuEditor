import Sudoku from '../models/sudoku'
import P5 from 'p5'
import { type Constraint, ConstraintState } from '../models/Constraint'

class EditorHandler {
  private _sudoku: Sudoku
  private readonly _canvas: P5

  constructor() {
    this._sudoku = Sudoku.GetEmptySudoku()
    // eslint-disable-next-line no-new
    this._canvas = new P5(this.sketch)
  }

  public setSudoku(sdk: Sudoku): void {
    this._sudoku = sdk
    this.updateInfoBoxes()
    this._canvas.draw()
  }

  public setConstraints(constraints: Constraint[]): void {
    this._sudoku.constraints = constraints
    this._canvas.draw()
  }

  private updateInfoBoxes(): void {
    const desc = document.getElementById('sdk-description')
    const auth = document.getElementById('sdk-author')

    desc!.textContent = this._sudoku.description
    auth!.textContent = this._sudoku.author

    desc?.classList.remove('hidden')
    auth?.classList.remove('hidden')
  }

  private updateConstraintBox(messages: string[]): void {
    const cBox = document.getElementById('constraint-box')
    cBox!.innerHTML = ''
    messages.forEach((msg) => {
      const p = document.createElement('p')
      p.textContent = msg
      cBox!.appendChild(p)
    })
  }

  private placeDigit(idx: number, digit: number): void {
    if (!this._sudoku.cells[idx].isLocked) {
      this._sudoku.cells[idx].value = digit

      const messages = this.checkConstraints()
      this.updateConstraintBox(messages)
    }
  }

  private checkConstraints(): string[] {
    const messages: string[] = []

    this._sudoku.cells.forEach((cell) => {
      cell.isBroken = false
    })

    this._sudoku.constraints.forEach((constraint) => {
      if (constraint.isOkay() === ConstraintState.Broken) {
        constraint.cells.forEach((cell) => {
          cell.isBroken = true
        })
        messages.push(constraint.message)
      }
    })
    return messages
  }

  sketch = (p5: P5): void => {
    const tileSize = 70

    p5.setup = () => {
      const canvas = p5.createCanvas(tileSize * 9 + 2, tileSize * 9 + 2)
      canvas.parent('canvasContainer')
      p5.cursor('pointer')
      p5.textAlign(p5.CENTER, p5.CENTER)
      p5.noLoop()
    }

    p5.draw = (): void => {
      p5.background(255)
      drawGrid()
      drawDigits()
      drawSelection()
    }

    const drawGrid = (): void => {
      p5.stroke(180)
      for (let i = 0; i < 10; i++) {
        p5.strokeWeight(i % 3 === 0 ? 2 : 1)
        p5.line(i * tileSize + 1, 1, i * tileSize + 1, p5.height + 1)
        p5.line(1, i * tileSize + 1, p5.width + 1, i * tileSize + 1)
      }
    }

    const drawDigits = (): void => {
      p5.noStroke()
      p5.textSize(32)

      this._sudoku.cells.forEach((cell) => {
        cell.isLocked ? p5.fill(50) : p5.fill(65, 105, 225)

        if (cell.isBroken) {
          p5.fill(255, 100, 100)
        }

        if (cell.value > 0) {
          p5.text(
            cell.value,
            cell.col * tileSize + 1 + tileSize / 2,
            cell.row * tileSize + 1 + tileSize / 2
          )
        }
      })
    }

    const drawSelection = (): void => {
      const edges: Array<[number, number]> = []
      const allSelected = this._sudoku.selected

      allSelected.forEach((selected) => {
        const orthogonal = this._sudoku.cells[selected].orthogonal

        orthogonal.forEach((orthogonal) => {
          if (!allSelected.includes(orthogonal)) {
            edges.push([selected, orthogonal])
          }
        })

        const cell = this._sudoku.cells[selected]
        p5.fill(65, 105, 225, 20)
        p5.square(cell.col * tileSize + 1, cell.row * tileSize + 1, tileSize)
      })

      const strokeWeight = 2

      p5.strokeCap(p5.SQUARE)
      p5.strokeWeight(strokeWeight)
      p5.stroke(65, 105, 225)

      edges.forEach((edge) => {
        const selected = this._sudoku.cells[edge[0]]
        const orthogonal = this._sudoku.cells[edge[1]]

        const selectedIsTop = selected.idx === orthogonal.idx - 9
        const selectedIsLeft = selected.idx === orthogonal.idx - 1
        const selectedIsBottom = orthogonal.idx === selected.idx - 9
        const selectedIsRight = orthogonal.idx === selected.idx - 1

        let sx, sy, ex, ey

        if (selectedIsTop) {
          sx = selected.col * tileSize - strokeWeight / 2
          ex = (selected.col + 1) * tileSize + strokeWeight / 2
          sy = ey = orthogonal.row * tileSize
        } else if (selectedIsLeft) {
          sx = ex = orthogonal.col * tileSize
          sy = selected.row * tileSize - strokeWeight / 2
          ey = (selected.row + 1) * tileSize + strokeWeight / 2
        } else if (selectedIsBottom) {
          sx = selected.col * tileSize - strokeWeight / 2
          ex = (selected.col + 1) * tileSize + strokeWeight / 2
          sy = ey = selected.row * tileSize
        } else if (selectedIsRight) {
          sx = ex = selected.col * tileSize
          sy = selected.row * tileSize - strokeWeight / 2
          ey = (selected.row + 1) * tileSize + strokeWeight / 2
        } else {
          throw Error('Given cells are not orthogonal')
        }

        p5.line(sx + 1, sy + 1, ex + 1, ey + 1)
      })
    }

    p5.mousePressed = (): void => {
      if (mouseInBounds()) {
        const row = Math.floor((p5.mouseY + 1) / tileSize)
        const col = Math.floor((p5.mouseX + 1) / tileSize)
        const idx = row * 9 + col

        if (p5.keyIsDown(p5.SHIFT) && !this._sudoku.selected.includes(idx)) {
          this._sudoku.selected.unshift(idx)
        } else if (p5.keyIsDown(p5.SHIFT)) {
          this._sudoku.selected.splice(this._sudoku.selected.indexOf(idx), 1)
        } else this._sudoku.selected = [idx]
        p5.draw()
      }
    }

    p5.mouseDragged = (): void => {
      if (mouseInBounds()) {
        const row = Math.floor((p5.mouseY + 1) / tileSize)
        const col = Math.floor((p5.mouseX + 1) / tileSize)
        const idx = row * 9 + col
        if (!this._sudoku.selected.includes(idx)) {
          this._sudoku.selected.push(idx)
        }
        p5.draw()
      }
    }

    p5.doubleClicked = (): void => {
      if (mouseInBounds()) {
        const row = Math.floor((p5.mouseY + 1) / tileSize)
        const col = Math.floor((p5.mouseX + 1) / tileSize)
        const idx = row * 9 + col
        const cell = this._sudoku.cells[idx]
        this._sudoku.selected = this._sudoku.cells
          .filter((selected) => selected.value === cell.value)
          .map((selected) => selected.idx)
        p5.draw()
      }
    }

    p5.keyPressed = (): void => {
      const selected = this._sudoku.selected
      const key = parseInt(p5.key)
      if (key >= 0 && key <= 9) {
        selected.forEach((selected) => {
          this.placeDigit(selected, key)
        })
        p5.draw()
      } else if (p5.keyCode === p5.BACKSPACE || p5.keyCode === p5.DELETE) {
        selected.forEach((selected) => {
          this.placeDigit(selected, 0)
        })
        p5.draw()
      } else if (p5.keyCode === p5.ESCAPE) {
        this._sudoku.selected = []
        p5.draw()
      } else if (
        (selected.length > 0 && p5.keyCode === p5.LEFT_ARROW) ||
        p5.keyCode === p5.RIGHT_ARROW ||
        p5.keyCode === p5.UP_ARROW ||
        p5.keyCode === p5.DOWN_ARROW
      ) {
        const cell = this._sudoku.cells[selected[0]]
        let row = 0
        let col = 0

        switch (p5.keyCode) {
          case p5.LEFT_ARROW:
            row = cell.row
            col = cell.col === 0 ? 8 : cell.col - 1
            break
          case p5.RIGHT_ARROW:
            row = cell.row
            col = cell.col === 8 ? 0 : cell.col + 1
            break
          case p5.UP_ARROW:
            row = cell.row === 0 ? 8 : cell.row - 1
            col = cell.col
            break
          case p5.DOWN_ARROW:
            row = cell.row === 8 ? 0 : cell.row + 1
            col = cell.col
            break
          default:
            break
        }

        const idx = row * 9 + col

        if (p5.keyIsDown(p5.SHIFT) && !selected.includes(idx)) {
          selected.unshift(idx)
        } else if (p5.keyIsDown(p5.SHIFT)) {
          selected.unshift(selected.splice(selected.indexOf(idx), 1)[0])
        } else this._sudoku.selected = [idx]
        p5.draw()
      }
    }

    const mouseInBounds = (): boolean =>
      p5.mouseX >= 0 &&
      p5.mouseX <= p5.width - 4 &&
      p5.mouseY >= 0 &&
      p5.mouseY <= p5.height - 4
  }
}

export default new EditorHandler()
