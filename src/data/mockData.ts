import { 
  TemplateStarterKit, 
  Tutorial, 
  LearningChallenge, 
  PeerFeedback, 
  UserProfile, 
  TutorialStep 
} from '../types/gamatutor';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Naila Yusroini',
  role: 'Mahasiswa / Tutor Pembelajar',
  institution: 'Universitas Gadjah Mada (UGM)',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  xp: 840,
  level: 4,
  levelTitle: 'Tutor Madya GamaTutor',
  streakDays: 6,
  tutorialsCreated: 3,
  feedbacksGiven: 7,
  completedChallenges: 5,
  badges: [
    {
      id: 'badge-gae-pioneer',
      title: 'UGM GAE Pioneer',
      icon: 'GraduationCap',
      description: 'Menyelesaikan tutorial pertama berbasis Gama Animation Engine.',
      dateUnlocked: '12 Sep 2026'
    },
    {
      id: 'badge-feynman-disciple',
      title: 'Feynman Disciple',
      icon: 'Sparkles',
      description: 'Mencapai peningkatan skor pemahaman > 25% pada Teach-Back Check.',
      dateUnlocked: '18 Sep 2026'
    },
    {
      id: 'badge-rme-specialist',
      title: 'RME Workflow Master',
      icon: 'Activity',
      description: 'Membuat tutorial alur Rekam Medis Elektronik dengan akurasi klinis tinggi.',
      dateUnlocked: '21 Sep 2026'
    }
  ]
};

