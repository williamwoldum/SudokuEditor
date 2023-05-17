import './style.css'
import {
  handleSudocodeUpload,
  handleSudocodeUploadClick,
  handleOverlayUploadClick
} from './handlers/UploadHandler'
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
  .getElementById('upload-sudocode-btn')!
  .addEventListener('click', handleSudocodeUploadClick)
document
  .getElementById('upload-sudocode-input')!
  .addEventListener('change', handleSudocodeUpload)
document
  .getElementById('upload-overlay-btn')!
  .addEventListener('click', handleOverlayUploadClick)

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

const params = new URL(window.location.toString()).searchParams
const id = params.get('id') ?? '000000'

const sudocodeScript = document.createElement('script')
sudocodeScript.setAttribute('src', `/Sudoku/${id}.js`)
sudocodeScript.onload = () => {
  EditorHandler.updateSudokuHandler()
}
document.head.appendChild(sudocodeScript)
