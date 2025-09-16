

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Farmer, Activity, Plot, Farm, DailyPlotLog, FarmingExperience, AIImageAnalysis, ConsultantNote } from '../types';
import * as dataService from '../services/dataService';

interface DataContextType {
    farmers: Farmer[];
    activities: Activity[];
    notes: ConsultantNote[];
    isLoading: boolean;
    addFarm: (farmData: Omit<Farm, 'id' | 'plots' | 'locationCoords'>) => Promise<void>;
    addPlot: (plotData: Omit<Plot, 'id' | 'dailyLogs'>) => Promise<void>;
    addActivity: (activityData: Omit<Activity, 'id' | 'photoUrl'> & { photoFile?: File }) => Promise<void>;
    addDailyPlotLog: (farmId: string, plotId: string, logData: { photoFiles: File[], farmerNotes?: string, aiAnalysis?: AIImageAnalysis }, farmerId: string) => Promise<void>;
    addNote: (noteData: Omit<ConsultantNote, 'id'>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [farmers, setFarmers] = useState<Farmer[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [notes, setNotes] = useState<ConsultantNote[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const { farmers, activities, notes } = await dataService.initializeData();
                setFarmers(farmers);
                setActivities(activities);
                setNotes(notes);
            } catch (error) {
                console.error("Failed to initialize data", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);
    
    const handleAddFarm = async (farmData: Omit<Farm, 'id' | 'plots' | 'locationCoords'>) => {
        const newFarm = await dataService.addFarm(farmData);
        setFarmers(prev => prev.map(f => f.id === newFarm.farmerId ? { ...f, farms: [...f.farms, newFarm] } : f));
    };

    const handleAddPlot = async (plotData: Omit<Plot, 'id' | 'dailyLogs'>) => {
        const newPlot = await dataService.addPlot(plotData);
        setFarmers(prev => prev.map(f => ({
            ...f,
            farms: f.farms.map(farm => farm.id === newPlot.farmId ? { ...farm, plots: [...farm.plots, newPlot]} : farm)
        })));
    };
    
    const handleAddActivity = async (activityData: Omit<Activity, 'id' | 'photoUrl'> & { photoFile?: File }) => {
        const newActivity = await dataService.addActivity(activityData);
        setActivities(prev => [...prev, newActivity]);
    };

    const handleAddDailyPlotLog = async (farmId: string, plotId: string, logData: { photoFiles: File[], farmerNotes?: string, aiAnalysis?: AIImageAnalysis }, farmerId: string) => {
        const newDailyLog = await dataService.addDailyPlotLog(farmId, plotId, logData, farmerId);
         setFarmers(prevFarmers => prevFarmers.map(farmer => {
            if (farmer.id === farmerId) {
                const newFarms = farmer.farms.map(f => {
                    if (f.id === farmId) {
                        const newPlots = f.plots.map(p => {
                            if (p.id === plotId) {
                                return { ...p, dailyLogs: [...(p.dailyLogs || []), newDailyLog] };
                            }
                            return p;
                        });
                        return { ...f, plots: newPlots };
                    }
                    return f;
                });
                return { ...farmer, farms: newFarms };
            }
            return farmer;
        }));
    };

    const handleAddNote = async (noteData: Omit<ConsultantNote, 'id'>) => {
        const newNote = await dataService.addNote(noteData);
        setNotes(prev => [newNote, ...prev]);
    };

    const value = {
        farmers,
        activities,
        notes,
        isLoading,
        addFarm: handleAddFarm,
        addPlot: handleAddPlot,
        addActivity: handleAddActivity,
        addDailyPlotLog: handleAddDailyPlotLog,
        addNote: handleAddNote,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};