export const STARTER_TEMPLATES: TemplateStarterKit[] = [
  {
    id: 'template-rme-admisi',
    title: 'RME: Pendaftaran Rawat Jalan & Validasi NIK BPJS',
    subtitle: 'Alur Penerimaan Pasien Baru & Cek Eligibilitas SIMRS',
    category: 'Rekam Medis Elektronik',
    badge: 'Prosedur Utama RME',
    iconName: 'FileText',
    description: 'Template lengkap untuk mengajarkan tata cara pendaftaran pasien, pencarian nomor rekam medis, validasi NIK melalui bridging VClaim BPJS, dan penerbitan Surat Eligibilitas Peserta (SEP).',
    defaultExplanation: 'Pasien datang ke loket pendaftaran rawat jalan rumah sakit membawa KTP dan kartu BPJS. Petugas admisi membuka modul pendaftaran pada sistem SIMRS, mencari apakah pasien sudah pernah terdaftar dengan memasukkan NIK 16 digit. Jika sudah ada, nomor rekam medis (RM) dipanggil untuk verifikasi data demografi. Selanjutnya, petugas melakukan bridging BPJS untuk mencetak SEP dan memilih poli spesialis yang dituju.',
    learningObjectives: [
      'Pencegahan rekam medis ganda dengan validasi NIK 16-digit',
      'Pengecekan rujukan faskes tingkat 1 dan bridging VClaim',
      'Pemilihan DPJP dan pencetakan nomor antrean poliklinik'
    ],
    sampleScenes: [
      {
        id: 'scene-1',
        stepNumber: 1,
        title: 'Verifikasi NIK & Pencarian Pasien',
        duration: 5,
        narration: 'Ketik atau pindai 16 digit NIK pasien pada kolom pencarian SIMRS untuk mendeteksi apakah pasien sudah memiliki berkas rekam medis.',
        backdrop: 'rme_hospital',
        actionType: 'type',
        targetElement: 'Field NIK / No. RM',
        callout: {
          title: 'Langkah 1: Identifikasi Tunggal',
          text: 'Pengecekan NIK mencegah duplikasi nomor rekam medis di database rumah sakit.',
          x: 22,
          y: 28,
          type: 'instruction'
        },
        hotspot: {
          x: 48,
          y: 33,
          label: 'Input NIK KTP',
          interactiveHint: 'Klik kolom input untuk memvalidasi NIK'
        },
        cursorAnimation: { startX: 15, startY: 85, endX: 48, endY: 33 },
        interactivePrompt: 'Klik kolom NIK untuk memulai simulasi penginputan'
      },
      {
        id: 'scene-2',
        stepNumber: 2,
        title: 'Bridging VClaim BPJS & Pembuatan SEP',
        duration: 6,
        narration: 'Klik tombol Bridging BPJS untuk memeriksa status aktif asuransi dan nomor rujukan puskesmas faskes tingkat 1.',
        backdrop: 'rme_hospital',
        actionType: 'click',
        targetElement: 'Tombol Bridging BPJS',
        callout: {
          title: 'Langkah 2: Bridging Online',
          text: 'Sistem langsung terhubung ke server BPJS Kesehatan untuk verifikasi keabsahan kartu.',
          x: 55,
          y: 26,
          type: 'tip'
        },
        hotspot: {
          x: 74,
          y: 33,
          label: 'Bridging VClaim',
          interactiveHint: 'Klik tombol untuk sinkronisasi'
        },
        cursorAnimation: { startX: 48, startY: 33, endX: 74, endY: 33 },
        interactivePrompt: 'Klik tombol Bridging BPJS untuk verifikasi kepesertaan'
      },
      {
        id: 'scene-3',
        stepNumber: 3,
        title: 'Penentuan Poli Tujuan & Dokter DPJP',
        duration: 5,
        narration: 'Pilih poliklinik spesialis yang dituju sesuai surat rujukan dan pastikan kuota dokter masih tersedia pada jadwal hari ini.',
        backdrop: 'rme_hospital',
        actionType: 'select',
        targetElement: 'Dropdown Poli & Dokter',
        callout: {
          title: 'Langkah 3: Pemilihan Poliklinik',
          text: 'Periksa jadwal dokter praktik dan estimasi waktu tunggu pasien.',
          x: 25,
          y: 50,
          type: 'instruction'
        },
        hotspot: {
          x: 50,
          y: 53,
          label: 'Dropdown Poliklinik Spesialis',
          interactiveHint: 'Pilih Poli Penyakit Dalam / Bedah'
        },
        cursorAnimation: { startX: 74, startY: 33, endX: 50, endY: 53 },
        interactivePrompt: 'Pilih Poliklinik tujuan pada dropdown'
      },
      {
        id: 'scene-4',
        stepNumber: 4,
        title: 'Finalisasi, Simpan & Cetak Gelang Identitas',
        duration: 5,
        narration: 'Klik Simpan & Cetak. Sistem akan mencetak lembar SEP, barcode rekam medis, dan gelang identitas pasien rawat jalan.',
        backdrop: 'rme_hospital',
        actionType: 'click',
        targetElement: 'Tombol Simpan & Cetak Gelang',
        callout: {
          title: 'Langkah 4: Keselamatan Pasien',
          text: 'Gelang identitas memuat barcode nomor RM, nama, dan tanggal lahir.',
          x: 48,
          y: 65,
          type: 'success'
        },
        hotspot: {
          x: 78,
          y: 84,
          label: 'Tombol Simpan & Cetak',
          interactiveHint: 'Klik tombol untuk mencetak berkas pendaftaran'
        },
        cursorAnimation: { startX: 50, startY: 53, endX: 78, endY: 84 },
        interactivePrompt: 'Klik Simpan & Cetak untuk menuntaskan pendaftaran'
      }
    ]
  },
  {
    id: 'template-rme-triase',
    title: 'RME: Triase Gawat Darurat (Pedoman ATS / ESI)',
    subtitle: 'Skrining Kedaruratan & Labeling Warna Pasien IGD',
    category: 'Rekam Medis Elektronik',
    badge: 'Klinis Kritis',
    iconName: 'AlertTriangle',
    description: 'Panduan visual interaktif untuk mengajarkan proses triase medis di IGD: penilaian jalan napas (Airway), pernapasan (Breathing), sirkulasi (Circulation), dan penentuan zona triase (Merah/Kuning/Hijau/Hitam).',
    defaultExplanation: 'Ketika pasien tiba di IGD, perawat triase langsung melakukan penilaian cepat tanda vital dan kondisi kesadaran. Pasien dengan henti jantung atau gagal napas segera ditempatkan di Zona Resusitasi Merah. Pasien stabil namun berisiko perburukan masuk Zona Kuning. Petugas memasukkan hasil triase ke modul RME IGD agar dokter jaga segera mendapat notifikasi prioritas penanganan.',
    learningObjectives: [
      'Identifikasi tanda kegawatdaruratan ABC (Airway, Breathing, Circulation)',
      'Input tanda vital: Tekanan Darah, SpO2, Laju Nadi, Skala Nyeri',
      'Pemberian label warna zona triase di SIMRS'
    ],
    sampleScenes: [
      {
        id: 'triase-1',
        stepNumber: 1,
        title: 'Penilaian Cepat Tanda Vital (ABC)',
        duration: 5,
        narration: 'Lakukan pemeriksaan awal saturasi oksigen, laju napas, dan denyut nadi pasien yang baru tiba di IGD.',
        backdrop: 'rme_triage',
        actionType: 'verify',
        targetElement: 'Panel Tanda Vital IGD',
        callout: {
          title: 'Triase Cepat (< 2 Menit)',
          text: 'Periksa kesadaran dengan metode AVPU dan hitung laju pernapasan.',
          x: 20,
          y: 25,
          type: 'warning'
        },
        hotspot: {
          x: 42,
          y: 35,
          label: 'Sensor SpO2 & Nadi',
          interactiveHint: 'Klik untuk memverifikasi nilai tanda vital'
        },
        cursorAnimation: { startX: 10, startY: 80, endX: 42, endY: 35 },
        interactivePrompt: 'Klik sensor untuk memeriksa data tanda vital'
      },
      {
        id: 'triase-2',
        stepNumber: 2,
        title: 'Klasifikasi Kategori Triase (Merah / Kuning / Hijau)',
        duration: 6,
        narration: 'Berdasarkan tanda vital SpO2 88%, pilih Kategori Merah (Resusitasi/Gawat Darurat) pada sistem RME IGD.',
        backdrop: 'rme_triage',
        actionType: 'select',
        targetElement: 'Pilihan Zona Triase',
        callout: {
          title: 'Klasifikasi Triase',
          text: 'Kategori Merah mengharuskan penanganan dokter dalam waktu 0 menit.',
          x: 55,
          y: 45,
          type: 'instruction'
        },
        hotspot: {
          x: 68,
          y: 50,
          label: 'Tombol Kategori Merah',
          interactiveHint: 'Pilih Kategori Merah'
        },
        cursorAnimation: { startX: 42, startY: 35, endX: 68, endY: 50 },
        interactivePrompt: 'Klik Kategori Merah untuk memprioritaskan pasien'
      },
      {
        id: 'triase-3',
        stepNumber: 3,
        title: 'Kirim Notifikasi Prioritas ke Tim Medis',
        duration: 5,
        narration: 'Klik Kirim Sinyal Resusitasi untuk menyalakan alarm visual di ruang tindakan dokter spesialis darurat.',
        backdrop: 'rme_triage',
        actionType: 'alert',
        targetElement: 'Tombol Notifikasi Dokter',
        callout: {
          title: 'Respons Cepat',
          text: 'Pemberitahuan terkirim instan ke display monitor IGD utama.',
          x: 35,
          y: 68,
          type: 'success'
        },
        hotspot: {
          x: 75,
          y: 82,
          label: 'Tombol Kirim Triase',
          interactiveHint: 'Klik untuk mengonfirmasi rute pasien'
        },
        cursorAnimation: { startX: 68, startY: 50, endX: 75, endY: 82 },
        interactivePrompt: 'Klik Kirim Triase untuk mengaktifkan tim medis'
      }
    ]
  },
  {
    id: 'template-farmasi-resep',
    title: 'Farmasi: Resep Elektronik (E-Prescription) & Skrining 7 Benar',
    subtitle: 'Verifikasi Dosis Obat, Interaksi & Penyerahan Farmasi',
    category: 'Kedokteran & Farmasi',
    badge: 'Patient Safety',
    iconName: 'Pill',
    description: 'Mengajarkan proses telaah resep elektronik oleh apoteker: pengecekan 7 benar pemberian obat, telaah duplikasi terapi, konfirmasi alergi, dan pembuatan etiket aturan pakai.',
    defaultExplanation: 'Dokter meresepkan obat melalui modul EMR dokter, resep langsung terkirim secara elektronik ke instalasi farmasi. Apoteker melakukan verifikasi telaah resep mencakup nama obat, bentuk sediaan, dosis, rute, waktu pemberian, dan riwayat alergi pasien. Apabila ditemukan potensi interaksi obat berbahaya, apoteker memberikan catatan konfirmasi klinis kepada dokter.',
    learningObjectives: [
      'Prinsip 7 Benar pemberian obat',
      'Skrining otomatis interaksi obat pada software farmasi',
      'Pemberian etiket digital dan edukasi aturan minum obat'
    ],
    sampleScenes: [
      {
        id: 'farmasi-1',
        stepNumber: 1,
        title: 'Penerimaan Antrean Resep Elektronik',
        duration: 5,
        narration: 'Buka daftar resep baru yang masuk dari poli rawat jalan, lalu periksa kesesuaian diagnosis pasien dengan item obat yang diresepkan.',
        backdrop: 'pharmacy_system',
        actionType: 'click',
        targetElement: 'Daftar Resep Masuk',
        callout: {
          title: 'Telaah Administratif & Klinis',
          text: 'Periksa kesesuaian obat dengan riwayat alergi yang tercatat pada rekam medis.',
          x: 20,
          y: 30,
          type: 'instruction'
        },
        hotspot: {
          x: 38,
          y: 40,
          label: 'Baris Resep No. RX-2026',
          interactiveHint: 'Pilih resep pasien untuk ditelaah'
        },
        cursorAnimation: { startX: 10, startY: 70, endX: 38, endY: 40 },
        interactivePrompt: 'Klik pada resep untuk membuka detail obat'
      },
      {
        id: 'farmasi-2',
        stepNumber: 2,
        title: 'Skrining Interaksi Obat & Perhitungan Dosis',
        duration: 6,
        narration: 'Jalankan fitur Drug Interaction Checker. Sistem menandai jika ada dua obat yang saling menghambat atau meningkatkan toksisitas.',
        backdrop: 'pharmacy_system',
        actionType: 'verify',
        targetElement: 'Modul Interaksi Obat',
        callout: {
          title: 'Deteksi Interaksi Obat',
          text: 'Sistem memberi peringatan warna kuning jika ada interaksi moderat antara obat hipertensi dan suplemen kalium.',
          x: 52,
          y: 42,
          type: 'warning'
        },
        hotspot: {
          x: 65,
          y: 50,
          label: 'Indikator Interaksi Obat',
          interactiveHint: 'Periksa detail interaksi'
        },
        cursorAnimation: { startX: 38, startY: 40, endX: 65, endY: 50 },
        interactivePrompt: 'Klik indikator untuk memeriksa potensi interaksi'
      },
      {
        id: 'farmasi-3',
        stepNumber: 3,
        title: 'Cetak Etiket Aturan Pakai & Siapkan Obat',
        duration: 5,
        narration: 'Setelah telaah aman, klik Cetak Etiket Berwarna. Tempelkan etiket dengan instruksi minum obat yang jelas untuk pasien.',
        backdrop: 'pharmacy_system',
        actionType: 'click',
        targetElement: 'Tombol Cetak Etiket',
        callout: {
          title: 'Edukasi Pasien',
          text: 'Etiket memuat nama obat, aturan pakai, waktu konsumsi, dan tanggal kedaluwarsa.',
          x: 40,
          y: 65,
          type: 'success'
        },
        hotspot: {
          x: 75,
          y: 80,
          label: 'Tombol Cetak Etiket Farmasi',
          interactiveHint: 'Klik tombol untuk mencetak etiket'
        },
        cursorAnimation: { startX: 65, startY: 50, endX: 75, endY: 80 },
        interactivePrompt: 'Klik Cetak Etiket untuk memfinalisasi obat'
      }
    ]
  },
  {
    id: 'template-ai-neuralnet',
    title: 'Sains Data: Neural Networks & Backpropagation',
    subtitle: 'Konsep Forward Pass, Loss Function, dan Perambatan Mundur',
    category: 'Sains Data & AI',
    badge: 'Fondasi AI',
    iconName: 'Cpu',
    description: 'Visualisasi interaktif konsep jaringan syaraf tiruan: bagaimana data melewati lapisan neuron (forward pass), cara mengukur error prediksi menggunakan loss function, dan bagaimana bobot diperbarui mundur (backpropagation).',
    defaultExplanation: 'Neural network menerima data input pada input layer, mengalikannya dengan bobot (weights) dan menambahkan bias sebelum dilewatkan ke fungsi aktivasi. Proses ini berlanjut hingga output layer menghasilkan prediksi. Selisih antara prediksi dan nilai aktual dihitung sebagai loss. Pada tahap backpropagation, gradien turunan parsial dihitung mundur menggunakan aturan rantai (chain rule) untuk memperbarui bobot dengan optimizer seperti SGD atau Adam.',
    learningObjectives: [
      'Alur maju forward pass dan operasi dot product',
      'Penghitungan Mean Squared Error / Cross Entropy Loss',
      'Konsep intuitif backpropagation dan aturan rantai (chain rule)'
    ],
    sampleScenes: [
      {
        id: 'nn-1',
        stepNumber: 1,
        title: 'Forward Pass: Dari Input ke Lapisan Tersembunyi',
        duration: 6,
        narration: 'Data fitur masukan dikalikan dengan bobot garis koneksi, dijumlahkan dengan bias, lalu diaktifkan oleh fungsi non-linear ReLU.',
        backdrop: 'flowchart_logic',
        actionType: 'click',
        targetElement: 'Neuron Lapisan Tersembunyi',
        callout: {
          title: 'Operasi Linier & Aktivasi',
          text: 'z = Wx + b, dilanjutkan dengan a = ReLU(z).',
          x: 25,
          y: 30,
          type: 'instruction'
        },
        hotspot: {
          x: 45,
          y: 40,
          label: 'Neuron Hidden Layer',
          interactiveHint: 'Klik neuron untuk melihat kalkulasi nilai aktif'
        },
        cursorAnimation: { startX: 15, startY: 40, endX: 45, endY: 40 },
        interactivePrompt: 'Klik neuron untuk mengalirkan sinyal maju'
      },
      {
        id: 'nn-2',
        stepNumber: 2,
        title: 'Penghitungan Loss Function (Error Prediksi)',
        duration: 5,
        narration: 'Output jaringan dibandingkan dengan label target sebenarnya untuk menghitung seberapa jauh melencengnya prediksi model.',
        backdrop: 'flowchart_logic',
        actionType: 'verify',
        targetElement: 'Node Loss Function',
        callout: {
          title: 'Mengukur Kesalahan',
          text: 'Nilai Loss tinggi berarti tebakan model masih buruk dan membutuhkan penyesuaian bobot.',
          x: 55,
          y: 25,
          type: 'warning'
        },
        hotspot: {
          x: 75,
          y: 40,
          label: 'Kalkulator Loss Function',
          interactiveHint: 'Periksa selisih prediksi dengan target'
        },
        cursorAnimation: { startX: 45, startY: 40, endX: 75, endY: 40 },
        interactivePrompt: 'Klik loss node untuk menghitung error'
      },
      {
        id: 'nn-3',
        stepNumber: 3,
        title: 'Backpropagation: Perambatan Gradien Mundur',
        duration: 6,
        narration: 'Melalui kalkulus aturan rantai, sinyal error dirambatkan mundur dari output ke input untuk memperbarui bobot ke arah yang meminimalkan loss.',
        backdrop: 'flowchart_logic',
        actionType: 'click',
        targetElement: 'Garis Bobot (Gradient Descent)',
        callout: {
          title: 'Pembaruan Bobot (Weights Update)',
          text: 'W_baru = W_lama - learning_rate * dLoss/dW.',
          x: 35,
          y: 65,
          type: 'success'
        },
        hotspot: {
          x: 50,
          y: 65,
          label: 'Panah Aliran Gradien Mundur',
          interactiveHint: 'Klik untuk memicu perambatan gradien'
        },
        cursorAnimation: { startX: 75, startY: 40, endX: 50, endY: 65 },
        interactivePrompt: 'Klik panah mundur untuk memperbarui bobot model'
      }
    ]
  },
  {
    id: 'template-lab-lims',
    title: 'Laboratorium: Verifikasi Sampel Darah & Input Hasil LIMS',
    subtitle: 'Manajemen Spesimen Laboratorium Medis & Validasi Nilai Kritis',
    category: 'Rekam Medis Elektronik',
    badge: 'Prosedur Lab',
    iconName: 'Activity',
    description: 'Tutorial interaktif penerimaan tabung sampel darah, pemindaian barcode LIMS, input nilai hemoglobin/leukosit, dan mekanisme penanganan nilai kritis (panic values).',
    defaultExplanation: 'Analis laboratorium menerima sampel darah dari ruangan, mencocokkan barcode tabung dengan data order pada LIMS. Setelah alat hematology analyzer memproses sampel, hasil ditinjau. Bila nilai berada pada rentang nilai kritis (contoh: Hb < 7 g/dL), analis wajib menghubungi DPJP dalam kurun waktu 15 menit dan mencatat pelaporan nilai kritis pada rekam medis.',
    learningObjectives: [
      'Pengecekan integritas spesimen (lisis/bekuan)',
      'Bridging hasil analyzer otomatis ke software LIMS',
      'Pelaporan Readback SBAR untuk nilai kritis laboratorium'
    ],
    sampleScenes: [
      {
        id: 'lab-1',
        stepNumber: 1,
        title: 'Pemindaian Barcode Tabung Spesimen',
        duration: 5,
        narration: 'Gunakan barcode scanner untuk membaca label pada tabung EDTA dan mencocokkannya dengan nomor rekam medis pasien.',
        backdrop: 'laboratory_lims',
        actionType: 'click',
        targetElement: 'Scanner Barcode LIMS',
        callout: {
          title: 'Pencocokan Sampel',
          text: 'Mencegah tertukarnya spesimen darah antar pasien.',
          x: 22,
          y: 32,
          type: 'instruction'
        },
        hotspot: {
          x: 45,
          y: 38,
          label: 'Kolom Barcode Sampel',
          interactiveHint: 'Klik untuk memindai spesimen'
        },
        cursorAnimation: { startX: 10, startY: 80, endX: 45, endY: 38 },
        interactivePrompt: 'Klik barcode untuk mengonfirmasi penerimaan spesimen'
      },
      {
        id: 'lab-2',
        stepNumber: 2,
        title: 'Verifikasi Hasil & Deteksi Nilai Kritis',
        duration: 6,
        narration: 'Tinjau hasil hitung darah lengkap. Nilai Hemoglobin 6.2 g/dL memicu tanda peringatan merah nilai kritis di sistem.',
        backdrop: 'laboratory_lims',
        actionType: 'alert',
        targetElement: 'Tabel Hasil Hematologi',
        callout: {
          title: 'Peringatan Nilai Kritis',
          text: 'Kadar Hb di bawah 7 g/dL merupakan kondisi darurat yang memerlukan transfusi segera.',
          x: 52,
          y: 40,
          type: 'warning'
        },
        hotspot: {
          x: 68,
          y: 48,
          label: 'Indikator Nilai Kritis Hb',
          interactiveHint: 'Klik untuk melihat rentang rujukan'
        },
        cursorAnimation: { startX: 45, startY: 38, endX: 68, endY: 48 },
        interactivePrompt: 'Klik peringatan untuk membuka protokol nilai kritis'
      },
      {
        id: 'lab-3',
        stepNumber: 3,
        title: 'Dokumentasi Pelaporan SBAR ke Dokter DPJP',
        duration: 5,
        narration: 'Catat waktu pelaporan nilai kritis, nama dokter penerima informasi, dan konfirmasi teknik Readback pada modul LIMS.',
        backdrop: 'laboratory_lims',
        actionType: 'click',
        targetElement: 'Formulir Pelaporan Nilai Kritis',
        callout: {
          title: 'Standar Akreditasi KARS',
          text: 'Waktu pelaporan maksimal 15 menit setelah hasil terverifikasi.',
          x: 35,
          y: 65,
          type: 'success'
        },
        hotspot: {
          x: 75,
          y: 80,
          label: 'Tombol Validasi & Kirim RME',
          interactiveHint: 'Klik tombol untuk validasi akhir'
        },
        cursorAnimation: { startX: 68, startY: 48, endX: 75, endY: 80 },
        interactivePrompt: 'Klik tombol untuk mengirim hasil resmi ke rekam medis'
      }
    ]
  }
];

