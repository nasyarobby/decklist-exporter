import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import axios from 'axios'
import Pin from './Pin'
import Admin from './Admin'
import './App.css'

type ExportStatus = 'idle' | 'exporting' | 'success' | 'error'

type Card = {
  index: number
  count: number
  name: string
  expansion: string
  number: string
  image: string
}

type DeckResponse = {
  message: string
  id: string
  name: string
  cards: Card[]
  url: string
}

function DecklistExporter() {
  const [decklistCode, setDecklistCode] = useState('')
  const [trainerName, setTrainerName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [status, setStatus] = useState<ExportStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [deckData, setDeckData] = useState<DeckResponse | null>(null)

  const exportDecklist = async (name: string, code: string, phone: string) => {
    return await axios.post('/api/decks', { name, code, phone })
  }

  const handleReset = () => {
    setDecklistCode('')
    setTrainerName('')
    setPhoneNumber('')
    setStatus('idle')
    setErrorMessage('')
    setDeckData(null)
  }

  const validatePhoneNumber = (phone: string): boolean => {
    // Must be numbers only, start with 08, and longer than 6 digits
    const phoneRegex = /^08\d+$/
    return phoneRegex.test(phone) && phone.length > 6
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!trainerName.trim()) {
      setErrorMessage('Please enter a trainer\'s name')
      setStatus('error')
      return
    }

    if (!decklistCode.trim()) {
      setErrorMessage('Please enter a decklist code')
      setStatus('error')
      return
    }

    if (!phoneNumber.trim()) {
      setErrorMessage('Please enter a phone number')
      setStatus('error')
      return
    }

    if (!validatePhoneNumber(phoneNumber.trim())) {
      setErrorMessage('Phone number must start with 08, contain only numbers, and be longer than 6 digits')
      setStatus('error')
      return
    }

    setStatus('exporting')
    setErrorMessage('')

    try {
      const response = await exportDecklist(trainerName.trim(), decklistCode.trim(), phoneNumber.trim())
      setDeckData(response.data)
      setStatus('success')
    } catch (error) {
      setStatus('error')
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data?.message || 'Failed to export decklist')
      } else {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to export decklist')
      }
    }
  }


  return (
    <div className="app">
      <img src="/banner.jpeg" alt="Banner" className="banner" />
      <h1>Decklist Exporter</h1>

      {status === 'success' && deckData ? (
        <div className="card">
          <div className="success-header">
            <h2>✓ Deck Created Successfully</h2>
            <div className="deck-code">
              <strong>Deck Code:</strong>
              <span className="code-value">{deckData.id}</span>
            </div>
            <div className="deck-name">
              <strong>Trainer:</strong> {deckData.name}
            </div>
          </div>

          <div className="cards-section">
            <h3>Cards</h3>
            <div className="cards-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {deckData.cards.map((card, index) => (
                    <tr key={index}>
                      <td>{card.name} ({card.expansion}/{card.number})</td>
                      <td>{card.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="success-actions">
            <button
              onClick={handleReset}
              className="submit-button"
            >
              Submit Another Decklist
            </button>
          </div>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="card">
            <div className="form-group">
              <label htmlFor="trainer-name">Trainer's name</label>
              <input
                id="trainer-name"
                type="text"
                value={trainerName}
                onChange={(e) => setTrainerName(e.target.value)}
                placeholder="Enter trainer's name"
                disabled={status === 'exporting'}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone-number">Phone Number</label>
              <input
                id="phone-number"
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="08XXXXXXXX"
                disabled={status === 'exporting'}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="decklist-code">Decklist Code</label>
              <input
                id="decklist-code"
                type="text"
                value={decklistCode}
                onChange={(e) => setDecklistCode(e.target.value)}
                placeholder="example: xjWavy-BLGRUg-alyCYf"
                disabled={status === 'exporting'}
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'exporting'}
              className="submit-button"
            >
              {status === 'exporting' ? 'Exporting...' : 'Export Decklist'}
            </button>
          </form>

          {status === 'exporting' && (
            <div className="status-message exporting">
              <div className="loading-indicator">
                <div className="spinner"></div>
              </div>
              <p>Exporting decklist...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="status-message error">
              <p>✗ Error: {errorMessage || 'An error occurred'}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<DecklistExporter />} />
      <Route path="/staff" element={<DecklistExporter />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/pin" element={<Pin />} />
    </Routes>
  )
}

export default App
