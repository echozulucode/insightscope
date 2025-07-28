import React, { useState } from 'react'
import Toolbar from './components/Toolbar'
import Sidebar, { View } from './components/Sidebar'
import HomeView from './views/HomeView'
import SettingsView from './views/SettingsView'
import ProfileView from './views/ProfileView'
import ScatterPlotView from './views/ScatterPlotView'
import ChartContainer from './views/ChartContainer'
import StatusBar from './components/StatusBar'
import Toast from './components/Toast'

function App(): React.JSX.Element {
  const [activeView, setActiveView] = useState<View>('home')
  const [isStatusBarVisible, setStatusBarVisibility] = useState(true)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToastMessage(message)
  }

  return (
    <div className="h-screen bg-gray-100 flex">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-grow flex flex-col">
        <Toolbar />
        <main className="flex-grow bg-white overflow-hidden">
          <div className={activeView === 'home' ? 'block' : 'hidden'}><HomeView /></div>
          <div className={activeView === 'settings' ? 'block' : 'hidden'}><SettingsView /></div>
          <div className={activeView === 'profile' ? 'block' : 'hidden'}><ProfileView /></div>
          <div className={activeView === 'scatterplot' ? 'block h-full' : 'hidden'}><ScatterPlotView /></div>
          <div className={activeView === 'chartviewer' ? 'block h-full' : 'hidden'}><ChartContainer /></div>
        </main>
        {isStatusBarVisible && <StatusBar />}
      </div>
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  )
}

export default App
