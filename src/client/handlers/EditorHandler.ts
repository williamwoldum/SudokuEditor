import DisplaySudoku from '../models/DisplaySudoku'
import P5 from 'p5'

class EditorHandler {
  private _sudokuHandler!: Sudoku
  private _sudoku!: DisplaySudoku
  private readonly _canvas: P5
  private _darkmodeEnabled: boolean = localStorage.theme === 'dark'

  constructor() {
    this._canvas = new P5(this.sketch)
  }

  public updateSudokuHandler(): void {
    this._sudokuHandler = new Sudoku()
    this._sudoku = DisplaySudoku.getEmpty()
    this.updateInfoBoxes()
    this.checkConstraints()
    this._canvas.draw()
  }

  public resetSudoku(): void {
    this._sudoku.reset()
    this.checkConstraints()
    this._canvas.draw()
  }

  public updateColorMode(): void {
    this._darkmodeEnabled = localStorage.theme === 'dark'
    this._canvas.draw()
  }

  private updateInfoBoxes(): void {
    const expsElem = document.getElementById('sdk-explanation')
    const exps = this._sudokuHandler.getExplanations()

    for (const constraint of Object.keys(exps)) {
      const pElem = document.createElement('p')
      const nameElem = document.createElement('span')
      const expElem = document.createElement('p')

      nameElem.textContent = `${constraint.slice(1)}: `
      nameElem.classList.add(
        'bg-gray-100',
        'dark:bg-gray-700',
        'px-1',
        'font-semibold',
        'text-xs'
      )

      pElem.appendChild(nameElem)
      expElem.textContent = exps[constraint]
      pElem.appendChild(expElem)
      expsElem!.appendChild(pElem)
    }
  }

  private updateConstraintBox(
    namedAssertions: NamedAssertion[],
    namedErrors: NamedError[]
  ): void {
    const cBox = document.getElementById('constraint-box')

    cBox!.innerHTML = ''

    if (namedErrors.length > 0) {
      namedErrors.forEach((nemedError) => {
        const errorElem = document.createElement('p')
        errorElem.classList.add(
          'text-gray-500',
          'dark:text-gray-400',
          'text-xs',
          'whitespace-nowrap',
          'space-x-2',
          'flex'
        )

        const badgeElem = document.createElement('span')
        badgeElem.textContent = `${nemedError.name.slice(1)}`
        badgeElem.classList.add(
          'bg-gray-200',
          'dark:bg-gray-600',
          'px-1',
          'font-semibold',
          'hover:cursor-pointer',
          'text-xs',
          'text-red-500'
        )
        errorElem.appendChild(badgeElem)

        const msgElem = document.createElement('p')
        msgElem.textContent = nemedError.error
        errorElem.appendChild(msgElem)
        cBox!.appendChild(errorElem)
      })
      return
    }

    if (namedAssertions.length === 0) {
      const noRulesElem = document.createElement('p')
      noRulesElem.classList.add('italic', 'text-gray-400', 'text-xs')
      noRulesElem.textContent = 'No rule breaks'
      cBox!.appendChild(noRulesElem)
      return
    }

    namedAssertions.forEach((namedAssertion) => {
      const ruleElem = document.createElement('p')
      ruleElem.classList.add(
        'text-gray-500',
        'dark:text-gray-400',
        'text-xs',
        'whitespace-nowrap',
        'space-x-2',
        'flex'
      )

      const badgeElem = document.createElement('span')
      badgeElem.textContent = `${namedAssertion.name.slice(1)}`
      badgeElem.classList.add(
        'bg-gray-200',
        'dark:bg-gray-600',
        'px-1',
        'font-semibold',
        'hover:cursor-pointer',
        'text-xs'
      )
      badgeElem.onclick = () => {
        this._sudoku.selected = []
        this._sudoku.selected = namedAssertion.assertion.cells.map(
          (cell) => (cell.row - 1) * 9 + (cell.col - 1)
        )
        this._canvas.draw()
      }
      ruleElem.appendChild(badgeElem)

      const msgElem = document.createElement('p')
      msgElem.textContent = namedAssertion.assertion.message
      ruleElem.appendChild(msgElem)

      namedAssertion.assertion.cells.forEach((cell) => {
        const cellElem = document.createElement('span')
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        cellElem.textContent = cell.toString()
        cellElem.classList.add(
          'bg-gray-200',
          'dark:bg-gray-600',
          'px-1',
          'font-semibold',
          'text-xs',
          'hover:cursor-pointer',
          'z-30'
        )
        cellElem.onclick = () => {
          this._sudoku.selected = []
          this._sudoku.selected = [(cell.row - 1) * 9 + (cell.col - 1)]
          this._canvas.draw()
        }
        ruleElem.appendChild(cellElem)
      })
      cBox!.appendChild(ruleElem)
    })
  }

  private placeDigit(idx: number, digit: number): void {
    if (!this._sudoku.cells[idx].isLocked) {
      this._sudoku.cells[idx].value = digit
      this.checkConstraints()
    }
  }