export const INITIAL_COMMUNITY_TUTORIALS: Tutorial[] = [
  {
    id: 'tut-1',
    title: 'Alur Pendaftaran Rawat Jalan & Validasi NIK BPJS di SIMRS',
    description: 'Tutorial interaktif step-by-step tentang cara memverifikasi data pasien, bridging BPJS VClaim, dan mencetak SEP tanpa kesalahan duplikasi RM.',
    category: 'Rekam Medis Elektronik',
    difficulty: 'Pemula',
    scenes: STARTER_TEMPLATES[0].sampleScenes,
    author: {
      name: 'Naila Yusroini',
      role: 'UGM Medical Informatics',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      badge: 'Feynman Disciple'
    },
    views: 1420,
    likes: 184,
    peerFeedbackCount: 12,
    createdAt: '2 hari yang lalu',
    tags: ['RME', 'SIMRS', 'BPJS', 'UGM GAE', 'Admisi'],
    teachBackScores: {
      before: 58,
      after: 89,
      delta: 31
    }
  },
  {
    id: 'tut-2',
    title: 'Triase Cepat IGD & Skoring Prioritas Pasien di RME',
    description: 'Simulasi langkah penentuan zona resusitasi merah, kuning, dan hijau di IGD rumah sakit dengan sistem notifikasi otomatis ke DPJP.',
    category: 'Rekam Medis Elektronik',
    difficulty: 'Menengah',
    scenes: STARTER_TEMPLATES[1].sampleScenes,
    author: {
      name: 'dr. Budi Setiawan',
      role: 'Alumni FK-KMK UGM',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
      badge: 'Gama Master Tutor'
    },
    views: 2180,
    likes: 310,
    peerFeedbackCount: 24,
    createdAt: '5 hari yang lalu',
    tags: ['Triase', 'IGD', 'Gawat Darurat', 'RME'],
    teachBackScores: {
      before: 65,
      after: 94,
      delta: 29
    }
  },
  {
    id: 'tut-3',
    title: 'Visualisasi Interaktif Backpropagation pada Neural Network',
    description: 'Pahami bagaimana kalkulus rantai dan penurunan gradien memperbarui bobot neuron buatan melalui simulasi interaktif GamaTutor.',
    category: 'Sains Data & AI',
    difficulty: 'Mahir',
    scenes: STARTER_TEMPLATES[3].sampleScenes,
    author: {
      name: 'Farhan Ramadhan',
      role: 'UGM Computer Science',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      badge: 'Logic Virtuoso'
    },
    views: 3450,
    likes: 540,
    peerFeedbackCount: 38,
    createdAt: '1 minggu yang lalu',
    tags: ['Machine Learning', 'Deep Learning', 'Neural Network'],
    teachBackScores: {
      before: 52,
      after: 88,
      delta: 36
    }
  },
  {
    id: 'tut-4',
    title: 'Telaah Resep Elektronik 7 Benar & Skrining Interaksi Obat',
    description: 'Langkah pencegahan medication error di instalasi farmasi rumah sakit menggunakan modul telaah resep digital.',
    category: 'Kedokteran & Farmasi',
    difficulty: 'Menengah',
    scenes: STARTER_TEMPLATES[2].sampleScenes,
    author: {
      name: 'Apt. Sarah Anindita',
      role: 'Fakultas Farmasi UGM',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      badge: 'Safety Champion'
    },
    views: 1890,
    likes: 275,
    peerFeedbackCount: 16,
    createdAt: '2 minggu yang lalu',
    tags: ['Farmasi', 'Resep', 'Patient Safety', 'Klinis'],
    teachBackScores: {
      before: 60,
      after: 92,
      delta: 32
    }
  }
];

