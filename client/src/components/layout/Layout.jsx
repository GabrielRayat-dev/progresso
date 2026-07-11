export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}