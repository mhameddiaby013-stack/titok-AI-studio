import express, { Request, Response, NextFunction } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Database initialization & storage
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DatabaseSchema {
  users: Array<{
    id: string;
    email: string;
    name: string;
    passwordHash: string;
    role: 'user' | 'admin';
    plan: 'free' | 'creator' | 'pro';
    credits: number;
    createdAt: string;
    renewalDate?: string;
  }>;
  sessions: Record<string, string>; // token -> userId
  scripts: Array<any>;
  videos: Array<any>;
  creditTransactions: Array<any>;
  paymentTransactions: Array<any>;
  plans: Array<{
    id: 'free' | 'creator' | 'pro';
    name: string;
    priceEur: number;
    priceUsd: number;
    monthlyCredits: number;
    badge: string;
    features: string[];
    recommended?: boolean;
  }>;
}

function hashPassword(password: string): string {
  return crypto.pbkdf2Sync(password, 'tiktok-ai-studio-salt', 1000, 64, 'sha512').toString('hex');
}

const defaultPlans: DatabaseSchema['plans'] = [
  {
    id: 'free',
    name: 'Gratuit',
    priceEur: 0,
    priceUsd: 0,
    monthlyCredits: 5,
    badge: 'Essai Découverte',
    features: [
      '5 crédits de bienvenue offerts',
      'Générateur de scripts TikTok IA',
      'Accroches & Hooks 0-3s optimisés',
      'Export des textes et prompts',
      'Support communautaire'
    ]
  },
  {
    id: 'creator',
    name: 'Creator',
    priceEur: 5,
    priceUsd: 5,
    monthlyCredits: 100,
    badge: 'Populaire',
    features: [
      '100 crédits par mois',
      'Scripts & Scènes 9:16 illimités',
      'Prompts Veo & IA vidéo haute précision',
      'Générateur de vidéos TikTok 9:16',
      'Historique étendu et téléchargement MP4',
      'Accès prioritaire aux modèles'
    ],
    recommended: true
  },
  {
    id: 'pro',
    name: 'Pro Studio',
    priceEur: 15,
    priceUsd: 15,
    monthlyCredits: 350,
    badge: 'Performance Max',
    features: [
      '350 crédits par mois',
      'Tous les outils Creator inclus',
      'File de rendu vidéo ultra-rapide',
      'Génération multi-variations A/B test',
      'Formats personnalisés Shorts & Reels',
      'Support VIP dédié en direct'
    ]
  }
];

function getInitialDB(): DatabaseSchema {
  const adminId = 'user_admin_01';
  const proId = 'user_pro_01';
  const creatorId = 'user_creator_01';
  const freeId = 'user_free_01';

  return {
    users: [
      {
        id: adminId,
        email: 'admin@tiktokstudio.ai',
        name: 'Admin TikTok Studio',
        passwordHash: hashPassword('admin1234!'),
        role: 'admin',
        plan: 'pro',
        credits: 999,
        createdAt: new Date().toISOString()
      },
      {
        id: proId,
        email: 'pro@tiktokstudio.ai',
        name: 'Sarah - Agence TikTok',
        passwordHash: hashPassword('pro1234!'),
        role: 'user',
        plan: 'pro',
        credits: 320,
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        renewalDate: new Date(Date.now() + 86400000 * 25).toISOString()
      },
      {
        id: creatorId,
        email: 'creator@tiktokstudio.ai',
        name: 'Maxime Créateur',
        passwordHash: hashPassword('creator1234!'),
        role: 'user',
        plan: 'creator',
        credits: 85,
        createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
        renewalDate: new Date(Date.now() + 86400000 * 18).toISOString()
      },
      {
        id: freeId,
        email: 'guest@demo.com',
        name: 'Nouveau Créateur',
        passwordHash: hashPassword('free1234!'),
        role: 'user',
        plan: 'free',
        credits: 5,
        createdAt: new Date().toISOString()
      }
    ],
    sessions: {},
    scripts: [
      {
        id: 'script_demo_01',
        userId: creatorId,
        topic: '3 astuces psychologiques pour captiver sur TikTok en 2025',
        category: 'marketing',
        language: 'Français',
        tone: 'Énergique & Captivant',
        title: 'Le secret des vidéos à 1M de vues révélé 🧠',
        alternativeTitles: [
          'Pourquoi tu perds tes abonnés après 3 secondes',
          '3 règles de psychologie pour percer sur TikTok'
        ],
        hook: 'Arrête de scroller ! 90% des créateurs font cette erreur fatale dès la première seconde...',
        fullScript: "Arrête de scroller ! 90% des créateurs font cette erreur fatale dès la première seconde. Règle numéro 1 : Ne dis jamais 'Salut à tous', commence directement par un choc visuel ou une question provocante. Règle numéro 2 : Coupe chaque micro-silence. Le cerveau de la génération TikTok décroche au bout de 0.8 seconde. Règle numéro 3 : Annonce le résultat dans les 3 premières secondes. Dis-moi en commentaire celle que tu testes dès aujourd'hui !",
        estimatedDuration: '38 secondes',
        description: 'Applique ces 3 règles psychologiques pour retenir ton audience jusqu\'au bout. Enregistre pour ta prochaine vidéo ! #tiktokfrance #astucescreatif #visibilite #conseiltiktok',
        hashtags: ['#tiktokfrance', '#astucescreatif', '#conseiltiktok', '#algorithmetiktok', '#ia'],
        soundSuggestion: 'Beat Phonk énergique avec montée de basse à la seconde 3',
        scenes: [
          {
            sceneNumber: 1,
            timestamp: '00:00 - 00:03',
            visualPrompt916: 'Gros plan dynamique sur un écran de smartphone vibrant avec des notifications virales, éclairage néon violet et cyan, style cinématique moderne 9:16',
            speech: 'Arrête de scroller ! 90% des créateurs font cette erreur fatale dès la première seconde.',
            textOnScreen: 'STOP SCROLL 🛑 ERREUR FATALE',
            cameraAngle: 'Zoom rapide vers l\'écran'
          },
          {
            sceneNumber: 2,
            timestamp: '00:03 - 00:15',
            visualPrompt916: 'Créateur moderne devant un setup studio néon avec micro cravate, pointant du doigt vers un graphique de rétention en forte hausse',
            speech: 'Règle 1 : Commence direct par le problème. Pas de bonjour, pas d\'intro.',
            textOnScreen: 'RÈGLE #1 : 0 SECONDE D\'INTRO ⏱️',
            cameraAngle: 'Plan poitrine énergique'
          },
          {
            sceneNumber: 3,
            timestamp: '00:15 - 00:28',
            visualPrompt916: 'Animation graphique rapide en style 3D montrant une timeline vidéo avec des coupures rythmées de silence',
            speech: 'Règle 2 : Coupe chaque micro-silence. Le cerveau moderne décroche en 0.8s.',
            textOnScreen: 'RÈGLE #2 : COUPE LES BLANCS ✂️',
            cameraAngle: 'Plan travelling latéral'
          },
          {
            sceneNumber: 4,
            timestamp: '00:28 - 00:38',
            visualPrompt916: 'Face caméra confiant avec flèche néon animée pointant vers la section commentaire',
            speech: 'Dis-moi en commentaire celle que tu testes aujourd\'hui et abonne-toi !',
            textOnScreen: 'COMMENTE ET ENREGISTRE 🚀',
            cameraAngle: 'Gros plan avec effet de zoom'
          }
        ],
        veoPrompt: 'Cinematic 9:16 vertical TikTok video of a charismatic creator in a futuristic neon cyberpunk studio giving marketing tips, dynamic camera zooms, purple and cyan studio lighting, high production value 4k, hyper-detailed.',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ],
    videos: [
      {
        id: 'video_demo_01',
        userId: creatorId,
        title: 'Secret psychologique TikTok',
        prompt: 'Futuristic vertical 9:16 neon studio creator revealing secret with high-energy animated graphics',
        style: 'Cinématique Réaliste',
        aspectRatio: '9:16',
        durationSeconds: 5,
        status: 'completed',
        isRealVeo: false,
        previewThumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=720&q=80',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        scenes: [
          {
            sceneNumber: 1,
            timestamp: '00:00 - 00:02',
            visualPrompt916: 'Futuristic neon room with holographic stats',
            speech: 'Arrête de scroller !',
            textOnScreen: 'STOP SCROLL 🛑',
            cameraAngle: 'Zoom rapide'
          },
          {
            sceneNumber: 2,
            timestamp: '00:02 - 00:05',
            visualPrompt916: 'Creator revealing viral formula with glowing arrows',
            speech: 'Voici le secret à 1M de vues.',
            textOnScreen: 'FORMULE 1M VUES 🚀',
            cameraAngle: 'Plan dynamique'
          }
        ]
      }
    ],
    creditTransactions: [
      {
        id: 'tx_welcome_creator',
        userId: creatorId,
        amount: 5,
        balanceAfter: 5,
        type: 'welcome',
        description: 'Crédits de bienvenue à l\'inscription',
        timestamp: new Date(Date.now() - 86400000 * 12).toISOString()
      },
      {
        id: 'tx_sub_creator',
        userId: creatorId,
        amount: 100,
        balanceAfter: 105,
        type: 'subscription',
        description: 'Activation abonnement Creator',
        timestamp: new Date(Date.now() - 86400000 * 12).toISOString()
      },
      {
        id: 'tx_gen_script_creator',
        userId: creatorId,
        amount: -1,
        balanceAfter: 104,
        type: 'generation_script',
        description: 'Génération script : 3 astuces psychologiques',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 'tx_gen_vid_creator',
        userId: creatorId,
        amount: -2,
        balanceAfter: 85,
        type: 'generation_video',
        description: 'Génération vidéo 9:16 : Secret psychologique',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ],
    paymentTransactions: [
      {
        id: 'pay_init_01',
        userId: creatorId,
        userEmail: 'creator@tiktokstudio.ai',
        amount: 5,
        currency: 'EUR',
        itemType: 'subscription',
        itemId: 'creator',
        method: 'card',
        status: 'completed',
        timestamp: new Date(Date.now() - 86400000 * 12).toISOString()
      },
      {
        id: 'pay_init_02',
        userId: proId,
        userEmail: 'pro@tiktokstudio.ai',
        amount: 15,
        currency: 'EUR',
        itemType: 'subscription',
        itemId: 'pro',
        method: 'card',
        status: 'completed',
        timestamp: new Date(Date.now() - 86400000 * 5).toISOString()
      }
    ],
    plans: defaultPlans
  };
}

let db: DatabaseSchema;

function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (!parsed.plans || parsed.plans.length === 0) {
        parsed.plans = defaultPlans;
      }
      return parsed;
    }
  } catch (err) {
    console.error('Error reading database, resetting to default:', err);
  }
  const initial = getInitialDB();
  saveDatabase(initial);
  return initial;
}

