import React from 'react'
import { FaFile, FaFolderOpen, FaSave, FaUndo, FaRedo } from 'react-icons/fa'

interface ToolbarProps {}

const Toolbar: React.FC<ToolbarProps> = () => {
  const buttons = [
    { id: 'new', tooltip: 'New File', icon: <FaFile /> },
    { id: 'open', tooltip: 'Open File', icon: <FaFolderOpen /> },
    { id: 'save', tooltip: 'Save File', icon: <FaSave /> },
    { id: 'undo', tooltip: 'Undo', icon: <FaUndo /> },
    { id: 'redo', tooltip: 'Redo', icon: <FaRedo /> }
  ]

  return (
    <div className="bg-gray-200 border-b border-gray-300 p-2 flex items-center space-x-2">
      {buttons.map((button) => (
        <button
          key={button.id}
          title={button.tooltip}
          className="p-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {button.icon}
        </button>
      ))}
    </div>
  )
}

export default Toolbar
