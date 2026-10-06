import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

// KOREKSI: Menerima variabel data langsung dari App.jsx lewat props
export default function DailyHistoryChart({ data }) {
  
  // Jika data utama belum selesai di-fetch dari App.jsx
  if (!data) {
    return (
      <div className="panel">
        <p className="panel-title">Konsumsi harian</p>
        <div className="state-message">Memuat...</div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="panel">
        <p className="panel-title">Konsumsi harian</p>
        <div className="state-message">
          Belum ada data agregasi harian. Jalankan endpoint agregasi
          (POST /api/energy/daily/compute) setelah data mentah terkumpul.
        </div>
      </div>
    )
  }

  const dataGrafik = data.map((d) => ({
    tanggal: d.tanggal.slice(5), // tampilkan MM-DD agar ringkas
    kwh: d.konsumsi_kwh,
    anomali: d.anomali === 1,
  }))

  return (
    <div className="panel">
      <p className="panel-title">Konsumsi harian (kWh)</p>
      <div className="chart-legend">
        <span className="legend-item">
          <span className="legend-swatch actual" /> Aktual
        </span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={dataGrafik} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid stroke="rgba(231,236,243,0.06)" vertical={false} />
          <XAxis
            dataKey="tanggal"
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
            formatter={(value) => [`${Number(value).toFixed(3)} kWh`, 'Konsumsi']}
          />
          <Line
            type="monotone"
            dataKey="kwh"
            stroke="#2fd9c4"
            strokeWidth={2}
            dot={{ r: 3, fill: '#2fd9c4', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