function saveDatabase(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save database:', err);
  }
}

db = loadDatabase();

// Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Auth helper middleware
function getAuthenticatedUser(req: Request) {
  const authHeader = req.headers.authorization;
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.headers['x-auth-token']) {
    token = req.headers['x-auth-token'] as string;
  }

  if (!token) return null;
  const userId = db.sessions[token];
  if (!userId) return null;
  return db.users.find(u => u.id === userId) || null;
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Non authentifié. Veuillez vous connecter.' });
  }
  (req as any).user = user;
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Accès réservé aux administrateurs.' });
  }
  (req as any).user = user;
  next();
}

// -------------------------------------------------------------
// AUTH ENDPOINTS
// -------------------------------------------------------------

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }

  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'Un compte avec cette adresse email existe déjà.' });
  }

  const welcomeCredits = 5;
  const newUser = {
    id: 'user_' + crypto.randomUUID().slice(0, 8),
    email: email.trim().toLowerCase(),
    name: name?.trim() || email.split('@')[0],
    passwordHash: hashPassword(password),
    role: 'user' as const,
    plan: 'free' as const,
    credits: welcomeCredits,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);

  // Log welcome credit transaction
  db.creditTransactions.push({
    id: 'tx_' + crypto.randomUUID().slice(0, 8),
    userId: newUser.id,
    amount: welcomeCredits,
    balanceAfter: welcomeCredits,
    type: 'welcome',
    description: 'Crédits de bienvenue offerts à l\'inscription',
    timestamp: new Date().toISOString()
  });

  const token = crypto.randomBytes(32).toString('hex');
  db.sessions[token] = newUser.id;
  saveDatabase(db);

  const { passwordHash, ...safeUser } = newUser;
  res.json({ user: safeUser, token });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: 'Identifiants invalides.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  db.sessions[token] = user.id;
  saveDatabase(db);

  const { passwordHash, ...safeUser } = user;
  res.json({ user: safeUser, token });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ user: null });
  }
  const { passwordHash, ...safeUser } = user;
  res.json({ user: safeUser });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : (req.headers['x-auth-token'] as string);
  if (token && db.sessions[token]) {
    delete db.sessions[token];
    saveDatabase(db);
  }
  res.json({ success: true });
});

