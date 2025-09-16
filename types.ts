

export enum ActivityType {
  SOWED = 'Sowed',
  SPRAYED = 'Sprayed',
  IRRIGATED = 'Irrigated',
  PHOTO_LOG = 'Photo Log', // This might be used for general manual photo logs
  FERTILIZED = 'Fertilized',
  HARVESTED = 'Harvested',
  GENERAL_NOTE = 'General Note', 
}

export interface FarmingExperience {
  years: number;
  cropsGrown: string[];
  farmSizeHectares: number;
  farmingType: string; 
}

export interface PlotCropInfo {
  variety: string; 
  plantingDate: string; 
  expectedHarvestDate?: string; 
  healthStatus: string; 
  growthStage?: string; 
}

// --- New AI Analysis related types for Daily Plot Log ---
export interface AIFindings {
  disease?: string;
  pests?: string;
  nutrients?: string;
}

export interface AIImageAnalysis {
  description?: string;
  growthStage?: string;
  health?: string;
  findings?: AIFindings;
  summary?: string;
  error?: string; // To store any error messages during AI processing
}

export interface DailyPlotLog {
  id: string;
  plotId: string; // Link back to the plot
  date: string; // ISO date string of the log
  photoUrls: string[]; // Array of Cloud Storage URLs for the photos
  farmerNotes?: string; // Optional notes from the farmer
  aiAnalysis?: AIImageAnalysis; // Structured analysis from AI (applied to the primary image)
  aiAnalysisError?: string; // If AI processing failed for this log
}

export interface Plot {
  id: string;
  farmId: string; 
  name: string;
  crop: string; 
  soilType?: string; 
  cropInfo?: PlotCropInfo;
  dailyLogs: DailyPlotLog[];
  polygon?: { lat: number; lng: number; }[]; // For Google Maps drawing
}

export interface Farm {
  id: string;
  farmerId: string;
  name: string;
  areaHectares: number;
  locationAddress: string;
  locationCoords?: { lat: number; lng: number; }; // For Google Maps centering
  plots: Plot[];
}

export interface Farmer {
  id: string;
  name: string;
  location: string; 
  email?: string;
  farmingExperience: FarmingExperience;
  farms: Farm[]; 
}

// Fix: Add ConsultantNote type to resolve import errors.
export interface ConsultantNote {
  id: string;
  farmerId: string;
  timestamp: string;
  text: string;
}

// Existing Activity type for manual, non-daily-image logs
export interface Activity {
  id: string;
  farmerId: string;
  farmerName: string; 
  farmId: string; 
  farmName: string; 
  plotId: string;
  plotName: string; 
  type: ActivityType;
  timestamp: string; 
  details: string;
  photoUrl?: string; // For single photo in manual activity (Cloud Storage URL)
}

export interface AIResponse {
  text: string;
  isLoading: boolean;
  error?: string | null;
}

// UI Notification
export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
}

export interface NotificationMessage {
  id: string;
  message: string;
  type: NotificationType;
}

// Weather Types
export interface CurrentWeather {
  temperature: number;
  condition: string;
  windSpeed: number;
  humidity: number;
}

export interface ForecastDay {
  day: string;
  condition: string;
  high: number;
  low: number;
}

export interface WeatherData {
  current: CurrentWeather;
  forecast: ForecastDay[];
}

// AI Crop Recommendation Types
export interface CropRecommendation {
  cropName: string;
  reasoning: string;
  estimatedProfitability: string; // e.g., "High", "Medium", "Low"
  suitableSeason: string;
}

// Market Intelligence Data
export interface MarketData {
  cropName: string;
  currentPrice: {
    price: number;
    unit: string; // e.g., "per quintal"
  };
  forecast: {
    day: string;
    trend: string; // e.g., "Stable", "Slight Increase"
  }[];
  summary: string;
}

// Yield Prediction Data
export interface YieldPredictionData {
  cropName: string;
  predictedYield: string; // e.g., "5-6 tons/hectare"
  confidence: 'High' | 'Medium' | 'Low';
  factors: string[];
}