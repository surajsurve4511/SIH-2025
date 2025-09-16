

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import imageCompression from 'browser-image-compression';
import { Farmer, NotificationType } from '../types';
import { AIServiceIcon, UploadIcon, XCircleIcon, InfoIcon, ChevronDownIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface AI_AssistantProps {
    aiInstance: GoogleGenAI | null;
    farmer: Farmer;
    showNotification: (message: string, type: NotificationType) => void;
}

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
    imagePreview?: string;
}

const AI_Assistant: React.FC<AI_AssistantProps> = ({ aiInstance, farmer, showNotification }) => {
    const { t } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([
        { id: 'initial', role: 'model', text: t('assistant.welcome') }
    ]);
    const [inputText, setInputText] = useState('');
    const [inputImage, setInputImage] = useState<{ file: File, preview: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFarmId, setSelectedFarmId] = useState<string>('');
    const [selectedPlotId, setSelectedPlotId] = useState<string>('');
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        // Reset plot selection if farm changes
        setSelectedPlotId('');
    }, [selectedFarmId]);

    const availablePlots = useMemo(() => {
        if (!selectedFarmId) return [];
        const selectedFarm = farmer.farms.find(f => f.id === selectedFarmId);
        return selectedFarm?.plots || [];
    }, [selectedFarmId, farmer.farms]);


    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const options = {
                maxSizeMB: 2,
                maxWidthOrHeight: 1024,
                useWebWorker: true,
            };
            try {
                showNotification(t('assistant.compressing'), NotificationType.INFO);
                const compressedFile = await imageCompression(file, options);
                setInputImage({
                    file: compressedFile,
                    preview: URL.createObjectURL(compressedFile),
                });
                showNotification(t('assistant.imageUploaded'), NotificationType.SUCCESS);
            } catch (error) {
                console.error("Image compression error:", error);
                showNotification(t('assistant.compressError'), NotificationType.ERROR);
            }
        }
         // Reset file input to allow re-selection of the same file
        if(event.target) {
            event.target.value = "";
        }
    };

    const handleSend = async () => {
        if ((!inputText.trim() && !inputImage) || isLoading) return;
        if (!aiInstance) {
            showNotification(t('assistant.notInitialized'), NotificationType.ERROR);
            return;
        }

        setIsLoading(true);

        const userText = inputText.trim();
        const userImage = inputImage;
        
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: userText,
            imagePreview: userImage?.preview,
        };
        setMessages(prev => [...prev, userMessage]);

        setInputText('');
        setInputImage(null);

        try {
            const contents: { parts: any[] } = { parts: [] };
            
            if (userImage) {
                const base64Data = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
                    reader.onerror = reject;
                    reader.readAsDataURL(userImage.file);
                });
                contents.parts.push({
                    inlineData: { data: base64Data, mimeType: userImage.file.type }
                });
            }

            const promptText = userText || t('assistant.defaultImagePrompt');
            contents.parts.push({ text: promptText });
            
            let systemInstruction: string;
            const farm = farmer.farms.find(f => f.id === selectedFarmId);
            const plot = farm?.plots.find(p => p.id === selectedPlotId);

            if (farm && plot) {
                systemInstruction = t('assistant.contextualSystemPrompt', {
                    farmName: farm.name,
                    plotName: plot.name,
                    location: farmer.location,
                    crops: farmer.farmingExperience.cropsGrown.join(', ')
                });
            } else {
                 systemInstruction = t('assistant.systemPrompt', {
                    location: farmer.location,
                    farmSize: farmer.farmingExperience.farmSizeHectares,
                    crops: farmer.farmingExperience.cropsGrown.join(', '),
                });
            }
            
            const response: GenerateContentResponse = await aiInstance.models.generateContent({
                model: 'gemini-2.5-flash',
                contents,
                config: { systemInstruction },
            });

            const modelResponseText = response.text;
            const modelMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: modelResponseText,
            };
            setMessages(prev => [...prev, modelMessage]);

        } catch (err) {
            console.error("AI Assistant error:", err);
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            const errorResponseMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: `${t('assistant.errorResponse')} ${errorMessage}`,
            };
            setMessages(prev => [...prev, errorResponseMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="bg-white p-4 rounded-lg shadow border border-neutral-200 h-[calc(100vh-200px)] flex flex-col">
            <div className="flex items-center mb-4 border-b border-neutral-200 pb-3">
                <AIServiceIcon className="w-8 h-8 text-brand-purple mr-3" />
                <div>
                    <h3 className="text-xl font-semibold text-neutral-700">{t('assistant.title')}</h3>
                    <p className="text-xs text-neutral-500">{t('assistant.description')}</p>
                </div>
            </div>
            
            {/* Backend Features Showcase */}
            <details className="mb-4">
                <summary className="cursor-pointer text-sm font-medium text-neutral-600 hover:text-brand-purple flex items-center">
                    <InfoIcon className="w-4 h-4 mr-1.5" />
                    {t('assistant.capabilities.title')}
                    <ChevronDownIcon className="w-4 h-4 ml-1" />
                </summary>
                <div className="mt-2 pl-5 text-xs text-neutral-500 bg-neutral-50 p-3 rounded-md border">
                    <ul className="list-disc list-inside space-y-1">
                        {t('assistant.capabilities.features').map((feature: string, index: number) => (
                           <li key={index}>{feature}</li>
                        ))}
                    </ul>
                </div>
            </details>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && <AIServiceIcon className="w-6 h-6 text-brand-purple flex-shrink-0 mb-1" />}
                        <div className={`max-w-xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-brand-blue text-white' : 'bg-neutral-100 text-neutral-800'}`}>
                            {msg.imagePreview && <img src={msg.imagePreview} alt="upload-preview" className="rounded-md mb-2 max-h-48" />}
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex items-end gap-2 justify-start">
                        <AIServiceIcon className="w-6 h-6 text-brand-purple flex-shrink-0 mb-1" />
                        <div className="max-w-lg p-3 rounded-lg bg-neutral-100 text-neutral-800">
                           <div className="flex items-center space-x-2">
                               <div className="w-2 h-2 bg-brand-purple rounded-full animate-pulse"></div>
                               <div className="w-2 h-2 bg-brand-purple rounded-full animate-pulse delay-150"></div>
                               <div className="w-2 h-2 bg-brand-purple rounded-full animate-pulse delay-300"></div>
                           </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="mt-4 pt-3 border-t border-neutral-200">
                <div className="grid grid-cols-2 gap-2 mb-2">
                    <select value={selectedFarmId} onChange={e => setSelectedFarmId(e.target.value)} className="w-full p-1.5 border border-neutral-300 rounded-md text-xs focus:ring-2 focus:ring-brand-purple">
                        <option value="">{t('assistant.selectFarm')}</option>
                        {farmer.farms.map(farm => <option key={farm.id} value={farm.id}>{farm.name}</option>)}
                    </select>
                    <select value={selectedPlotId} onChange={e => setSelectedPlotId(e.target.value)} disabled={!selectedFarmId} className="w-full p-1.5 border border-neutral-300 rounded-md text-xs focus:ring-2 focus:ring-brand-purple disabled:bg-neutral-100">
                        <option value="">{t('assistant.selectPlot')}</option>
                         <option value="all">{t('assistant.allPlots')}</option>
                        {availablePlots.map(plot => <option key={plot.id} value={plot.id}>{plot.name}</option>)}
                    </select>
                </div>
                 {inputImage && (
                    <div className="relative w-24 h-24 mb-2">
                        <img src={inputImage.preview} alt="selected-preview" className="w-full h-full object-cover rounded-md" />
                        <button onClick={() => setInputImage(null)} className="absolute -top-2 -right-2 bg-neutral-800 text-white rounded-full p-0.5">
                            <XCircleIcon className="w-5 h-5" />
                        </button>
                    </div>
                )}
                <div className="flex items-center space-x-2">
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="p-2 text-neutral-500 hover:text-brand-purple bg-neutral-100 hover:bg-neutral-200 rounded-md">
                        <UploadIcon className="w-5 h-5"/>
                    </button>
                    <textarea
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
                        placeholder={t('assistant.placeholder')}
                        className="flex-1 p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-brand-purple text-sm"
                        rows={1}
                    />
                    <button onClick={handleSend} disabled={isLoading} className="px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-brand-purple/90 disabled:opacity-70">
                        {t('assistant.send')}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default AI_Assistant;
