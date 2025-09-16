







import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Farmer, Activity, Plot, Farm, NotificationMessage, NotificationType, DailyPlotLog, AIImageAnalysis, WeatherData, ConsultantNote, MarketData, YieldPredictionData } from './types';
import PlotCard from './components/PlotCard';
import ActivityCard from './components/ActivityCard';
import FarmerListItem from './components/FarmerListItem';
import { UserIcon, ActivityLogIcon, FarmIcon as AppFarmIcon, PlotIcon as SectionPlotIcon, DashboardIcon, SettingsIcon, PlusCircleIcon, CheckCircleIcon, XCircleIcon, InfoIcon, LogoutIcon, MapIcon, GlobeIcon, AIServiceIcon, ChevronDownIcon, UploadIcon, CameraIcon, PencilIcon, BrainCircuitIcon } from './components/icons';
import { LoggedInUser } from './App';
import Modal from './components/Modal';
import { useData } from './contexts/DataContext';
import useGoogleMaps from './hooks/useGoogleMaps';
import FarmMap from './components/FarmMap';
import WeatherCard from './components/WeatherCard';
import AI_Assistant from './components/AI_Assistant';
import NoteCard from './components/NoteCard';
import AddNoteForm from './components/AddNoteForm';
import { useLanguage } from './contexts/LanguageContext';
import PersonalizedSuggestions from './components/PersonalizedSuggestions';
import MarketPriceCard from './components/MarketPriceCard';
import YieldPredictionCard from './components/YieldPredictionCard';
import PlotLogHistoryModal from './components/PlotLogHistoryModal';
import CameraCapture from './components/CameraCapture';


const LOCAL_STORAGE_KEYS = {
  SELECTED_FARMER_ID: 'smartFarmData_selectedFarmerId'
};

// --- LocalStorage Utilities ---
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const saveToStorage = <T,>(key: string, value: T): void => {
  try {
    const item = JSON.stringify(value);
    localStorage.setItem(key, item);
  } catch (error) {
    console.warn(`Error setting localStorage key "${key}":`, error);
  }
};

