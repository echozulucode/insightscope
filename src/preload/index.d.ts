import { ElectronAPI } from '@electron-toolkit/preload'

interface ICustomAPI {
  openFile: () => Promise<string | undefined>
  onOpenCsv: (callback: () => void) => () => void // Returns a cleanup function
  readFile: (filePath: string) => Promise<string | null>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: ICustomAPI
  }
}
