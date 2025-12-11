export default function StyleTest() {
  return (
    <div>
      {/* Inline styles for comparison */}
      <div style={{ backgroundColor: 'red', padding: '20px', minHeight: '100vh' }}>
        <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '20px' }}>
          INLINE STYLES TEST
        </h1>
        <p style={{ color: 'white' }}>This uses inline styles - should always work</p>
      </div>
      
      {/* Tailwind CSS styles */}
      <div className="bg-blue-500 p-8 min-h-screen">
        <h1 className="text-white text-4xl mb-8">TAILWIND CSS TEST</h1>
        <p className="text-white">This uses Tailwind classes - should work if CSS is compiled</p>
        
        <div className="mt-8 space-y-4">
          <div className="bg-green-500 p-4 rounded-lg">
            <p className="text-white">Green box with Tailwind</p>
          </div>
          <div className="bg-yellow-500 p-4 rounded-lg">
            <p className="text-black">Yellow box with Tailwind</p>
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
            Purple button
          </button>
        </div>
      </div>
    </div>
  )
}