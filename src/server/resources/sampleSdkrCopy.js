// eslint-disable-next-line no-unused-vars
class SudokuHandler {
  #title
  #author
  #description
  #initialSudoku
  #currentSudoku
  #predicates

  constructor() {
    this.#title = 'A classic Dudoku'
    this.#author = 'William Woldum'
    this.#description = 'Normal Sudoku rules apply'

    this.#initialSudoku = [
      [0, 0, 0, 0, 0, 3, 2, 0, 0],
      [0, 0, 0, 7, 0, 0, 0, 0, 0],
      [0, 4, 0, 0, 9, 0, 0, 0, 0],
      [0, 0, 0, 0, 8, 0, 9, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 4],
      [0, 0, 0, 0, 0, 6, 0, 0, 0],
      [0, 0, 0, 0, 0, 7, 0, 5, 0],
      [0, 5, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
    this.#currentSudoku = [
      [0, 0, 0, 0, 0, 3, 2, 0, 0],
      [0, 0, 0, 7, 0, 0, 0, 0, 0],
      [0, 4, 0, 0, 9, 0, 0, 0, 0],
      [0, 0, 0, 0, 8, 0, 9, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 4],
      [0, 0, 0, 0, 0, 6, 0, 0, 0],
      [0, 0, 0, 0, 0, 7, 0, 5, 0],
      [0, 5, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]

    this.#predicates = {
      rootRule: (params, cells) => {
        const results = []
        let passed = true

        results.push(
          this.#predicates.uniqueCollection(
            [],
            [
              [
                cells[0][0],
                cells[0][1],
                cells[0][2],
                cells[0][3],
                cells[0][4],
                cells[0][5],
                cells[0][6],
                cells[0][7],
                cells[0][8]
              ]
            ]
          )
        )
        passed = passed && results.at(-1).passed

        return {
          passed,
          name: 'rootRule',
          children: results
        }
      },

      uniqueCollection: (params, cells) => {
        //
        const results = []
        let passed = true

        //
        for (let i = 0; i < cells[0].length; i++) {
          for (let j = i + 1; j < cells[0].length; j++) {
            results.push(
              this.#predicates.unique([], [[cells[0][i]], [cells[0][j]]])
            )
            passed = passed && results.at(-1).passed
          }
        }

        //
        return {
          passed,
          name: 'uniqueCollection',
          children: results
        }
      },

      unique: (params, cells) => {
        //
        const results = []
        let passed = true

        //
        results.push({
          passed: cells[0][0].val !== cells[1][0].val,
          name: '',
          children: []
        })
        passed = passed && results.at(-1).passed

        //
        return {
          passed,
          name: 'unique',
          children: results
        }
      }
    }
  }

  /// ////////////////////////////////////////////////////////////////////

  getTitle() {
    return this.#title
  }

  getAuthor() {
    return this.#author
  }

  getDescription() {
    return this.#description
  }

  getInitialSudoku() {
    return this.#initialSudoku
  }

  getCurrentSudoku() {
    return this.#currentSudoku
  }

  validate() {
    return this.#predicates.rootRule([], this.#currentSudoku)
  }

  setCell(row, col, val) {
    this.#currentSudoku[row][col] = val
  }
}
