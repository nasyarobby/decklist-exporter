import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

type Player = {
  id: string
  name: string
  deckCode: string | null
  deckUrl: string | null
}

function Admin() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [registeringPlayerId, setRegisteringPlayerId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editDeckCode, setEditDeckCode] = useState('')
  const [registerDeckCode, setRegisterDeckCode] = useState('')

  useEffect(() => {
    fetchPlayers()
  }, [])

  const fetchPlayers = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/players')
      setPlayers(response.data)
      setError('')
    } catch (err) {
      setError('Failed to load players')
      if (axios.isAxiosError(err)) {
        console.error('Error fetching players:', err.response?.data)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (player: Player) => {
    setEditingPlayer(player)
    setEditName(player.name)
    setEditDeckCode(player.deckCode || '')
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (!editingPlayer) return

    try {
      await axios.put(`/api/players/${editingPlayer.id}`, {
        name: editName,
        deckCode: editDeckCode || undefined,
      })
      setShowEditModal(false)
      setEditingPlayer(null)
      fetchPlayers()
    } catch (err) {
      setError('Failed to update player')
      if (axios.isAxiosError(err)) {
        console.error('Error updating player:', err.response?.data)
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this player?')) {
      return
    }

    try {
      await axios.delete(`/api/players/${id}`)
      fetchPlayers()
    } catch (err) {
      setError('Failed to delete player')
      if (axios.isAxiosError(err)) {
        console.error('Error deleting player:', err.response?.data)
      }
    }
  }

  const handleRegisterDeck = (player: Player) => {
    setRegisteringPlayerId(player.id)
    setRegisterDeckCode(player.deckCode || '')
    setShowRegisterModal(true)
  }

  const handleSaveRegisterDeck = async () => {
    if (!registeringPlayerId) return

    try {
      await axios.put(`/api/players/${registeringPlayerId}`, {
        deckCode: registerDeckCode,
      })
      setShowRegisterModal(false)
      setRegisteringPlayerId(null)
      fetchPlayers()
    } catch (err) {
      setError('Failed to register deck')
      if (axios.isAxiosError(err)) {
        console.error('Error registering deck:', err.response?.data)
      }
    }
  }

  return (
    <div className="app">
      <img src="/banner.jpeg" alt="Banner" className="banner" />
      <h1>Player Management</h1>

      <div className="card">
        {error && (
          <div className="status-message error">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="status-message exporting">
            <div className="loading-indicator">
              <div className="spinner"></div>
            </div>
            <p>Loading players...</p>
          </div>
        ) : (
          <div className="cards-table">
            <table>
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Name</th>
                  <th>Deck Code</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {players.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>
                      No players found
                    </td>
                  </tr>
                ) : (
                  players.map((player, index) => (
                    <tr key={player.id}>
                      <td>{index + 1}</td>
                      <td>{player.name}</td>
                      <td>{player.deckCode || '-'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button
                            onClick={() => handleEdit(player)}
                            className="submit-button"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', width: 'auto' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleRegisterDeck(player)}
                            className="submit-button"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', width: 'auto' }}
                          >
                            Register Deck
                          </button>
                          <button
                            onClick={() => handleDelete(player.id)}
                            className="submit-button"
                            style={{ 
                              padding: '0.5rem 1rem', 
                              fontSize: '0.875rem', 
                              width: 'auto',
                              background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingPlayer && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div className="card" style={{ maxWidth: '500px', width: '90%', position: 'relative' }}>
            <h2 style={{ marginTop: 0 }}>Edit Player</h2>
            <div className="form-group">
              <label htmlFor="edit-name">Name</label>
              <input
                id="edit-name"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-deck-code">Deck Code</label>
              <input
                id="edit-deck-code"
                type="text"
                value={editDeckCode}
                onChange={(e) => setEditDeckCode(e.target.value)}
                placeholder="example: xjWavy-BLGRUg-alyCYf"
                className="input-field"
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                onClick={handleSaveEdit}
                className="submit-button"
                style={{ flex: 1 }}
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingPlayer(null)
                }}
                className="submit-button"
                style={{ 
                  flex: 1,
                  background: 'linear-gradient(135deg, #666 0%, #888 100%)'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register Deck Modal */}
      {showRegisterModal && registeringPlayerId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div className="card" style={{ maxWidth: '500px', width: '90%', position: 'relative' }}>
            <h2 style={{ marginTop: 0 }}>Register Deck</h2>
            <div className="form-group">
              <label htmlFor="register-deck-code">Deck Code</label>
              <input
                id="register-deck-code"
                type="text"
                value={registerDeckCode}
                onChange={(e) => setRegisterDeckCode(e.target.value)}
                placeholder="example: xjWavy-BLGRUg-alyCYf"
                className="input-field"
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                onClick={handleSaveRegisterDeck}
                className="submit-button"
                style={{ flex: 1 }}
              >
                Register
              </button>
              <button
                onClick={() => {
                  setShowRegisterModal(false)
                  setRegisteringPlayerId(null)
                }}
                className="submit-button"
                style={{ 
                  flex: 1,
                  background: 'linear-gradient(135deg, #666 0%, #888 100%)'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin
