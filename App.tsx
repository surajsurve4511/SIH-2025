



import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Farmer, AIImageAnalysis, NotificationMessage, NotificationType } from './types';
import LoginPage from './components/LoginPage';
import Dashboard from './Dashboard';
import { DataProvider, useData } from './contexts/DataContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

const LOCAL_STORAGE_KEYS = {
  LOGGED_IN_USER: 'smartFarmData_loggedInUser'
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

export type LoggedInUser = {
  role: 'consultant' | 'farmer';
  id?: string; // only for farmer
};

const AppContent: React.FC = () => {
    const { farmers, isLoading: isDataLoading } = useData();
    const { t } = useLanguage();
    const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentNotification, setCurrentNotification] = useState<NotificationMessage | null>(null);

    useEffect(() => {
        const user = loadFromStorage<LoggedInUser | null>(LOCAL_STORAGE_KEYS.LOGGED_IN_USER, null);
        if(user){
            setLoggedInUser(user);
        }
        setIsLoading(false);
    }, []);

    const handleLogin = (user: LoggedInUser) => {
        setLoggedInUser(user);
        saveToStorage(LOCAL_STORAGE_KEYS.LOGGED_IN_USER, user);
    };

    const handleLogout = () => {
        setLoggedInUser(null);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.LOGGED_IN_USER);
        localStorage.removeItem('smartFarmData_selectedFarmerId');
    };

    const showNotification = useCallback((message: string, type: NotificationType) => {
        setCurrentNotification({ id: Date.now().toString(), message, type });
    }, []);

    const ai = useMemo(() => {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
        console.error("API_KEY environment variable not set. AI features will be disabled.");
        return null;
        }
        try {
            return new GoogleGenAI({ apiKey });
        } catch(e) {
            console.error("Failed to initialize GoogleGenAI, likely due to API key issue:", e);
            return null;
        }
    }, []);

    const analyzePlotImageWithAI = async (imageDataBase64: string, mimeType: string): Promise<AIImageAnalysis | null> => {
        if (!ai) {
            showNotification("AI Service not initialized. API_KEY might be missing or invalid.", NotificationType.ERROR);
            return { error: "AI Service not initialized. API_KEY might be missing or invalid." };
        }
        const imagePart = { inlineData: { data: imageDataBase64, mimeType } };

        const promptSchema = {
        type: Type.OBJECT,
        properties: {
            description: { type: Type.STRING, description: "A concise visual description of the image (e.g., leaf color, soil condition)." },
            growthStage: { type: Type.STRING, description: "The crop's growth stage (e.g., Vegetative, Flowering)." },
            health: { type: Type.STRING, description: "The crop's overall health (e.g., Healthy, Poor)." },
            findings: {
            type: Type.OBJECT,
            properties: {
                disease: { type: Type.STRING, description: "Detailed findings on diseases. State 'None observed' if none." },
                pests: { type: Type.STRING, description: "Detailed findings on pests. State 'None observed' if none." },
                nutrients: { type: Type.STRING, description: "Detailed findings on nutrient deficiencies. State 'None observed' if none." },
            },
            },
            summary: { type: Type.STRING, description: "A one-sentence summary of the plot's condition." },
        },
        };

        try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, {text: "You are an expert agronomist AI. Analyze the provided image of a crop plot."}] },
            config: { 
            responseMimeType: "application/json",
            responseSchema: promptSchema,
            }
        });
        
        let jsonStr = response.text.trim();
        return JSON.parse(jsonStr) as AIImageAnalysis;

        } catch (error) {
        console.error("AI plot image analysis error:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during image analysis.";
        showNotification(`AI Plot Image Analysis Error: ${errorMessage}`, NotificationType.ERROR);
        return { error: errorMessage };
        }
    };

    if (isLoading || isDataLoading) {
        return <div className="flex items-center justify-center h-screen bg-neutral-base text-lg text-neutral-600">{t('app.loading')}</div>;
    }
    
    if (!loggedInUser) {
        return <LoginPage onLogin={handleLogin} farmers={farmers} />;
    }

    return (
        <Dashboard
            user={loggedInUser}
            onLogout={handleLogout}
            analyzePlotImageWithAI={analyzePlotImageWithAI}
            currentNotification={currentNotification}
            showNotification={showNotification}
            dismissNotification={() => setCurrentNotification(null)}
            aiInstance={ai}
        />
    );
};

const App: React.FC = () => {
    return (
        <DataProvider>
            <LanguageProvider>
                <AppContent />
            </LanguageProvider>
        </DataProvider>
    );
};


export default App;