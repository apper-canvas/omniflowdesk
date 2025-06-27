import Sidebar from '@/components/organisms/Sidebar'

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}

export default Layout