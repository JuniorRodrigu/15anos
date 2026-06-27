import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Gift as GiftIcon, 
  DollarSign, 
  Settings as SettingsIcon, 
  Layers, 
  Lock, 
  User, 
  Image as ImageIcon, 
  Calendar, 
  Sparkles, 
  Heart,
  CheckCircle2, 
  XCircle, 
  Copy, 
  ExternalLink,
  MessageSquare,
  AlertTriangle,
  Phone,
  Users,
  ClipboardCheck
} from 'lucide-react';
import { Gift, Contribution, AppSettings, GuestConfirmation } from '../types';
import { addGift, updateGift, deleteGift, updateAppSettings, updateContributionStatus, deleteConfirmation } from '../lib/firebase';

interface AdminPanelProps {
  settings: AppSettings;
  gifts: Gift[];
  contributions: Contribution[];
  confirmations: GuestConfirmation[];
  onRefresh: () => Promise<void>;
  onClose: () => void;
}

// Beautiful 15th Birthday preset images
const IMAGE_PRESETS = [
  { name: 'Vestido de Debutante', url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&auto=format&fit=crop&q=80' },
  { name: 'Dia de Princesa (Spa)', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80' },
  { name: 'Anel de Debutante', url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80' },
  { name: 'Sapato de Salto', url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80' },
  { name: 'Ensaio Fotográfico', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80' },
  { name: 'Kit Maquiagem', url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&auto=format&fit=crop&q=80' },
  { name: 'Viagem de Sonho', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80' },
  { name: 'Festa de 15 Anos', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80' },
  { name: 'Colar de Pérolas', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80' },
  { name: 'Bolo de Aniversário', url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=600&auto=format&fit=crop&q=80' },
  { name: 'Buquê de Flores', url: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format&fit=crop&q=80' },
  { name: 'Celular Novo', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80' }
];

export default function AdminPanel({ settings, gifts, contributions, confirmations, onRefresh, onClose }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'gifts' | 'contributions' | 'confirmations' | 'settings'>('gifts');
  const [isSeeding, setIsSeeding] = useState(false);

  // Custom Confirmation Dialog States
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void | Promise<void>;
  } | null>(null);

  // Custom Alert Modal States
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showConfirm = (title: string, message: string, onConfirm: () => void | Promise<void>) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: async () => {
        try {
          await onConfirm();
        } finally {
          setConfirmModal(null);
        }
      }
    });
  };

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlertModal({
      isOpen: true,
      title,
      message,
      type
    });
  };
  
  // Gift form state
  const [isGiftFormOpen, setIsGiftFormOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);
  const [giftName, setGiftName] = useState('');
  const [giftDescription, setGiftDescription] = useState('');
  const [giftQuotaValue, setGiftQuotaValue] = useState(50);
  const [giftTotalQuotas, setGiftTotalQuotas] = useState(5);
  const [giftImageUrl, setGiftImageUrl] = useState('');
  const [showPresetSelector, setShowPresetSelector] = useState(false);

  // Image upload state
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setGiftImageUrl(dataUrl);
        } else {
          setGiftImageUrl(event.target?.result as string);
        }
        setIsUploading(false);
      };
      img.onerror = () => {
        setUploadError('Falha ao processar imagem.');
        setIsUploading(false);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setUploadError('Erro ao ler arquivo.');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };
  
  // Settings form state
  const [settingsGirl, setSettingsGirl] = useState(settings.birthdayGirl);
  const [settingsDate, setSettingsDate] = useState(settings.birthdayDate);
  const [settingsMessage, setSettingsMessage] = useState(settings.welcomeMessage);
  const [settingsLocation, setSettingsLocation] = useState(settings.location || '');
  const [settingsPixKey, setSettingsPixKey] = useState(settings.pixKey);
  const [settingsPixType, setSettingsPixType] = useState(settings.pixType);
  const [settingsPixName, setSettingsPixName] = useState(settings.pixName);
  const [settingsPixQrCodeUrl, setSettingsPixQrCodeUrl] = useState(settings.pixQrCodeUrl);
  const [settingsPin, setSettingsPin] = useState(settings.adminPin);
  const [settingsFeaturedImg, setSettingsFeaturedImg] = useState(settings.featuredImageUrl || '');
  const [settingsTheme, setSettingsTheme] = useState<'navy' | 'rose' | 'lavender'>(settings.theme || 'navy');
  const [settingsWhatsappPhone, setSettingsWhatsappPhone] = useState(settings.whatsappPhone || '5587988024652');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsFeedback, setSettingsFeedback] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Synchronize local settings state when the settings prop changes
  React.useEffect(() => {
    setSettingsGirl(settings.birthdayGirl);
    setSettingsDate(settings.birthdayDate);
    setSettingsMessage(settings.welcomeMessage);
    setSettingsLocation(settings.location || '');
    setSettingsPixKey(settings.pixKey);
    setSettingsPixType(settings.pixType);
    setSettingsPixName(settings.pixName);
    setSettingsPixQrCodeUrl(settings.pixQrCodeUrl);
    setSettingsPin(settings.adminPin);
    setSettingsFeaturedImg(settings.featuredImageUrl || '');
    setSettingsTheme(settings.theme || 'navy');
    setSettingsWhatsappPhone(settings.whatsappPhone || '5587988024652');
  }, [settings]);

  // Image upload state for Pix QR Code
  const [isDraggingPix, setIsDraggingPix] = useState(false);
  const [pixUploadError, setPixUploadError] = useState<string | null>(null);
  const [isUploadingPix, setIsUploadingPix] = useState(false);

  // Image upload state for Cover / Featured Image
  const [isDraggingFeatured, setIsDraggingFeatured] = useState(false);
  const [featuredUploadError, setFeaturedUploadError] = useState<string | null>(null);
  const [isUploadingFeatured, setIsUploadingFeatured] = useState(false);

  const handleFeaturedFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setFeaturedUploadError('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    setIsUploadingFeatured(true);
    setFeaturedUploadError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // High quality setting for banner
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8); // 80% compression is great for big photos
          setSettingsFeaturedImg(dataUrl);
        } else {
          setSettingsFeaturedImg(event.target?.result as string);
        }
        setIsUploadingFeatured(false);
      };
      img.onerror = () => {
        setFeaturedUploadError('Falha ao processar imagem de capa.');
        setIsUploadingFeatured(false);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setFeaturedUploadError('Erro ao ler arquivo.');
      setIsUploadingFeatured(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFeaturedDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFeatured(true);
  };

  const handleFeaturedDragLeave = () => {
    setIsDraggingFeatured(false);
  };

  const handleFeaturedDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFeatured(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFeaturedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFeaturedFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFeaturedFile(e.target.files[0]);
    }
  };

  const handlePixQrCodeFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setPixUploadError('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    setIsUploadingPix(true);
    setPixUploadError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 500;
        const MAX_HEIGHT = 500;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85); // slightly higher quality for QR codes
          setSettingsPixQrCodeUrl(dataUrl);
        } else {
          setSettingsPixQrCodeUrl(event.target?.result as string);
        }
        setIsUploadingPix(false);
      };
      img.onerror = () => {
        setPixUploadError('Falha ao processar imagem do QR Code.');
        setIsUploadingPix(false);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setPixUploadError('Erro ao ler arquivo.');
      setIsUploadingPix(false);
    };
    reader.readAsDataURL(file);
  };

  const handlePixDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingPix(true);
  };

  const handlePixDragLeave = () => {
    setIsDraggingPix(false);
  };

  const handlePixDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingPix(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePixQrCodeFile(e.dataTransfer.files[0]);
    }
  };

  const handlePixFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handlePixQrCodeFile(e.target.files[0]);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === settings.adminPin || pinInput === '15anos') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const openAddGiftForm = () => {
    setEditingGift(null);
    setGiftName('');
    setGiftDescription('');
    setGiftQuotaValue(50);
    setGiftTotalQuotas(5);
    setGiftImageUrl(IMAGE_PRESETS[0].url);
    setIsGiftFormOpen(true);
  };

  const openEditGiftForm = (gift: Gift) => {
    setEditingGift(gift);
    setGiftName(gift.name);
    setGiftDescription(gift.description);
    setGiftQuotaValue(gift.quotaValue);
    setGiftTotalQuotas(gift.totalQuotas);
    setGiftImageUrl(gift.imageUrl);
    setIsGiftFormOpen(true);
  };

  const handleImportPreList = () => {
    const confirmMessage = "Deseja importar uma lista pré-definida de presentes de 15 anos? Isso adicionará novos presentes sugeridos de debutante à sua lista.";
    showConfirm(
      "Importar Sugestões",
      confirmMessage,
      async () => {
        setIsSeeding(true);
        try {
          const preGifts = [
            {
              name: 'Vestido da Valsa Principal',
              description: `Ajude a ${settingsGirl || 'debutante'} a brilhar na valsa de 15 anos com um lindo vestido digno de princesa!`,
              quotaValue: 100,
              totalQuotas: 10,
              imageUrl: IMAGE_PRESETS[0].url
            },
            {
              name: 'Dia de Princesa (Spa Completo)',
              description: 'Um dia de relaxamento, massagem e cuidados especiais de beleza antes da grande festa.',
              quotaValue: 80,
              totalQuotas: 6,
              imageUrl: IMAGE_PRESETS[1].url
            },
            {
              name: 'Anel Clássico de Debutante',
              description: 'O tradicional anel que simboliza a passagem mágica da infância para a juventude.',
              quotaValue: 120,
              totalQuotas: 5,
              imageUrl: IMAGE_PRESETS[2].url
            },
            {
              name: 'Sapato de Cinderela',
              description: 'O salto alto perfeito, delicado e confortável para dançar a valsa a noite inteira.',
              quotaValue: 75,
              totalQuotas: 4,
              imageUrl: IMAGE_PRESETS[3].url
            },
            {
              name: 'Sessão de Fotos Profissional (Book)',
              description: 'Registro fotográfico profissional desse momento tão marcante para guardar para sempre.',
              quotaValue: 60,
              totalQuotas: 8,
              imageUrl: IMAGE_PRESETS[4].url
            },
            {
              name: 'Kit de Maquiagem Importada',
              description: 'Uma paleta maravilhosa de sombras e produtinhos premium de beleza importada.',
              quotaValue: 50,
              totalQuotas: 5,
              imageUrl: IMAGE_PRESETS[5].url
            },
            {
              name: 'Viagem de Sonho dos 15 Anos',
              description: `Contribuição para a sonhada viagem de debutante da ${settingsGirl || 'debutante'} com suas melhores amigas.`,
              quotaValue: 150,
              totalQuotas: 15,
              imageUrl: IMAGE_PRESETS[6].url
            },
            {
              name: 'Som, Iluminação e DJ da Balada',
              description: 'Garantia de uma pista de dance bombada com as melhores músicas e efeitos visuais!',
              quotaValue: 90,
              totalQuotas: 10,
              imageUrl: IMAGE_PRESETS[7].url
            },
            {
              name: 'Colar de Pérolas Delicado',
              description: 'Uma joia clássica, elegante e minimalista para usar na valsa e em momentos especiais.',
              quotaValue: 95,
              totalQuotas: 4,
              imageUrl: IMAGE_PRESETS[8].url
            },
            {
              name: 'Bolo de Debutante de 3 Andares',
              description: 'O bolo artístico da mesa de doces, feito com recheio espetacular para encantar a todos.',
              quotaValue: 40,
              totalQuotas: 12,
              imageUrl: IMAGE_PRESETS[9].url
            }
          ];

          for (const item of preGifts) {
            await addGift(item);
          }

          await onRefresh();
          showAlert("Sucesso", "Sua pré-lista de presentes de 15 anos foi importada com sucesso!", "success");
        } catch (err) {
          console.error("Error seeding pre-list:", err);
          showAlert("Erro", "Ocorreu um erro ao importar a lista. Por favor, tente novamente.", "error");
        } finally {
          setIsSeeding(false);
        }
      }
    );
  };

  const handleSaveGift = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const giftData = {
        name: giftName,
        description: giftDescription,
        quotaValue: Number(giftQuotaValue),
        totalQuotas: Number(giftTotalQuotas),
        imageUrl: giftImageUrl || IMAGE_PRESETS[0].url
      };

      if (editingGift) {
        await updateGift(editingGift.id, giftData);
      } else {
        await addGift(giftData);
      }
      
      await onRefresh();
      setIsGiftFormOpen(false);
    } catch (err) {
      console.error("Error saving gift:", err);
      showAlert("Erro", "Erro ao salvar o presente. Verifique os dados.", "error");
    }
  };

  const handleDeleteGift = (id: string) => {
    showConfirm(
      "Excluir Presente",
      "Tem certeza que deseja excluir este presente? Esta ação é irreversível.",
      async () => {
        try {
          await deleteGift(id);
          await onRefresh();
          showAlert("Sucesso", "Presente excluído com sucesso!", "success");
        } catch (err) {
          console.error("Error deleting gift:", err);
          showAlert("Erro", "Erro ao excluir o presente.", "error");
        }
      }
    );
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsFeedback(null);
    try {
      await updateAppSettings({
        birthdayGirl: settingsGirl,
        birthdayDate: settingsDate,
        welcomeMessage: settingsMessage,
        pixKey: settingsPixKey,
        pixType: settingsPixType,
        pixName: settingsPixName,
        pixQrCodeUrl: settingsPixQrCodeUrl,
        adminPin: settingsPin,
        featuredImageUrl: settingsFeaturedImg,
        location: settingsLocation,
        theme: settingsTheme,
        whatsappPhone: settingsWhatsappPhone
      });
      await onRefresh();
      setSettingsFeedback({ type: 'success', text: 'Configurações salvas com sucesso!' });
    } catch (err) {
      console.error("Error updating settings:", err);
      setSettingsFeedback({ type: 'error', text: 'Erro ao salvar as configurações.' });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleStatusChange = (contributionId: string, newStatus: 'approved' | 'rejected') => {
    const confirmationMsg = newStatus === 'approved' 
      ? 'Deseja confirmar o pagamento deste presente? Isso atualizará as cotas garantidas.' 
      : 'Deseja recusar o pagamento?';
    showConfirm(
      newStatus === 'approved' ? "Confirmar Pagamento" : "Recusar Pagamento",
      confirmationMsg,
      async () => {
        try {
          await updateContributionStatus(contributionId, newStatus);
          await onRefresh();
          showAlert("Sucesso", newStatus === 'approved' ? "Pagamento confirmado com sucesso!" : "Pagamento recusado.", "success");
        } catch (err) {
          console.error("Error updating status:", err);
          showAlert("Erro", "Erro ao atualizar o status do pagamento.", "error");
        }
      }
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <div className="glass-panel rounded-3xl p-8 max-w-md w-full relative overflow-hidden">
          {/* Decorative backdrop */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200/20 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-200/20 rounded-full blur-2xl" />

          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-white/50"
            id="btn-close-login"
          >
            <X size={20} />
          </button>

          <div className="text-center mb-6 relative">
            <div className="inline-flex p-3 bg-white/50 text-pink-600 rounded-full mb-3 border border-white/40">
              <Lock size={28} />
            </div>
            <h2 className="text-2xl font-serif font-semibold text-gray-800">Painel de Controle</h2>
            <p className="text-sm text-gray-500 mt-1">Apenas para os organizadores do evento</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 relative">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Código PIN Administrativo
              </label>
              <input
                type="password"
                placeholder="Ex: 15anos"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl text-center font-mono text-lg tracking-widest focus:outline-none transition-all glass-input ${
                  pinError 
                    ? 'border-red-300 focus:ring-red-200' 
                    : ''
                }`}
                required
                autoFocus
                id="input-pin-admin"
              />
              {pinError && (
                <p className="text-red-500 text-xs mt-1 text-center font-medium">
                  PIN incorreto! Dica padrão: <code className="bg-red-50 px-1 rounded">15anos</code>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-400 to-pink-500 text-white font-medium py-3 rounded-xl hover:opacity-95 active:scale-[0.99] transition-all shadow-md shadow-rose-200 cursor-pointer text-sm tracking-wider uppercase font-sans"
              id="btn-submit-login"
            >
              Acessar Painel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col z-50 animate-fade-in overflow-hidden" style={{ background: 'linear-gradient(135deg, #fce4ec 0%, #f3e5f5 50%, #e1f5fe 100%)' }}>
      {/* Admin Header */}
      <header className="glass-header px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 relative">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-rose-400 to-pink-500 text-white rounded-2xl shadow-sm">
            <Sparkles size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-serif font-semibold text-gray-800">Painel 15 Anos</h1>
              <span className="text-[10px] bg-white/50 text-pink-600 font-bold px-2 py-0.5 rounded-full border border-white/40">ADM</span>
            </div>
            <p className="text-xs text-gray-400 font-sans">Gerenciando festa de {settings.birthdayGirl}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-white/40 p-1 rounded-xl border border-white/50 backdrop-blur-xs flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('gifts')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all uppercase cursor-pointer ${
              activeTab === 'gifts'
                ? 'bg-white/80 text-pink-600 border border-white/60 shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
            id="tab-gifts"
          >
            <Layers size={14} />
            Lista de Presentes
          </button>
          <button
            onClick={() => setActiveTab('contributions')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all uppercase relative cursor-pointer ${
              activeTab === 'contributions'
                ? 'bg-white/80 text-pink-600 border border-white/60 shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
            id="tab-contributions"
          >
            <GiftIcon size={14} />
            Presentes Recebidos
            {contributions.filter(c => c.status === 'pending').length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full animate-bounce">
                {contributions.filter(c => c.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('confirmations')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all uppercase cursor-pointer ${
              activeTab === 'confirmations'
                ? 'bg-white/80 text-pink-600 border border-white/60 shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
            id="tab-confirmations"
          >
            <ClipboardCheck size={14} />
            Presenças Confirmadas
            {confirmations.length > 0 && (
              <span className="bg-pink-100 text-pink-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {confirmations.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all uppercase cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-white/80 text-pink-600 border border-white/60 shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
            id="tab-settings"
          >
            <SettingsIcon size={14} />
            Configurações
          </button>
        </div>

        {/* Exit Admin */}
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-gray-500 hover:text-rose-600 hover:bg-white/40 px-4 py-2 rounded-xl transition-all font-medium text-xs tracking-wider uppercase border border-transparent hover:border-white/50 cursor-pointer"
          id="btn-logout"
        >
          <X size={16} />
          Sair do Painel
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl w-full mx-auto">
        
        {/* GIFTS TAB */}
        {activeTab === 'gifts' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-gray-800">Lista de Presentes Cadastrados</h2>
                <p className="text-xs text-gray-400 mt-1">Configure os mimos, valores das cotas e acompanhe as vendas.</p>
              </div>
              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleImportPreList}
                  disabled={isSeeding}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white hover:bg-pink-50 text-pink-600 hover:text-pink-700 border border-pink-200 hover:border-pink-300 text-xs font-bold px-4 py-3 rounded-xl transition-all cursor-pointer tracking-wider uppercase font-sans disabled:opacity-50"
                  id="btn-import-pre-list"
                >
                  <Sparkles size={16} className={isSeeding ? "animate-spin text-pink-500" : "animate-pulse text-pink-400"} />
                  {isSeeding ? 'Importando...' : 'Importar Pré-lista'}
                </button>
                <button
                  type="button"
                  onClick={openAddGiftForm}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-4 py-3 rounded-xl transition-all shadow-md shadow-rose-200/50 cursor-pointer tracking-wider uppercase font-sans"
                  id="btn-add-gift"
                >
                  <Plus size={16} />
                  Adicionar Presente
                </button>
              </div>
            </div>

            {gifts.length === 0 ? (
              <div className="glass-card rounded-3xl p-12 text-center shadow-sm">
                <div className="p-4 bg-white/50 text-pink-600 rounded-full inline-flex mb-4 border border-white/40">
                  <GiftIcon size={36} />
                </div>
                <h3 className="text-lg font-serif font-bold text-gray-800">Nenhum presente por aqui</h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto mt-2">
                  Você pode gerar uma pré-lista de presentes de 15 anos automaticamente ou criar seus mimos individualmente.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleImportPreList}
                    disabled={isSeeding}
                    className="inline-flex items-center gap-2 bg-white hover:bg-pink-50 text-pink-600 border border-pink-200 hover:border-pink-300 text-xs font-bold px-5 py-3 rounded-xl transition-all cursor-pointer uppercase tracking-wider font-sans disabled:opacity-50"
                    id="btn-import-pre-list-empty"
                  >
                    <Sparkles size={16} className={isSeeding ? "animate-spin" : "animate-pulse"} />
                    {isSeeding ? 'Gerando Lista...' : 'Gerar Pré-lista Completa'}
                  </button>
                  <button
                    type="button"
                    onClick={openAddGiftForm}
                    className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-md shadow-rose-200 cursor-pointer uppercase tracking-wider font-sans"
                    id="btn-add-gift-empty"
                  >
                    <Plus size={16} />
                    Criar Presente Manualmente
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gifts.map((gift) => {
                  const taken = gift.takenQuotas || 0;
                  const total = gift.totalQuotas || 1;
                  const pending = gift.pendingQuotas || 0;
                  const percent = Math.min(100, Math.round((taken / total) * 100));
                  const pendingPercent = Math.min(100, Math.round((pending / total) * 100));

                  return (
                    <div key={gift.id} className="glass-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col" id={`gift-card-${gift.id}`}>
                      <div className="relative h-44 bg-black/5 overflow-hidden shrink-0">
                        <img 
                          src={gift.imageUrl} 
                          alt={gift.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                          R$ {gift.quotaValue} / cota
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <h3 className="font-serif font-bold text-gray-800 text-base line-clamp-1">{gift.name}</h3>
                          <p className="text-xs text-gray-400 line-clamp-2 min-h-[2rem] leading-relaxed">{gift.description || 'Sem descrição.'}</p>
                          
                          {/* Quota Progress */}
                          <div className="space-y-1.5 pt-2">
                            <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                              <span>Cotas: {taken} / {total} {pending > 0 && <span className="text-amber-600">({pending} pendentes)</span>}</span>
                              <span className="text-rose-600">{percent}%</span>
                            </div>
                            
                            {/* Multilayer progress bar */}
                            <div className="h-2.5 w-full bg-white/40 border border-white/30 rounded-full overflow-hidden relative">
                              {/* Approved progress */}
                              <div 
                                className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full absolute left-0 top-0 z-10 transition-all duration-500" 
                                style={{ width: `${percent}%` }}
                              />
                              {/* Pending progress */}
                              <div 
                                className="h-full bg-amber-400/80 rounded-full absolute left-0 top-0 transition-all duration-500" 
                                style={{ width: `${percent + pendingPercent}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/40">
                          <button
                            onClick={() => openEditGiftForm(gift)}
                            className="flex-1 flex items-center justify-center gap-1 bg-white/40 hover:bg-white/95 text-gray-600 hover:text-pink-600 border border-white/50 font-bold py-2.5 rounded-xl text-[11px] transition-all uppercase tracking-wider cursor-pointer"
                            id={`btn-edit-${gift.id}`}
                          >
                            <Edit3 size={13} />
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteGift(gift.id)}
                            className="p-2.5 bg-white/40 hover:bg-red-50 text-gray-400 hover:text-red-500 border border-white/50 rounded-xl transition-all cursor-pointer"
                            title="Excluir presente"
                            id={`btn-delete-${gift.id}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* CONTRIBUTIONS TAB */}
        {activeTab === 'contributions' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-serif font-bold text-gray-800">Confirmação de Pagamentos</h2>
              <p className="text-xs text-gray-400 mt-1">Veja quem presenteou, as mensagens carinhosas e confirme as transações via Pix.</p>
            </div>

            {contributions.length === 0 ? (
              <div className="glass-card rounded-3xl p-12 text-center shadow-sm">
                <div className="p-4 bg-white/50 text-pink-600 rounded-full inline-flex mb-4 border border-white/40">
                  <Heart size={36} />
                </div>
                <h3 className="text-lg font-serif font-bold text-gray-800">Nenhum presente recebido ainda</h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto mt-2">
                  Quando seus convidados escolherem um presente e confirmarem o pagamento, a notificação aparecerá aqui para você validar.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {contributions.map((contrib) => {
                  const dateStr = new Date(contrib.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div 
                      key={contrib.id} 
                      className={`glass-card rounded-2xl p-5 md:p-6 transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-5 shadow-sm ${
                        contrib.status === 'pending' ? 'ring-2 ring-amber-400 bg-amber-500/5' : 
                        contrib.status === 'approved' ? 'ring-1 ring-green-400 bg-emerald-500/5' : 'ring-1 ring-red-400 bg-red-500/5'
                      }`}
                      id={`contrib-card-${contrib.id}`}
                    >
                      {/* Left Block: Info */}
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-serif font-bold text-gray-800 text-base">{contrib.guestName}</span>
                          <span className="text-[10px] text-gray-400 font-medium">{dateStr}</span>
                          
                          {/* Status Badge */}
                          {contrib.status === 'pending' && (
                            <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Aguardando Aprovação
                            </span>
                          )}
                          {contrib.status === 'approved' && (
                            <span className="text-[9px] bg-green-50 text-green-700 border border-green-200 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Confirmado
                            </span>
                          )}
                          {contrib.status === 'rejected' && (
                            <span className="text-[9px] bg-red-50 text-red-700 border border-red-200 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Recusado
                            </span>
                          )}
                        </div>

                        {/* Present info */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1.5 text-xs text-gray-500">
                          <span className="flex items-center gap-1 font-semibold text-gray-700">
                            <GiftIcon size={14} className="text-rose-400" />
                            {contrib.giftName}
                          </span>
                          <span className="text-gray-300 hidden sm:inline">|</span>
                          <span className="flex items-center gap-1">
                            <Layers size={14} />
                            {contrib.quotasCount} cota(s)
                          </span>
                          <span className="text-gray-300 hidden sm:inline">|</span>
                          <span className="flex items-center gap-1 font-bold text-rose-500">
                            R$ {contrib.totalValue}
                          </span>
                        </div>

                        {/* Msg */}
                        {contrib.guestMessage && (
                          <div className="bg-rose-50/30 border border-rose-100/50 rounded-xl p-3 text-xs text-gray-600 leading-relaxed italic flex gap-1.5 items-start">
                            <MessageSquare size={14} className="text-rose-400 shrink-0 mt-0.5" />
                            <span>&ldquo;{contrib.guestMessage}&rdquo;</span>
                          </div>
                        )}

                        {/* Contact */}
                        {contrib.guestPhone && (
                          <div className="text-[11px] text-gray-400 flex items-center gap-1">
                            <Phone size={12} />
                            Contato: <span className="font-semibold text-gray-600">{contrib.guestPhone}</span>
                          </div>
                        )}
                      </div>

                      {/* Right Block: Actions */}
                      <div className="flex items-center gap-2 border-t md:border-t-0 pt-4 md:pt-0 shrink-0">
                        {contrib.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleStatusChange(contrib.id, 'approved')}
                              className="flex-1 md:flex-none flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-green-100 cursor-pointer tracking-wide uppercase font-sans"
                              id={`btn-approve-${contrib.id}`}
                            >
                              <Check size={14} />
                              Aprovar
                            </button>
                            <button
                              onClick={() => handleStatusChange(contrib.id, 'rejected')}
                              className="flex-1 md:flex-none flex items-center justify-center gap-1 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer tracking-wide uppercase font-sans"
                              id={`btn-reject-${contrib.id}`}
                            >
                              <X size={14} />
                              Recusar
                            </button>
                          </>
                        ) : (
                          // Allow resetting back to pending or toggling status for corrections
                          <button
                            onClick={() => handleStatusChange(
                              contrib.id, 
                              contrib.status === 'approved' ? 'rejected' : 'approved'
                            )}
                            className="w-full md:w-auto text-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 text-[10px] font-bold px-3 py-2 rounded-lg border border-gray-200 transition-all uppercase tracking-wider cursor-pointer"
                            id={`btn-change-status-${contrib.id}`}
                          >
                            Alterar Status
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* CONFIRMATIONS TAB */}
        {activeTab === 'confirmations' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-gray-800">Presenças Confirmadas</h2>
                <p className="text-xs text-gray-400 mt-1">Veja a lista de convidados que confirmaram presença no evento pelo site.</p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-white/50 shadow-xs flex items-center gap-3 self-start md:self-auto">
                <Users size={16} className="text-pink-500" />
                <div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total de Convidados</div>
                  <div className="text-base font-serif font-bold text-gray-800 leading-tight">
                    {confirmations.reduce((acc, c) => acc + 1 + (c.companionCount || 0), 0)} pessoas
                  </div>
                </div>
              </div>
            </div>

            {confirmations.length === 0 ? (
              <div className="glass-card rounded-3xl p-12 text-center shadow-sm">
                <div className="p-4 bg-white/50 text-pink-600 rounded-full inline-flex mb-4 border border-white/40">
                  <ClipboardCheck size={36} />
                </div>
                <h3 className="text-lg font-serif font-bold text-gray-800">Nenhuma presença confirmada ainda</h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto mt-2">
                  Quando seus convidados preencherem a confirmação de presença no site, eles aparecerão aqui nesta lista em tempo real.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {confirmations.map((conf) => {
                  const dateStr = new Date(conf.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div 
                      key={conf.id} 
                      className="glass-card rounded-2xl p-5 md:p-6 transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-5 shadow-sm border border-white/40 bg-white/40 hover:bg-white/60"
                      id={`conf-card-${conf.id}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-pink-100 text-pink-600 border border-pink-200/50 flex-shrink-0">
                          <User size={18} />
                        </div>
                        
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold text-gray-800 font-sans flex items-center gap-2 flex-wrap">
                            {conf.guestName}
                            {conf.companionCount > 0 && (
                              <span className="bg-pink-100 text-pink-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                +{conf.companionCount} {conf.companionCount === 1 ? 'acompanhante' : 'acompanhantes'}
                              </span>
                            )}
                          </h4>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500 font-sans flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              Confirmado em: {dateStr}
                            </span>
                            {conf.guestPhone && (
                              <a 
                                href={`https://api.whatsapp.com/send?phone=${conf.guestPhone.replace(/\D/g, '')}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center gap-1 text-pink-600 hover:text-pink-700 font-medium hover:underline cursor-pointer"
                              >
                                <Phone size={12} />
                                {conf.guestPhone}
                              </a>
                            )}
                          </div>

                          {conf.companionCount > 0 && conf.companionNames && (
                            <div className="bg-white/40 rounded-lg p-2.5 mt-2 border border-white/40 text-[11px] text-gray-600 leading-relaxed font-sans max-w-xl">
                              <span className="font-semibold text-pink-600">Acompanhantes: </span>
                              {conf.companionNames}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end md:self-auto">
                        <button
                          onClick={async () => {
                            if (window.confirm(`Tem certeza que deseja excluir a confirmação de ${conf.guestName}?`)) {
                              try {
                                await deleteConfirmation(conf.id);
                                await onRefresh();
                              } catch (err) {
                                console.error("Error deleting confirmation:", err);
                              }
                            }
                          }}
                          className="w-full md:w-auto text-center text-rose-500 hover:text-white hover:bg-rose-500 text-[10px] font-bold px-3 py-2 rounded-lg border border-rose-200 transition-all uppercase tracking-wider cursor-pointer"
                          id={`btn-delete-conf-${conf.id}`}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="glass-panel rounded-3xl p-6 md:p-8 space-y-8 shadow-sm animate-fade-in">
            <div className="border-b border-white/40 pb-5">
              <h2 className="text-xl font-serif font-bold text-gray-800">Configurações do Evento</h2>
              <p className="text-xs text-gray-400 mt-1">Customize o nome da aniversariante, data da festa, dados bancários do Pix e chave PIN.</p>
            </div>

            {settingsFeedback && (
              <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
                settingsFeedback.type === 'success' 
                  ? 'bg-green-500/10 text-green-700 border-green-500/20' 
                  : 'bg-red-500/10 text-red-700 border-red-500/20'
              }`} id="settings-feedback-banner">
                {settingsFeedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                {settingsFeedback.text}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Box 1: Profile */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-rose-600 flex items-center gap-2 uppercase tracking-wider font-sans border-b border-white/40 pb-2">
                  <User size={16} />
                  Dados da Aniversariante
                </h3>
                
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Nome Completo</label>
                  <input
                    type="text"
                    value={settingsGirl}
                    onChange={(e) => setSettingsGirl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none text-sm"
                    required
                    id="setting-girl-name"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Data da Festa / Aniversário</label>
                  <input
                    type="date"
                    value={settingsDate}
                    onChange={(e) => setSettingsDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none text-sm font-sans"
                    required
                    id="setting-party-date"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                    <Phone size={12} className="text-rose-500" />
                    Telefone de Confirmação (WhatsApp)
                  </label>
                  <input
                    type="text"
                    value={settingsWhatsappPhone}
                    onChange={(e) => setSettingsWhatsappPhone(e.target.value)}
                    placeholder="Ex: 5587988024652"
                    className="w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none text-sm font-sans"
                    required
                    id="setting-whatsapp-phone"
                  />
                  <p className="text-[10px] text-gray-400 leading-relaxed">Número para receber as mensagens de confirmação de presença e os comprovantes de Pix dos convidados. Coloque o código do país e DDD (Ex: 5587988024652).</p>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Imagem de Capa</label>
                  
                  {/* Interactive Drag and Drop Upload for Cover Image */}
                  <div
                    onDragOver={handleFeaturedDragOver}
                    onDragLeave={handleFeaturedDragLeave}
                    onDrop={handleFeaturedDrop}
                    onClick={() => document.getElementById('featured-image-file-input')?.click()}
                    className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1 ${
                      isDraggingFeatured 
                        ? 'border-rose-500 bg-rose-500/5' 
                        : 'border-white/40 hover:border-rose-300 hover:bg-white/10'
                    }`}
                  >
                    <input
                      type="file"
                      id="featured-image-file-input"
                      accept="image/*"
                      onChange={handleFeaturedFileChange}
                      className="hidden"
                    />
                    
                    {isUploadingFeatured ? (
                      <div className="flex flex-col items-center gap-1.5 py-1">
                        <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-[10px] text-gray-500 font-medium">Processando e otimizando imagem de capa...</span>
                      </div>
                    ) : settingsFeaturedImg ? (
                      <div className="flex flex-col items-center gap-2 w-full">
                        <div className="w-full h-32 relative rounded-xl overflow-hidden border border-white/40 shadow-sm">
                          <img 
                            src={settingsFeaturedImg} 
                            alt="Capa da Festa" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-bold">Alterar Imagem</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">Imagem de capa carregada!</span>
                        <span className="text-[9px] text-gray-400">Toque ou arraste para substituir</span>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className={`w-6 h-6 ${isDraggingFeatured ? 'text-rose-500 animate-pulse' : 'text-gray-400'}`} />
                        <p className="text-xs font-bold text-gray-600">Arraste a imagem de capa aqui ou toque para selecionar</p>
                        <p className="text-[9px] text-gray-400">PNG, JPG, WEBP (será otimizada para o banner do site)</p>
                      </>
                    )}
                  </div>
                  {featuredUploadError && (
                    <p className="text-[10px] text-red-500 font-bold mt-0.5">{featuredUploadError}</p>
                  )}
                  
                  <input
                    type="url"
                    value={settingsFeaturedImg}
                    onChange={(e) => setSettingsFeaturedImg(e.target.value)}
                    placeholder="Ou cole a URL da imagem aqui se preferir"
                    className="w-full px-3 py-1.5 rounded-lg border border-white/30 focus:outline-none text-[10px] text-gray-500 font-sans mt-2 bg-white/20"
                    id="setting-featured-img"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Mensagem de Boas-Vindas</label>
                  <textarea
                    rows={4}
                    value={settingsMessage}
                    onChange={(e) => setSettingsMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none text-sm leading-relaxed"
                    required
                    id="setting-welcome-msg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Endereço / Local da Festa</label>
                  <input
                    type="text"
                    value={settingsLocation}
                    onChange={(e) => setSettingsLocation(e.target.value)}
                    placeholder="Ex: Rua Rio Tigre, 259 - José e Maria"
                    className="w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none text-sm"
                    id="setting-location"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Tema Visual do Site</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Navy Theme Option */}
                    <button
                      type="button"
                      onClick={() => setSettingsTheme('navy')}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                        settingsTheme === 'navy' 
                          ? 'bg-[#FAF8F3]/80 border-[#1B365D] ring-2 ring-[#1B365D]/20 shadow-sm' 
                          : 'bg-white/50 border-slate-200 hover:border-[#1B365D]/40 hover:bg-white'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-[#1B365D] flex items-center justify-center text-[#FAF8F3] shrink-0 font-serif font-black text-xs shadow-xs">
                        N
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Azul & Creme</p>
                        <p className="text-[10px] text-slate-500">Tema Lara Giovana, clássico e sofisticado</p>
                      </div>
                    </button>

                    {/* Rose Theme Option */}
                    <button
                      type="button"
                      onClick={() => setSettingsTheme('rose')}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                        settingsTheme === 'rose' 
                          ? 'bg-rose-50/50 border-rose-400 ring-2 ring-rose-200 shadow-sm' 
                          : 'bg-white/50 border-slate-200 hover:border-rose-300 hover:bg-white'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-rose-400 flex items-center justify-center text-white shrink-0 font-serif font-black text-xs shadow-xs">
                        R
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Rosa Romântico</p>
                        <p className="text-[10px] text-slate-500">O tema anterior, delicado e festivo</p>
                      </div>
                    </button>

                    {/* Lavender Theme Option */}
                    <button
                      type="button"
                      onClick={() => setSettingsTheme('lavender')}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                        settingsTheme === 'lavender' 
                          ? 'bg-purple-950/10 border-purple-500 ring-2 ring-purple-200 shadow-sm' 
                          : 'bg-white/50 border-slate-200 hover:border-purple-300 hover:bg-white'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-purple-100 shrink-0 font-serif font-black text-xs shadow-xs">
                        L
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Lavanda Mágico</p>
                        <p className="text-[10px] text-slate-500">Mágico e estrelado, tom violeta luxuoso</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Box 2: Pix Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-rose-600 flex items-center gap-2 uppercase tracking-wider font-sans border-b border-white/40 pb-2">
                  <DollarSign size={16} />
                  Configuração de Recebimento Pix
                </h3>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1 space-y-1">
                    <label className="block text-xs font-semibold text-gray-500 uppercase">Tipo</label>
                    <select
                      value={settingsPixType}
                      onChange={(e) => setSettingsPixType(e.target.value)}
                      className="w-full px-2 py-2.5 rounded-xl border border-white/40 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 text-xs font-medium bg-white/70"
                      id="setting-pix-type"
                    >
                      <option value="CPF">CPF</option>
                      <option value="CNPJ">CNPJ</option>
                      <option value="E-mail">E-mail</option>
                      <option value="Celular">Celular</option>
                      <option value="Chave Aleatória">Chave Aleatória</option>
                    </select>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="block text-xs font-semibold text-gray-500 uppercase">Chave Pix</label>
                    <input
                      type="text"
                      value={settingsPixKey}
                      onChange={(e) => setSettingsPixKey(e.target.value)}
                      placeholder="Sua chave Pix para receber mimos"
                      className="w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none text-sm"
                      required
                      id="setting-pix-key"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Nome Completo do Titular</label>
                  <input
                    type="text"
                    value={settingsPixName}
                    onChange={(e) => setSettingsPixName(e.target.value)}
                    placeholder="Nome que aparece no banco"
                    className="w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none text-sm"
                    required
                    id="setting-pix-name"
                  />
                  <p className="text-[10px] text-gray-400">Ajuda o convidado a confirmar os dados antes de transferir.</p>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Imagem do QR Code Pix</label>
                  
                  {/* Interactive Drag and Drop Upload for Pix QR Code */}
                  <div
                    onDragOver={handlePixDragOver}
                    onDragLeave={handlePixDragLeave}
                    onDrop={handlePixDrop}
                    onClick={() => document.getElementById('pix-qrcode-file-input')?.click()}
                    className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1 ${
                      isDraggingPix 
                        ? 'border-rose-500 bg-rose-500/5' 
                        : 'border-white/40 hover:border-rose-300 hover:bg-white/10'
                    }`}
                  >
                    <input
                      type="file"
                      id="pix-qrcode-file-input"
                      accept="image/*"
                      onChange={handlePixFileChange}
                      className="hidden"
                    />
                    
                    {isUploadingPix ? (
                      <div className="flex flex-col items-center gap-1.5 py-1">
                        <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-[10px] text-gray-500 font-medium">Processando e otimizando imagem...</span>
                      </div>
                    ) : settingsPixQrCodeUrl ? (
                      <div className="flex flex-col items-center gap-2">
                        <img 
                          src={settingsPixQrCodeUrl} 
                          alt="QR Code Pix" 
                          className="w-24 h-24 object-contain rounded-lg border border-white/40 shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">QR Code carregado com sucesso!</span>
                        <span className="text-[9px] text-gray-400">Toque ou arraste para substituir</span>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className={`w-6 h-6 ${isDraggingPix ? 'text-rose-500 animate-pulse' : 'text-gray-400'}`} />
                        <p className="text-xs font-bold text-gray-600">Arraste a imagem do QR Code aqui ou toque para selecionar</p>
                        <p className="text-[9px] text-gray-400">PNG, JPG, WEBP (será salvo automaticamente no seu site)</p>
                      </>
                    )}
                  </div>
                  {pixUploadError && (
                    <p className="text-[10px] text-red-500 font-bold mt-0.5">{pixUploadError}</p>
                  )}
                  
                  <input
                    type="text"
                    value={settingsPixQrCodeUrl}
                    onChange={(e) => setSettingsPixQrCodeUrl(e.target.value)}
                    placeholder="Ou cole a URL da imagem aqui se preferir"
                    className="w-full px-3 py-1.5 rounded-lg border border-white/30 focus:outline-none text-[10px] text-gray-500 font-sans mt-2 bg-white/20"
                    id="setting-pix-qrcode"
                  />
                </div>

                {/* Secure PIN */}
                <div className="space-y-1 pt-4 border-t border-white/40">
                  <label className="block text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                    <Lock size={12} />
                    PIN Administrativo do Site
                  </label>
                  <input
                    type="text"
                    value={settingsPin}
                    onChange={(e) => setSettingsPin(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none text-sm font-mono tracking-widest text-rose-600 font-bold"
                    required
                    id="setting-admin-pin"
                  />
                  <p className="text-[10px] text-gray-400">Código numérico ou palavra para proteger este painel ADM.</p>
                </div>
              </div>
            </div>

            {/* Bottom Form Action */}
            <div className="flex justify-end pt-5 border-t border-white/40">
              <button
                type="submit"
                disabled={isSavingSettings}
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-md shadow-rose-200 transition-all uppercase tracking-wider font-sans flex items-center gap-2 cursor-pointer disabled:opacity-50"
                id="btn-save-settings"
              >
                {isSavingSettings ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        )}
      </main>

      {/* GIFT FORM MODAL */}
      {isGiftFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="glass-panel rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl my-8 animate-scale-up max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setIsGiftFormOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-white/50 cursor-pointer"
              id="btn-close-gift-modal"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-serif font-bold text-gray-800 mb-2 flex items-center gap-2">
              <GiftIcon size={20} className="text-rose-500" />
              {editingGift ? 'Editar Presente' : 'Adicionar Novo Presente'}
            </h3>
            <p className="text-xs text-gray-400 mb-6">Insira os detalhes do presente que os convidados poderão apoiar.</p>

            <form onSubmit={handleSaveGift} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase">Nome do Presente</label>
                <input
                  type="text"
                  placeholder="Ex: Viagem de Debutante, Anel de Prata..."
                  value={giftName}
                  onChange={(e) => setGiftName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none text-sm"
                  required
                  id="form-gift-name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Valor de cada Cota (R$)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Ex: 50"
                    value={giftQuotaValue}
                    onChange={(e) => setGiftQuotaValue(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none text-sm font-sans"
                    required
                    id="form-gift-quota-value"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Total de Cotas</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Ex: 10"
                    value={giftTotalQuotas}
                    onChange={(e) => setGiftTotalQuotas(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none text-sm font-sans"
                    required
                    id="form-gift-total-quotas"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase">Descrição do Presente</label>
                <textarea
                  placeholder="Explique o motivo desse presente ou deixe um recado fofo..."
                  value={giftDescription}
                  onChange={(e) => setGiftDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none text-sm"
                  id="form-gift-description"
                />
              </div>

              {/* Image Input and Preset Gallery */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Foto do Presente (URL)</label>
                  <button
                    type="button"
                    onClick={() => setShowPresetSelector(!showPresetSelector)}
                    className="text-xs text-rose-500 hover:text-rose-600 font-bold flex items-center gap-1 underline cursor-pointer"
                    id="btn-toggle-presets"
                  >
                    <ImageIcon size={12} />
                    {showPresetSelector ? 'Esconder Temas' : 'Ver Fotos de Tema 15 Anos'}
                  </button>
                </div>

                <input
                  type="url"
                  placeholder="https://exemplo.com/imagem-presente.jpg"
                  value={giftImageUrl}
                  onChange={(e) => setGiftImageUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none text-sm font-sans"
                  id="form-gift-image-url"
                />

                {/* Interactive Drag and Drop File Upload Area */}
                <div className="space-y-1 mt-2">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('gift-image-file-input')?.click()}
                    className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1 ${
                      isDragging 
                        ? 'border-rose-500 bg-rose-500/5' 
                        : 'border-white/40 hover:border-rose-300 hover:bg-white/10'
                    }`}
                  >
                    <input
                      type="file"
                      id="gift-image-file-input"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-1.5 py-1">
                        <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-[10px] text-gray-500 font-medium">Processando e compactando imagem...</span>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className={`w-6 h-6 ${isDragging ? 'text-rose-500 animate-pulse' : 'text-gray-400'}`} />
                        <p className="text-xs font-bold text-gray-600">Arraste uma foto aqui ou toque para selecionar</p>
                        <p className="text-[9px] text-gray-400">PNG, JPG, WEBP (otimizada para carregar super rápido)</p>
                      </>
                    )}
                  </div>
                  {uploadError && (
                    <p className="text-[10px] text-red-500 font-bold mt-0.5">{uploadError}</p>
                  )}
                </div>

                {showPresetSelector && (
                  <div className="border border-white/40 rounded-2xl bg-white/20 backdrop-blur-xs p-3 space-y-2 animate-fade-in">
                    <p className="text-[10px] text-gray-400 font-medium">Toque em uma foto recomendada para usar:</p>
                    <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1">
                      {IMAGE_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            setGiftImageUrl(preset.url);
                            setShowPresetSelector(false);
                          }}
                          className={`relative h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                            giftImageUrl === preset.url ? 'border-rose-500 scale-[0.95]' : 'border-transparent hover:border-rose-200'
                          }`}
                          title={preset.name}
                        >
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Image Preview */}
              {giftImageUrl && (
                <div className="h-28 rounded-xl overflow-hidden border border-white/30 bg-white/35 flex items-center justify-center relative">
                  <img src={giftImageUrl} alt="Prévia" className="h-full w-full object-cover" onError={(e) => { (e.target as any).src = IMAGE_PRESETS[0].url; }} />
                  <span className="absolute bottom-1 right-2 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">Prévia da imagem</span>
                </div>
              )}

              <div className="flex items-center gap-3 pt-4 border-t border-white/40">
                <button
                  type="button"
                  onClick={() => setIsGiftFormOpen(false)}
                  className="flex-1 bg-white/40 hover:bg-white/60 text-gray-500 font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer border border-white/50"
                  id="btn-cancel-gift-form"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-rose-200 cursor-pointer"
                  id="btn-submit-gift-form"
                >
                  {editingGift ? 'Salvar Presente' : 'Criar Presente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {confirmModal?.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[100] animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-rose-100 text-center space-y-4">
            <div className="inline-flex p-3 bg-amber-50 text-amber-500 rounded-full border border-amber-100">
              <AlertTriangle size={24} />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-gray-800">{confirmModal.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{confirmModal.message}</p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => confirmModal.onConfirm()}
                className="flex-1 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-rose-200 cursor-pointer"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alert Modal */}
      {alertModal?.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[100] animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-rose-100 text-center space-y-4">
            <div className={`inline-flex p-3 rounded-full border ${
              alertModal.type === 'success' 
                ? 'bg-green-50 text-green-500 border-green-100' 
                : 'bg-red-50 text-red-500 border-red-100'
            }`}>
              {alertModal.type === 'success' ? (
                <CheckCircle2 size={24} />
              ) : (
                <AlertTriangle size={24} />
              )}
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-gray-800">{alertModal.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{alertModal.message}</p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setAlertModal(null)}
                className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
