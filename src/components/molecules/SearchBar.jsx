import { useState } from 'react'
import { motion } from 'framer-motion'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'

const SearchBar = ({ onSearch, placeholder = "Search...", className = '' }) => {
  const [query, setQuery] = useState('')
  
  const handleSearch = (value) => {
    setQuery(value)
    onSearch(value)
  }
  
  const clearSearch = () => {
    setQuery('')
    onSearch('')
  }
  
  return (
    <div className={`relative ${className}`}>
      <Input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
        icon="Search"
        iconPosition="left"
        className="pr-10"
      />
      
      {query && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={clearSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <ApperIcon name="X" size={16} />
        </motion.button>
      )}
    </div>
  )
}

export default SearchBar