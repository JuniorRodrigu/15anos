import React, { useState, useEffect } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { Gift, Contribution, AppSettings } from './types';
import { getAppSettings, getGifts, getContributions } from './lib/firebase';
import GuestView from './components/GuestView';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  
  const checkIsAdminRoute = () => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    return path === '/admin' || path.endsWith('/admin') || hash === '#/admin' || hash === '#admin';
  };

  const [isAdmin, setIsAdmin] = useState(checkIsAdminRoute);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdmin(checkIsAdminRoute());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    // Initial check is also handled by state initializer, but keep it robust
    handleLocationChange();

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const fetchData = async () => {
    try {
      const fetchedSettings = await getAppSettings();
      const fetchedGifts = await getGifts();
      const fetchedContributions = await getContributions();
      
      setSettings(fetchedSettings);
      setGifts(fetchedGifts);
      setContributions(fetchedContributions);
    } catch (err) {
      console.error("Error fetching Firestore data:", err);
      // Fallback to defaults if Firestore is not reachable or hasn't finished provisioning
      const defaultSettings: AppSettings = {
        birthdayGirl: 'Lorena Silva',
        birthdayDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        welcomeMessage: 'Bem-vindo ao meu site de 15 anos! Fico muito feliz em ter você aqui para comemorar esse momento tão especial comigo. Se quiser me presentear, escolha uma das cotas abaixo. Cada detalhe foi pensado com muito carinho!',
        pixKey: 'lorena15anos@exemplo.com',
        pixType: 'E-mail',
        pixName: 'Lorena Silva Santos',
        pixQrCodeUrl: '',
        adminPin: '15anos',
        featuredImageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80',
        theme: 'navy',
        whatsappPhone: '5587988024652'
      };
      const defaultGifts: Gift[] = [
        {
          id: 'default-1',
          name: 'Vestido da Valsa Principal',
          description: 'Ajude a Lorena a brilhar na valsa de 15 anos com um lindo vestido digno de princesa!',
          quotaValue: 100,
          totalQuotas: 10,
          takenQuotas: 0,
          pendingQuotas: 0,
          imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&auto=format&fit=crop&q=80',
          createdAt: Date.now() - 60000
        },
        {
          id: 'default-2',
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
          id: 'default-3',
          name: 'Anel Clássico de Debutante',
          description: 'O tradicional anel que marca a transição mágica de uma jovem debutante.',
          quotaValue: 120,
          totalQuotas: 5,
          takenQuotas: 0,
          pendingQuotas: 0,
          imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80',
          createdAt: Date.now() - 180000
        }
      ];
      setSettings(defaultSettings);
      setGifts(defaultGifts);
      setContributions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-rose-50/20 flex flex-col items-center justify-center p-6 font-sans">
        <div className="text-center space-y-4 relative">
          {/* Pulsing decoration */}
          <div className="absolute inset-0 bg-rose-100 rounded-full blur-2xl scale-150 animate-pulse opacity-40" />
          
          <div className="inline-flex relative z-10">
            <div className="absolute inset-0 bg-rose-300 rounded-full blur-md opacity-20 animate-ping" />
            <div className="p-4 bg-white border border-rose-100 shadow-xl rounded-full text-rose-500 animate-spin-slow">
              <Heart size={32} className="fill-rose-300 stroke-[1.5]" />
            </div>
          </div>
          
          <div className="space-y-1 z-10 relative">
            <h2 className="text-xl font-serif font-bold text-gray-800 tracking-wide flex items-center justify-center gap-1.5">
              Carregando Sonhos 
              <Sparkles size={16} className="text-rose-400 animate-pulse" />
            </h2>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              Buscando lista de presentes e preparando o site de 15 anos...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {isAdmin ? (
        <AdminPanel
          settings={settings}
          gifts={gifts}
          contributions={contributions}
          onRefresh={fetchData}
          onClose={() => {
            setIsAdmin(false);
            window.history.pushState({}, '', '/');
          }}
        />
      ) : (
        <GuestView
          settings={settings}
          gifts={gifts}
          onOpenAdmin={() => {
            setIsAdmin(true);
            window.history.pushState({}, '', '/admin');
          }}
          onRefresh={fetchData}
        />
      )}
    </>
  );
}