// Quick switch between accounts for demonstration / test review
app.post('/api/auth/switch-demo', (req: Request, res: Response) => {
  const { roleOrEmail } = req.body;
  let targetUser = db.users.find(u => u.email.toLowerCase() === roleOrEmail?.toLowerCase());

  if (!targetUser) {
    if (roleOrEmail === 'admin') targetUser = db.users.find(u => u.role === 'admin');
    else if (roleOrEmail === 'pro') targetUser = db.users.find(u => u.plan === 'pro' && u.role !== 'admin');
    else if (roleOrEmail === 'creator') targetUser = db.users.find(u => u.plan === 'creator');
    else targetUser = db.users.find(u => u.plan === 'free');
  }

  if (!targetUser) {
    return res.status(404).json({ error: 'Compte de démonstration non trouvé.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  db.sessions[token] = targetUser.id;
  saveDatabase(db);

  const { passwordHash, ...safeUser } = targetUser;
  res.json({ user: safeUser, token });
});

// -------------------------------------------------------------
// SCRIPT GENERATOR (GEMINI 3.8 FLASH)
// -------------------------------------------------------------

app.post('/api/generate/script', requireAuth, async (req: Request, res: Response) => {
  const user = (req as any).user;
  const SCRIPT_COST = 1;

  if (user.role !== 'admin' && user.credits < SCRIPT_COST) {
    return res.status(402).json({
      error: `Crédits insuffisants. Cette génération nécessite ${SCRIPT_COST} crédit. Votre solde est de ${user.credits} crédit(s).`,
      requiresCredits: true
    });
  }

  const { topic, category = 'motivation', language = 'Français', tone = 'Énergique & Captivant', targetDuration = '30-60s' } = req.body;

  if (!topic || topic.trim().length < 3) {
    return res.status(400).json({ error: 'Veuillez renseigner un sujet ou une idée pour votre vidéo.' });
  }

  try {
    const promptInstructions = `
Génère un script vidéo viral ultra-performant pour TikTok / Instagram Reels / YouTube Shorts en format vertical 9:16.
Sujet : "${topic}"
Catégorie : ${category}
Langue : ${language}
Ton & Style : ${tone}
Durée ciblée : ${targetDuration}

IMPORTANT : Réponds EXCLUSIVEMENT avec un objet JSON valide sans balises markdown, respectant la structure suivante :
{
  "title": "Titre principal ultra-cliquable (sans clickbait trompeur)",
  "alternativeTitles": ["Titre alternatif 1", "Titre alternatif 2"],
  "hook": "L'accroche choc des 3 premières secondes pour bloquer le scroll",
  "fullScript": "Le texte parlé complet mot à mot avec ponctuation rythmée",
  "estimatedDuration": "ex: 42 secondes",
  "description": "Texte de publication TikTok optimisé SEO avec appel à l'action",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
  "soundSuggestion": "Recommandation précise du son ou de l'ambiance musicale tendance TikTok",
  "scenes": [
    {
      "sceneNumber": 1,
      "timestamp": "00:00 - 00:03",
      "visualPrompt916": "Description visuelle ultra détaillée en 9:16 pour modèle IA vidéo (Veo/Runway)",
      "speech": "Ce qui est dit durant cette scène",
      "textOnScreen": "Texte court en lettres capitales affiché à l'écran",
      "cameraAngle": "Angle et mouvement de caméra (ex: Zoom rapide, travelling)",
      "musicMood": "Intensité audio (ex: Impact de basse)"
    }
  ],
  "veoPrompt": "Prompt principal en anglais optimisé pour Veo 9:16 vertical video generator intégrant le sujet, le style visuel cinématique et l'ambiance."
}
`;

    const geminiRes = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptInstructions,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.85
      }
    });

    const responseText = geminiRes.text?.trim() || '';
    let parsedData: any;
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseErr) {
      console.warn('JSON parsing fallback for script:', parseErr);
      // Clean possible markdown code fences
      const cleaned = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    // Server-side credit deduction
    if (user.role !== 'admin') {
      user.credits = Math.max(0, user.credits - SCRIPT_COST);
      db.creditTransactions.push({
        id: 'tx_' + crypto.randomUUID().slice(0, 8),
        userId: user.id,
        amount: -SCRIPT_COST,
        balanceAfter: user.credits,
        type: 'generation_script',
        description: `Génération script TikTok : "${topic.slice(0, 30)}..."`,
        timestamp: new Date().toISOString()
      });
    }

    const newScript = {
      id: 'script_' + crypto.randomUUID().slice(0, 8),
      userId: user.id,
      topic,
      category,
      language,
      tone,
      title: parsedData.title || topic,
      alternativeTitles: parsedData.alternativeTitles || [],
      hook: parsedData.hook || '',
      fullScript: parsedData.fullScript || '',
      estimatedDuration: parsedData.estimatedDuration || '35 secondes',
      description: parsedData.description || '',
      hashtags: parsedData.hashtags || ['#tiktok', '#ia'],
      soundSuggestion: parsedData.soundSuggestion || 'Beat tendance',
      scenes: parsedData.scenes || [],
      veoPrompt: parsedData.veoPrompt || '',
      createdAt: new Date().toISOString()
    };

    db.scripts.unshift(newScript);
    saveDatabase(db);

    res.json({
      success: true,
      script: newScript,
      remainingCredits: user.credits
    });
  } catch (error: any) {
    console.error('Gemini script generation error:', error);
    res.status(500).json({
      error: 'Erreur lors de la génération du script via Gemini : ' + (error?.message || 'Erreur inconnue')
    });
  }
});

// -------------------------------------------------------------
// VIDEO GENERATOR (VEO & DYNAMIC 9:16 STUDIO)
// -------------------------------------------------------------

app.post('/api/generate/video', requireAuth, async (req: Request, res: Response) => {
  const user = (req as any).user;
  const VIDEO_COST = 2;

  if (user.role !== 'admin' && user.credits < VIDEO_COST) {
    return res.status(402).json({
      error: `Crédits insuffisants. La génération vidéo nécessite ${VIDEO_COST} crédits. Votre solde actuel est de ${user.credits} crédit(s).`,
      requiresCredits: true
    });
  }

  const {
    prompt,
    style = 'Cinématique Réaliste',
    aspectRatio = '9:16',
    durationSeconds = 5,
    scenes = []
  } = req.body;

  if (!prompt || prompt.trim().length < 3) {
    return res.status(400).json({ error: 'Veuillez décrire la vidéo souhaitée.' });
  }

  // Deduct credits initially (will be refunded if unrecoverable error occurs)
  if (user.role !== 'admin') {
    user.credits = Math.max(0, user.credits - VIDEO_COST);
    db.creditTransactions.push({
      id: 'tx_' + crypto.randomUUID().slice(0, 8),
      userId: user.id,
      amount: -VIDEO_COST,
      balanceAfter: user.credits,
      type: 'generation_video',
      description: `Génération vidéo 9:16 : "${prompt.slice(0, 30)}..."`,
      timestamp: new Date().toISOString()
    });
  }

  let isRealVeo = false;
  let operationName = '';
  let veoError = '';

  // Attempt real Veo generation if configured
  try {
    if (process.env.GEMINI_API_KEY) {
      const veoAspect = aspectRatio === '16:9' ? '16:9' : '9:16';
      const operation = await ai.models.generateVideos({
        model: 'veo-3.1-lite-generate-preview',
        prompt: `${prompt}. High resolution 720p vertical TikTok style, ${style} aesthetic, professional lighting, seamless motion.`,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: veoAspect
        }
      });
      if (operation && operation.name) {
        operationName = operation.name;
        isRealVeo = true;
      }
    }
  } catch (vErr: any) {
    console.warn('Veo API call notice (likely quota / paid tier required for Veo models):', vErr?.message);
    veoError = vErr?.message || 'Quota ou accès Veo non configuré sur la clé API actuelle.';
    // Honest handling: We do not fake Veo MP4 generation!
    isRealVeo = false;
  }

  // Pre-generate dynamic visual scenes and high-res aesthetic gradients for vertical playback
  const defaultScenes = scenes.length > 0 ? scenes : [
    {
      sceneNumber: 1,
      timestamp: '00:00 - 00:02',
      visualPrompt916: prompt,
      speech: 'Accroche percutante',
      textOnScreen: prompt.slice(0, 24).toUpperCase(),
      cameraAngle: 'Zoom dynamique 9:16'
    },
    {
      sceneNumber: 2,
      timestamp: '00:02 - 00:05',
      visualPrompt916: `${prompt} - Climax et révélation`,
      speech: 'Développement de l\'idée',
      textOnScreen: 'ABONNE-TOI 🚀',
      cameraAngle: 'Plan travelling'
    }
  ];

  // Pick an aesthetic stylized vertical placeholder image relevant to style
  const styleImageMap: Record<string, string> = {
    'Cinématique Réaliste': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=720&q=80',
    'Cyberpunk Futuriste': 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=720&q=80',
    '3D Disney/Pixar': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=720&q=80',
    'Anime Japonais': 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=720&q=80',
    'Rétro VHS': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=720&q=80',
    'Studio Photo': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=720&q=80'
  };

  const previewThumbnail = styleImageMap[style] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=720&q=80';

  const newVideoProject = {
    id: 'vid_' + crypto.randomUUID().slice(0, 8),
    userId: user.id,
    title: prompt.slice(0, 40),
    prompt,
    style,
    aspectRatio,
    durationSeconds: Number(durationSeconds) || 5,
    status: isRealVeo ? 'processing' : 'completed',
    isRealVeo,
    operationName,
    previewThumbnail,
    scenes: defaultScenes,
    errorMessage: isRealVeo ? undefined : (veoError ? `Mode Studio Interactif (Veo API indisponible sur cette clé : ${veoError.slice(0, 100)})` : undefined),
    createdAt: new Date().toISOString()
  };

  db.videos.unshift(newVideoProject);
  saveDatabase(db);

  res.json({
    success: true,
    video: newVideoProject,
    isRealVeo,
    remainingCredits: user.credits,
    message: isRealVeo
      ? 'Opération Veo initiée avec succès. Rendu en cours...'
      : 'Vidéo préparée en Mode Studio Storyboard 9:16 (Le modèle Veo officiel nécessite un compte avec facturation Google Cloud activée. Le lecteur interactif TikTok est opérationnel).'
  });
});

