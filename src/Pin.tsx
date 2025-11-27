import { useState, useEffect } from 'react'
import './App.css'

function Pin() {
  const [pin, setPin] = useState('')
  const [encodedValue, setEncodedValue] = useState<string | null>(null)

  useEffect(() => {
    if (pin.length === 8 && /^\d+$/.test(pin)) {
      // Split into first 4 and last 4 digits
      const firstFour = pin.substring(0, 4)
      const lastFour = pin.substring(4, 8)
      
      // Join with ":"
      const joined = `${firstFour}:${lastFour}`
      
      // Base64 encode
      const encoded = btoa(joined)
      
      // Store in localStorage
      localStorage.setItem('pin', encoded)
      setEncodedValue(encoded)
    } else {
      setEncodedValue(null)
    }
  }, [pin])

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 8)
    setPin(value)
  }

  return (
    <div className="app">
      <img src="/banner.jpeg" alt="Banner" className="banner" />
      <h1>PIN Entry</h1>
      
      <div className="card">
        <div className="form-group">
          <label htmlFor="pin-input">8-Digit PIN</label>
          <input
            id="pin-input"
            type="text"
            value={pin}
            onChange={handlePinChange}
            placeholder="Enter 8-digit PIN"
            maxLength={8}
            className="input-field"
            style={{ 
              fontSize: '2rem', 
              textAlign: 'center',
              letterSpacing: '0.5rem',
              fontFamily: 'monospace'
            }}
          />
        </div>

        {pin.length === 8 && encodedValue && (
          <div className="success-header">
            <div className="deck-code">
              <strong>Saved</strong>
            </div>
            </div>
        )}

        {pin.length > 0 && pin.length < 8 && (
          <div className="status-message" style={{ 
            background: 'rgba(156, 39, 176, 0.25)',
            color: '#ce93d8',
            border: '1px solid rgba(186, 104, 200, 0.4)'
          }}>
            <p>Enter {8 - pin.length} more digit{8 - pin.length !== 1 ? 's' : ''}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Pin