// --- Notification Component ---
interface NotificationProps {
  notification: NotificationMessage | null;
  onDismiss: () => void;
}
const Notification: React.FC<NotificationProps> = ({ notification, onDismiss }) => {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, onDismiss]);

  if (!notification) return null;

  const baseClasses = "fixed top-5 right-5 p-4 rounded-md shadow-lg text-white text-sm z-[100] flex items-center transition-all duration-300 ease-in-out transform";
  const typeClasses = {
    [NotificationType.SUCCESS]: "bg-brand-green",
    [NotificationType.ERROR]: "bg-red-500",
    [NotificationType.INFO]: "bg-brand-blue",
  };
  const Icon = notification.type === NotificationType.SUCCESS ? CheckCircleIcon : notification.type === NotificationType.ERROR ? XCircleIcon : InfoIcon;

  return (
    <div className={`${baseClasses} ${typeClasses[notification.type]} ${notification ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
      <span>{notification.message}</span>
      <button onClick={onDismiss} className="ml-4 text-white hover:text-white/80" aria-label="Dismiss notification">
        &times;
      </button>
    </div>
  );
};

// --- Add Farm Form ---
interface AddFarmFormProps {
  farmerId: string;
  onClose: () => void;
  showNotification: (message: string, type: NotificationType) => void;
}
const AddFarmForm: React.FC<AddFarmFormProps> = ({ farmerId, onClose, showNotification }) => {
  const { addFarm } = useData();
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [areaHectares, setAreaHectares] = useState<number | ''>('');
  const [locationAddress, setLocationAddress] = useState('');
  const [errors, setErrors] = useState<{[key:string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: {[key:string]: string} = {};
    if (!name.trim()) newErrors.name = t('forms.errors.farmNameRequired');
    if (areaHectares === '' || Number(areaHectares) <= 0) newErrors.areaHectares = t('forms.errors.areaPositive');
    if (!locationAddress.trim()) newErrors.locationAddress = t('forms.errors.locationRequired');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
        const newFarmData: Omit<Farm, 'id' | 'plots' | 'locationCoords'> = {
            farmerId,
            name,
            areaHectares: Number(areaHectares),
            locationAddress,
        };
        await addFarm(newFarmData);
        showNotification(t('notifications.farmAdded', { name }), NotificationType.SUCCESS);
        onClose();
    } catch (error) {
        showNotification(t('notifications.farmAddFailed'), NotificationType.ERROR);
        console.error(error);
    } finally {
        setIsSubmitting(false);
    }
  };
  return (
     <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="farm-name" className="block text-sm font-medium text-neutral-700">{t('forms.labels.farmName')}</label>
        <input type="text" id="farm-name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue" />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="farm-area" className="block text-sm font-medium text-neutral-700">{t('forms.labels.area')}</label>
        <input type="number" id="farm-area" value={areaHectares} onChange={e => setAreaHectares(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 block w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue" />
        {errors.areaHectares && <p className="text-red-500 text-xs mt-1">{errors.areaHectares}</p>}
      </div>
      <div>
        <label htmlFor="farm-address" className="block text-sm font-medium text-neutral-700">{t('forms.labels.location')}</label>
        <input type="text" id="farm-address" value={locationAddress} onChange={e => setLocationAddress(e.target.value)} className="mt-1 block w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue" />
        {errors.locationAddress && <p className="text-red-500 text-xs mt-1">{errors.locationAddress}</p>}
      </div>
      <div className="flex justify-end pt-2 space-x-2">
         <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 rounded-md hover:bg-neutral-200">{t('forms.buttons.cancel')}</button>
         <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-brand-blue rounded-md hover:bg-brand-blue/90 disabled:opacity-50 flex items-center">
            {isSubmitting && <AIServiceIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />}
            {isSubmitting ? t('forms.buttons.adding') : t('forms.buttons.addFarm')}
        </button>
      </div>
    </form>
  );
};

// --- Add Daily Log Form ---
interface AddDailyLogFormProps {
    plot: Plot;
    farmerId: string;
    onClose: () => void;
    showNotification: (message: string, type: NotificationType) => void;
    analyzePlotImageWithAI: (imageDataBase64: string, mimeType: string) => Promise<AIImageAnalysis | null>;
}
const AddDailyLogForm: React.FC<AddDailyLogFormProps> = ({ plot, farmerId, onClose, showNotification, analyzePlotImageWithAI }) => {
    const { addDailyPlotLog } = useData();
    const { t } = useLanguage();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [farmerNotes, setFarmerNotes] = useState('');
    const [photoFiles, setPhotoFiles] = useState<File[]>([]);
    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [aiAnalysisResult, setAiAnalysisResult] = useState<AIImageAnalysis | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    useEffect(() => {
        // Clean up object URLs
        return () => {
            photoPreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [photoPreviews]);

    const runAIAnalysis = useCallback(async (file: File) => {
        setIsAnalyzing(true);
        setAiAnalysisResult(null);
        showNotification("Starting AI analysis on image...", NotificationType.INFO);
        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = async () => {
                const base64 = (reader.result as string).split(',')[1];
                const result = await analyzePlotImageWithAI(base64, file.type);
                setAiAnalysisResult(result);
                if (result?.error) {
                    showNotification(`AI Analysis failed: ${result.error}`, NotificationType.ERROR);
                } else {
                    showNotification('AI analysis complete.', NotificationType.SUCCESS);
                }
                setIsAnalyzing(false);
            };
            reader.onerror = () => {
                 showNotification('Failed to read image file for analysis.', NotificationType.ERROR);
                 setIsAnalyzing(false);
            }
        } catch (error) {
            console.error(error);
            showNotification('An error occurred during AI analysis.', NotificationType.ERROR);
            setIsAnalyzing(false);
        }
    }, [analyzePlotImageWithAI, showNotification]);

    const handleFileChange = useCallback((files: FileList | null) => {
        if (files) {
            const newFiles = Array.from(files);
            setPhotoFiles(prev => [...prev, ...newFiles]);
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setPhotoPreviews(prev => [...prev, ...newPreviews]);

            if (photoFiles.length === 0 && newFiles.length > 0) {
                runAIAnalysis(newFiles[0]);
            }
        }
    }, [photoFiles.length, runAIAnalysis]);

    const handleCapture = useCallback((file: File) => {
        setPhotoFiles(prev => [...prev, file]);
        setPhotoPreviews(prev => [...prev, URL.createObjectURL(file)]);
        setIsCameraOpen(false);
        if (photoFiles.length === 0) {
            runAIAnalysis(file);
        }
    }, [photoFiles.length, runAIAnalysis]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (photoFiles.length === 0) {
            showNotification('Please upload at least one photo.', NotificationType.ERROR);
            return;
        }

        setIsSubmitting(true);
        try {
            await addDailyPlotLog(plot.farmId, plot.id, {
                photoFiles,
                farmerNotes: farmerNotes.trim() ? farmerNotes.trim() : undefined,
                aiAnalysis: aiAnalysisResult || undefined,
            }, farmerId);
            showNotification('Daily log added successfully!', NotificationType.SUCCESS);
            onClose();
        } catch (error) {
            console.error('Failed to add daily log:', error);
            showNotification('Failed to add daily log.', NotificationType.ERROR);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700">Photos</label>
                    <div className="mt-1 flex-col space-y-2">
                         <div className="flex justify-center px-6 py-4 border-2 border-neutral-300 border-dashed rounded-md text-center">
                            <div className="space-y-1">
                                <UploadIcon className="mx-auto h-10 w-10 text-neutral-400" />
                                <div className="flex text-sm text-neutral-600">
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="relative cursor-pointer bg-white rounded-md font-medium text-brand-blue hover:text-brand-blue-dark">
                                        <span>Upload files</span>
                                    </button>
                                    <input ref={fileInputRef} id="file-upload" type="file" multiple accept="image/*" className="sr-only" onChange={e => handleFileChange(e.target.files)} />
                                    <p className="pl-1">or use camera</p>
                                </div>
                                 <button type="button" onClick={() => setIsCameraOpen(true)} className="mt-2 text-sm text-white bg-neutral-600 hover:bg-neutral-700 px-3 py-1 rounded-md flex items-center mx-auto">
                                    <CameraIcon className="w-4 h-4 mr-2" /> Use Camera
                                </button>
                            </div>
                        </div>
                        {photoPreviews.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 pt-2">
                                {photoPreviews.map((src, index) => <img key={index} src={src} alt={`preview ${index}`} className="h-24 w-full object-cover rounded-md border" />)}
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="farmer-notes" className="block text-sm font-medium text-neutral-700 flex items-center"><PencilIcon className="w-4 h-4 mr-2" />Farmer's Notes</label>
                    <textarea id="farmer-notes" value={farmerNotes} onChange={e => setFarmerNotes(e.target.value)} rows={3} placeholder="Add any observations..." className="mt-1 block w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue" />
                </div>

                {(isAnalyzing || aiAnalysisResult) && (
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 flex items-center"><BrainCircuitIcon className="w-4 h-4 mr-2" />AI Analysis</label>
                        <div className="mt-1 p-3 bg-neutral-100 rounded-md border text-sm">
                            {isAnalyzing && <p className="text-neutral-600 flex items-center"><AIServiceIcon className="w-4 h-4 mr-2 animate-spin" /> Analyzing first image...</p>}
                            {aiAnalysisResult?.error && <p className="text-red-600">Error: {aiAnalysisResult.error}</p>}
                            {aiAnalysisResult && !aiAnalysisResult.error && (
                                <div className="space-y-1">
                                    <p><strong>Summary:</strong> {aiAnalysisResult.summary}</p>
                                    <p><strong>Health:</strong> {aiAnalysisResult.health}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex justify-end pt-2 space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 rounded-md hover:bg-neutral-200">Cancel</button>
                    <button type="submit" disabled={isSubmitting || photoFiles.length === 0} className="px-4 py-2 text-sm font-medium text-white bg-brand-blue rounded-md hover:bg-brand-blue/90 disabled:opacity-50 flex items-center">
                        {isSubmitting && <AIServiceIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />}
                        {isSubmitting ? 'Saving...' : 'Save Log'}
                    </button>
                </div>
            </form>
            <CameraCapture isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} onCapture={handleCapture} showNotification={showNotification} />
        </>
    );
};


// --- Language Switcher ---
const LanguageSwitcher: React.FC = () => {
    const { language, changeLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'हिन्दी' },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLanguageChange = (code: string) => {
        changeLanguage(code);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 text-neutral-600 hover:bg-neutral-100 p-2 rounded-md"
            >
                <GlobeIcon className="w-5 h-5" />
                <span className="text-sm font-medium uppercase">{language}</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-neutral-200 z-20">
                    <ul className="py-1">
                        {languages.map(lang => (
                            <li key={lang.code}>
                                <button
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className={`w-full text-left px-4 py-2 text-sm ${language === lang.code ? 'bg-brand-blue/10 text-brand-blue font-semibold' : 'text-neutral-700 hover:bg-neutral-100'}`}
                                >
                                    {lang.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};


// --- Main Dashboard Component ---
interface DashboardProps {
  user: LoggedInUser;
  onLogout: () => void;
  analyzePlotImageWithAI: (imageDataBase64: string, mimeType: string) => Promise<AIImageAnalysis | null>;
  currentNotification: NotificationMessage | null;
  showNotification: (message: string, type: NotificationType) => void;
  dismissNotification: () => void;
  aiInstance: GoogleGenAI | null;
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  onLogout,
  analyzePlotImageWithAI,
  currentNotification,
  showNotification,
  dismissNotification,
  aiInstance,
}) => {
  const { farmers, activities, notes, addDailyPlotLog } = useData();
  const { t } = useLanguage();

  type View = 'dashboard' | 'plots' | 'map' | 'feed' | 'assistant';
  const [activeView, setActiveView] = useState<View>('dashboard');
  
  const { isMapApiLoaded, mapApiError } = useGoogleMaps();

  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(() => {
    if (user.role === 'farmer') {
      return user.id || null;
    }
    return loadFromStorage<string | null>(LOCAL_STORAGE_KEYS.SELECTED_FARMER_ID, null);
  });

  const [isAddFarmModalOpen, setAddFarmModalOpen] = useState(false);
  const [viewingPlot, setViewingPlot] = useState<Plot | null>(null);
  const [addLogForPlot, setAddLogForPlot] = useState<Plot | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isMarketLoading, setIsMarketLoading] = useState(true);
  const [yieldPrediction, setYieldPrediction] = useState<YieldPredictionData | null>(null);
  const [isYieldLoading, setIsYieldLoading] = useState(true);
  
  const selectedFarmer = useMemo(() => {
    return farmers.find(f => f.id === selectedFarmerId);
  }, [farmers, selectedFarmerId]);

  const primaryCrop = useMemo(() => selectedFarmer?.farmingExperience.cropsGrown[0] || 'wheat', [selectedFarmer]);

  // AI-powered data fetching
  const fetchAIData = useCallback(async () => {
      if (!aiInstance || !selectedFarmer) return;

      // --- Fetch Weather ---
      setIsWeatherLoading(true);
      try {
          const prompt = `Act as a weather API. For the location "${selectedFarmer.location}", provide a JSON object with the current weather and a 5-day forecast.`;
          const schema = {
              type: Type.OBJECT,
              properties: {
                  current: { type: Type.OBJECT, properties: { temperature: {type: Type.NUMBER}, condition: {type: Type.STRING}, windSpeed: {type: Type.NUMBER}, humidity: {type: Type.NUMBER} } },
                  forecast: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { day: {type: Type.STRING}, condition: {type: Type.STRING}, high: {type: Type.NUMBER}, low: {type: Type.NUMBER} } } }
              }
          };
          const response = await aiInstance.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: "application/json", responseSchema: schema }});
          setWeatherData(JSON.parse(response.text));
      } catch (e) { console.error("AI Weather Error:", e); showNotification(t('notifications.weatherError'), NotificationType.ERROR); }
      finally { setIsWeatherLoading(false); }

      // --- Fetch Market Data ---
      setIsMarketLoading(true);
      try {
          const prompt = `Act as an agricultural market price API. For the crop "${primaryCrop}" in the region of "${selectedFarmer.location}", provide a JSON object with an estimated current price in Indian Rupees (INR) per quintal, a 5-day price trend forecast, and a brief market summary. The unit should only be a weight measure like 'quintal'.`;
          const schema = {
              type: Type.OBJECT, properties: {
                  cropName: { type: Type.STRING },
                  currentPrice: { type: Type.OBJECT, properties: { 
                      price: { type: Type.NUMBER, description: "The price in Indian Rupees (INR)." }, 
                      unit: { type: Type.STRING, description: "The unit of measurement for the price, e.g., 'quintal' or 'tonne'." } 
                  } },
                  forecast: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { day: { type: Type.STRING }, trend: { type: Type.STRING } } } },
                  summary: { type: Type.STRING }
              }
          };
          const response = await aiInstance.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: "application/json", responseSchema: schema }});
          setMarketData(JSON.parse(response.text));
      } catch (e) { console.error("AI Market Data Error:", e); showNotification(t('notifications.marketError'), NotificationType.ERROR); }
      finally { setIsMarketLoading(false); }

      // --- Fetch Yield Prediction ---
      setIsYieldLoading(true);
      try {
          const prompt = `Act as an agricultural yield prediction model. For a farmer in "${selectedFarmer.location}" growing "${primaryCrop}" with an average farm size of ${selectedFarmer.farmingExperience.farmSizeHectares} hectares, provide a JSON object with an estimated yield prediction, a confidence level ('High', 'Medium', or 'Low'), and three key influencing factors for this prediction.`;
          const schema = {
              type: Type.OBJECT, properties: {
                  cropName: { type: Type.STRING },
                  predictedYield: { type: Type.STRING },
                  confidence: { type: Type.STRING },
                  factors: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
          };
          const response = await aiInstance.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: "application/json", responseSchema: schema }});
          setYieldPrediction(JSON.parse(response.text));
      } catch (e) { console.error("AI Yield Prediction Error:", e); showNotification(t('notifications.yieldError'), NotificationType.ERROR); }
      finally { setIsYieldLoading(false); }

  }, [aiInstance, selectedFarmer, primaryCrop, showNotification, t]);

  useEffect(() => {
    if (user.role === 'consultant' && !selectedFarmerId && farmers.length > 0) {
      setSelectedFarmerId(farmers[0].id);
    }
  }, [selectedFarmerId, farmers, user.role]);

  const prevFarmerIdRef = useRef<string | null>();
  
  useEffect(() => {
    // Only reset view to dashboard if the farmer ID has actually changed
    if (prevFarmerIdRef.current !== selectedFarmerId) {
      setActiveView('dashboard');
    }
    prevFarmerIdRef.current = selectedFarmerId;
    saveToStorage(LOCAL_STORAGE_KEYS.SELECTED_FARMER_ID, selectedFarmerId);
  }, [selectedFarmerId]);

  useEffect(() => {
      // This effect fetches data whenever the farmer or other dependencies change.
      if (selectedFarmer && aiInstance) {
          fetchAIData();
      }
  }, [selectedFarmer, aiInstance, fetchAIData]);


  const handleSelectFarmer = (farmerId: string) => {
    setSelectedFarmerId(farmerId);
  };

  const filteredActivities = useMemo(() => {
    if (!selectedFarmerId) return [];
    return activities.filter(a => a.farmerId === selectedFarmerId).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [activities, selectedFarmerId]);
  
  const filteredNotes = useMemo(() => {
    if (!selectedFarmerId) return [];
    return notes.filter(n => n.farmerId === selectedFarmerId).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [notes, selectedFarmerId]);

  const navItems = [
      { id: 'dashboard', label: t('dashboard.nav.dashboard'), icon: DashboardIcon },
      { id: 'plots', label: t('dashboard.nav.plots'), icon: SectionPlotIcon },
      { id: 'map', label: t('dashboard.nav.map'), icon: MapIcon },
      { id: 'feed', label: t('dashboard.nav.feed'), icon: ActivityLogIcon },
      { id: 'assistant', label: t('dashboard.nav.assistant'), icon: AIServiceIcon },
  ];

  const totalFarms = selectedFarmer?.farms.length || 0;
  const totalPlots = selectedFarmer?.farms.reduce((acc, farm) => acc + farm.plots.length, 0) || 0;
  const recentActivityCount = filteredActivities.filter(a => new Date(a.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;

  return (
    <div className="flex h-screen bg-neutral-100">
        <Notification notification={currentNotification} onDismiss={dismissNotification} />
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col">
            <div className="p-4 border-b border-neutral-200">
                <h1 className="text-2xl font-bold text-brand-green flex items-center">
                    <UserIcon className="w-8 h-8 mr-2"/> AgriSmart
                </h1>
            </div>
            {user.role === 'consultant' && (
                <div className="flex-1 overflow-y-auto">
                    <h2 className="p-4 text-sm font-semibold text-neutral-600">{t('dashboard.farmers')}</h2>
                    <ul>
                        {farmers.map(farmer => (
                            <FarmerListItem
                                key={farmer.id}
                                farmer={farmer}
                                isSelected={farmer.id === selectedFarmerId}
                                onSelect={handleSelectFarmer}
                            />
                        ))}
                    </ul>
                </div>
            )}
             <div className="p-4 mt-auto border-t border-neutral-200">
                <div className="flex items-center space-x-3">
                    <UserIcon className="w-8 h-8 text-neutral-500"/>
                    <div>
                        <p className="font-semibold text-neutral-700">{selectedFarmer?.name || user.role}</p>
                        <p className="text-xs text-neutral-500 capitalize">{user.role}</p>
                    </div>
                </div>
                <button
                    onClick={onLogout}
                    className="mt-4 w-full flex items-center justify-center px-3 py-2 text-sm text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-md"
                >
                    <LogoutIcon className="w-4 h-4 mr-2"/>
                    {t('dashboard.logout')}
                </button>
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
           <header className="bg-white p-4 lg:px-8 lg:py-5 border-b border-neutral-200 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-neutral-800">
                  {selectedFarmer ? t('dashboard.overviewFor', { name: selectedFarmer.name }) : t('dashboard.title')}
                </h2>
                <p className="text-neutral-500 text-sm">{t('dashboard.tagline')}</p>
              </div>
              <LanguageSwitcher />
            </header>
            
            <nav className="bg-white border-b border-neutral-200 flex-shrink-0">
                <div className="px-4 lg:px-8 flex space-x-2 sm:space-x-4 overflow-x-auto">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id as View)}
                            className={`flex items-center space-x-2 py-3 px-2 border-b-2 text-sm font-medium transition-colors whitespace-nowrap
                                ${activeView === item.id 
                                    ? 'border-brand-blue text-brand-blue' 
                                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>

            <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                {!selectedFarmer ? (
                    <div className="text-center mt-10">
                        <p className="text-neutral-600">
                            {user.role === 'consultant' ? t('dashboard.selectFarmer') : t('dashboard.loading')}
                        </p>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto space-y-8">
                      
                      {activeView === 'dashboard' && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="bg-white p-5 rounded-lg shadow border border-neutral-200 flex items-center space-x-4">
                                  <AppFarmIcon className="w-10 h-10 text-brand-green"/>
                                  <div>
                                      <p className="text-sm text-neutral-500">{t('dashboard.statCards.totalFarms')}</p>
                                      <p className="text-2xl font-bold text-neutral-800">{totalFarms}</p>
                                  </div>
                              </div>
                              <div className="bg-white p-5 rounded-lg shadow border border-neutral-200 flex items-center space-x-4">
                                  <SectionPlotIcon className="w-10 h-10 text-brand-blue"/>
                                  <div>
                                      <p className="text-sm text-neutral-500">{t('dashboard.statCards.totalPlots')}</p>
                                      <p className="text-2xl font-bold text-neutral-800">{totalPlots}</p>
                                  </div>
                              </div>
                              <div className="bg-white p-5 rounded-lg shadow border border-neutral-200 flex items-center space-x-4">
                                  <ActivityLogIcon className="w-10 h-10 text-brand-orange"/>
                                  <div>
                                      <p className="text-sm text-neutral-500">{t('dashboard.statCards.recentActivities')}</p>
                                      <p className="text-2xl font-bold text-neutral-800">{recentActivityCount}</p>
                                  </div>
                              </div>
                          </div>
                          <PersonalizedSuggestions farmer={selectedFarmer} weatherData={weatherData} />
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <MarketPriceCard marketData={marketData} isLoading={isMarketLoading} />
                            <YieldPredictionCard yieldPrediction={yieldPrediction} isLoading={isYieldLoading} />
                          </div>
                          <WeatherCard weatherData={weatherData} location={selectedFarmer.location} isLoading={isWeatherLoading} />
                        </div>
                      )}

                      {activeView === 'plots' && (
                        <section>
                           <div className="flex justify-between items-center mb-4">
                              <h3 className="text-xl font-semibold text-neutral-700">{t('dashboard.farmsAndPlots')}</h3>
                              <button onClick={() => setAddFarmModalOpen(true)} className="px-3 py-1.5 text-sm bg-brand-blue text-white rounded-md hover:bg-brand-blue/90 flex items-center">
                                  <PlusCircleIcon className="w-4 h-4 mr-1.5"/> {t('dashboard.addFarm')}
                              </button>
                           </div>
                          {selectedFarmer.farms.map(farm => (
                               <div key={farm.id} className="mb-6 bg-white p-4 rounded-lg shadow border border-neutral-200">
                                  <h4 className="text-lg font-medium text-neutral-700 mb-3 border-b pb-2">{farm.name}</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {farm.plots.length > 0 ? farm.plots.map(plot => (
                                      <PlotCard
                                          key={plot.id}
                                          plot={plot}
                                          // FIX: Corrected the onAddDailyLog prop to have the right function signature and implemented the handler to open a modal for adding a new log.
                                          onAddDailyLog={(plotId, farmId) => {
                                              const currentFarm = selectedFarmer.farms.find(f => f.id === farmId);
                                              const targetPlot = currentFarm?.plots.find(p => p.id === plotId);
                                              if (targetPlot) {
                                                  setAddLogForPlot(targetPlot);
                                              }
                                          }}
                                          onViewLogHistory={(p) => setViewingPlot(p)}
                                      />
                                  )) : <p className="text-sm text-neutral-500 italic">{t('dashboard.noPlots')}</p>}
                                  </div>
                              </div>
                          ))}
                        </section>
                      )}

                      {activeView === 'map' && (
                          <section>
                              <h3 className="text-xl font-semibold text-neutral-700 mb-4">{t('dashboard.mapView')}</h3>
                              {isMapApiLoaded && !mapApiError ? (
                                  selectedFarmer.farms.map(farm => (
                                      <div key={farm.id} className="mb-6">
                                          <h4 className="text-lg font-medium text-neutral-600 mb-2">{farm.name}</h4>
                                          <FarmMap farm={farm} plots={farm.plots} />
                                      </div>
                                  ))
                              ) : mapApiError ? (
                                  <div className="p-4 bg-red-100 text-red-700 rounded-md">{mapApiError.message}</div>
                              ) : (
                                  <div className="p-4 bg-blue-100 text-blue-700 rounded-md">{t('dashboard.loadingMap')}</div>
                              )}
                          </section>
                      )}

                      {activeView === 'feed' && (
                        <section>
                            <h3 className="text-xl font-semibold text-neutral-700 mb-4">{t('dashboard.activityFeed')}</h3>
                            {/* FIX: The error "Expected 1 arguments, but got 0" points to a type mismatch. The callback is updated to accept an (unused) argument to satisfy the type-checker. Also implemented notification on success. */}
                            <AddNoteForm farmerId={selectedFarmer.id} farmerName={selectedFarmer.name} onNoteAdded={(_) => showNotification('Note added successfully!', NotificationType.SUCCESS)} />
                            <div className="mt-4 space-y-4">
                                {[...filteredActivities.map(a => ({...a, type: 'activity'})), ...filteredNotes.map(n => ({...n, type: 'note'}))]
                                    .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                    .map(item =>
                                        item.type === 'activity'
                                            ? <ActivityCard key={`act-${item.id}`} activity={item as Activity} showFarmName={selectedFarmer.farms.length > 1} />
                                            : <NoteCard key={`note-${item.id}`} note={item as ConsultantNote} />
                                    )
                                }
                            </div>
                        </section>
                      )}

                      {activeView === 'assistant' && (
                        <AI_Assistant aiInstance={aiInstance} farmer={selectedFarmer} showNotification={showNotification} />
                      )}

                    </div>
                )}
            </div>
        </main>
        <PlotLogHistoryModal plot={viewingPlot} onClose={() => setViewingPlot(null)} />
         <Modal isOpen={isAddFarmModalOpen} onClose={() => setAddFarmModalOpen(false)} title={t('modals.addFarm.title')}>
            {selectedFarmerId && (
                <AddFarmForm
                    farmerId={selectedFarmerId}
                    onClose={() => setAddFarmModalOpen(false)}
                    showNotification={showNotification}
                />
            )}
        </Modal>
        <Modal isOpen={!!addLogForPlot} onClose={() => setAddLogForPlot(null)} title={`Add Daily Log for ${addLogForPlot?.name}`}>
            {addLogForPlot && selectedFarmer && (
                <AddDailyLogForm
                    plot={addLogForPlot}
                    farmerId={selectedFarmer.id}
                    onClose={() => setAddLogForPlot(null)}
                    showNotification={showNotification}
                    analyzePlotImageWithAI={analyzePlotImageWithAI}
                />
            )}
        </Modal>
    </div>
  );
};

export default Dashboard;