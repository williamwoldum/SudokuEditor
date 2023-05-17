import { reportError, reportSuccess } from './StatusHandler'

export function handleSudocodeUploadClick(): void {
  document.getElementById('upload-sudocode-input')?.click()
}

export function handleOverlayUploadClick(): void {
  document.getElementById('upload-overlay-input')?.click()
}

export function handleSudocodeUpload(e: Event): void {
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