export const INITIAL_PEER_FEEDBACKS: PeerFeedback[] = [
  {
    id: 'fb-1',
    tutorialId: 'tut-1',
    tutorialTitle: 'Alur Pendaftaran Rawat Jalan & Validasi NIK BPJS di SIMRS',
    authorName: 'Dimas Wicaksono',
    authorRole: 'Mahasiswa RMIK UGM',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    clarityRating: 5,
    easyToUnderstandPart: 'Penjelasan mengapa NIK 16 digit harus dicek terlebih dahulu sangat masuk akal untuk mencegah nomor rekam medis dobel.',
    confusingOrMissingPart: 'Sedikit penasaran bagaimana alurnya kalau pasien lupa membawa KTP dan BPJS-nya sedang non-aktif?',
    suggestion: 'Bisa ditambahkan 1 langkah percabangan penanganan kasus darurat tanpa identitas (Mr. X) agar lebih komprehensif!',
    timestamp: 'Kemarin, 14:20',
    helpfulVotes: 14,
    creatorReplied: true,
    creatorReplyText: 'Terima kasih banyak atas feedback-nya Mas Dimas! Saya sudah menambahkan catatan SOP penanganan Mr. X pada deskripsi langkah pertama.'
  },
  {
    id: 'fb-2',
    tutorialId: 'tut-1',
    tutorialTitle: 'Alur Pendaftaran Rawat Jalan & Validasi NIK BPJS di SIMRS',
    authorName: 'Siti Rahmawati',
    authorRole: 'Petugas Admisi RS Sardjito',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    clarityRating: 5,
    easyToUnderstandPart: 'Simulasi klik pada tombol bridging VClaim terasa sangat nyata seperti sistem SIMRS Khanza asli yang kami pakai di RS.',
    confusingOrMissingPart: 'Sudah sangat jelas dan mudah dipraktikkan untuk petugas baru.',
    suggestion: 'Pertahankan nuansa interaktif Try-It Mode-nya, sangat membantu orientasi staf baru.',
    timestamp: '2 hari lalu',
    helpfulVotes: 8,
    creatorReplied: false
  },
  {
    id: 'fb-3',
    tutorialId: 'tut-3',
    tutorialTitle: 'Visualisasi Interaktif Backpropagation pada Neural Network',
    authorName: 'Rian Pratama',
    authorRole: 'Mahasiswa Ilmu Komputer',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    clarityRating: 4,
    easyToUnderstandPart: 'Animasi perpindahan sinyal maju di forward pass sangat membantu membayangkan alur matrix multiplication.',
    confusingOrMissingPart: 'Bagian turunan berantai (chain rule) pada backprop terasa agak cepat pergerakan panahnya.',
    suggestion: 'Bagus kalau durasi langkah ke-3 diperpanjang 2 detik agar pembelajar sempat mencerna formulanya.',
    timestamp: '4 hari lalu',
    helpfulVotes: 19,
    creatorReplied: true,
    creatorReplyText: 'Siap Mas Rian! Saya sudah update durasi langkah kalkulus rantai menjadi 7 detik di versi terbaru.'
  }
];

