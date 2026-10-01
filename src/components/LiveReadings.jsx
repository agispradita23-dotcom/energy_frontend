import { useEffect, useState } from 'react'
import { ambilPembacaanTerakhir } from '../api'

const REFRESH_MS = 5000 // polling ringan setiap 5 detik

// Definisi kolom pembacaan: field mentah dari backend -> label & format tampilan.
// Dipisah dari JSX agar mudah disesuaikan tanpa menyentuh struktur render.
const KOLOM = [
  { field: 'tegangan', label: 'Tegangan', unit: 'V', desimal: 1 },
  { field: 'arus', label: 'Arus', unit: 'A', desimal: 3 },
  { field: 'daya_aktif', label: 'Daya Aktif', unit: 'W', desimal: 2 },
  { field: 'energi', label: 'Energi', unit: 'kWh', desimal: 3 },
  { field: 'frekuensi', label: 'Frekuensi', unit: 'Hz', desimal: 1 },
  { field: 'power_factor', label: 'Power Factor', unit: '', desimal: 3 },
]

export default function LiveReadings({ onStatusChange }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let batal = false

    async function muatData() {
      try {
        const hasil = await ambilPembacaanTerakhir(1)
        if (batal) return
        if (hasil.length > 0) {
          setData(hasil[0])
          setError(null)
          onStatusChange?.(true, hasil[0].recorded_at)
        }
      } catch (err) {
        if (batal) return
        setError(err.message)
        onStatusChange?.(false, null)
      }
    }

    muatData()
    const interval = setInterval(muatData, REFRESH_MS)
    return () => {
      batal = true
      clearInterval(interval)
    }
  }, [onStatusChange])

  if (error) {
    return (
      <div className="panel state-message error">
        Tidak dapat memuat pembacaan sensor: {error}
      </div>
    )
  }

  if (!data) {
    return <div className="panel state-message">Menunggu data pembacaan pertama...</div>
  }

  return (
    <div className="readings-strip">
      {KOLOM.map((kolom) => (
        <div className="reading-cell" key={kolom.field}>
          <div className="reading-value">
            {Number(data[kolom.field]).toFixed(kolom.desimal)}
            <span className="reading-unit">{kolom.unit}</span>
          </div>
          <div className="reading-label">{kolom.label}</div>
        </div>
      ))}
    </div>
  )
}
