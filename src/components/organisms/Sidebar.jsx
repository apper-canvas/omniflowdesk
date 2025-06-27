import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
    { name: 'Contacts', href: '/contacts', icon: 'Users' },
    { name: 'Deals', href: '/deals', icon: 'Target' },
    { name: 'Activities', href: '/activities', icon: 'Calendar' },
  ]
  
  return (
    <motion.div
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className={`bg-white/95 backdrop-blur-xl border-r border-gray-200/50 h-screen sticky top-0 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
            <ApperIcon name="Zap" size={20} className="text-white" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <h1 className="text-xl font-bold text-gray-900 font-display">
                  FlowDesk
                </h1>
                <p className="text-xs text-gray-500 font-body">CRM</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <nav className="px-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-primary text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <ApperIcon 
                name={item.icon} 
                size={20} 
                className={`${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`}
              />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-medium font-body"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          )
        })}
      </nav>
      
      <div className="absolute bottom-6 left-4 right-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center py-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <ApperIcon 
            name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'} 
            size={20} 
          />
        </button>
      </div>
    </motion.div>
  )
}

export default Sidebar