export const INITIAL_CHALLENGES: LearningChallenge[] = [
  {
    id: 'ch-daily-1',
    title: 'Tutor Harian: Buat 1 Tutorial Konsep',
    description: 'Gunakan TeachBack Mode untuk mengajarkan 1 topik yang baru Anda pelajari hari ini.',
    xpReward: 100,
    type: 'daily',
    progress: 1,
    target: 1,
    completed: true,
    badgeUnlock: 'Daily Explainer',
    iconName: 'Zap'
  },
  {
    id: 'ch-daily-2',
    title: 'Refleksi Celah: Atasi 2 Knowledge Gap',
    description: 'Jalankan AI Knowledge Gap Detection dan perbaiki minimal 2 konsep yang ditandai belum lengkap.',
    xpReward: 75,
    type: 'daily',
    progress: 2,
    target: 2,
    completed: true,
    badgeUnlock: 'Gap Hunter',
    iconName: 'ShieldAlert'
  },
  {
    id: 'ch-weekly-1',
    title: 'Peer Reviewer: Beri Umpan Balik Rekan',
    description: 'Tonton tutorial rekan pembelajar di Community Hub dan berikan 2 feedback konstruktif.',
    xpReward: 120,
    type: 'weekly',
    progress: 1,
    target: 2,
    completed: false,
    badgeUnlock: 'Peer Mentor',
    iconName: 'MessageSquareText'
  },
  {
    id: 'ch-milestone-1',
    title: 'Teach-Back Mastery (+25% Delta)',
    description: 'Selesaikan Teach-Back Check dengan peningkatan skor pemahaman minimal 25 poin.',
    xpReward: 250,
    type: 'milestone',
    progress: 31,
    target: 25,
    completed: true,
    badgeUnlock: 'Feynman Disciple',
    iconName: 'Award'
  }
];
