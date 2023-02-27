import './style.css'
import {
  handleSdkClick,
  handleSdkrClick,
  handleSdkInput,
  handleSdkrInput
} from './handlers/UploadHandler'
import EditorHandler from './handlers/EditorHandler'

const darkModeToggle = document.getElementById(
  'darkmode-toggle'
) as HTMLInputElement
darkModeToggle.addEventListener<'change'>('change', toggleDarkMode)
darkModeToggle.checked = localStorage.theme === 'dark'

document.getElementById('reset-btn')!.addEventListener<'click'>('click', () => {
  EditorHandler.resetSudoku()
})
document
  .getElementById('sdk-btn')!
  .addEventListener<'click'>('click', handleSdkClick)
document
  .getElementById('sdkr-btn')!
  .addEventListener<'click'>('click', handleSdkrClick)
document
  .getElementById('sdk-input')!
  .addEventListener<'change'>('change', handleSdkInput)
document
  .getElementById('sdkr-input')!
  .addEventListener<'change'>('change', handleSdkrInput)

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
