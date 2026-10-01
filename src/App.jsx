import { useCallback, useState } from 'react'
import LiveReadings from './components/LiveReadings'
import DailyHistoryChart from './components/DailyHistoryChart'
import PredictionChart from './components/PredictionChart'
import { DEVICE_ID } from './api'

function formatWaktu(isoString) {
  if (!isoString) return '—'
  const d = new Date(isoString)
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export default function App() {
  const [online, setOnline] = useState(null)
  const [waktuTerakhir, setWaktuTerakhir] = useState(null)

  // useCallback agar referensi fungsi stabil -- mencegah LiveReadings
  // membentuk ulang interval polling-nya setiap kali App re-render.
  const handleStatusChange = useCallback((status, waktu) => {
    setOnline(status)
    if (waktu) setWaktuTerakhir(waktu)
  }, [])

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Energy Monitor</h1>
          <span className="device-id">{DEVICE_ID}</span>
        </div>
        <div className="status-line">
          <span className={`status-dot ${online === false ? 'offline' : ''}`} />
          {online === null && 'Menghubungkan...'}
          {online === true && `Data terakhir ${formatWaktu(waktuTerakhir)} UTC`}
          {online === false && 'Backend tidak terjangkau'}
        </div>
      </header>

      <LiveReadings onStatusChange={handleStatusChange} />

      <div className="chart-grid">
        <DailyHistoryChart />
        <PredictionChart />
      </div>

      <footer className="app-footer">
        {DEVICE_ID} · refresh pembacaan tiap 5 detik · prediksi WMA-7
      </footer>
    </div>
  )
}
