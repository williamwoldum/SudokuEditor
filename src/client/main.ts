import './style.css'
import { handleSdkrUpload, handleUploadClick } from './handlers/UploadHandler'
import EditorHandler from './handlers/EditorHandler'

const darkModeToggle = document.getElementById(
  'darkmode-toggle'
) as HTMLInputElement
darkModeToggle.addEventListener('change', toggleDarkMode)
darkModeToggle.checked = localStorage.theme === 'dark'

document.getElementById('reset-btn')!.addEventListener('click', () => {
  EditorHandler.resetSudoku()
})
document
  .getElementById('upload-btn')!
  .addEventListener('click', handleUploadClick)
document
  .getElementById('upload-input')!
  .addEventListener('change', handleSdkrUpload)

updateDarkMode()

function toggleDarkMode(e: Event): void {
  const toggle = e.target as HTMLInputElement
  if (toggle.checked) localStorage.theme = 'dark'
  else localStorage.theme = 'light'
  updateDarkMode()
  EditorHandler.updateColorMode()
}

function updateDarkMode(): void {
  if (localStorage.theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
