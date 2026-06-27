import React, { useState, useEffect } from 'react';
import { 
  Gift as GiftIcon, 
  Sparkles, 
  Heart, 
  Search, 
  Clock, 
  Calendar, 
  QrCode, 
  Copy, 
  Check, 
  ChevronRight, 
  MessageCircle, 
  User, 
  Phone, 
  Smile, 
  CheckCircle,
  X,
  Plus,
  Minus,
  PartyPopper,
  Info
} from 'lucide-react';
import { Gift, Contribution, AppSettings, GuestConfirmation } from '../types';
import { addContribution, addConfirmation } from '../lib/firebase';

interface GuestViewProps {
  settings: AppSettings;
  gifts: Gift[];
  onOpenAdmin: () => void;
  onRefresh: () => Promise<void>;
}

export default function GuestView({ settings, gifts, onOpenAdmin, onRefresh }: GuestViewProps) {
  const theme = settings.theme || 'navy';
  const birthdayGirlName = settings.birthdayGirl === 'Lorena Silva' || settings.birthdayGirl === 'Lorena' ? 'Lara Giovana' : settings.birthdayGirl;

  const [isSystemDark, setIsSystemDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsSystemDark(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsSystemDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const themeConfigs = {
    navy: {
      primaryColor: '#1B365D',
      primaryClass: 'text-[#1B365D]',
      primaryBgClass: 'bg-[#1B365D]',
      primaryHoverBgClass: 'hover:bg-[#1B365D]/90',
      primaryBorderClass: 'border-[#1B365D]',
      primaryBorderMutedClass: 'border-[#1B365D]/25',
      primaryBorderLightClass: 'border-[#1B365D]/15',
      primaryTextMutedClass: 'text-[#1B365D]/40',
      primaryTextSemiMutedClass: 'text-[#1B365D]/90',
      primaryBgLightClass: 'bg-[#1B365D]/10',
      primaryBgLightBorderClass: 'border-[#1B365D]/20',
      bodyBgStyle: {
        backgroundColor: '#FCFAF6',
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(27, 54, 93, 0.03) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(27, 54, 93, 0.03) 0%, transparent 45%)'
      },
      cardBgClass: 'bg-[#FAF8F3]',
      cardBorderClass: 'border-[#1B365D]/15',
      sparkleClass: 'text-[#1B365D]',
      buttonBgGradient: 'bg-gradient-to-r from-[#1B365D] to-[#2E588E]',
      shadowColor: 'rgba(27, 54, 93, 0.1)',
      successBadgeClass: 'bg-[#1B365D]/10 text-[#1B365D] border-[#1B365D]/20',
      textMain: 'text-slate-800',
      textMuted: 'text-slate-500',
      inputBgClass: 'bg-white border-slate-200',
      dateBoxBgClass: 'bg-white/50'
    },
    rose: {
      primaryColor: '#F43F5E',
      primaryClass: 'text-rose-500',
      primaryBgClass: 'bg-rose-500',
      primaryHoverBgClass: 'hover:bg-rose-600',
      primaryBorderClass: 'border-rose-500',
      primaryBorderMutedClass: 'border-rose-400/25',
      primaryBorderLightClass: 'border-rose-300/20',
      primaryTextMutedClass: 'text-rose-400/40',
      primaryTextSemiMutedClass: 'text-rose-900/90',
      primaryBgLightClass: 'bg-rose-100/50',
      primaryBgLightBorderClass: 'border-rose-200',
      bodyBgStyle: {
        backgroundColor: '#FFF5F6',
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(244, 63, 94, 0.05) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(14, 165, 233, 0.05) 0%, transparent 45%)'
      },
      cardBgClass: 'bg-[#FFFDFE]',
      cardBorderClass: 'border-rose-200/60',
      sparkleClass: 'text-rose-400',
      buttonBgGradient: 'bg-gradient-to-r from-rose-500 to-pink-500',
      shadowColor: 'rgba(244, 63, 94, 0.08)',
      successBadgeClass: 'bg-rose-50 text-rose-600 border-rose-100',
      textMain: 'text-slate-800',
      textMuted: 'text-slate-500',
      inputBgClass: 'bg-white border-rose-200',
      dateBoxBgClass: 'bg-white/50'
    },
    lavender: {
      primaryColor: '#A78BFA',
      primaryClass: 'text-[#C084FC]',
      primaryBgClass: 'bg-[#8B5CF6]',
      primaryHoverBgClass: 'hover:bg-[#7C3AED]',
      primaryBorderClass: 'border-[#A78BFA]',
      primaryBorderMutedClass: 'border-[#8B5CF6]/30',
      primaryBorderLightClass: 'border-[#C084FC]/20',
      primaryTextMutedClass: 'text-[#C084FC]/40',
      primaryTextSemiMutedClass: 'text-purple-200',
      primaryBgLightClass: 'bg-purple-950/40',
      primaryBgLightBorderClass: 'border-purple-800/40',
      bodyBgStyle: {
        backgroundColor: '#0B0418',
        backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.12) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(192, 132, 252, 0.1) 0%, transparent 50%)'
      },
      cardBgClass: 'bg-[#150D27]',
      cardBorderClass: 'border-purple-950/40',
      sparkleClass: 'text-purple-300',
      buttonBgGradient: 'bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]',
      shadowColor: 'rgba(139, 92, 246, 0.15)',
      successBadgeClass: 'bg-purple-950/60 text-[#D8B4FE] border-purple-800/30',
      textMain: 'text-purple-50',
      textMuted: 'text-purple-300/70',
      inputBgClass: 'bg-[#1F143A] border-purple-900/50 text-purple-50',
      dateBoxBgClass: 'bg-purple-950/30'
    }
  };

  const activeTheme = React.useMemo(() => {
    const currentTheme = settings.theme || 'navy';
    
    if (currentTheme === 'lavender') {
      return themeConfigs.lavender;
    }
    
    if (isSystemDark) {
      if (currentTheme === 'navy') {
        return {
          ...themeConfigs.navy,
          primaryClass: 'text-blue-400',
          primaryBgClass: 'bg-blue-600',
          primaryHoverBgClass: 'hover:bg-blue-700',
          primaryBorderClass: 'border-blue-500',
          primaryBorderMutedClass: 'border-blue-500/30',
          primaryBorderLightClass: 'border-blue-500/20',
          primaryTextMutedClass: 'text-blue-300/40',
          primaryTextSemiMutedClass: 'text-blue-200',
          primaryBgLightClass: 'bg-blue-950/40',
          primaryBgLightBorderClass: 'border-blue-900/40',
          bodyBgStyle: {
            backgroundColor: '#090D16',
            backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(29, 78, 216, 0.08) 0%, transparent 45%)'
          },
          cardBgClass: 'bg-[#111827]',
          cardBorderClass: 'border-slate-800',
          sparkleClass: 'text-blue-400',
          buttonBgGradient: 'bg-gradient-to-r from-blue-600 to-indigo-500',
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          successBadgeClass: 'bg-blue-950/60 text-blue-200 border-blue-900/30',
          textMain: 'text-slate-100',
          textMuted: 'text-slate-400',
          inputBgClass: 'bg-[#1F2937] border-slate-700 text-slate-100',
          dateBoxBgClass: 'bg-[#090D16]/50'
        };
      } else if (currentTheme === 'rose') {
        return {
          ...themeConfigs.rose,
          primaryClass: 'text-rose-400',
          primaryBgClass: 'bg-rose-500',
          primaryHoverBgClass: 'hover:bg-rose-600',
          primaryBorderClass: 'border-rose-500',
          primaryBorderMutedClass: 'border-rose-500/30',
          primaryBorderLightClass: 'border-rose-500/20',
          primaryTextMutedClass: 'text-rose-300/40',
          primaryTextSemiMutedClass: 'text-rose-200',
          primaryBgLightClass: 'bg-rose-950/40',
          primaryBgLightBorderClass: 'border-rose-900/40',
          bodyBgStyle: {
            backgroundColor: '#0F0507',
            backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(244, 63, 94, 0.12) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(219, 39, 119, 0.08) 0%, transparent 45%)'
          },
          cardBgClass: 'bg-[#1A090C]',
          cardBorderClass: 'border-rose-950/40',
          sparkleClass: 'text-rose-300',
          buttonBgGradient: 'bg-gradient-to-r from-rose-500 to-pink-600',
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          successBadgeClass: 'bg-rose-950/60 text-rose-200 border-rose-900/30',
          textMain: 'text-rose-100',
          textMuted: 'text-rose-300/60',
          inputBgClass: 'bg-[#240F12] border-rose-900/40 text-rose-100',
          dateBoxBgClass: 'bg-[#0F0507]/50'
        };
      }
    }
    
    return themeConfigs[currentTheme] || themeConfigs.navy;
  }, [settings.theme, isSystemDark]);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'available' | 'completed'>('all');
  
  // Countdown state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPartyPast, setIsPartyPast] = useState(false);

  // Selected gift for payment modal
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  
  // Modal step: 'details' -> 'pix' -> 'success'
  const [modalStep, setModalStep] = useState<'details' | 'pix' | 'success'>('details');
  
  // Gift selection form
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [selectedQuotas, setSelectedQuotas] = useState(1);
  const [isCopying, setIsCopying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Attendance confirmation modal states
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmName, setConfirmName] = useState('');
  const [confirmPhone, setConfirmPhone] = useState('');
  const [confirmCompanionCount, setConfirmCompanionCount] = useState(0);
  const [confirmCompanionNames, setConfirmCompanionNames] = useState('');
  const [isConfirmSubmitting, setIsConfirmSubmitting] = useState(false);

  // Sync body background styles
  useEffect(() => {
    const bgStyle = activeTheme.bodyBgStyle;
    document.body.style.backgroundColor = bgStyle.backgroundColor;
    document.body.style.backgroundImage = bgStyle.backgroundImage;
    
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.backgroundImage = '';
    };
  }, [theme, activeTheme]);

  // Calculate countdown
  useEffect(() => {
    const calculateTimeLeft = () => {
      const dateStr = settings.birthdayDate.includes('T') 
        ? settings.birthdayDate 
        : `${settings.birthdayDate}T00:00:00`;
      const difference = +new Date(dateStr) - +new Date();
      if (difference <= 0) {
        setIsPartyPast(true);
        return;
      }
      setIsPartyPast(false);
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [settings.birthdayDate]);

  // Filter gifts
  const filteredGifts = gifts.filter(gift => {
    const matchesSearch = gift.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (gift.description && gift.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const remaining = gift.totalQuotas - (gift.takenQuotas || 0);
    if (activeFilter === 'available') {
      return matchesSearch && remaining > 0;
    }
    if (activeFilter === 'completed') {
      return matchesSearch && remaining === 0;
    }
    return matchesSearch;
  });

  const handleOpenGiftModal = (gift: Gift) => {
    const remaining = gift.totalQuotas - (gift.takenQuotas || 0);
    if (remaining <= 0) return; // Already completed
    setSelectedGift(gift);
    setSelectedQuotas(1);
    setGuestName('');
    setGuestPhone('');
    setGuestMessage('');
    setModalStep('details');
  };

  const handleNextToPix = (e: React.FormEvent) => {
    e.preventDefault();
    setModalStep('pix');
  };

  const handleCopyPixKey = () => {
    navigator.clipboard.writeText(settings.pixKey);
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), 2000);
  };

  const handleConfirmPayment = async () => {
    if (!selectedGift) return;
    setIsSubmitting(true);
    
    const whatsappUrl = getWhatsappUrl();
    
    // Tenta abrir o WhatsApp imediatamente para evitar bloqueio de popup pelo navegador (sincronamente com o clique)
    let wpWindow: Window | null = null;
    if (whatsappUrl) {
      try {
        wpWindow = window.open(whatsappUrl, '_blank');
      } catch (e) {
        console.warn("Navegador bloqueou a abertura direta do WhatsApp:", e);
      }
    }

    try {
      await addContribution({
        giftId: selectedGift.id,
        giftName: selectedGift.name,
        guestName,
        guestPhone,
        guestMessage,
        quotasCount: selectedQuotas,
        totalValue: selectedGift.quotaValue * selectedQuotas
      });
      await onRefresh();
      
      setModalStep('success');
      
      // Se não conseguiu abrir em nova aba antes, redireciona agora como fallback
      if (!wpWindow && whatsappUrl) {
        window.location.href = whatsappUrl;
      }
    } catch (err) {
      console.error("Error creating contribution:", err);
      alert("Houve um erro ao registrar sua cota no sistema. Se você já fez o Pix, envie o comprovante no WhatsApp do mesmo jeito!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsappUrl = () => {
    if (!selectedGift) return '';
    const phoneNumber = settings.whatsappPhone || '5587988024652';
    const totalValue = selectedGift.quotaValue * selectedQuotas;
    const text = `Olá! Acabei de presentear com mimos virtuais de 15 anos!\n\n` +
      `🎁 *Presente:* ${selectedGift.name}\n` +
      `🔢 *Quantidade de Cotas:* ${selectedQuotas}\n` +
      `💰 *Valor Total:* R$ ${totalValue}\n` +
      `👤 *Convidado:* ${guestName}\n` +
      `${guestMessage ? `💬 *Mensagem:* "${guestMessage}"\n` : ''}\n` +
      `Estou enviando o comprovante Pix em anexo! Por favor, confirme aí. 😊`;
    return `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(text)}`;
  };

  const handleConfirmPresenceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmName.trim()) return;
    setIsConfirmSubmitting(true);

    let text = `Olá! Confirmei minha presença na festa de 15 anos da ${birthdayGirlName}! ✨\n\n`;
    text += `👤 *Nome:* ${confirmName}\n`;
    if (confirmCompanionCount > 0) {
      text += `👥 *Acompanhantes:* ${confirmCompanionCount} (${confirmCompanionNames})\n`;
    } else {
      text += `👥 *Acompanhantes:* Nenhum\n`;
    }
    text += `\nFico muito feliz em participar desse momento especial! 💖`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${settings.whatsappPhone || '5587988024652'}&text=${encodeURIComponent(text)}`;

    // Tenta abrir o WhatsApp imediatamente para evitar bloqueio de popup pelo navegador (sincronamente com o clique)
    let wpWindow: Window | null = null;
    try {
      wpWindow = window.open(whatsappUrl, '_blank');
    } catch (e) {
      console.warn("Navegador bloqueou a abertura direta do WhatsApp:", e);
    }

    try {
      await addConfirmation({
        guestName: confirmName,
        guestPhone: confirmPhone,
        companionCount: confirmCompanionCount,
        companionNames: confirmCompanionCount > 0 ? confirmCompanionNames : ''
      });
      await onRefresh();
      
      // Limpa os campos
      setConfirmName('');
      setConfirmPhone('');
      setConfirmCompanionCount(0);
      setConfirmCompanionNames('');
      setIsConfirmModalOpen(false);

      // Se não conseguiu abrir em nova aba antes, redireciona agora como fallback
      if (!wpWindow) {
        window.location.href = whatsappUrl;
      }
    } catch (err) {
      console.error("Error creating confirmation:", err);
      alert("Houve um erro ao registrar sua confirmação de presença no sistema, mas você pode confirmar diretamente pelo WhatsApp!");
      window.location.href = whatsappUrl;
    } finally {
      setIsConfirmSubmitting(false);
    }
  };

  // Pre-formatted Date String
  const partyDateFormatted = new Date(settings.birthdayDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  });

  // Precise date parsing to prevent UTC shifts for Lara Giovana's invitation card
  const dateParts = settings.birthdayDate.split('-');
  const invitationYear = parseInt(dateParts[0]) || 2026;
  const invitationMonthIdx = (parseInt(dateParts[1]) || 7) - 1;
  const invitationDay = parseInt(dateParts[2]?.split('T')[0]) || 4;
  
  const invitationDateObj = new Date(invitationYear, invitationMonthIdx, invitationDay, 19, 30);
  const monthStr = invitationDateObj.toLocaleDateString('pt-BR', { month: 'long' }).toUpperCase();
  const weekdayStr = invitationDateObj.toLocaleDateString('pt-BR', { weekday: 'long' }).split('-')[0].toUpperCase();
  const timeStr = settings.birthdayDate.includes('T')
    ? settings.birthdayDate.split('T')[1].substring(0, 5).toLowerCase()
    : '19h30';

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans relative pb-16">
      
      {/* Delicate Sparkles/Floating Icons Background Accent */}
      <div className="absolute top-10 left-10 w-44 h-44 bg-amber-100/10 rounded-full blur-3xl pointer-events-none" />
      <div className={`absolute top-1/3 right-10 w-60 h-60 ${theme === 'rose' ? 'bg-rose-100/20' : theme === 'lavender' ? 'bg-purple-900/10' : 'bg-[#1B365D]/5'} rounded-full blur-3xl pointer-events-none`} />
      <div className={`absolute bottom-20 left-1/4 w-52 h-52 ${theme === 'rose' ? 'bg-rose-100/10' : theme === 'lavender' ? 'bg-purple-900/5' : 'bg-[#1B365D]/3'} rounded-full blur-3xl pointer-events-none`} />

      {/* Top Banner Navigation */}
      <header className="w-full glass-header px-4 md:px-8 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-3 z-50 sticky top-0 shrink-0 shadow-xs">
        <div className="flex items-center gap-2">
          <Heart size={16} className={`${activeTheme.primaryClass} fill-current/40 animate-pulse`} />
          <span className={`font-serif font-extrabold text-sm md:text-base ${activeTheme.primaryClass} tracking-widest uppercase`}>
            {birthdayGirlName} • 15 Anos
          </span>
        </div>
        
        {/* Navigation Items indicating other remaining sections */}
        <nav className="flex items-center gap-1 md:gap-2 flex-wrap justify-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer hover:bg-black/5 active:scale-95 ${
              theme === 'lavender' ? 'text-purple-200 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Convite
          </button>
          
          <button
            onClick={() => document.getElementById('gifts-section')?.scrollIntoView({ behavior: 'smooth' })}
            className={`px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 hover:bg-black/5 active:scale-95 ${
              theme === 'lavender' ? 'text-purple-200 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GiftIcon size={12} />
            Presentes
          </button>

          <button
            onClick={() => setIsConfirmModalOpen(true)}
            className={`px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 hover:bg-black/5 active:scale-95 ${
              theme === 'lavender' ? 'text-purple-200 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart size={12} className="fill-current/10" />
            Presença
          </button>

          {settings.location && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 hover:bg-black/5 active:scale-95 ${
                theme === 'lavender' ? 'text-purple-200 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Mapa
            </a>
          )}


        </nav>
      </header>

      {/* Hero Invitation Section */}
      <section className="relative w-full max-w-4xl mx-auto px-4 pt-6 pb-12">
        <div className={`glass-panel rounded-[32px] overflow-hidden p-6 md:p-12 relative flex flex-col items-center ${activeTheme.cardBgClass} border ${activeTheme.cardBorderClass} shadow-xl min-h-[580px]`}>
          
          {/* Beautiful Hanging Ornament from Top Left */}
          <div className="absolute top-0 left-0 p-4 md:p-8 select-none pointer-events-none">
            {theme === 'rose' ? (
              <svg width="90" height="120" viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-rose-400 drop-shadow-md">
                <line x1="50" y1="0" x2="50" y2="40" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" />
                <path d="M 25,80 Q 50,83 75,80 Q 78,92 50,95 Q 22,92 25,80" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M 25,80 L 22,60 L 37,70 L 50,45 L 63,70 L 78,60 L 75,80" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="22" cy="58" r="3" fill="currentColor" />
                <circle cx="37" cy="68" r="2.5" fill="currentColor" />
                <circle cx="50" cy="42" r="4" fill="currentColor" />
                <circle cx="63" cy="68" r="2.5" fill="currentColor" />
                <circle cx="78" cy="58" r="3" fill="currentColor" />
                <circle cx="50" cy="88" r="2" fill="currentColor" />
                <circle cx="30" cy="50" r="1" fill="currentColor" opacity="0.6" />
                <circle cx="70" cy="50" r="1" fill="currentColor" opacity="0.6" />
              </svg>
            ) : theme === 'lavender' ? (
              <svg width="90" height="120" viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-400 drop-shadow-md">
                <line x1="50" y1="0" x2="50" y2="45" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" />
                <path d="M 50,55 A 20,20 0 1,0 75,80 A 15,15 0 1,1 50,55" fill="#FAF5FF" stroke="currentColor" strokeWidth="2" />
                <path d="M 68,52 L 70,45 L 72,52 L 79,54 L 72,56 L 70,63 L 68,56 L 61,54 Z" fill="currentColor" />
                <circle cx="35" cy="85" r="1.5" fill="currentColor" />
                <circle cx="45" cy="95" r="1" fill="currentColor" />
                <circle cx="32" cy="65" r="2" fill="currentColor" />
                <circle cx="74" cy="90" r="1.5" fill="currentColor" />
              </svg>
            ) : (
              <svg width="90" height="120" viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#1B365D]/95 drop-shadow-md">
                <line x1="50" y1="0" x2="50" y2="40" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" />
                <circle cx="50" cy="43" r="4" stroke="currentColor" strokeWidth="2" />
                <circle cx="50" cy="75" r="30" fill="#FCFAF6" stroke="currentColor" strokeWidth="2" />
                <path d="M 24,65 Q 50,75 76,65" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
                <path d="M 20,75 Q 50,85 80,75" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
                <path d="M 22,85 Q 50,95 78,85" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
                <path d="M 32,53 Q 44,75 32,97" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.5" />
                <path d="M 41,47 Q 50,75 41,103" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.5" />
                <path d="M 59,47 Q 50,75 59,103" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.5" />
                <path d="M 68,53 Q 56,75 68,97" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.5" />
                <circle cx="45" cy="62" r="1.5" fill="currentColor" />
                <circle cx="55" cy="88" r="1.5" fill="currentColor" />
                <circle cx="38" cy="76" r="2" fill="#94A3B8" />
                <circle cx="62" cy="70" r="1.5" fill="#94A3B8" />
              </svg>
            )}
          </div>

          {/* Star Arc Embellishments around the Header Name */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Top right starry cluster */}
            <div className="absolute top-6 right-6 md:top-10 md:right-10 flex gap-1.5 flex-wrap max-w-[120px] justify-end opacity-80">
              <Sparkles size={16} className={activeTheme.sparkleClass} />
              <span className={`${activeTheme.sparkleClass} text-lg`}>★</span>
              <span className="text-slate-400 text-sm">★</span>
              <span className={`${activeTheme.sparkleClass} text-xs`}>★</span>
              <Sparkles size={10} className="text-slate-400" />
            </div>
            
            {/* Mid left star */}
            <div className="absolute top-1/3 left-6 md:left-12 flex flex-col gap-2 items-center opacity-70">
              <span className="text-slate-400 text-base">★</span>
              <span className={`${activeTheme.sparkleClass} text-xs`}>★</span>
            </div>

            {/* Mid right star cluster */}
            <div className="absolute top-1/3 right-6 md:right-12 flex flex-col gap-1 items-center opacity-80">
              <span className={`${activeTheme.sparkleClass} text-xl`}>★</span>
              <span className="text-slate-400 text-xs">★</span>
              <span className={`${activeTheme.sparkleClass} text-sm`}>★</span>
            </div>
            
            {/* Bottom left small sparkles */}
            <div className="absolute bottom-24 left-10 opacity-50">
              <span className={`${activeTheme.sparkleClass} text-sm`}>✦</span>
            </div>
            {/* Bottom right small sparkles */}
            <div className="absolute bottom-24 right-10 opacity-50">
              <span className={`${activeTheme.sparkleClass} text-sm`}>✦</span>
            </div>
          </div>

          {/* Core Content */}
          <div className="w-full text-center mt-14 md:mt-16 flex flex-col items-center z-10">
            {/* The calligraphic cursive birthday girl's name */}
            <h1 className={`font-cursive text-6xl md:text-8xl ${activeTheme.primaryClass} leading-none tracking-wide py-1 drop-shadow-xs select-none`}>
              {birthdayGirlName}
            </h1>

            {/* "15 anos" elegantly written under */}
            <div className="flex items-center gap-3 justify-center mt-2">
              <span className={`${activeTheme.primaryTextMutedClass} text-sm`}>✦</span>
              <h2 className={`font-serif italic text-3xl md:text-4xl font-light ${activeTheme.primaryClass} tracking-widest uppercase`}>
                15 anos
              </h2>
              <span className={`${activeTheme.primaryTextMutedClass} text-sm`}>✦</span>
            </div>

            {/* Elegant text block / Welcome message */}
            <p className={`${theme === 'lavender' ? 'text-purple-200' : 'text-slate-600'} font-serif italic text-sm md:text-base max-w-lg mt-8 leading-relaxed px-4 text-center`}>
              {settings.welcomeMessage || "Neste dia especial, sua presença é more than important!"}
            </p>

            {/* Beautiful horizontal framed date box from the invitation */}
            <div className="w-full max-w-xl px-4 mt-8">
              <div className={`border ${activeTheme.primaryBorderMutedClass} rounded-xs p-1 ${activeTheme.dateBoxBgClass || 'bg-white/50'} backdrop-blur-xs`}>
                <div className={`border ${activeTheme.primaryBorderClass} flex justify-between items-center py-4 px-3 md:px-8 ${activeTheme.primaryClass}`}>
                  
                  {/* Weekday & Time column */}
                  <div className={`flex-1 text-center md:text-right border-r ${activeTheme.primaryBorderMutedClass} pr-2 md:pr-6`}>
                    <p className="font-serif font-extrabold text-xs md:text-sm uppercase tracking-widest leading-none">
                      {weekdayStr}
                    </p>
                    <p className={`font-sans text-[9px] md:text-xs font-semibold tracking-wider mt-1 ${theme === 'lavender' ? 'text-purple-300' : 'text-slate-500'} uppercase`}>
                      {timeStr}
                    </p>
                  </div>

                  {/* Day Circle element */}
                  <div className="px-3 md:px-6 shrink-0">
                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full border ${activeTheme.primaryBorderClass} flex items-center justify-center ${activeTheme.cardBgClass} shadow-xs`}>
                      <span className={`font-serif font-bold text-xl md:text-2xl ${activeTheme.primaryClass}`}>
                        {invitationDay}
                      </span>
                    </div>
                  </div>

                  {/* Month & Year column */}
                  <div className={`flex-1 text-center md:text-left border-l ${activeTheme.primaryBorderMutedClass} pl-2 md:pl-6`}>
                    <p className="font-serif font-extrabold text-xs md:text-sm uppercase tracking-widest leading-none">
                      {monthStr}
                    </p>
                    <p className={`font-sans text-[9px] md:text-xs font-semibold tracking-wider mt-1 ${theme === 'lavender' ? 'text-purple-300' : 'text-slate-500'}`}>
                      {invitationYear}
                    </p>
                  </div>

                </div>
              </div>
            </div>

            {/* Location / Physical Address */}
            {settings.location && (
              <p className={`font-serif text-xs md:text-sm ${activeTheme.primaryTextSemiMutedClass} tracking-wide mt-4 px-4 max-w-md mx-auto font-medium`}>
                {settings.location}
              </p>
            )}

            {/* Dynamic Real-time Countdown Timer */}
            {!isPartyPast && (
              <div className={`mt-8 pt-6 border-t ${activeTheme.primaryBorderLightClass} w-full max-w-md flex flex-col items-center`}>
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={12} className={activeTheme.primaryClass} />
                  <span className={`text-[10px] font-bold ${activeTheme.primaryClass} uppercase tracking-widest`}>Contagem Regressiva</span>
                </div>
                <div className="grid grid-cols-4 gap-4 md:gap-6 text-center w-full px-4">
                  <div>
                    <span className={`block text-xl md:text-2xl font-serif font-bold ${activeTheme.primaryClass}`}>{timeLeft.days}</span>
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Dias</span>
                  </div>
                  <div>
                    <span className={`block text-xl md:text-2xl font-serif font-bold ${activeTheme.primaryClass}`}>{timeLeft.hours}</span>
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Horas</span>
                  </div>
                  <div>
                    <span className={`block text-xl md:text-2xl font-serif font-bold ${activeTheme.primaryClass}`}>{timeLeft.minutes}</span>
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Minutos</span>
                  </div>
                  <div>
                    <span className={`block text-xl md:text-2xl font-serif font-bold ${activeTheme.primaryClass}`}>{timeLeft.seconds}</span>
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Segundos</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Action Circle Buttons exactly as seen in the invitation */}
            <div className="flex justify-center items-center gap-6 md:gap-10 mt-10 w-full">
              
              {/* Button 1: Lista de Presentes */}
              <button
                onClick={() => {
                  document.getElementById('gifts-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
              >
                <div className={`w-14 h-14 rounded-full ${activeTheme.primaryBgClass} ${activeTheme.primaryHoverBgClass} text-white flex items-center justify-center shadow-md transition-all group-hover:scale-105 active:scale-95`}>
                  <GiftIcon size={20} />
                </div>
                <span className={`text-[9px] uppercase font-bold ${activeTheme.primaryClass} tracking-wider text-center max-w-[80px] leading-tight font-sans`}>
                  Lista de Presentes
                </span>
              </button>

              {/* Button 2: Confirmar Presença */}
              <button
                onClick={() => setIsConfirmModalOpen(true)}
                className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
              >
                <div className={`w-14 h-14 rounded-full ${activeTheme.primaryBgClass} ${activeTheme.primaryHoverBgClass} text-white flex items-center justify-center shadow-md transition-all group-hover:scale-105 active:scale-95`}>
                  <Heart size={20} className="fill-white/10" />
                </div>
                <span className={`text-[9px] uppercase font-bold ${activeTheme.primaryClass} tracking-wider text-center max-w-[80px] leading-tight font-sans`}>
                  Confirmar Presença
                </span>
              </button>

              {/* Button 3: Endereço no Mapa */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  settings.location || 'Rua Rio Tigre, 259 - José e Maria'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-full ${activeTheme.primaryBgClass} ${activeTheme.primaryHoverBgClass} text-white flex items-center justify-center shadow-md transition-all group-hover:scale-105 active:scale-95`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <span className={`text-[9px] uppercase font-bold ${activeTheme.primaryClass} tracking-wider text-center max-w-[80px] leading-tight font-sans`}>
                  Endereço no Mapa
                </span>
              </a>

            </div>

            {/* Scroll Down Indicator - solves "Someone opening the page might not realize there's more content below" */}
            <div 
              onClick={() => {
                document.getElementById('gifts-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-14 mb-2 flex flex-col items-center gap-2 cursor-pointer group"
              title="Clique para ver a lista de presentes"
            >
              <span className={`text-[10px] font-extrabold uppercase tracking-widest ${theme === 'lavender' ? 'text-purple-300' : 'text-slate-500'} group-hover:scale-105 transition-transform animate-pulse`}>
                Veja a Lista de Presentes Abaixo
              </span>
              <div className={`w-9 h-9 rounded-full border ${activeTheme.primaryBorderMutedClass} bg-white/45 backdrop-blur-xs flex items-center justify-center group-hover:border-current transition-all shadow-xs group-hover:scale-110`}>
                <svg 
                  className={`w-4 h-4 animate-bounce ${activeTheme.primaryClass}`} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Main Grid Content (The Gift Registry) */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 flex-1">
        
        {/* Search, Filter, and Title Block */}
        <div id="gifts-section" className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-panel p-6 rounded-3xl">
          <div>
            <h2 className={`text-xl md:text-2xl font-serif font-bold ${activeTheme.primaryClass} flex items-center gap-2`}>
              <GiftIcon size={20} className={activeTheme.primaryClass} />
              Mimos & Presentes virtuais
            </h2>
            <p className={`text-xs ${theme === 'lavender' ? 'text-purple-300' : 'text-slate-500'} mt-1`}>Escolha uma lembrancinha virtual para apoiar e celebrar esse grande dia.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-none sm:w-60">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar presente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs transition-all placeholder:text-slate-400 focus:outline-none ${activeTheme.inputBgClass}`}
                id="search-gifts"
              />
            </div>

            {/* Filters */}
            <div className="flex bg-white/40 p-1 rounded-xl border border-white/50 backdrop-blur-xs self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeFilter === 'all'
                    ? `${activeTheme.primaryBgClass} text-white shadow-xs`
                    : `text-slate-500 hover:${activeTheme.primaryClass}`
                }`}
                id="filter-all"
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('available')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeFilter === 'available'
                    ? `${activeTheme.primaryBgClass} text-white shadow-xs`
                    : `text-slate-500 hover:${activeTheme.primaryClass}`
                }`}
                id="filter-available"
              >
                Disponíveis
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('completed')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeFilter === 'completed'
                    ? `${activeTheme.primaryBgClass} text-white shadow-xs`
                    : `text-slate-500 hover:${activeTheme.primaryClass}`
                }`}
                id="filter-completed"
              >
                Concluídos
              </button>
            </div>
          </div>
        </div>

        {/* Gift Cards Grid */}
        {filteredGifts.length === 0 ? (
          <div className={`glass-panel rounded-[32px] p-16 text-center ${theme === 'lavender' ? 'bg-[#150D27]/50' : 'bg-[#FAF8F3]/50'}`}>
            <div className={`p-4 bg-white/40 ${activeTheme.primaryClass} rounded-full inline-flex mb-4`}>
              <GiftIcon size={36} />
            </div>
            <h3 className={`text-lg font-serif font-bold ${activeTheme.primaryClass}`}>Nenhum presente encontrado</h3>
            <p className={`text-xs ${theme === 'lavender' ? 'text-purple-300' : 'text-slate-500'} max-w-sm mx-auto mt-2`}>
              Não encontramos presentes que correspondam à sua pesquisa ou filtro atual. Experimente digitar outra palavra-chave!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGifts.map((gift) => {
              const taken = gift.takenQuotas || 0;
              const total = gift.totalQuotas || 1;
              const remaining = total - taken;
              const percent = Math.min(100, Math.round((taken / total) * 100));
              const isCompleted = remaining <= 0;

              return (
                <div 
                  key={gift.id} 
                  className={`glass-card rounded-[24px] overflow-hidden transition-all duration-300 flex flex-col justify-between h-full group ${activeTheme.cardBgClass} border ${activeTheme.cardBorderClass} ${
                    isCompleted ? 'opacity-80' : `hover:scale-[1.02] hover:shadow-xl hover:${activeTheme.primaryBorderClass}`
                  }`}
                  id={`gift-${gift.id}`}
                >
                  {/* Image Header with Hover Scale */}
                  <div className="relative h-52 bg-slate-50 overflow-hidden shrink-0">
                    <img 
                      src={gift.imageUrl} 
                      alt={gift.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Floating Quota Price */}
                    <div className={`absolute top-4 right-4 ${activeTheme.cardBgClass} backdrop-blur-md ${activeTheme.primaryClass} font-extrabold px-3 py-1.5 rounded-xl text-xs shadow-md border ${activeTheme.cardBorderClass} tracking-wider`}>
                      Cota: R$ {gift.quotaValue}
                    </div>

                    {isCompleted && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                        <span className={`bg-white text-emerald-600 border border-slate-100 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg`}>
                          100% Garantido! 💖
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Info */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <h3 className={`font-serif font-bold ${activeTheme.textMain} text-lg leading-snug line-clamp-1`}>{gift.name}</h3>
                      <p className={`text-xs ${activeTheme.textMuted} leading-relaxed line-clamp-3 min-h-[3rem] font-sans`}>
                        {gift.description || `Uma contribuição carinhosa para deixar meu aniversário de 15 anos ainda mais inesquecível!`}
                      </p>

                      {/* Quota bar & status */}
                      <div className="space-y-1.5 pt-3">
                        <div className={`flex justify-between items-center text-[10px] font-bold ${activeTheme.textMuted} uppercase tracking-wider`}>
                          <span>{taken} de {total} cotas garantidas</span>
                          <span className={isCompleted ? 'text-emerald-500' : activeTheme.primaryClass}>
                            {isCompleted ? 'Esgotado' : `${remaining} restantes`}
                          </span>
                        </div>
                        
                        {/* Progress Bar container */}
                        <div className={`h-2 w-full ${theme === 'lavender' ? 'bg-purple-950/50' : 'bg-slate-100'} rounded-full overflow-hidden border ${activeTheme.cardBorderClass}`}>
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              isCompleted 
                                ? 'bg-emerald-500' 
                                : activeTheme.buttonBgGradient
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Button */}
                    <div className={`mt-6 pt-4 border-t ${activeTheme.cardBorderClass}`}>
                      {isCompleted ? (
                        <div className="w-full text-center py-3 bg-emerald-50/10 text-emerald-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-emerald-500/20">
                          <CheckCircle size={15} className="text-emerald-500" />
                          {birthdayGirlName} agradece muito!
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenGiftModal(gift)}
                          className={`w-full ${activeTheme.primaryBgClass} ${activeTheme.primaryHoverBgClass} text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider font-sans group-hover:translate-y-[-1px]`}
                          id={`btn-gift-${gift.id}`}
                        >
                          <GiftIcon size={14} />
                          Presentear
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer message */}
      <footer className="w-full max-w-7xl mx-auto px-4 md:px-8 text-center mt-12 pt-8 border-t border-slate-200/60 text-slate-400 text-xs">
        <p>Criado com amor para celebrar a mágica transição dos 15 anos de {birthdayGirlName}.</p>
        <p className="mt-1">© 2026 Todos os direitos reservados.</p>
      </footer>

      {/* PAYMENT & DETAILS REGISTRY MODAL FLOW */}
      {selectedGift && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className={`glass-panel rounded-3xl p-6 md:p-8 max-w-xl w-full my-8 animate-scale-up max-h-[90vh] overflow-y-auto relative shadow-2xl ${activeTheme.cardBgClass} border ${activeTheme.cardBorderClass}`}>
            
            {/* Close modal */}
            <button 
              onClick={() => setSelectedGift(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-full hover:bg-slate-100/10 cursor-pointer"
              id="btn-close-payment-modal"
            >
              <X size={20} />
            </button>

            {/* STEP 1: FILL DETAILS & QUOTAS COUNT */}
            {modalStep === 'details' && (
              <div className="space-y-6">
                <div>
                  <span className={`text-[10px] ${activeTheme.successBadgeClass} font-bold px-2.5 py-1 rounded-full uppercase tracking-widest inline-block mb-2`}>
                    Passo 1 de 2
                  </span>
                  <h3 className={`text-xl md:text-2xl font-serif font-bold ${activeTheme.textMain}`}>
                    Presentear com: <br/>
                    <span className={`${activeTheme.primaryClass} italic font-medium`}>{selectedGift.name}</span>
                  </h3>
                  <p className={`text-xs ${activeTheme.textMuted} mt-1`}>Preencha seus dados para que a {birthdayGirlName} saiba quem enviou o presente com carinho!</p>
                </div>

                <form onSubmit={handleNextToPix} className="space-y-4">
                  
                  {/* Name field */}
                  <div className="space-y-1">
                    <label className={`block text-xs font-semibold ${activeTheme.textMuted} uppercase flex items-center gap-1`}>
                      <User size={13} className={activeTheme.primaryClass} />
                      Seu Nome Completo
                    </label>
                    <input
                      type="text"
                      placeholder="Como quer ser identificado no presente"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none text-sm ${activeTheme.inputBgClass}`}
                      required
                      id="input-guest-name"
                    />
                  </div>

                  {/* Phone field */}
                  <div className="space-y-1">
                    <label className={`block text-xs font-semibold ${activeTheme.textMuted} uppercase flex items-center gap-1`}>
                      <Phone size={13} className={activeTheme.primaryClass} />
                      Seu Telefone / WhatsApp (Opcional)
                    </label>
                    <input
                      type="tel"
                      placeholder="Ex: (88) 99999-9999"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none text-sm font-sans ${activeTheme.inputBgClass}`}
                      id="input-guest-phone"
                    />
                  </div>

                  {/* Message field */}
                  <div className="space-y-1">
                    <label className={`block text-xs font-semibold ${activeTheme.textMuted} uppercase flex items-center gap-1`}>
                      <MessageCircle size={13} className={activeTheme.primaryClass} />
                      Mensagem de carinho para a Debutante
                    </label>
                    <textarea
                      placeholder="Deixe um recado lindo para ficar guardado no coração dela!"
                      value={guestMessage}
                      onChange={(e) => setGuestMessage(e.target.value)}
                      rows={3}
                      className={`w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none text-sm leading-relaxed ${activeTheme.inputBgClass}`}
                      id="input-guest-message"
                    />
                  </div>

                  {/* Quotas Selector Counter */}
                  <div className={`glass-card p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border ${activeTheme.cardBorderClass}`}>
                    <div>
                      <h4 className={`text-xs font-bold ${activeTheme.textMain} uppercase tracking-wide`}>Quantas cotas deseja dar?</h4>
                      <p className={`text-[10px] ${activeTheme.textMuted} mt-0.5`}>Cada cota custa R$ {selectedGift.quotaValue}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={selectedQuotas <= 1}
                        onClick={() => setSelectedQuotas(prev => Math.max(1, prev - 1))}
                        className={`w-9 h-9 ${theme === 'lavender' ? 'bg-purple-950/40 border-purple-800/35 hover:bg-purple-900/30' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'} ${activeTheme.primaryClass} disabled:opacity-40 border rounded-full flex items-center justify-center font-bold transition-all cursor-pointer shadow-xs`}
                      >
                        <Minus size={14} />
                      </button>
                      
                      <span className={`text-base font-extrabold ${activeTheme.textMain} min-w-[20px] text-center font-mono`}>
                        {selectedQuotas}
                      </span>

                      <button
                        type="button"
                        disabled={selectedQuotas >= (selectedGift.totalQuotas - (selectedGift.takenQuotas || 0))}
                        onClick={() => setSelectedQuotas(prev => Math.min(selectedGift.totalQuotas - (selectedGift.takenQuotas || 0), prev + 1))}
                        className={`w-9 h-9 ${theme === 'lavender' ? 'bg-purple-950/40 border-purple-800/35 hover:bg-purple-900/30' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'} ${activeTheme.primaryClass} disabled:opacity-40 border rounded-full flex items-center justify-center font-bold transition-all cursor-pointer shadow-xs`}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Calc summary info banner */}
                  <div className={`pt-4 border-t ${activeTheme.cardBorderClass} flex justify-between items-center text-sm`}>
                    <span className={`${activeTheme.textMuted} font-medium`}>Total do seu carinho:</span>
                    <span className={`text-xl font-serif font-black ${activeTheme.primaryClass}`}>
                      R$ {selectedGift.quotaValue * selectedQuotas}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setSelectedGift(null)}
                      className={`flex-1 ${theme === 'lavender' ? 'bg-purple-950/40 border-purple-900/50 hover:bg-purple-900/30 text-purple-200' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'} font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all border cursor-pointer text-center`}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className={`flex-1 ${activeTheme.primaryBgClass} ${activeTheme.primaryHoverBgClass} text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer`}
                      id="btn-goto-pix"
                    >
                      Seguir para o Pix
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 2: PIX KEY & QR CODE DISPLAY */}
            {modalStep === 'pix' && (
              <div className="space-y-4">
                <div className="text-center">
                  <span className={`text-[9px] ${activeTheme.successBadgeClass} font-extrabold px-3 py-0.5 rounded-full uppercase tracking-widest inline-block mb-1`}>
                    Passo 2 de 2
                  </span>
                  <h3 className={`text-lg md:text-xl font-serif font-bold ${activeTheme.textMain}`}>
                    Realize o Pagamento Pix
                  </h3>
                </div>

                {/* Amount to pay banner */}
                <div className={`${activeTheme.buttonBgGradient} rounded-xl p-3 text-white text-center shadow-md flex items-center justify-between px-4`}>
                  <div className="text-left">
                    <p className="text-[9px] uppercase font-bold tracking-widest text-white/70">Cota selecionada</p>
                    <p className="text-xs font-semibold text-white/95 truncate max-w-[200px]">{selectedQuotas} cota(s) de "{selectedGift.name}"</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase font-bold tracking-widest text-white/70">Total a transferir</p>
                    <p className="text-xl font-black text-white">R$ {selectedGift.quotaValue * selectedQuotas}</p>
                  </div>
                </div>

                {/* Two-column layout for desktop, single column for mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  {/* Pix QR Code representation */}
                  <div className="flex flex-col items-center justify-center space-y-2 glass-card rounded-xl p-3 border border-slate-200 bg-white">
                    {settings.pixQrCodeUrl ? (
                      <div className="w-32 h-32 bg-white p-1.5 rounded-lg border border-gray-100 flex items-center justify-center">
                        <img 
                          src={settings.pixQrCodeUrl} 
                          alt="QR Code Pix" 
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 bg-white p-2 rounded-xl border border-emerald-100 relative flex flex-col items-center justify-center gap-1 shadow-xs">
                        <QrCode size={48} className="text-emerald-500 stroke-[1.5]" />
                        <span className="bg-emerald-500 text-white text-[7px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider">
                          Pix QR Code
                        </span>
                      </div>
                    )}
                    <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider text-center">
                      Escaneie o QR Code acima
                    </p>
                  </div>

                  {/* Copy Pix Key Box & Account Details */}
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase">Chave Pix ({settings.pixType})</label>
                      </div>

                      <div className="flex items-stretch glass-input rounded-xl overflow-hidden border border-slate-200 bg-white">
                        <input
                          type="text"
                          readOnly
                          value={settings.pixKey}
                          className="flex-1 px-3 py-2.5 bg-transparent text-xs font-mono font-bold text-gray-700 select-all focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleCopyPixKey}
                          className={`px-3 flex items-center justify-center gap-1 transition-all text-xs font-bold cursor-pointer border-l ${activeTheme.cardBorderClass} ${
                            isCopying 
                              ? 'bg-emerald-500 text-white' 
                              : `bg-slate-50 hover:bg-slate-100/10 ${activeTheme.primaryClass}`
                          }`}
                          id="btn-copy-pix"
                        >
                          {isCopying ? <Check size={12} /> : <Copy size={12} />}
                          {isCopying ? 'Chave copiada!' : 'Copiar'}
                        </button>
                      </div>
                    </div>

                    <div className="bg-amber-500/5 border border-amber-500/10 p-2.5 rounded-xl text-[10px] text-amber-500 leading-relaxed">
                      <strong>Titular:</strong> {settings.pixName}
                      <p className="text-[9px] text-slate-400 mt-0.5 font-medium">Confirme os dados no app do banco antes de transferir.</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Flow */}
                <div className={`space-y-2 pt-3 border-t ${activeTheme.cardBorderClass}`}>
                  <button
                    onClick={handleConfirmPayment}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-emerald-500 via-[#25D366] to-emerald-600 hover:from-emerald-600 hover:via-[#20ba5a] hover:to-emerald-700 text-white font-extrabold text-xs py-4 px-6 rounded-xl transition-all shadow-lg shadow-emerald-200/50 flex items-center justify-center gap-3 cursor-pointer uppercase tracking-wider border-b-4 border-emerald-700 hover:border-emerald-800 scale-100 hover:scale-[1.01] active:scale-[0.99] animate-pulse hover:animate-none"
                    id="btn-confirm-payment"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Confirmando e abrindo WhatsApp...
                      </span>
                    ) : (
                      <>
                        <MessageCircle size={18} className="fill-white/10" />
                        <span>Confirmar Pagamento & Enviar no WhatsApp</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setModalStep('details')}
                    className="w-full text-center text-slate-400 hover:text-slate-600 py-2 rounded-lg text-[10px] font-bold transition-all uppercase cursor-pointer tracking-wider"
                  >
                    ← Voltar para Detalhes
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: SUCCESS CELEBRATION */}
            {modalStep === 'success' && (
              <div className="text-center py-6 space-y-6 animate-scale-up">
                
                {/* Heart / sparkles animation layout */}
                <div className="inline-flex relative">
                  <div className={`absolute inset-0 ${theme === 'rose' ? 'bg-rose-500/15' : theme === 'lavender' ? 'bg-purple-500/15' : 'bg-[#1B365D]/10'} rounded-full blur-xl scale-125 animate-pulse`} />
                  <div className={`p-5 ${activeTheme.buttonBgGradient} text-white rounded-full relative shadow-lg`}>
                    <PartyPopper size={48} className="animate-bounce" />
                  </div>
                </div>

                <div className="space-y-2 max-w-sm mx-auto">
                  <h3 className={`text-2xl font-serif font-bold ${activeTheme.textMain}`}>Mimo Reservado!</h3>
                  <p className={`text-xs ${activeTheme.primaryClass} font-extrabold uppercase tracking-widest`}>Muito obrigado pelo carinho! 💖</p>
                  <p className={`text-xs ${activeTheme.textMuted} leading-relaxed mt-2 font-sans`}>
                    Sua contribuição de <strong>R$ {selectedGift.quotaValue * selectedQuotas}</strong> para o item <strong>"{selectedGift.name}"</strong> foi enviada aos organizadores. 
                  </p>
                  <p className="text-[10px] text-amber-600 bg-amber-500/10 rounded-lg p-2.5 border border-amber-500/20 mt-4 leading-relaxed font-semibold">
                    Assim que o organizador confirmar o recebimento do Pix, seu presente e mensagem de felicitação serão destacados na lista!
                  </p>
                </div>

                <div className="pt-4 max-w-xs mx-auto space-y-3">
                  <a
                    href={getWhatsappUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md shadow-emerald-100 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider font-sans"
                    id="btn-success-whatsapp"
                  >
                    <MessageCircle size={16} />
                    Enviar Comprovante via WhatsApp
                  </a>

                  <button
                    onClick={() => setSelectedGift(null)}
                    className={`w-full ${activeTheme.primaryBgClass} ${activeTheme.primaryHoverBgClass} text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer`}
                    id="btn-success-close"
                  >
                    Fechar e Voltar ao Site
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* ATTENDANCE CONFIRMATION MODAL */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur effect */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
            onClick={() => setIsConfirmModalOpen(false)}
          />
          
          {/* Modal Container */}
          <div className={`relative w-full max-w-lg ${activeTheme.cardBgClass} border ${activeTheme.cardBorderClass} rounded-3xl p-6 md:p-8 shadow-2xl z-10 overflow-hidden max-h-[90vh] overflow-y-auto animate-scale-up font-sans text-left`}>
            
            {/* Header layout */}
            <div className="flex justify-between items-start pb-4 border-b border-white/40">
              <div className="space-y-1">
                <span className={`text-[9px] uppercase font-extrabold tracking-widest ${activeTheme.primaryClass} flex items-center gap-1.5`}>
                  <Heart size={10} className="fill-current animate-pulse" /> Confirmar Presença
                </span>
                <h3 className={`text-xl font-serif font-bold ${activeTheme.textMain}`}>Você vai comparecer?</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/40 border border-white/50 hover:bg-white/80 transition-all text-slate-400 hover:text-slate-800 cursor-pointer"
                id="btn-close-confirm-modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleConfirmPresenceSubmit} className="space-y-5 pt-5">
              
              {/* Name field */}
              <div className="space-y-1.5">
                <label htmlFor="confirm-guest-name" className={`text-[10px] font-extrabold uppercase tracking-wider ${activeTheme.primaryClass} flex items-center gap-1`}>
                  <User size={12} /> Seu Nome Completo *
                </label>
                <input
                  type="text"
                  id="confirm-guest-name"
                  value={confirmName}
                  onChange={(e) => setConfirmName(e.target.value)}
                  placeholder="Ex: João da Silva"
                  required
                  className="w-full px-4 py-3 rounded-xl glass-input focus:outline-none text-sm font-sans text-gray-800 bg-white/30 border border-white/40"
                />
              </div>

              {/* Companion Count Section */}
              <div className="space-y-3 p-4 rounded-2xl bg-white/30 border border-white/40">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">Levará acompanhantes?</h4>
                    <p className="text-[10px] text-gray-400 leading-tight">Adicione apenas familiares ou pessoas próximas.</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmCompanionCount(Math.max(0, confirmCompanionCount - 1))}
                      className="w-8 h-8 rounded-full bg-white/80 hover:bg-white border border-slate-200 text-slate-600 font-bold flex items-center justify-center transition-all cursor-pointer text-sm"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-gray-800 font-sans">
                      {confirmCompanionCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setConfirmCompanionCount(confirmCompanionCount + 1)}
                      className="w-8 h-8 rounded-full bg-white/80 hover:bg-white border border-slate-200 text-slate-600 font-bold flex items-center justify-center transition-all cursor-pointer text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                {confirmCompanionCount > 0 && (
                  <div className="space-y-1.5 pt-2 animate-fade-in">
                    <label htmlFor="confirm-companion-names" className={`text-[10px] font-extrabold uppercase tracking-wider ${activeTheme.primaryClass}`}>
                      Nomes dos Acompanhantes
                    </label>
                    <textarea
                      id="confirm-companion-names"
                      value={confirmCompanionNames}
                      onChange={(e) => setConfirmCompanionNames(e.target.value)}
                      placeholder="Ex: Maria Souza, Lucas Silva"
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl glass-input focus:outline-none text-xs font-sans resize-none text-gray-800 bg-white/30 border border-white/40"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-2">
                <button
                  type="submit"
                  disabled={isConfirmSubmitting || !confirmName.trim()}
                  className="w-full bg-gradient-to-r from-pink-500 via-[#25D366] to-emerald-600 hover:from-pink-600 hover:via-[#20ba5a] hover:to-emerald-700 text-white font-extrabold text-xs py-4 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 cursor-pointer uppercase tracking-wider border-b-4 border-emerald-700 scale-100 hover:scale-[1.01] active:scale-[0.99]"
                >
                  {isConfirmSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Salvando e redirecionando...
                    </span>
                  ) : (
                    <>
                      <MessageCircle size={18} className="fill-white/10" />
                      <span>Confirmar Presença & WhatsApp</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="w-full text-center text-slate-400 hover:text-slate-600 py-2 rounded-lg text-[10px] font-bold transition-all uppercase cursor-pointer tracking-wider"
                >
                  Cancelar
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