  private checkConstraints(): void {
    this._sudoku.cells.forEach((cell) => {
      cell.isBroken = false
    })

    const constraintResults = this._sudokuHandler.checkAllConstraints(
      this._sudoku.getNums()
    )
    const failedAssertions = this.formatAssertions(constraintResults)
    const failedErrors = this.formatErrors(constraintResults)

    for (const namedAssertion of failedAssertions) {
      for (const cell of namedAssertion.assertion.cells) {
        const idx = (cell.row - 1) * 9 + (cell.col - 1)
        this._sudoku.cells[idx].isBroken = true
      }
    }

    this.updateConstraintBox(failedAssertions, failedErrors)
  }

  private formatAssertions(
    constraintsAssertions: constraintsResult
  ): NamedAssertion[] {
    const formattedConstraints: NamedAssertion[] = []
    for (const name of Object.keys(constraintsAssertions)) {
      for (const assertion of constraintsAssertions[name].results) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
        if (assertion.passed === false) {
          formattedConstraints.push({ name, assertion })
        }
      }
    }
    return formattedConstraints
  }

  private formatErrors(constraintsAssertions: constraintsResult): NamedError[] {
    const formattedErrors: NamedError[] = []
    for (const name of Object.keys(constraintsAssertions)) {
      for (const error of constraintsAssertions[name].errors) {
        formattedErrors.push({ name, error })
      }
    }
    return formattedErrors
  }

  sketch = (p5: P5): void => {
    const tileSize = 40
    const blue300 = p5.color('#93c5fd')
    const blue700 = p5.color('#1d4ed8')
    const red300 = p5.color('#fca5a5')
    const red700 = p5.color('#b91c1c')
    const gray200 = p5.color('#e5e7eb')
    const gray400 = p5.color('#9ca3af')
    const gray500 = p5.color('#6b7280')
    const gray600 = p5.color('#4b5563')
    const gray700 = p5.color('#374151')
    const gray800 = p5.color('#1f2937')

    let overlayImg: P5.Image

    p5.setup = () => {
      const canvas = p5.createCanvas(tileSize * 9 + 2, tileSize * 9 + 2)
      canvas.parent('canvasContainer')
      p5.cursor('pointer')
      p5.textAlign(p5.CENTER, p5.CENTER)
      p5.noLoop()

      const input = document.getElementById('upload-overlay-input')
      input!.addEventListener('change', setOverlay, false)
    }

    p5.draw = (): void => {
      p5.background(this._darkmodeEnabled ? gray800 : p5.color(255))
      drawOverlay()
      drawGrid()
      drawDigits()
      drawSelection()
    }

    const setOverlay = (e: Event): void => {
      const target = e.target as HTMLInputElement
      const file = (target.files as FileList)[0]

      if (file.type === 'image/png' || file.type === 'image/jpeg') {
        const urlOfImageFile = URL.createObjectURL(file)
        overlayImg = p5.loadImage(urlOfImageFile, formatOverlay)
      }
    }

    const formatOverlay = (): void => {
      if (overlayImg !== undefined) {
        overlayImg.loadPixels()

        for (let y = 0; y < overlayImg.height; y++) {
          for (let x = 0; x < overlayImg.width; x++) {
            const index = (y * overlayImg.width + x) * 4

            const r = overlayImg.pixels[index + 0]
            const g = overlayImg.pixels[index + 1]
            const b = overlayImg.pixels[index + 2]

            if (r + g + b > 700) {
              overlayImg.pixels[index + 3] = 0
            } else {
              overlayImg.pixels[index + 0] = 156
              overlayImg.pixels[index + 1] = 163
              overlayImg.pixels[index + 2] = 175
            }
          }
        }

        overlayImg.updatePixels()
      }
      p5.draw()
    }

    const drawOverlay = (): void => {
      if (overlayImg !== undefined) {
        p5.image(overlayImg, 0, 0, p5.width, p5.height)
      }
    }

    const drawGrid = (): void => {
      p5.stroke(this._darkmodeEnabled ? gray700 : gray200)
      for (let i = 0; i < 10; i++) {
        p5.strokeWeight(i % 3 === 0 ? 4 : 2)
        p5.line(i * tileSize + 1, 1, i * tileSize + 1, p5.height + 1)
        p5.line(1, i * tileSize + 1, p5.width + 1, i * tileSize + 1)
      }
    }

    const drawDigits = (): void => {
      p5.noStroke()
      p5.textSize(20)

      this._sudoku.cells.forEach((cell) => {
        if (this._darkmodeEnabled) {
          cell.isLocked ? p5.fill(gray400) : p5.fill(blue300)
          if (cell.isBroken) p5.fill(red300)
        } else {
          cell.isLocked ? p5.fill(gray600) : p5.fill(blue700)
          if (cell.isBroken) p5.fill(red700)
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
        gray400.setAlpha(5)
        p5.fill(gray400)
        p5.square(cell.col * tileSize + 1, cell.row * tileSize + 1, tileSize)
        gray400.setAlpha(255)
      })

      const strokeWeight = 3

      p5.strokeCap(p5.SQUARE)
      p5.strokeWeight(strokeWeight)
      p5.stroke(this._darkmodeEnabled ? gray500 : gray400)

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
interface NamedAssertion {
  name: string
  assertion: Assertion
}

interface NamedError {
  name: string
  error: string
}

export default new EditorHandler()
