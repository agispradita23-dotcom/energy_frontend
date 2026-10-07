import { useEffect, useState } from 'react'
import LiveReadings from './components/LiveReadings'
import DailyHistoryChart from './components/DailyHistoryChart'
import PredictionChart from './components/PredictionChart'
import { ambilRiwayatHarian, ambilPrediksi } from './api'

export default function App() {
  const [riwayatData, setRiwayatData] = useState([])
  const [prediksiData, setPrediksiData] = useState([])

  // State untuk metrik ringkasan dashboard
  const [totalKwh, setTotalKwh] = useState(0)
  const [estimasiBiaya, setEstimasiBiaya] = useState(0)
  const [rataRataKwh, setRataRataKwh] = useState(0)
  const [prediksiBesok, setPrediksiBesok] = useState(0)

    useEffect(() => {
    // KOREKSI: Tambahkan parameter 45 hari agar menarik rentang data dummy Anda secara utuh
    ambilRiwayatHarian(45)
      .then((data) => {
        if (data && Array.isArray(data)) {
          // Dapatkan string tanggal hari ini dalam format lokal (YYYY-MM-DD)
          const hariIni = new Date().toISOString().split('T')[0];

          // FILTER: Hanya gunakan data yang tanggalnya BUKAN hari ini
          const dataSelesai = data.filter(item => item.tanggal !== hariIni);

          setRiwayatData(dataSelesai); // Render grafik hanya dari hari yang sudah selesai
      
          // Hitung Total kWh dari data yang sudah difilter bersih
          const total = dataSelesai.reduce((sum, item) => sum + (Number(item.konsumsi_kwh) || 0), 0);
          setTotalKwh(total);

          // Hitung Estimasi Biaya (Tarif 900 VA Non-Subsidi)
          setEstimasiBiaya(total * 1352);

          // Hitung Rata-rata Harian yang valid
          const rataRata = dataSelesai.length > 0 ? total / dataSelesai.length : 0;
          setRataRataKwh(rataRata);
       }
      })

      .catch((err) => console.error("Gagal memuat riwayat untuk dashboard:", err))

    // 2. Tarik data prediksi untuk mengambil nilai H+1
    ambilPrediksi()
      .then((data) => {
        if (data && Array.isArray(data)) {
          setPrediksiData(data)
          
          const besok = data.find((item) => item.horizon === 1)
          if (besok) {
            const nilaiBesok = besok.prediksi_daya ?? besok.prediksi_kwh ?? besok.nilai_prediksi ?? besok.prediksi_energi ?? besok.nilai
            setPrediksiBesok(Number(nilaiBesok) || 0)
          }
        }
      })
      .catch((err) => console.error("Gagal memuat prediksi untuk dashboard:", err))
  }, [])


  return (
    <div className="container">
      <header className="header">
        <h1 className="header-title">Energy Monitor</h1>
        <p className="header-subtitle">esp32-01</p>
      </header>

      {/* Tambahan Komponen: Baris Kartu Informasi Ringkasan KPI Dashboard */}
      <div className="dashboard-summary-grid">
        <div className="summary-card">
          <p className="card-label">Total Konsumsi Energi</p>
          <p className="card-value">
            {totalKwh.toFixed(4)} <span className="card-unit">kWh</span>
          </p>
        </div>

        <div className="summary-card">
          <p className="card-label">Estimasi Biaya (PLN)</p>
          <p className="card-value">
            Rp {estimasiBiaya.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
          </p>
        </div>

        <div className="summary-card">
          <p className="card-label">Rata-rata Konsumsi</p>
          <p className="card-value">
            {rataRataKwh.toFixed(4)} <span className="card-unit">kWh/hari</span>
          </p>
        </div>

        <div className="summary-card highlight">
          <p className="card-label">Prediksi Besok (H+1)</p>
          <p className="card-value">
            {prediksiBesok.toFixed(4)} <span className="card-unit">kWh</span>
          </p>
        </div>
      </div>

      {/* Grid Monitor Sensor Utama */}
      <LiveReadings />

      {/* Grid Dua Visualisasi Grafik */}
      <div className="charts-grid">
        <DailyHistoryChart data={riwayatData} />
        <PredictionChart data={prediksiData} />
      </div>
    </div>
  )
}
