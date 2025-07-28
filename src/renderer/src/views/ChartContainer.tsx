import React, { useState, useEffect, useRef, useCallback } from 'react'
import Papa from 'papaparse'
import { FaFileCsv, FaTimes } from 'react-icons/fa'
import ChartView from './ChartView'
import ChartControls, { LayoutMode } from '../components/ChartControls'
import Toast from '../components/Toast'

interface ChartTab {
  id: string
  name: string
  data: Plotly.Data[]
  layout: Partial<Plotly.Layout>
  layoutMode: LayoutMode
  yAxisAssignments: { [traceName: string]: 'y' | 'y2' }
  fitToScreen: boolean
}

const ChartContainer: React.FC = () => {
  const [tabs, setTabs] = useState<ChartTab[]>([])
  const [activeTabId, setActiveTabId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [chartAreaHeight, setChartAreaHeight] = useState(0)
  const mainContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setChartAreaHeight(entry.contentRect.height)
      }
    })
    if (mainContentRef.current) {
      resizeObserver.observe(mainContentRef.current)
    }
    return () => resizeObserver.disconnect()
  }, [])

  const showToast = (message: string) => {
    setToastMessage(message)
  }

  const handleOpenFile = useCallback(async () => {
    const filePath = await window.api.openFile()
    if (filePath) {
      const fileContent = await window.api.readFile(filePath)
      if (fileContent) {
        const parsed = Papa.parse(fileContent, { header: true })
        const headers = parsed.meta.fields?.slice(1) ?? []
        const timeColumn = parsed.meta.fields?.[0] ?? 'time'

        const traces: Plotly.Data[] = headers.map((header) => ({
          x: parsed.data.map((row) => row[timeColumn]),
          y: parsed.data.map((row) => row[header]),
          name: header,
          type: 'scatter',
          mode: 'lines'
        }))

        const yAxisAssignments = headers.reduce((acc, header) => {
          acc[header] = 'y'
          return acc
        }, {})

        const newTab: ChartTab = {
          id: filePath,
          name: filePath.split(/[\\/]/).pop() ?? 'Untitled',
          data: traces,
          layout: {
            title: `Chart for ${filePath}`,
            xaxis: { title: timeColumn },
            yaxis: { title: 'Value' }
          },
          layoutMode: 'combined',
          yAxisAssignments,
          fitToScreen: false
        }

        setTabs((prevTabs) => [...prevTabs, newTab])
        setActiveTabId(newTab.id)
      } else {
        showToast('Error reading file content.')
      }
    }
  }, [])

  useEffect(() => {
    const cleanup = window.api.onOpenCsv(handleOpenFile)
    return cleanup
  }, [handleOpenFile])

  const handleLayoutModeChange = (tabId: string, mode: LayoutMode) => {
    setTabs(tabs.map((tab) => (tab.id === tabId ? { ...tab, layoutMode: mode } : tab)))
  }

  const handleAssignY2 = (tabId: string) => {
    setTabs(
      tabs.map((tab) => {
        if (tab.id === tabId && tab.data.length > 1) {
          const secondTraceName = tab.data[1].name
          if (secondTraceName) {
            return {
              ...tab,
              yAxisAssignments: { ...tab.yAxisAssignments, [secondTraceName]: 'y2' }
            }
          }
        }
        return tab
      })
    )
  }

  const handleFitToScreenChange = (tabId: string, isFit: boolean) => {
    setTabs(tabs.map((tab) => (tab.id === tabId ? { ...tab, fitToScreen: isFit } : tab)))
  }

  const handleCloseTab = (e: React.MouseEvent, tabIdToClose: string) => {
    e.stopPropagation() // Prevent the click from activating the tab
    setTabs((prevTabs) => {
      const newTabs = prevTabs.filter((tab) => tab.id !== tabIdToClose)
      if (activeTabId === tabIdToClose) {
        const closedTabIndex = prevTabs.findIndex((tab) => tab.id === tabIdToClose)
        const newActiveTab = newTabs[closedTabIndex - 1] ?? newTabs[0]
        setActiveTabId(newActiveTab?.id ?? null)
      }
      return newTabs
    })
  }

  const activeTab = tabs.find((tab) => tab.id === activeTabId)

  const getChartData = (tab: ChartTab): Plotly.Data[] => {
    if (tab.layoutMode === 'stacked') {
      return tab.data.map((trace, index) => {
        const axisNumber = index === 0 ? '' : index + 1
        return { ...trace, xaxis: `x${axisNumber}`, yaxis: `y${axisNumber}` }
      })
    }
    return tab.data.map((trace) => ({ ...trace, yaxis: tab.yAxisAssignments[trace.name ?? ''] ?? 'y1' }))
  }

  const getLayout = (tab: ChartTab): Partial<Plotly.Layout> => {
    const baseLayout = { ...tab.layout, showlegend: true, margin: { l: 80, r: 80, t: 50, b: 50 } }

    if (tab.layoutMode === 'stacked') {
      const traceCount = tab.data.length
      if (traceCount === 0) return { ...baseLayout, height: chartAreaHeight }

      const totalHeight = tab.fitToScreen ? chartAreaHeight : 240 * traceCount

      const newLayout: Partial<Plotly.Layout> = {
        ...baseLayout,
        grid: { rows: traceCount, columns: 1, pattern: 'independent', ygap: 0.05 },
        height: totalHeight
      }

      tab.data.forEach((trace, index) => {
        const axisNumber = index === 0 ? '' : index + 1
        const yAxisName = `yaxis${axisNumber}`
        const xAxisName = `xaxis${axisNumber}`
        const isLastTrace = index === traceCount - 1

        newLayout[yAxisName] = {
          title: { text: tab.fitToScreen ? '' : trace.name },
          autorange: true
        }
        newLayout[xAxisName] = {
          ...tab.layout.xaxis,
          autorange: true,
          matches: index > 0 ? 'x' : undefined,
          showticklabels: tab.fitToScreen ? isLastTrace : true
        }
      })
      return newLayout
    }

    const newLayout = { ...baseLayout, yaxis: { title: 'Value' }, height: chartAreaHeight }
    const hasY2 = Object.values(tab.yAxisAssignments).includes('y2')
    if (hasY2) {
      newLayout.yaxis2 = { title: 'Secondary Value', overlaying: 'y', side: 'right' }
    }
    return newLayout
  }

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <div className="flex border-b border-gray-300 bg-gray-200">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`group flex items-center justify-between cursor-pointer border-r border-gray-300 ${
              activeTabId === tab.id ? 'bg-white text-gray-800' : 'text-gray-600 hover:bg-gray-300'
            }`}
          >
            <div className="flex items-center px-4 py-2">
              <FaFileCsv className="mr-2" />
              <span>{tab.name}</span>
            </div>
            <button
              onClick={(e) => handleCloseTab(e, tab.id)}
              className={`p-1 rounded-md ml-2 mr-2 opacity-0 group-hover:opacity-100 hover:bg-gray-400 ${
                activeTabId === tab.id ? 'opacity-100' : ''
              }`}
              title="Close"
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
      {activeTab && (
        <ChartControls
          layoutMode={activeTab.layoutMode}
          onLayoutModeChange={(mode) => handleLayoutModeChange(activeTab.id, mode)}
          onAssignY2={() => handleAssignY2(activeTab.id)}
          traceCount={activeTab.data.length}
          isFitToScreen={activeTab.fitToScreen}
          onFitToScreenChange={(isFit) => handleFitToScreenChange(activeTab.id, isFit)}
        />
      )}
      <main ref={mainContentRef} className="flex-grow p-4 overflow-y-auto min-h-0">
        {activeTab ? (
          <ChartView data={getChartData(activeTab)} layout={getLayout(activeTab)} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">No file opened</h2>
              <p>Use the File menu to open a CSV file.</p>
            </div>
          </div>
        )}
      </main>
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  )
}

export default ChartContainer

