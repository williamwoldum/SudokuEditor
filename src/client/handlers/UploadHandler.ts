import { reportError, reportSuccess } from './StatusHandler'
// import EditorHandler from './EditorHandler'
// import { SudokuHandler } from '../models/SudokuHandler'

export function handleUploadClick(): void {
  document.getElementById('upload-input')?.click()
}

export function handleSdkrUpload(e: Event): void {
  const target = e.target as HTMLInputElement
  const file = (target.files as FileList)[0]

  const formData = new FormData()
  formData.append('file', file)

  fetch('/api/upload-sudoku', {
    method: 'POST',
    body: formData
  })
    // eslint-disable-next-line @typescript-eslint/promise-function-async
    .then((response) => response.text())
    .then((id) => {
      window.location.href = `/index.html?id=${id}`
      reportSuccess('Upload succesful')
    })
    .catch((error) => {
      reportError(error.message)
    })
}
