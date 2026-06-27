import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { Gift, Contribution, AppSettings, GuestConfirmation } from '../types';

const firebaseConfig = {
  projectId: "gen-lang-client-0309471529",
  appId: "1:281567227386:web:9818abc1987cdd9f848843",
  apiKey: "AIzaSyA-d9hkav0o4h6NEVdwGE8r0tRsDAPT7lE",
  authDomain: "gen-lang-client-0309471529.firebaseapp.com",
  storageBucket: "gen-lang-client-0309471529.firebasestorage.app",
  messagingSenderId: "281567227386"
};

const databaseId = "ai-studio-e5d37590-403b-45aa-9bd7-ab3737350408";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, databaseId);

// Helper collection references
const SETTINGS_DOC_ID = 'main_settings';

export async function getAppSettings(): Promise<AppSettings> {
  const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data() as AppSettings;
    if (data.birthdayGirl === 'Lorena Silva' || data.birthdayGirl === 'Lorena') {
      data.birthdayGirl = 'Lara Giovana';
      data.pixName = 'Lara Giovana Silva';
      try {
        await updateDoc(docRef, {
          birthdayGirl: 'Lara Giovana',
          pixName: 'Lara Giovana Silva'
        });
      } catch (err) {
        console.error("Error auto-updating settings in Firestore:", err);
      }
    }
    return data;
  } else {
    // Return default settings
    const defaultSettings: AppSettings = {
      birthdayGirl: 'Lara Giovana',
      birthdayDate: '2026-07-04',
      welcomeMessage: 'Bem-vindo ao meu site de 15 anos! Fico muito feliz em ter você aqui para comemorar esse momento tão especial comigo. Se quiser me presentear, escolha uma das cotas abaixo. Cada detalhe foi pensado com muito carinho!',
      pixKey: 'juniorrodrigues1717@gmail.com',
      pixType: 'E-mail',
      pixName: 'Lara Giovana Silva',
      pixQrCodeUrl: '',
      adminPin: '15anos',
      featuredImageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80',
      location: 'Rua Rio Tigre, 259 - José e Maria',
      theme: 'navy',
      whatsappPhone: '5587988024652'
    };
    await setDoc(docRef, defaultSettings);
    return defaultSettings;
  }
}

export async function updateAppSettings(settings: Partial<AppSettings>): Promise<void> {
  const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
  await setDoc(docRef, settings, { merge: true });
}

