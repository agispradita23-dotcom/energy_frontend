import { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { ambilPrediksi } from '../api'

export default function PredictionChart() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    ambilPrediksi()
      .then((hasil) => setData(hasil))
      .catch((err) => setError(err.message))
  }, [])

  if (error) {
    return (
      <div className="panel">
        <p className="panel-title">Prediksi 15 hari ke depan (WMA-7)</p>
        <div className="state-message error">Gagal memuat data: {error}</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="panel">
        <p className="panel-title">Prediksi 15 hari ke depan (WMA-7)</p>
        <div className="state-message">Memuat...</div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="panel">
        <p className="panel-title">Prediksi 15 hari ke depan (WMA-7)</p>
        <div className="state-message">
          Belum ada prediksi tersimpan. Prediksi membutuhkan minimal 7 hari
          data historis.
        </div>
      </div>
    )
  }

  // DI SINI PERBAIKANNYA: Mengubah d.prediksi_kwh menjadi d.prediksi_daya
  const dataGrafik = data.map((d) => ({
    hari: `H+${d.horizon}`,
    kwh: d.prediksi_daya, 
  }))

  return (
    <div className="panel">
      <p className="panel-title">Prediksi 15 hari ke depan (WMA-7)</p>
      <div className="chart-legend">
        <span className="legend-item">
          <span className="legend-swatch forecast" /> Prediksi
        </span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={dataGrafik} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid stroke="rgba(231,236,243,0.06)" vertical={false} />
          <XAxis
            dataKey="hari"
            tick={{ fill: '#8b96a8', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
            axisLine={{ stroke: 'rgba(231,236,243,0.15)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#8b96a8', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
            axisLine={false}
            tickLine={false}
            width={44}
          />
          <Tooltip
            contentStyle={{
              background: '#141b2b',
              border: '1px solid rgba(231,236,243,0.12)',
              borderRadius: 6,
              fontFamily: 'IBM Plex Mono',
              fontSize: 12,
            }}
            labelStyle={{ color: '#8b96a8' }}
            formatter={(value) => [`${Number(value).toFixed(4)} kWh`, 'Prediksi']}
          />
          <Line
            type="monotone"
            dataKey="kwh"
            stroke="#f5a623"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={{ r: 3, fill: '#f5a623', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
