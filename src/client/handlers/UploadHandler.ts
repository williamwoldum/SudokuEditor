import { reportError, reportSuccess } from './StatusHandler'
import EditorHandler from './EditorHandler'
import { SudokuHandler } from '../models/SudokuHandler'

export function handleUploadClick(): void {
  document.getElementById('upload-input')?.click()
}

export function handleSdkrUpload(e: Event): void {
  const target = e.target as HTMLInputElement
  const file = (target.files as FileList)[0]

  const fr = new FileReader()
  fr.onload = async () => {
    const sdkText = fr.result as string

    try {
      const response = await fetch('/api/get-sudoku-handler', {
        method: 'POST',
        headers: {
          Accept: 'application/javascript',
          'Content-Type': 'text/plain;charset=UTF-8'
        },
        body: sdkText
      })

      const sdkrLoadTxt = await response.text()
      // eslint-disable-next-line no-eval
      const sdkrLoad = eval(sdkrLoadTxt)
      EditorHandler.setSudokuHandler(new SudokuHandler(sdkrLoad))

      reportSuccess('Upload succesful')
    } catch (e) {
      if (e instanceof Error) reportError(e.message)
    }
  } // Not implemented yet
  fr.readAsText(file)
}
