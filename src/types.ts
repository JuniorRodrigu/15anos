export interface Gift {
  id: string;
  name: string;
  description: string;
  quotaValue: number;
  totalQuotas: number;
  takenQuotas: number;
  pendingQuotas: number;
  imageUrl: string;
  createdAt: number;
}

export interface Contribution {
  id: string;
  giftId: string;
  giftName: string;
  guestName: string;
  guestPhone: string;
  guestMessage: string;
  quotasCount: number;
  totalValue: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: number;
}

export interface AppSettings {
  birthdayGirl: string;
  birthdayDate: string;
  welcomeMessage: string;
  pixKey: string;
  pixType: string;
  pixName: string;
  pixQrCodeUrl: string;
  adminPin: string;
  featuredImageUrl?: string;
  location?: string;
  theme?: 'navy' | 'rose' | 'lavender';
  whatsappPhone?: string;
}
