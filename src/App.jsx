import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Component } from 'react'
import Layout from '@/components/organisms/Layout'
import Dashboard from '@/components/pages/Dashboard'
import Contacts from '@/components/pages/Contacts'
import Deals from '@/components/pages/Deals'
import Activities from '@/components/pages/Activities'

// Error Boundary to catch ApexCharts viewport errors
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    // Check if it's an ApexCharts viewport error
    if (error?.message?.includes('viewport') || error?.message?.includes('ApexCharts')) {
      return { hasError: true, error }
    }
    return null
  }

  componentDidCatch(error, errorInfo) {
    // Log viewport/ApexCharts errors for debugging
    if (error?.message?.includes('viewport') || error?.message?.includes('ApexCharts')) {
      console.warn('ApexCharts viewport error caught:', error.message)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
          <div className="glass-card rounded-2xl p-8 max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Loading Error</h2>
            <p className="text-gray-600 mb-4">There was an issue initializing the application.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/activities" element={<Activities />} />
            </Routes>
          </Layout>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            style={{ zIndex: 9999 }}
          />
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App