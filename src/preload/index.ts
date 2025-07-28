import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  openFile: (): Promise<string | undefined> => ipcRenderer.invoke('dialog:openFile'),
  onOpenCsv: (callback: () => void) => {
    const handler = (): void => callback()
    ipcRenderer.on('menu:open-csv', handler)
    // Return a cleanup function
    return () => {
      ipcRenderer.removeListener('menu:open-csv', handler)
    }
  },
  readFile: (filePath: string): Promise<string | null> => ipcRenderer.invoke('fs:readFile', filePath)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
