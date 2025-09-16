


import { MOCK_FARMERS, MOCK_ACTIVITIES, MOCK_NOTES } from '../mockData';
import { Farmer, Activity, Plot, Farm, DailyPlotLog, FarmingExperience, AIImageAnalysis, WeatherData, CurrentWeather, ForecastDay, ConsultantNote } from '../types';

const LOCAL_STORAGE_KEYS = {
  FARMERS: 'smartFarmData_farmers',
  ACTIVITIES: 'smartFarmData_activities',
  NOTES: 'smartFarmData_notes',
};

const SIMULATED_LATENCY = 300; // ms

// --- Internal LocalStorage Utilities ---
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

const simulateRequest = <T,>(data: T): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(data);
        }, SIMULATED_LATENCY);
    });
}

// --- SIMULATED CLOUD STORAGE ---
/**
 * Simulates uploading a file to Google Cloud Storage.
 * In a real application, this would use the Firebase Storage SDK (`firebase/storage`).
 * It would involve `ref()` to create a reference, `uploadBytes()` to upload,
 * and `getDownloadURL()` to get the public URL.
 * @param file The file to upload.
 * @returns A promise that resolves to a fake public URL for the file.
 */
const uploadImage = async (file: File): Promise<string> => {
    console.log(`Simulating upload for: ${file.name}`);
    // Simulate network delay for upload
    await new Promise(res => setTimeout(res, 500)); 
    const fakeUrl = `https://storage.googleapis.com/agrisinart-fake-bucket/${Date.now()}-${file.name}`;
    console.log(`Simulated upload complete. URL: ${fakeUrl}`);
    return fakeUrl;
};

/**
 * Simulates a call to a geocoding service like Google's Geocoding API.
 * Takes an address string and returns mock coordinates.
 * @param address The address to geocode.
 * @returns A promise that resolves to a latitude/longitude object.
 */
