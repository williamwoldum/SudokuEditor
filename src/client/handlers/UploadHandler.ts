import { reportError } from './StatusHandler'
import { parseSdk } from './SudokuParser'
import EditorHandler from './editorHandler'

export function handleSdkClick(): void {
  document.getElementById('sdk-input')?.click()
}

export function handleSdkrClick(): void {
  document.getElementById('sdkr-input')?.click()
}

export function handleSdkInput(e: Event): void {
  const target = e.target as HTMLInputElement
  const file = (target.files as FileList)[0]

  const fr = new FileReader()
  fr.onload = () => {
    const sdkText = fr.result as string

    try {
      const sudoku = parseSdk(sdkText)
      EditorHandler.setSudoku(sudoku)
    } catch (e) {
      if (e instanceof Error) reportError(e.message)
    }
  }
  fr.readAsText(file)
}

export function handleSdkrInput(e: Event): void {
  const target = e.target as HTMLInputElement
  const file = (target.files as FileList)[0]

  const fr = new FileReader()
  fr.onload = () => {} // Not implemented yet
  fr.readAsText(file)
}
