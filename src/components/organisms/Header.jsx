import { useState, useContext } from 'react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { AuthContext } from '@/App'
const Header = ({ title, onAddNew, onSearch, showAddButton = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAuthenticated } = useSelector((state) => state.user)
  const { logout } = useContext(AuthContext)
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 mb-8 shadow-lg"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {onSearch && (
            <SearchBar
              onSearch={onSearch}
              placeholder={`Search ${title.toLowerCase()}...`}
              className="w-64"
            />
          )}
          
          {showAddButton && onAddNew && (
            <Button
              onClick={onAddNew}
              icon="Plus"
              variant="primary"
              className="shrink-0"
            >
              Add New
            </Button>
          )}
          
<button className="p-2 text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors duration-200">
            <ApperIcon name="Bell" size={20} />
          </button>
          
          {isAuthenticated && (
            <Button
              onClick={logout}
              variant="ghost"
              icon="LogOut"
              className="text-gray-500 hover:text-gray-700"
              size="sm"
            >
              Logout
            </Button>
          )}
          
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
            {isAuthenticated && user ? (
              <span className="text-white text-sm font-semibold">
                {(user.firstName || user.name || '?').charAt(0).toUpperCase()}
              </span>
            ) : (
              <ApperIcon name="User" size={20} className="text-white" />
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header