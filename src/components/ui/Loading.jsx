import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const Loading = ({ type = 'default' }) => {
  const [isViewportReady, setIsViewportReady] = useState(false)
  
  useEffect(() => {
    // Ensure viewport is stable before rendering chart-related components
    const checkViewport = () => {
      if (document.readyState === 'complete' && window.innerWidth > 0 && window.innerHeight > 0) {
        setIsViewportReady(true)
      }
    }
    
    checkViewport()
    window.addEventListener('load', checkViewport)
    window.addEventListener('resize', checkViewport)
    
    return () => {
      window.removeEventListener('load', checkViewport)
      window.removeEventListener('resize', checkViewport)
    }
  }, [])
  
  if (type === 'table') {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="glass-card rounded-xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gradient-to-r from-primary-200 to-secondary-200 rounded w-1/3"></div>
                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/2"></div>
              </div>
              <div className="w-24 h-8 bg-gradient-to-r from-accent-200 to-accent-300 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card rounded-xl p-6">
            <div className="space-y-4">
              <div className="h-6 bg-gradient-to-r from-primary-200 to-secondary-200 rounded w-3/4"></div>
              <div className="h-8 bg-gradient-to-r from-accent-200 to-accent-300 rounded w-1/2"></div>
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-full"></div>
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      {isViewportReady ? (
        <motion.div
          className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      ) : (
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
      )}
      <div className="text-center space-y-2">
        <div className="h-6 bg-gradient-to-r from-primary-200 to-secondary-200 rounded w-32 mx-auto animate-pulse"></div>
        <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-48 mx-auto animate-pulse"></div>
      </div>
    </div>
  )
}

export default Loading