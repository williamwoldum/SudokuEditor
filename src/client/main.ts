import './style.css'
import {
  handleSdkClick,
  handleSdkrClick,
  handleSdkInput,
  handleSdkrInput
} from './handlers/UploadHandler'

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
