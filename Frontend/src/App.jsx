import { useState } from 'react'
import AuthScreen from './components/auth/AuthScreen'
import ReviewLayout from './components/ReviewLayout'

function App() {
  const [screen, setScreen] = useState('login')

  return (
    screen === 'dashboard'
      ? <ReviewLayout onNavigate={setScreen} />
      : <AuthScreen mode={screen} onNavigate={setScreen} />
  )
}

export default App
