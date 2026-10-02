// =====================================================================
// LAPISAN API - Dashboard Tahap 8
// Terpisah dari komponen UI agar mudah diuji/diganti tanpa menyentuh
// logika tampilan. Base URL dapat diubah via .env (VITE_API_BASE_URL)
// tanpa mengubah kode -- penting saat pindah dari backend lokal ke
// Koyeb nanti.
// =====================================================================

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const DEVICE_ID = import.meta.env.VITE_DEVICE_ID || 'esp32-01'

async function ambilJSON(url) {
  const res = await fetch(url)
  if (!res.ok) {
    // Coba baca pesan error dari backend (format {"detail": "..."})
    let pesan = `Permintaan gagal (HTTP ${res.status})`
    try {
      const data = await res.json()
      if (data?.detail) pesan = data.detail
    } catch {
      // respons bukan JSON, gunakan pesan default di atas
    }
    throw new Error(pesan)
  }
  return res.json()
}

/** Mengambil pembacaan sensor terakhir (data mentah, bukan agregat). */
export function ambilPembacaanTerakhir(limit = 1) {
  return ambilJSON(`${BASE_URL}/api/energy/latest?limit=${limit}`)
}

/** Mengambil riwayat konsumsi energi harian. */
export function ambilRiwayatHarian(limit = 45) {
  return ambilJSON(`${BASE_URL}/api/energy/daily?device_id=${DEVICE_ID}&limit=${limit}`)
}

/** Mengambil batch prediksi WMA-7 terbaru yang tersimpan. */
export async function ambilPrediksi() {
  const respons = await ambilJSON(`${BASE_URL}/api/energy/predict?device_id=${DEVICE_ID}`)
  // Ambil array di dalam properti 'data'. Jika data tidak ada atau bukan array, kembalikan array kosong []
return Array.isArray(respons) ? respons : (respons?.data && Array.isArray(respons.data) ? respons.data : []);
}

export { DEVICE_ID }