const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number; }> => {
    console.log(`Simulating geocoding for: ${address}`);
    await new Promise(res => setTimeout(res, 200)); // Simulate geocoding latency
    // Simple hash function to generate deterministic "random" coords from address
    let hash = 0;
    for (let i = 0; i < address.length; i++) {
        const char = address.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    const lat = 34 + (hash % 1000) / 1000.0;
    const lng = -118 + (hash % 2000) / 1000.0;
    return { lat, lng };
}


// --- Public Data Service API ---

export const initializeData = async (): Promise<{ farmers: Farmer[], activities: Activity[], notes: ConsultantNote[] }> => {
    return simulateRequest(null).then(() => {
        let farmers = loadFromStorage<Farmer[]>(LOCAL_STORAGE_KEYS.FARMERS, []);
        let activities = loadFromStorage<Activity[]>(LOCAL_STORAGE_KEYS.ACTIVITIES, []);
        let notes = loadFromStorage<ConsultantNote[]>(LOCAL_STORAGE_KEYS.NOTES, []);

        if (farmers.length === 0 && activities.length === 0) {
            farmers = MOCK_FARMERS;
            activities = MOCK_ACTIVITIES;
            notes = MOCK_NOTES;
            saveToStorage(LOCAL_STORAGE_KEYS.FARMERS, farmers);
            saveToStorage(LOCAL_STORAGE_KEYS.ACTIVITIES, activities);
            saveToStorage(LOCAL_STORAGE_KEYS.NOTES, notes);
        }
        return { farmers, activities, notes };
    });
};

export const addFarm = async (farmData: Omit<Farm, 'id' | 'plots' | 'locationCoords'>): Promise<Farm> => {
    const farmers = loadFromStorage<Farmer[]>(LOCAL_STORAGE_KEYS.FARMERS, []);
    
    // Simulate geocoding the address to get coordinates
    const coords = await geocodeAddress(farmData.locationAddress);

    const newFarm: Farm = {
        ...farmData,
        id: `farm-${Date.now()}`,
        plots: [],
        locationCoords: coords,
    };
    const updatedFarmers = farmers.map(f => {
        if (f.id === farmData.farmerId) {
            return { ...f, farms: [...f.farms, newFarm] };
        }
        return f;
    });
    saveToStorage(LOCAL_STORAGE_KEYS.FARMERS, updatedFarmers);
    return simulateRequest(newFarm);
}

export const addPlot = async (plotData: Omit<Plot, 'id' | 'dailyLogs'>): Promise<Plot> => {
    const farmers = loadFromStorage<Farmer[]>(LOCAL_STORAGE_KEYS.FARMERS, []);
    const newPlot: Plot = {
        ...plotData,
        id: `plot-${Date.now()}`,
        dailyLogs: [],
    };
    const updatedFarmers = farmers.map(f => ({
        ...f,
        farms: f.farms.map(farm => {
            if (farm.id === plotData.farmId) {
                return { ...farm, plots: [...farm.plots, newPlot] };
            }
            return farm;
        })
    }));
    saveToStorage(LOCAL_STORAGE_KEYS.FARMERS, updatedFarmers);
    return simulateRequest(newPlot);
}

export const addActivity = async (activityData: Omit<Activity, 'id' | 'photoUrl'> & { photoFile?: File }): Promise<Activity> => {
    const activities = loadFromStorage<Activity[]>(LOCAL_STORAGE_KEYS.ACTIVITIES, []);
    let photoUrl: string | undefined = undefined;

    if (activityData.photoFile) {
        photoUrl = await uploadImage(activityData.photoFile);
    }

    const newActivity: Activity = {
        id: `activity-${Date.now()}`,
        farmerId: activityData.farmerId,
        farmerName: activityData.farmerName,
        farmId: activityData.farmId,
        farmName: activityData.farmName,
        plotId: activityData.plotId,
        plotName: activityData.plotName,
        type: activityData.type,
        timestamp: activityData.timestamp,
        details: activityData.details,
        photoUrl: photoUrl,
    };
    const updatedActivities = [...activities, newActivity];
    saveToStorage(LOCAL_STORAGE_KEYS.ACTIVITIES, updatedActivities);
    return simulateRequest(newActivity);
}

export const addNote = async (noteData: Omit<ConsultantNote, 'id'>): Promise<ConsultantNote> => {
    const notes = loadFromStorage<ConsultantNote[]>(LOCAL_STORAGE_KEYS.NOTES, []);
    const newNote: ConsultantNote = {
        ...noteData,
        id: `note-${Date.now()}`,
    };
    const updatedNotes = [newNote, ...notes];
    saveToStorage(LOCAL_STORAGE_KEYS.NOTES, updatedNotes);
    return simulateRequest(newNote);
};

export const addDailyPlotLog = async (
    farmId: string, 
    plotId: string, 
    logData: { photoFiles: File[], farmerNotes?: string, aiAnalysis?: AIImageAnalysis }, 
    farmerId: string
): Promise<DailyPlotLog> => {
    
    // Step 1: Upload all images and get their URLs
    const uploadPromises = logData.photoFiles.map(file => uploadImage(file));
    const uploadedPhotoUrls = await Promise.all(uploadPromises);

    // Step 2: Create the final DailyPlotLog object with the real URLs
    const newDailyLog: DailyPlotLog = {
        id: `dailylog-${Date.now()}`,
        plotId: plotId,
        date: new Date().toISOString(),
        photoUrls: uploadedPhotoUrls,
        farmerNotes: logData.farmerNotes,
        aiAnalysis: logData.aiAnalysis,
    };

    // Step 3: Save the new log to the correct plot in our data store
    const farmers = loadFromStorage<Farmer[]>(LOCAL_STORAGE_KEYS.FARMERS, []);
    const updatedFarmers = farmers.map(farmer => {
      if (farmer.id === farmerId) {
        return {
          ...farmer,
          farms: farmer.farms.map(f => {
            if (f.id === farmId) {
              return {
                ...f,
                plots: f.plots.map(p => {
                  if (p.id === plotId) {
                    return { ...p, dailyLogs: [...(p.dailyLogs || []), newDailyLog] };
                  }
                  return p;
                })
              };
            }
            return f;
          })
        };
      }
      return farmer;
    });
    saveToStorage(LOCAL_STORAGE_KEYS.FARMERS, updatedFarmers);
    return simulateRequest(newDailyLog);
}