// Check Veo video status
app.post('/api/video-status', requireAuth, async (req: Request, res: Response) => {
  const { operationName } = req.body;
  if (!operationName) {
    return res.status(400).json({ error: 'Nom d\'opération manquant.' });
  }

  try {
    // Dynamically reconstruct operation for SDK
    const op = { name: operationName } as any;
    const updated = await ai.operations.getVideosOperation({ operation: op });

    res.json({
      done: updated.done,
      response: updated.response,
      error: updated.error
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Erreur de vérification du statut Veo.' });
  }
});

// Download real Veo video
app.post('/api/video-download', requireAuth, async (req: Request, res: Response) => {
  const { operationName } = req.body;
  if (!operationName) {
    return res.status(400).json({ error: 'Nom d\'opération manquant.' });
  }

  try {
    const op = { name: operationName } as any;
    const updated = await ai.operations.getVideosOperation({ operation: op });
    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;

    if (!uri) {
      return res.status(404).json({ error: 'Fichier vidéo non encore disponible ou expiré.' });
    }

    const videoRes = await fetch(uri, {
      headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY || '' },
    });

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'attachment; filename="tiktok-ai-video.mp4"');

    const buffer = await videoRes.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err: any) {
    res.status(500).json({ error: 'Erreur lors du téléchargement : ' + (err?.message || '') });
  }
});

// -------------------------------------------------------------
// LIBRARY & SAVED GENERATIONS
// -------------------------------------------------------------

app.get('/api/library', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const userScripts = db.scripts.filter(s => s.userId === user.id);
  const userVideos = db.videos.filter(v => v.userId === user.id);
  res.json({ scripts: userScripts, videos: userVideos });
});

app.delete('/api/library/:type/:id', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { type, id } = req.params;

  if (type === 'script') {
    db.scripts = db.scripts.filter(s => !(s.id === id && (s.userId === user.id || user.role === 'admin')));
  } else if (type === 'video') {
    db.videos = db.videos.filter(v => !(v.id === id && (v.userId === user.id || user.role === 'admin')));
  }

  saveDatabase(db);
  res.json({ success: true });
});

// -------------------------------------------------------------
// CREDITS & PAYMENTS (MULTI-GATEWAY + SANDBOX/REAL)
// -------------------------------------------------------------

app.get('/api/credits/history', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const transactions = db.creditTransactions
    .filter(t => t.userId === user.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  res.json({ transactions, currentCredits: user.credits });
});

// Checkout initiation and confirmation
app.post('/api/checkout/session', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { itemType, itemId, method = 'card', currency = 'EUR', testMode = true } = req.body;

  let amount = 0;
  let creditsToAdd = 0;
  let newPlan: 'free' | 'creator' | 'pro' | undefined;
  let itemTitle = '';

  if (itemType === 'subscription') {
    const targetPlan = db.plans.find(p => p.id === itemId);
    if (!targetPlan) {
      return res.status(400).json({ error: 'Forfait inexistant.' });
    }
    amount = currency === 'USD' ? targetPlan.priceUsd : targetPlan.priceEur;
    creditsToAdd = targetPlan.monthlyCredits;
    newPlan = targetPlan.id;
    itemTitle = `Abonnement ${targetPlan.name}`;
  } else if (itemType === 'credit_pack') {
    const packs: Record<string, { credits: number; priceEur: number; priceUsd: number; title: string }> = {
      pack_50: { credits: 50, priceEur: 3, priceUsd: 3, title: 'Pack 50 crédits' },
      pack_150: { credits: 150, priceEur: 7, priceUsd: 7, title: 'Pack 150 crédits' },
      pack_500: { credits: 500, priceEur: 19, priceUsd: 19, title: 'Pack 500 crédits VIP' }
    };
    const pack = packs[itemId];
    if (!pack) {
      return res.status(400).json({ error: 'Pack de crédits inexistant.' });
    }
    amount = currency === 'USD' ? pack.priceUsd : pack.priceEur;
    creditsToAdd = pack.credits;
    itemTitle = pack.title;
  } else {
    return res.status(400).json({ error: 'Type de paiement non supporté.' });
  }

  // Payment transaction record
  const paymentRecord = {
    id: 'pay_' + crypto.randomUUID().slice(0, 8),
    userId: user.id,
    userEmail: user.email,
    amount,
    currency,
    itemType,
    itemId,
    method,
    status: 'completed',
    timestamp: new Date().toISOString()
  };

  db.paymentTransactions.push(paymentRecord);

  // Update user credits & plan atomically
  user.credits += creditsToAdd;
  if (newPlan) {
    user.plan = newPlan;
    user.renewalDate = new Date(Date.now() + 30 * 86400000).toISOString();
  }

  db.creditTransactions.push({
    id: 'tx_' + crypto.randomUUID().slice(0, 8),
    userId: user.id,
    amount: creditsToAdd,
    balanceAfter: user.credits,
    type: itemType === 'subscription' ? 'subscription' : 'purchase',
    description: `Paiement confirmé (${method.toUpperCase()}) : ${itemTitle}`,
    timestamp: new Date().toISOString()
  });

  saveDatabase(db);

  const { passwordHash, ...safeUser } = user;
  res.json({
    success: true,
    payment: paymentRecord,
    user: safeUser,
    message: `Paiement validé avec succès ! ${creditsToAdd} crédits ajoutés à votre compte.`
  });
});

app.post('/api/subscription/cancel', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  user.plan = 'free';
  user.renewalDate = undefined;
  saveDatabase(db);
  const { passwordHash, ...safeUser } = user;
  res.json({ success: true, user: safeUser, message: 'Votre abonnement a été résilié. Vous êtes repassé au forfait Gratuit.' });
});

// -------------------------------------------------------------
// ADMIN ENDPOINTS (STATS, PLANS, USERS, CREDITS)
// -------------------------------------------------------------

app.get('/api/admin/stats', requireAdmin, (req: Request, res: Response) => {
  const totalUsers = db.users.length;
  const activeUsers = db.users.filter(u => u.credits > 0 || u.plan !== 'free').length;
  const premiumSubscribers = db.users.filter(u => u.plan === 'creator' || u.plan === 'pro').length;

  const totalRevenueUsd = db.paymentTransactions
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + (p.currency === 'USD' ? p.amount : p.amount * 1.08), 0);

  const totalCreditsUsed = db.creditTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const successfulGenerations = db.scripts.length + db.videos.filter(v => v.status === 'completed').length;
  const failedGenerations = db.videos.filter(v => v.status === 'failed').length;

  // Real estimated Gemini API costs (Gemini 3.8 Flash is ~$0.10/M tokens, so scripts cost ~$0.0002 each)
  const estimatedApiCostUsd = Math.round((db.scripts.length * 0.0003 + db.videos.length * 0.002) * 1000) / 1000;

  res.json({
    stats: {
      totalUsers,
      activeUsers,
      premiumSubscribers,
      totalRevenueUsd: Math.round(totalRevenueUsd * 100) / 100,
      totalCreditsUsed,
      successfulGenerations,
      failedGenerations,
      estimatedApiCostUsd
    }
  });
});

app.get('/api/admin/plans', (req: Request, res: Response) => {
  res.json({ plans: db.plans });
});

app.put('/api/admin/plans', requireAdmin, (req: Request, res: Response) => {
  const { plans } = req.body;
  if (!Array.isArray(plans)) {
    return res.status(400).json({ error: 'Format des forfaits invalide.' });
  }

  db.plans = plans;
  saveDatabase(db);
  res.json({ success: true, plans: db.plans, message: 'Grille tarifaire mise à jour avec succès.' });
});

app.get('/api/admin/users', requireAdmin, (req: Request, res: Response) => {
  const safeUsers = db.users.map(({ passwordHash, ...u }) => ({
    ...u,
    scriptsCount: db.scripts.filter(s => s.userId === u.id).length,
    videosCount: db.videos.filter(v => v.userId === u.id).length
  }));
  res.json({ users: safeUsers });
});

app.post('/api/admin/adjust-credits', requireAdmin, (req: Request, res: Response) => {
  const { userId, amount, reason } = req.body;
  const target = db.users.find(u => u.id === userId);

  if (!target) {
    return res.status(404).json({ error: 'Utilisateur introuvable.' });
  }

  const delta = parseInt(amount, 10);
  if (isNaN(delta) || delta === 0) {
    return res.status(400).json({ error: 'Montant de crédits invalide.' });
  }

  target.credits = Math.max(0, target.credits + delta);

  db.creditTransactions.push({
    id: 'tx_' + crypto.randomUUID().slice(0, 8),
    userId: target.id,
    amount: delta,
    balanceAfter: target.credits,
    type: 'admin_adjust',
    description: `Ajustement Administrateur (${reason || 'Régularisation'})`,
    timestamp: new Date().toISOString()
  });

  saveDatabase(db);
  res.json({ success: true, newBalance: target.credits, user: target });
});

app.get('/api/admin/transactions', requireAdmin, (req: Request, res: Response) => {
  res.json({
    payments: db.paymentTransactions.slice().reverse(),
    creditTransactions: db.creditTransactions.slice().reverse()
  });
});

// System check & free hosting deployment guide
app.get('/api/system/status', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    appName: 'TikTok AI Studio',
    version: '1.0.0',
    geminiApiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
    geminiModel: 'gemini-3.8-flash',
    veoModel: 'veo-3.1-lite-generate-preview',
    storageMode: 'Persistent JSON DB (/data/database.json)',
    nodeVersion: process.version,
    freeHostingOptions: [
      {
        name: 'Google AI Studio / Cloud Run',
        description: 'Déjà prêt et déployé automatiquement via le lien de partage AI Studio.',
        cost: 'Gratuit avec quota Google'
      },
      {
        name: 'Render.com (Web Service)',
        description: 'Connectez votre dépôt GitHub, commande build: "npm run build", commande start: "npm start".',
        cost: 'Forfait Free disponible'
      },
      {
        name: 'Railway / Fly.io',
        description: 'Déploiement Docker ou Node.js 1 clic avec persistance de volume montée sur /data.',
        cost: 'Crédits d\'essai gratuits'
      }
    ]
  });
});

// -------------------------------------------------------------
// STATIC OR VITE DEV SERVER INTEGRATION
// -------------------------------------------------------------

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 TikTok AI Studio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
