import { useState } from 'react'

function App() {
  const [clicks, setClicks] = useState(0)

  return (
    <main className="container">
      <span className="badge">Phase 1 · Setup check</span>
      <h1>Stayora</h1>
      <p>Find Your Perfect Stay.</p>

      <div className="card">
        <h2>It works!</h2>
        <p>
          React, Vite and our colour palette are running. Click the button to
          confirm React state is working.
        </p>
        <button className="btn" onClick={() => setClicks(clicks + 1)}>
          Clicked {clicks} {clicks === 1 ? 'time' : 'times'}
        </button>
      </div>
    </main>
  )
}

export default App