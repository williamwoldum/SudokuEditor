// eslint-disable-next-line no-unused-vars
export class SudokuHandler {
  private readonly title: string
  private readonly author: string
  private readonly description: string
  private readonly sudoku: number[][]
  private readonly predicates: PredicateCollection

  constructor(sdkrLoad: SdkrLoad) {
    this.title = sdkrLoad.title
    this.author = sdkrLoad.author
    this.description = sdkrLoad.description
    this.sudoku = sdkrLoad.sudoku
    this.predicates = sdkrLoad.predicates
  }

  public getTitle = (): string => this.title
  public getAuthor = (): string => this.author
  public getDescription = (): string => this.description
  public getSudoku = (): number[][] => this.sudoku

  public validate(cells: number[][]): PredicateResult {
    return this.predicates.rootRule([], cells)
  }

  public static getEmptySudokuHandler(): SudokuHandler {
    const sdkrLoad: SdkrLoad = {
      title: '',
      author: '',
      description: '',
      sudoku: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
      ],
      predicates: {
        rootRule: (_params: number[], _cells: number[][]) => ({
          passed: true,
          name: 'rootRule',
          children: []
        })
      }
    }
    return new SudokuHandler(sdkrLoad)
  }
}

type Predicate = (params: number[], cells: number[][]) => PredicateResult

interface PredicateResult {
  passed: boolean
  name: string
  children: PredicateResult[]
}

interface PredicateCollection {
  [key: string]: Predicate
  rootRule: Predicate
}

interface SdkrLoad {
  title: string
  author: string
  description: string
  sudoku: number[][]
  predicates: PredicateCollection
}
