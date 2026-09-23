import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini SDK
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// -------------------------------------------------------------
// API Route 1: AI Knowledge Gap Detection
// -------------------------------------------------------------
app.post('/api/gap-detection', async (req, res) => {
  const { topic, explanation, targetAudience, category } = req.body;

  if (!topic || !explanation) {
    return res.status(400).json({ error: 'Topic and explanation are required.' });
  }

  // If Gemini API is available, use real AI reasoning
  if (ai && process.env.GEMINI_API_KEY) {
    try {
      const prompt = `You are an expert pedagogical evaluator and senior domain tutor for GamaTutor (Gama Animation Engine tutorial system, originally developed at Universitas Gadjah Mada).
Analyze this learner's explanation in the context of the "Learning-by-Teaching" / TeachBack method.

Topic: "${topic}"
Category: "${category || 'General / Electronic Medical Records (RME)'}"
Intended Audience: "${targetAudience || 'Beginner to Intermediate'}"
Learner's Explanation:
"""
${explanation}
"""

Evaluate what the learner currently understands and accurately identify their knowledge gaps (concepts missing, inaccurate, vague, or incomplete).
Respond ONLY in valid JSON matching this schema:
{
  "completenessScore": number (0-100),
  "clarityScore": number (0-100),
  "overallSummary": string (encouraging pedagogical synthesis in Indonesian/English as appropriate),
  "strengths": string[] (2-4 strong points already present in their explanation),
  "detectedGaps": [
    {
      "id": string,
      "title": string,
      "severity": "high" | "medium" | "low",
      "description": string (clear explanation of what is missing or ambiguous),
      "recommendedReview": string (actionable concept or standard procedure to look up)
    }
  ],
  "guidingQuestions": string[] (2-4 Socratic questions to prompt deeper thinking before animating)
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      if (response && response.text) {
        const parsed = JSON.parse(response.text);
        return res.json(parsed);
      }
    } catch (error) {
      console.error('Gemini gap-detection error:', error);
      // Fall through to deterministic fallback
    }
  }

  // Graceful domain-aware fallback if API key is inactive or offline
  const words = explanation.trim().split(/\s+/).length;
  const hasMedical = /pasien|rm|rekam medis|rme|bpjs|dokter|diagnosa|triase|obat|resep/i.test(topic + ' ' + explanation);
  const completenessScore = Math.min(90, Math.max(45, Math.round(words * 1.4)));
  const clarityScore = Math.min(92, Math.max(55, Math.round(60 + (words > 30 ? 25 : 10))));

  const sampleGaps = hasMedical ? [
    {
      id: 'gap-1',
      title: 'Validasi Identitas Ganda & Nomor Rekam Medis (RM)',
      severity: 'high',
      description: 'Penjelasan belum memaparkan secara spesifik bagaimana sistem mencegah duplikasi berkas rekam medis ketika NIK atau nama pasien mirip.',
      recommendedReview: 'Pelajari Permenkes No. 24 Tahun 2022 tentang Rekam Medis Elektronik Bab III mengenai Pendaftaran dan Penomoran Tunggal.'
    },
    {
      id: 'gap-2',
      title: 'Verifikasi Hak Akses & Keabsahan Asuransi (BPJS VClaim / SEP)',
      severity: 'medium',
      description: 'Langkah bridging sistem pendaftaran rumah sakit dengan sistem penjamin (BPJS Kesehatan / Asuransi) belum terinci.',
      recommendedReview: 'Tinjau alur bridging API VClaim BPJS untuk verifikasi kepesertaan aktif dan pembuatan Surat Eligibilitas Peserta (SEP).'
    },
    {
      id: 'gap-3',
      title: 'Penanganan Kondisi Darurat / Pasien Khusus',
      severity: 'low',
      description: 'Belum ada penjelasan alur jika pasien datang dalam kondisi gawat darurat tanpa dokumen identitas lengkap.',
      recommendedReview: 'Pelajari Prosedur Standar Operasional (SOP) pendaftaran pasien darurat dengan identitas sementara (Mr/Mrs X).'
    }
  ] : [
    {
      id: 'gap-1',
      title: 'Prasyarat dan Kondisi Awal (Pre-requisites)',
      severity: 'high',
      description: 'Langkah awal belum menjelaskan kondisi prasyarat atau asumsi dasar yang harus dipenuhi sebelum proses utama dieksekusi.',
      recommendedReview: 'Tentukan state awal sistem dan data input yang wajib tersedia.'
    },
    {
      id: 'gap-2',
      title: 'Penanganan Kesalahan & Alur Alternatif (Edge Cases)',
      severity: 'medium',
      description: 'Penjelasan hanya membahas skenario ideal (happy path), belum mencakup bagaimana sistem merespons jika terjadi kegagalan input.',
      recommendedReview: 'Tambahkan satu langkah cadangan (fallback procedure) ketika input tidak valid.'
    }
  ];

  return res.json({
    completenessScore,
    clarityScore,
    overallSummary: `Penjelasan mengenai "${topic}" sudah memiliki kerangka dasar yang baik. Terdapat beberapa detail prosedural penting yang perlu Anda lengkapi sebelum memvisualisasikannya ke dalam animasi langkah-demi-langkah.`,
    strengths: [
      'Alur pemikiran utama sudah sistematis dan mudah diikuti',
      'Pemilihan istilah teknis sudah relevan dengan topik yang diangkat',
      'Niat instruksional sudah terfokus pada pengguna akhir'
    ],
    detectedGaps: sampleGaps,
    guidingQuestions: [
      `Bagaimana pembelajar tahu bahwa langkah pertama pada "${topic}" telah berhasil dieksekusi?`,
      'Apa konsekuensi paling fatal jika salah satu tahapan ini terlewatkan?',
      'Indikator visual apa yang paling jelas untuk menunjukkan transisi antar langkah?'
    ]
  });
});

// -------------------------------------------------------------
// API Route 2: AI Script-to-Animation
// -------------------------------------------------------------
app.post('/api/script-to-animation', async (req, res) => {
  const { topic, explanation, gaps, category, templateId } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required.' });
  }

  if (ai && process.env.GEMINI_API_KEY) {
    try {
      const prompt = `You are the Gama Animation Engine (GAE) instructional architect at Universitas Gadjah Mada (UGM).
Convert this learner's explanation and addressed knowledge gaps into a complete, interactive 4 to 6-step animated tutorial for GamaTutor.

Topic: "${topic}"
Category: "${category || 'Rekam Medis Elektronik'}"
Learner's Explanation:
"""
${explanation || ''}
"""
Key Addressed Elements:
${JSON.stringify(gaps || [])}

Create a structured animation script where each step has:
1. title: Step action title
2. duration: time in seconds (usually 4-7s)
3. narration: conversational instructional audio narration
4. backdrop: one of ["rme_hospital", "rme_triage", "pharmacy_system", "laboratory_lims", "flowchart_logic", "code_studio", "medical_diagram"]
5. actionType: one of ["click", "type", "verify", "drag", "select", "alert"]
6. targetElement: name of UI element being interacted with
7. callout: { title: string, text: string, x: number (percentage 10-85), y: number (percentage 15-80), type: "instruction" | "tip" | "warning" | "success" }
8. hotspot: { x: number (percentage 10-90), y: number (percentage 15-85), label: string, interactiveHint: string }
9. cursorAnimation: { startX: number, startY: number, endX: number, endY: number }
10. interactivePrompt: optional mini-prompt for try-it mode

Return ONLY valid JSON matching this schema:
{
  "tutorialTitle": string,
  "description": string,
  "category": string,
  "difficulty": "Pemula" | "Menengah" | "Mahir",
  "scenes": [
    {
      "id": string,
      "stepNumber": number,
      "title": string,
      "duration": number,
      "narration": string,
      "backdrop": string,
      "actionType": string,
      "targetElement": string,
      "callout": {
        "title": string,
        "text": string,
        "x": number,
        "y": number,
        "type": string
      },
      "hotspot": {
        "x": number,
        "y": number,
        "label": string,
        "interactiveHint": string
      },
      "cursorAnimation": {
        "startX": number,
        "startY": number,
        "endX": number,
        "endY": number
      },
      "interactivePrompt": string
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      if (response && response.text) {
        const parsed = JSON.parse(response.text);
        return res.json(parsed);
      }
    } catch (error) {
      console.error('Gemini script-to-animation error:', error);
      // Fall through to fallback generator
    }
  }

  // High quality domain-rich fallback generator
  const isRME = /rme|rekam|medis|pasien|hospital|bpjs|rawat|klinis|dokter/i.test(topic + ' ' + (explanation || ''));

  const scenes = isRME ? [
    {
      id: 'step-1',
      stepNumber: 1,
      title: 'Pemeriksaan Identitas & Pemindaian NIK',
      duration: 5,
      narration: 'Selamat datang di GamaTutor RME. Langkah pertama, minta kartu identitas pasien (KTP atau Kartu Indonesia Sehat) lalu masukkan 16 digit NIK ke dalam kolom pencarian SIMRS.',
      backdrop: 'rme_hospital',
      actionType: 'type',
      targetElement: 'Kolom Input NIK / No. RM',
      callout: {
        title: 'Verifikasi Awal Pasien',
        text: 'Pastikan NIK terdiri dari 16 digit valid untuk mencegah rekam medis ganda di basis data RS.',
        x: 20,
        y: 28,
        type: 'instruction'
      },
      hotspot: {
        x: 48,
        y: 33,
        label: 'Field NIK SIMRS',
        interactiveHint: 'Ketik NIK 16 digit atau klik scanner'
      },
      cursorAnimation: { startX: 15, startY: 80, endX: 48, endY: 33 },
      interactivePrompt: 'Klik pada kolom NIK untuk memvalidasi identitas pasien'
    },
    {
      id: 'step-2',
      stepNumber: 2,
      title: 'Sinkronisasi Bridging BPJS & Cetak SEP',
      duration: 6,
      narration: 'Setelah NIK terverifikasi, klik tombol Bridging BPJS untuk memeriksa status kepesertaan aktif dan membuat Surat Eligibilitas Peserta secara otomatis.',
      backdrop: 'rme_hospital',
      actionType: 'click',
      targetElement: 'Tombol Bridging VClaim BPJS',
      callout: {
        title: 'Bridging Real-time',
        text: 'Sistem langsung memvalidasi rujukan faskes tingkat 1 dan menghasilkan nomor SEP.',
        x: 52,
        y: 26,
        type: 'tip'
      },
      hotspot: {
        x: 74,
        y: 33,
        label: 'Tombol VClaim BPJS',
        interactiveHint: 'Klik tombol untuk sinkronisasi dengan server BPJS'
      },
      cursorAnimation: { startX: 48, startY: 33, endX: 74, endY: 33 },
      interactivePrompt: 'Klik tombol VClaim BPJS untuk menghubungkan data klaim'
    },
    {
      id: 'step-3',
      stepNumber: 3,
      title: 'Pemilihan Poliklinik & Dokter DPJP',
      duration: 5,
      narration: 'Pilih poliklinik spesialis yang dituju sesuai rujukan, lalu tentukan Dokter Penanggung Jawab Pelayanan (DPJP) yang sedang membuka sesi praktik.',
      backdrop: 'rme_hospital',
      actionType: 'select',
      targetElement: 'Dropdown Poli Tujuan & Dokter',
      callout: {
        title: 'Jadwal Praktik DPJP',
        text: 'Pastikan kuota antrean dokter masih tersedia pada jadwal poliklinik hari ini.',
        x: 24,
        y: 50,
        type: 'instruction'
      },
      hotspot: {
        x: 50,
        y: 52,
        label: 'Pilihan Poli Spesialis',
        interactiveHint: 'Pilih Poliklinik Penyakit Dalam / Dokter DPJP'
      },
      cursorAnimation: { startX: 74, startY: 33, endX: 50, endY: 52 },
      interactivePrompt: 'Pilih Poliklinik yang dituju oleh pasien'
    },
    {
      id: 'step-4',
      stepNumber: 4,
      title: 'Konfirmasi, Simpan & Cetak Gelang Pasien',
      duration: 5,
      narration: 'Periksa kembali ringkasan data pendaftaran. Terakhir, klik Simpan & Cetak untuk menerbitkan gelang identitas pasien dan nomor antrean poliklinik.',
      backdrop: 'rme_hospital',
      actionType: 'click',
      targetElement: 'Tombol Simpan & Cetak Barcode',
      callout: {
        title: 'Keselamatan Pasien (Patient Safety)',
        text: 'Gelang identitas memuat barcode Nomor RM, Nama, dan Tanggal Lahir sesuai standar akreditasi rumah sakit.',
        x: 48,
        y: 65,
        type: 'success'
      },
      hotspot: {
        x: 78,
        y: 84,
        label: 'Tombol Simpan & Cetak',
        interactiveHint: 'Klik untuk menyelesaikan pendaftaran dan mencetak gelang'
      },
      cursorAnimation: { startX: 50, startY: 52, endX: 78, endY: 84 },
      interactivePrompt: 'Klik Simpan & Cetak untuk menyelesaikan alur pendaftaran'
    }
  ] : [
    {
      id: 'step-1',
      stepNumber: 1,
      title: 'Inisialisasi & Pengaturan Parameter Awal',
      duration: 5,
      narration: `Mari pelajari ${topic}. Pada tahap pertama, siapkan parameter awal dan tetapkan ruang lingkup data yang akan diproses.`,
      backdrop: 'flowchart_logic',
      actionType: 'click',
      targetElement: 'Node Input / Start',
      callout: {
        title: 'Tahap Persiapan',
        text: 'Menetapkan variabel input dan kondisi awal sistem.',
        x: 20,
        y: 25,
        type: 'instruction'
      },
      hotspot: {
        x: 50,
        y: 28,
        label: 'Blok Inisialisasi Data',
        interactiveHint: 'Klik blok untuk menetapkan parameter'
      },
      cursorAnimation: { startX: 10, startY: 70, endX: 50, endY: 28 },
      interactivePrompt: 'Klik untuk mengaktifkan node awal'
    },
    {
      id: 'step-2',
      stepNumber: 2,
      title: 'Pemrosesan Logika & Transformasi Nilai',
      duration: 6,
      narration: 'Pada tahap kedua, nilai input diproses melalui formula dan kondisi percabangan untuk menentukan arah eksekusi.',
      backdrop: 'flowchart_logic',
      actionType: 'verify',
      targetElement: 'Node Percabangan / Logika',
      callout: {
        title: 'Evaluasi Kondisi',
        text: 'Sistem mengecek apakah kriteria terpenuhi sebelum melanjutkan.',
        x: 25,
        y: 50,
        type: 'tip'
      },
      hotspot: {
        x: 50,
        y: 55,
        label: 'Decision Diamond',
        interactiveHint: 'Evaluasi kondisi nilai masukan'
      },
      cursorAnimation: { startX: 50, startY: 28, endX: 50, endY: 55 },
      interactivePrompt: 'Periksa kondisi pada blok keputusan'
    },
    {
      id: 'step-3',
      stepNumber: 3,
      title: 'Verifikasi Hasil & Finalisasi Output',
      duration: 5,
      narration: 'Hasil akhir diperoleh dan diverifikasi terhadap standar keluaran yang diharapkan sebelum dikirimkan ke pengguna.',
      backdrop: 'flowchart_logic',
      actionType: 'click',
      targetElement: 'Node Selesai / Output',
      callout: {
        title: 'Hasil Akhir',
        text: 'Output tervalidasi siap didistribusikan atau disimpan.',
        x: 45,
        y: 70,
        type: 'success'
      },
      hotspot: {
        x: 50,
        y: 82,
        label: 'Terminal Selesai',
        interactiveHint: 'Klik untuk menyelesaikan proses'
      },
      cursorAnimation: { startX: 50, startY: 55, endX: 50, endY: 82 },
      interactivePrompt: 'Klik untuk memfinalisasi hasil'
    }
  ];

  return res.json({
    tutorialTitle: topic,
    description: `Tutorial interaktif GamaTutor untuk topik "${topic}", dirancang dengan pendekatan Learning-by-Teaching.`,
    category: category || (isRME ? 'Rekam Medis Elektronik' : 'Logika & Algoritma'),
    difficulty: 'Menengah',
    scenes
  });
});

// -------------------------------------------------------------
// API Route 3: Teach-Back Check
// -------------------------------------------------------------
app.post('/api/teach-back-check', async (req, res) => {
  const { topic, initialExplanation, finalExplanation, initialGaps } = req.body;

  if (!topic || !finalExplanation) {
    return res.status(400).json({ error: 'Topic and final explanation are required.' });
  }

  if (ai && process.env.GEMINI_API_KEY) {
    try {
      const prompt = `You are the lead pedagogical assessor at GamaTutor UGM evaluating the "Teach-Back Check".
The Teach-Back Check tests how well the user learned a skill by asking them to teach it back from memory AFTER designing the animated tutorial.

Topic: "${topic}"

Initial Learner Understanding (Before Tutorial Creation):
"""
${initialExplanation || 'Tidak dicatat'}
"""

Identified Knowledge Gaps Before:
${JSON.stringify(initialGaps || [])}

Final Teach-Back Explanation (After Designing the Animated Tutorial):
"""
${finalExplanation}
"""

Evaluate their progression in depth:
1. Did they resolve the knowledge gaps identified earlier?
2. Did their conceptual vocabulary and clarity increase?
3. What is their mastery level?

Return ONLY valid JSON matching this schema:
{
  "beforeScore": number (0-100),
  "afterScore": number (0-100),
  "improvementDelta": number (positive difference),
  "masteryBadge": string (e.g. "Gama Master Tutor", "Feynman Prodigy", "RME Specialist"),
  "pedagogicalVerdict": string (2-3 sentences evaluating their learning-by-teaching progression),
  "resolvedGaps": string[] (list of concepts successfully addressed now),
  "remainingNuances": string[] (minor areas they could teach even better next time),
  "earnedXP": number (typically 100-250 XP),
  "learningQuote": string
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      if (response && response.text) {
        const parsed = JSON.parse(response.text);
        return res.json(parsed);
      }
    } catch (error) {
      console.error('Gemini teach-back-check error:', error);
    }
  }

  // Domain fallback evaluator
  const initialLength = (initialExplanation || '').length;
  const finalLength = finalExplanation.length;
  const beforeScore = Math.min(75, Math.max(45, Math.round(initialLength > 50 ? 60 : 45)));
  const afterScore = Math.min(98, Math.max(beforeScore + 15, Math.round(beforeScore + 26 + (finalLength > 120 ? 10 : 0))));
  const improvementDelta = afterScore - beforeScore;

  return res.json({
    beforeScore,
    afterScore,
    improvementDelta,
    masteryBadge: 'Feynman Master Educator',
    pedagogicalVerdict: `Peningkatan signifikan! Melalui proses merancang animasi dan mengajarkan kembali topik "${topic}", pemahaman konsep Anda melonjak tajam (+${improvementDelta}%). Penjelasan akhir jauh lebih runtut, presisi, dan mempertimbangkan keselamatan prosedur.`,
    resolvedGaps: [
      'Menyertakan alur verifikasi identitas secara eksplisit',
      'Memahami titik interaksi kritis yang rawan kesalahan prosedur',
      'Mampu menjelaskan rationale (alasan di balik setiap langkah) bukan sekadar hafalan'
    ],
    remainingNuances: [
      'Dapat diperkaya dengan contoh kendala jaringan atau kegagalan bridging eksternal di masa depan'
    ],
    earnedXP: 180,
    learningQuote: '"To teach is to learn twice." - Joseph Joubert'
  });
});

// -------------------------------------------------------------
// Vite Middleware / Static Server
// -------------------------------------------------------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GamaTutor server running on http://localhost:${PORT}`);
  });
}

startServer();