export async function getGifts(): Promise<Gift[]> {
  const colRef = collection(db, 'gifts');
  const q = query(colRef, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  
  if (snap.empty) {
    // Seed default gifts
    const defaultGifts: Omit<Gift, 'id'>[] = [
      {
        name: 'Vestido da Valsa Principal',
        description: 'Ajude a Lara Giovana a brilhar na valsa de 15 anos com um lindo vestido digno de princesa!',
        quotaValue: 100,
        totalQuotas: 10,
        takenQuotas: 0,
        pendingQuotas: 0,
        imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&auto=format&fit=crop&q=80',
        createdAt: Date.now() - 60000
      },
      {
        name: 'Dia de Princesa (Spa Completo)',
        description: 'Um dia de relaxamento, massagem e cuidados especiais antes da grande festa.',
        quotaValue: 75,
        totalQuotas: 6,
        takenQuotas: 0,
        pendingQuotas: 0,
        imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80',
        createdAt: Date.now() - 120000
      },
      {
        name: 'Anel Clássico de Debutante',
        description: 'O tradicional anel que marca a transição mágica de uma jovem debutante.',
        quotaValue: 120,
        totalQuotas: 5,
        takenQuotas: 0,
        pendingQuotas: 0,
        imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80',
        createdAt: Date.now() - 180000
      },
      {
        name: 'Sapato de Cinderela',
        description: 'O salto alto perfeito e delicado para combinar com o vestido de debutante.',
        quotaValue: 80,
        totalQuotas: 4,
        takenQuotas: 0,
        pendingQuotas: 0,
        imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80',
        createdAt: Date.now() - 240000
      },
      {
        name: 'Sessão de Fotos Profissional (Book)',
        description: 'Registro profissional desse momento tão especial para ficar guardado para sempre.',
        quotaValue: 60,
        totalQuotas: 8,
        takenQuotas: 0,
        pendingQuotas: 0,
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
        createdAt: Date.now() - 300000
      },
      {
        name: 'Kit de Maquiagem Importada',
        description: 'Uma paleta linda de sombras e produtos premium de make para a aniversariante.',
        quotaValue: 50,
        totalQuotas: 5,
        takenQuotas: 0,
        pendingQuotas: 0,
        imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&auto=format&fit=crop&q=80',
        createdAt: Date.now() - 360000
      }
    ];

    const seededGifts: Gift[] = [];
    for (const g of defaultGifts) {
      const docRef = doc(collection(db, 'gifts'));
      const newGift: Gift = { ...g, id: docRef.id };
      await setDoc(docRef, newGift);
      seededGifts.push(newGift);
    }
    return seededGifts;
  }

  return snap.docs.map(d => d.data() as Gift);
}

export async function addGift(gift: Omit<Gift, 'id' | 'takenQuotas' | 'pendingQuotas' | 'createdAt'>): Promise<Gift> {
  const docRef = doc(collection(db, 'gifts'));
  const newGift: Gift = {
    ...gift,
    id: docRef.id,
    takenQuotas: 0,
    pendingQuotas: 0,
    createdAt: Date.now()
  };
  await setDoc(docRef, newGift);
  return newGift;
}

export async function updateGift(giftId: string, giftData: Partial<Gift>): Promise<void> {
  const docRef = doc(db, 'gifts', giftId);
  await updateDoc(docRef, giftData);
}

export async function deleteGift(giftId: string): Promise<void> {
  const docRef = doc(db, 'gifts', giftId);
  await deleteDoc(docRef);
}

export async function getContributions(): Promise<Contribution[]> {
  const colRef = collection(db, 'contributions');
  const q = query(colRef, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as Contribution);
}

export async function addContribution(contribution: Omit<Contribution, 'id' | 'status' | 'createdAt'>): Promise<Contribution> {
  const docRef = doc(collection(db, 'contributions'));
  const newContribution: Contribution = {
    ...contribution,
    id: docRef.id,
    status: 'approved',
    createdAt: Date.now()
  };
  await setDoc(docRef, newContribution);
  
  // Also increment takenQuotas for the gift to reflect immediately as taken
  const giftRef = doc(db, 'gifts', contribution.giftId);
  const giftSnap = await getDoc(giftRef);
  if (giftSnap.exists()) {
    const gift = giftSnap.data() as Gift;
    await updateDoc(giftRef, {
      takenQuotas: (gift.takenQuotas || 0) + contribution.quotasCount
    });
  }
  
  return newContribution;
}

export async function updateContributionStatus(
  contributionId: string, 
  newStatus: 'approved' | 'rejected'
): Promise<void> {
  const contribRef = doc(db, 'contributions', contributionId);
  const contribSnap = await getDoc(contribRef);
  if (!contribSnap.exists()) return;
  
  const contribution = contribSnap.data() as Contribution;
  const currentStatus = contribution.status;
  
  if (currentStatus === newStatus) return; // No change
  
  // Update status
  await updateDoc(contribRef, { status: newStatus });
  
  // Adjust gift quotas
  const giftRef = doc(db, 'gifts', contribution.giftId);
  const giftSnap = await getDoc(giftRef);
  if (giftSnap.exists()) {
    const gift = giftSnap.data() as Gift;
    
    let pendingDiff = 0;
    let takenDiff = 0;
    
    // We are transitions:
    // From 'pending':
    //   -> to 'approved': subtract from pending, add to taken
    //   -> to 'rejected': subtract from pending
    if (currentStatus === 'pending') {
      pendingDiff = -contribution.quotasCount;
      if (newStatus === 'approved') {
        takenDiff = contribution.quotasCount;
      }
    } 
    // From 'approved' (in case they re-adjust later):
    //   -> to 'rejected' or 'pending': subtract from taken
    // Wait, let's keep it simple. Standard flow is: pending -> approved/rejected.
    
    const newPending = Math.max(0, (gift.pendingQuotas || 0) + pendingDiff);
    const newTaken = Math.max(0, Math.min(gift.totalQuotas, (gift.takenQuotas || 0) + takenDiff));
    
    await updateDoc(giftRef, {
      pendingQuotas: newPending,
      takenQuotas: newTaken
    });
  }
}

export async function getConfirmations(): Promise<GuestConfirmation[]> {
  const colRef = collection(db, 'confirmations');
  const q = query(colRef, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as GuestConfirmation);
}

export async function addConfirmation(confirmation: Omit<GuestConfirmation, 'id' | 'createdAt'>): Promise<GuestConfirmation> {
  const docRef = doc(collection(db, 'confirmations'));
  const newConfirmation: GuestConfirmation = {
    ...confirmation,
    id: docRef.id,
    createdAt: Date.now()
  };
  await setDoc(docRef, newConfirmation);
  return newConfirmation;
}

export async function deleteConfirmation(id: string): Promise<void> {
  const docRef = doc(db, 'confirmations', id);
  await deleteDoc(docRef);
}
