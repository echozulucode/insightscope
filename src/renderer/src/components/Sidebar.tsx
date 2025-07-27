import React, { useState, useEffect, useRef } from 'react'
import { FaHome, FaCog, FaUser, FaFileAlt, FaChess, FaEllipsisH, FaUpload, FaProjectDiagram, FaRegMap } from 'react-icons/fa'

export type View = 'home' | 'settings' | 'profile'

interface NavItem {
  id: View
  tooltip: string
  icon: React.ReactElement
}

interface SidebarProps {
  activeView: View
  setActiveView: (view: View) => void
}

const navItems: NavItem[] = [
  { id: 'home', tooltip: 'Home', icon: <FaHome /> },
  { id: 'profile', tooltip: 'Profile', icon: <FaUser /> },
  { id: 'settings', tooltip: 'Settings', icon: <FaCog /> }
]

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const [visibleItems, setVisibleItems] = useState<NavItem[]>(navItems)
  const [hiddenItems, setHiddenItems] = useState<NavItem[]>([])
  const [isPopoverVisible, setPopoverVisible] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    const calculateVisibleItems = () => {
      if (!sidebarRef.current) return

      const sidebarHeight = sidebarRef.current.offsetHeight
      // Estimate the height per item (icon + padding/margin). Adjust this value as needed.
      const itemHeight = 60 // Approx 56px + 4px margin
      const maxVisible = Math.floor((sidebarHeight - 40) / itemHeight) // Subtract padding and space for ellipsis

      if (navItems.length > maxVisible) {
        setVisibleItems(navItems.slice(0, maxVisible -1))
        setHiddenItems(navItems.slice(maxVisible - 1))
      } else {
        setVisibleItems(navItems)
        setHiddenItems([])
      }
    }

    calculateVisibleItems()

    const resizeObserver = new ResizeObserver(calculateVisibleItems)
    if (sidebarRef.current) {
      resizeObserver.observe(sidebarRef.current)
    }

    return () => {
      if (sidebarRef.current) {
        resizeObserver.unobserve(sidebarRef.current)
      }
    }
  }, [])

  const NavButton: React.FC<{ item: NavItem; isPopover?: boolean }> = ({ item, isPopover = false }) => (
    <button
      key={item.id}
      ref={(el) => {
        const index = navItems.findIndex((navItem) => navItem.id === item.id)
        if (index !== -1) itemRefs.current[index] = el
      }}
      title={item.tooltip}
      onClick={() => {
        setActiveView(item.id)
        if (isPopover) setPopoverVisible(false)
      }}
      className={`p-3 rounded-lg w-full flex justify-center hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
        activeView === item.id ? 'bg-gray-900' : ''
      } ${isPopover ? 'text-left' : ''}`}
    >
      {item.icon}
    </button>
  )

  return (
    <div ref={sidebarRef} className="bg-gray-800 text-white w-16 flex flex-col items-center space-y-1 py-4 relative">
      <div className="flex flex-col items-center space-y-1 w-full px-2">
        {visibleItems.map((item) => (
          <NavButton key={item.id} item={item} />
        ))}
      </div>

      {hiddenItems.length > 0 && (
        <div className="mt-auto w-full px-2">
          <button
            title="More"
            onClick={() => setPopoverVisible(!isPopoverVisible)}
            className="p-3 rounded-lg w-full flex justify-center hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <FaEllipsisH />
          </button>
        </div>
      )}

      {isPopoverVisible && hiddenItems.length > 0 && (
        <div className="absolute left-full ml-2 bottom-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-2 w-48 z-10">
          <div className="flex flex-col space-y-1">
            {hiddenItems.map((item) => (
              <button
                key={item.id}
                title={item.tooltip}
                onClick={() => {
                  setActiveView(item.id)
                  setPopoverVisible(false)
                }}
                className={`p-2 rounded-md w-full flex items-center space-x-3 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                  activeView === item.id ? 'bg-gray-900' : ''
                }`}
              >
                {item.icon}
                <span>{item.tooltip}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar
