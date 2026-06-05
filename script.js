// ==========================================
// 1. UTILITY UTAMA & ENGINE TOAST NOTIFIKASI
// ==========================================
function formatRupiah(angka) { return 'Rp ' + angka.toLocaleString('id-ID'); }

let riwayatPesananProduk = [];
let riwayatPesananJasa = [];
let keranjangBelanja = []; 

// Fungsi Desain Toast Pengganti Alert Kaku
function tampilkanToast(pesan, tipe = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.classList.add('toast', tipe);
    
    const iconClass = tipe === 'success' ? 'fa-circle-check' : 'fa-circle-info';
    toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${pesan}</span>`;
    
    container.appendChild(toast);
    
    // Picu animasi muncul
    setTimeout(() => toast.classList.add('show'), 50);
    
    // Hapus otomatis setelah 3 detik
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// Fungsi Mengontrol Pop-up Nota Sukses Transaksi
function bukaSuccessModal(htmlKonten) {
    document.getElementById('success-details-box').innerHTML = htmlKonten;
    document.getElementById('success-modal').classList.add('active');
    document.getElementById('success-overlay').classList.add('active');
}
function tutupSuccessModal() {
    document.getElementById('success-modal').classList.remove('active');
    document.getElementById('success-overlay').classList.remove('active');
}

// ==========================================
// 2. LOGIKA KERANJANG & CHECKOUT LANGSUNG (PRODUK)
// ==========================================
function tambahKeKeranjang(namaProduk, harga) {
    let index = keranjangBelanja.findIndex(item => item.nama === namaProduk);
    if (index !== -1) {
        keranjangBelanja[index].kuantitas += 1;
        keranjangBelanja[index].totalHarga = keranjangBelanja[index].kuantitas * keranjangBelanja[index].hargaDasar;
    } else {
        keranjangBelanja.push({ nama: namaProduk, hargaDasar: harga, kuantitas: 1, totalHarga: harga });
    }
    perbaruiTampilanKeranjang();
    tampilkanToast(`${namaProduk} berhasil masuk keranjang!`);
}

function beliSekarang(namaProduk, harga) {
    let jumlahBeli = prompt(`Berapa kilo (kg) yang ingin Anda pesan untuk ${namaProduk}?`, "1");
    if (jumlahBeli === null) return; 
    
    jumlahBeli = parseInt(jumlahBeli);
    if (isNaN(jumlahBeli) || jumlahBeli <= 0) {
        tampilkanToast("Jumlah pembelian harus berupa angka valid!", "info");
        return;
    }

    keranjangBelanja = [{ nama: namaProduk, hargaDasar: harga, kuantitas: jumlahBeli, totalHarga: harga * jumlahBeli }];
    perbaruiTampilanKeranjang();
    bukaCheckoutProduk();
}

function tambahKuantitas(index) {
    keranjangBelanja[index].kuantitas += 1;
    keranjangBelanja[index].totalHarga = keranjangBelanja[index].kuantitas * keranjangBelanja[index].hargaDasar;
    perbaruiTampilanKeranjang();
}

function kurangKuantitas(index) {
    if (keranjangBelanja[index].kuantitas > 1) {
        keranjangBelanja[index].kuantitas -= 1;
        keranjangBelanja[index].totalHarga = keranjangBelanja[index].kuantitas * keranjangBelanja[index].hargaDasar;
        perbaruiTampilanKeranjang();
    } else { hapusItem(index); }
}

function hapusItem(index) {
    if (confirm(`Hapus "${keranjangBelanja[index].nama}" dari keranjang?`)) {
        keranjangBelanja.splice(index, 1);
        perbaruiTampilanKeranjang();
        tampilkanToast("Item berhasil dihapus.", "info");
    }
}

function perbaruiTampilanKeranjang() {
    const daftar = document.getElementById('daftar-keranjang-modal');
    const totalEl = document.getElementById('total-harga-modal');
    const totalCOProduk = document.getElementById('co-produk-total-bayar');
    
    daftar.innerHTML = '';
    let totalHargaKeranjang = 0;

    if (keranjangBelanja.length === 0) {
        daftar.innerHTML = '<p style="text-align: center; color: #94A3B8; margin-top: 20px;">Keranjang kosong.</p>';
    } else {
        keranjangBelanja.forEach((item, index) => {
            totalHargaKeranjang += item.totalHarga;
            daftar.innerHTML += `
                <div class="item-keranjang-dinamis">
                    <div class="info-atas"><span>${item.nama}</span><span style="color: #64748B;">${formatRupiah(item.hargaDasar)}/kg</span></div>
                    <div class="info-bawah">
                        <div class="kontrol-kuantitas">
                            <button class="btn-qty" onclick="kurangKuantitas(${index})">-</button>
                            <span class="angka-qty">${item.kuantitas}</span>
                            <button class="btn-qty" onclick="tambahKuantitas(${index})">+</button>
                            <button class="btn-hapus" onclick="hapusItem(${index})"><i class="fa-solid fa-trash"></i></button>
                        </div>
                        <div class="harga-subtotal">${formatRupiah(item.totalHarga)}</div>
                    </div>
                </div>`;
        });
    }
    const teksTotal = formatRupiah(totalHargaKeranjang);
    totalEl.innerText = teksTotal;
    if(totalCOProduk) totalCOProduk.innerText = teksTotal;
}

function bukaKeranjang() { document.getElementById('cart-modal').classList.add('active'); document.getElementById('cart-overlay').classList.add('active'); }
function tutupKeranjang() { document.getElementById('cart-modal').classList.remove('active'); document.getElementById('cart-overlay').classList.remove('active'); }
function bukaCheckoutProduk() { if(keranjangBelanja.length === 0) { tampilkanToast("Keranjang Anda masih kosong!", "info"); return; } tutupKeranjang(); document.getElementById('checkout-produk-modal').classList.add('active'); document.getElementById('checkout-produk-overlay').classList.add('active'); }
function tutupCheckoutProduk() { document.getElementById('checkout-produk-modal').classList.remove('active'); document.getElementById('checkout-produk-overlay').classList.remove('active'); }

// FINISH DESIGN: Selesaikan Pesanan Produk Hasil Tani
function prosesCheckoutSayur() {
    const nama = document.getElementById('co-produk-nama').value;
    const hp = document.getElementById('co-produk-hp').value;
    const alamat = document.getElementById('co-produk-alamat').value;
    const armada = document.getElementById('co-produk-armada').value;
    const metode = document.querySelector('input[name="metode-produk"]:checked').value;
    
    if(!nama || !hp || !alamat) { Oscar = tampilkanToast("Mohon lengkapi seluruh formulir!", "info"); return; }
    
    let totalAkhir = keranjangBelanja.reduce((sum, item) => sum + item.totalHarga, 0);
    let rincianTextHTML = keranjangBelanja.map(item => `• ${item.kuantitas}x ${item.nama} (${formatRupiah(item.totalHarga)})`).join("<br>");
    let orderId = "TNG-P-" + Math.floor(Math.random() * 100000);

    let pesananBaru = { id: orderId, tanggal: new Date().toLocaleString('id-ID'), items: rincianTextHTML, total: totalAkhir, status: "Dikemas" };
    riwayatPesananProduk.unshift(pesananBaru);
    
    // Suntik Nota Cantik ke Success Modal
    let notaHTML = `
        <div class="invoice-success-box">
            <h4>ID Pesanan: ${orderId}</h4>
            <p><strong>Penerima:</strong> ${nama} (${hp})</p>
            <p><strong>Alamat:</strong> ${alamat}</p>
            <p style="margin-top:8px; margin-bottom:4px;"><strong>Rincian Item:</strong></p>
            <p style="color:var(--text-muted); line-height:1.4;">${rincianTextHTML}</p>
            <p style="margin-top:8px;"><strong>Pengiriman:</strong> ${armada}</p>
            <p><strong>Metode Bayar:</strong> ${metode}</p>
            <p style="margin-top:10px; font-weight:bold; color:var(--brand-green); font-size:1.05rem;">Total Akhir: ${formatRupiah(totalAkhir)}</p>
        </div>`;
    
    tutupCheckoutProduk();
    bukaSuccessModal(notaHTML); // Tampilkan popup sukses terdesain

    keranjangBelanja = []; perbaruiTampilanKeranjang();
    document.getElementById('co-produk-nama').value = ''; document.getElementById('co-produk-hp').value = ''; document.getElementById('co-produk-alamat').value = '';
}

// ==========================================
// 3. LOGIKA REAL PETA (STABIL & OFFLINE-CALCULATED)
// ==========================================
let map, markerJemput, markerTujuan, garisRute;
let jarakGlobalKm = 0; let waktuGlobalMenit = 0; let transaksiJasaAktif = null;

window.addEventListener('load', function() {
    map = L.map('map-interaktif').setView([5.1805, 97.1507], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);

    const ikonBiru = L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png', iconSize: [25, 41], iconAnchor: [12, 41] });
    const ikonMerah = L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png', iconSize: [25, 41], iconAnchor: [12, 41] });

    markerJemput = L.marker([5.1805, 97.1507], { draggable: true, icon: ikonBiru }).addTo(map).bindPopup("Lokasi A: Jemput").openPopup();
    markerTujuan = L.marker([5.1950, 97.1600], { draggable: true, icon: ikonMerah }).addTo(map).bindPopup("Lokasi B: Tujuan");
    garisRute = L.polyline([markerJemput.getLatLng(), markerTujuan.getLatLng()], { color: '#3B82F6', weight: 4, dashArray: '5, 10' }).addTo(map);

    markerJemput.on('drag', kalkulasiJarakLangsung);
    markerTujuan.on('drag', kalkulasiJarakLangsung);
    kalkulasiJarakLangsung();
});

function kalkulasiJarakLangsung() {
    let latlngA = markerJemput.getLatLng();
    let latlngB = markerTujuan.getLatLng();
    garisRute.setLatLngs([latlngA, latlngB]);
    
    let jarakMeter = latlngA.distanceTo(latlngB);
    jarakGlobalKm = Math.ceil((jarakMeter * 1.3) / 1000);
    if(jarakGlobalKm === 0) jarakGlobalKm = 1;
    
    document.getElementById('global-teks-jarak').innerText = jarakGlobalKm + " km";
    perbaruiDaftarTarifArmada(jarakGlobalKm);
}

function cariLokasi(tipe) {
    const idInput = tipe === 'jemput' ? 'alamat-jemput' : 'alamat-tujuan';
    const query = document.getElementById(idInput).value;
    if(!query) { tampilkanToast("Ketikkan alamat yang dicari!", "info"); return; }

    fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
            if(data && data.length > 0) {
                const lat = parseFloat(data[0].lat); const lon = parseFloat(data[0].lon);
                if(tipe === 'jemput') { markerJemput.setLatLng([lat, lon]); map.setView([lat, lon], 13); } 
                else { markerTujuan.setLatLng([lat, lon]); map.setView([lat, lon], 13); }
                kalkulasiJarakLangsung();
                tampilkanToast("Lokasi berhasil dipetakan!");
            } else { tampilkanToast("Alamat tidak ditemukan!", "info"); }
        }).catch(err => { tampilkanToast("Gagal memuat peta internet.", "info"); });
}

function perbaruiDaftarTarifArmada(jarakKm) {
    waktuGlobalMenit = jarakKm * 4;
    const durasiWaktuTeks = (waktuGlobalMenit >= 60) ? `${Math.floor(waktuGlobalMenit / 60)} jam ${waktuGlobalMenit % 60} mnt` : `${waktuGlobalMenit} menit`;
    
    const tarifPickup = 100000 + (jarakKm * 5000); const tarifBox = 150000 + (jarakKm * 7000); const tarifTruk = 300000 + (jarakKm * 15000);

    document.getElementById('tarif-pickup').innerText = formatRupiah(tarifPickup); document.getElementById('waktu-pickup').innerText = durasiWaktuTeks;
    document.getElementById('tarif-box').innerText = formatRupiah(tarifBox); document.getElementById('waktu-box').innerText = durasiWaktuTeks;
    document.getElementById('tarif-truk').innerText = formatRupiah(tarifTruk); document.getElementById('waktu-truk').innerText = durasiWaktuTeks;
}

// ==========================================
// 4. CHECKOUT JASA LOGISTIK
// ==========================================
function bukaPembayaranJasa(namaJasa, hargaDasar, tarifPerKm) {
    let tarifAkhir = hargaDasar + (jarakGlobalKm * tarifPerKm);
    transaksiJasaAktif = { nama: namaJasa, jarak: jarakGlobalKm + " km", waktu: document.getElementById('waktu-pickup').innerText, totalBiaya: tarifAkhir };

    document.getElementById('pay-nama-jasa').innerText = transaksiJasaAktif.nama;
    document.getElementById('pay-jarak').innerText = transaksiJasaAktif.jarak;
    document.getElementById('pay-waktu').innerText = transaksiJasaAktif.waktu;
    document.getElementById('pay-total-harga').innerText = formatRupiah(transaksiJasaAktif.totalBiaya);

    document.getElementById('payment-modal').classList.add('active');
    document.getElementById('payment-overlay').classList.add('active');
}
function tutupPembayaranJasa() { document.getElementById('payment-modal').classList.remove('active'); document.getElementById('payment-overlay').classList.remove('active'); }

// FINISH DESIGN: Selesaikan Pesanan Order Jasa Ekspedisi Driver
function prosesPembayaranLangsung() {
    const nama = document.getElementById('jasa-nama-pemesan').value;
    const hp = document.getElementById('jasa-hp-pemesan').value;
    const metode = document.querySelector('input[name="metode-opsi"]:checked').value;
    
    if(!nama || !hp) { tampilkanToast("Isi Nama Pemesan dan No HP dahulu!", "info"); return; }
    
    let orderId = "TNG-J-" + Math.floor(Math.random() * 100000);
    let pesananBaru = { id: orderId, tanggal: new Date().toLocaleString('id-ID'), layanan: transaksiJasaAktif.nama, jarak: transaksiJasaAktif.jarak, total: transaksiJasaAktif.totalBiaya, status: "Menunggu Driver" };
    riwayatPesananJasa.unshift(pesananBaru);
    
    // Suntik Nota Cantik Ekspedisi ke Success Modal
    let notaJasaHTML = `
        <div class="invoice-success-box">
            <h4>ID Logistik: ${orderId}</h4>
            <p><strong>Nama Pemesan:</strong> ${nama}</p>
            <p><strong>No HP Klien:</strong> ${hp}</p>
            <p style="margin-top:6px; border-top:1px dashed #CBD5E1; padding-top:6px;"><strong>Jenis Armada:</strong> ${transaksiJasaAktif.nama}</p>
            <p><strong>Jarak Distribusi:</strong> ${transaksiJasaAktif.jarak}</p>
            <p><strong>Estimasi Perjalanan:</strong> ${transaksiJasaAktif.waktu}</p>
            <p><strong>Metode Pembayaran:</strong> ${metode}</p>
            <p style="margin-top:10px; font-weight:bold; color:var(--brand-green); font-size:1.05rem;">Total Biaya: ${formatRupiah(transaksiJasaAktif.totalBiaya)}</p>
        </div>`;
    
    tutupPembayaranJasa();
    bukaSuccessModal(notaJasaHTML); // Tampilkan popup sukses terdesain

    document.getElementById('jasa-nama-pemesan').value = ''; document.getElementById('jasa-hp-pemesan').value = '';
}

// ==========================================
// 5. NAVIGASI TAB PESANAN SAYA
// ==========================================
function bukaPesananSaya() { renderRiwayatPesanan(); document.getElementById('riwayat-modal').classList.add('active'); document.getElementById('riwayat-overlay').classList.add('active'); }
function tutupPesananSaya() { document.getElementById('riwayat-modal').classList.remove('active'); document.getElementById('riwayat-overlay').classList.remove('active'); }

function gantiTabPesanan(tab) {
    document.getElementById('tab-produk-btn').classList.remove('active');
    document.getElementById('tab-jasa-btn').classList.remove('active');
    document.getElementById('konten-riwayat-produk').style.display = 'none';
    document.getElementById('konten-riwayat-jasa').style.display = 'none';

    if (tab === 'produk') {
        document.getElementById('tab-produk-btn').classList.add('active');
        document.getElementById('konten-riwayat-produk').style.display = 'block';
    } else {
        document.getElementById('tab-jasa-btn').classList.add('active');
        document.getElementById('konten-riwayat-jasa').style.display = 'block';
    }
}

function renderRiwayatPesanan() {
    const listProduk = document.getElementById('konten-riwayat-produk');
    const listJasa = document.getElementById('konten-riwayat-jasa');

    if (riwayatPesananProduk.length === 0) {
        listProduk.innerHTML = '<p style="text-align: center; color: #94A3B8; margin-top: 20px;">Belum ada riwayat pesanan produk.</p>';
    } else {
        listProduk.innerHTML = riwayatPesananProduk.map(order => `
            <div class="kartu-riwayat">
                <div class="kartu-riwayat-header"><span><i class="fa-solid fa-hashtag"></i> ${order.id}</span><span class="status-badge">${order.status}</span></div>
                <div class="kartu-riwayat-body"><div style="font-size: 0.8rem; color: #94A3B8; margin-bottom: 5px;">${order.tanggal}</div><div>${order.items}</div></div>
                <div class="kartu-riwayat-footer">Total Belanja <span>${formatRupiah(order.total)}</span></div>
            </div>`).join('');
    }

    if (riwayatPesananJasa.length === 0) {
        listJasa.innerHTML = '<p style="text-align: center; color: #94A3B8; margin-top: 20px;">Belum ada riwayat pesanan armada.</p>';
    } else {
        listJasa.innerHTML = riwayatPesananJasa.map(order => `
            <div class="kartu-riwayat">
                <div class="kartu-riwayat-header"><span><i class="fa-solid fa-hashtag"></i> ${order.id}</span><span class="status-badge" style="background:#DBEAFE; color:#2563EB;">${order.status}</span></div>
                <div class="kartu-riwayat-body"><div style="font-size: 0.8rem; color: #94A3B8; margin-bottom: 5px;">${order.tanggal}</div><div style="font-weight:bold;">${order.layanan}</div><div style="color:#64748B; font-size:0.85rem;">Jarak: ${order.jarak}</div></div>
                <div class="kartu-riwayat-footer">Tarif Layanan <span>${formatRupiah(order.total)}</span></div>
            </div>`).join('');
    }
}