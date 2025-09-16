

import { Farmer, Activity, Plot, ActivityType, Farm, FarmingExperience, DailyPlotLog, ConsultantNote } from './types';

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(today.getDate() - 2);
const threeDaysAgo = new Date(today);
threeDaysAgo.setDate(today.getDate() - 3);

const MOCK_PLOTS_FARM_1: Plot[] = [
  { 
    id: 'plot-1-1', 
    farmId: 'farm-1',
    name: 'North Field', 
    crop: 'Corn', 
    soilType: 'Loam',
    cropInfo: { 
      variety: 'Golden Bantam', 
      plantingDate: threeDaysAgo.toISOString(), 
      healthStatus: 'Good',
      growthStage: 'Vegetative',
    },
    dailyLogs: [] as DailyPlotLog[],
    polygon: [
      { lat: 34.056, lng: -118.245 },
      { lat: 34.058, lng: -118.245 },
      { lat: 34.058, lng: -118.242 },
      { lat: 34.056, lng: -118.242 },
    ]
  },
  { 
    id: 'plot-1-2', 
    farmId: 'farm-1',
    name: 'South Field', 
    crop: 'Wheat',
    soilType: 'Clay Loam',
    cropInfo: {
      variety: 'Winter Red',
      plantingDate: new Date(today.getFullYear(), today.getMonth() - 2, 15).toISOString(), 
      healthStatus: 'Needs Monitoring',
      growthStage: 'Tillering',
    },
    dailyLogs: [] as DailyPlotLog[],
    polygon: [
      { lat: 34.053, lng: -118.245 },
      { lat: 34.055, lng: -118.245 },
      { lat: 34.055, lng: -118.242 },
      { lat: 34.053, lng: -118.242 },
    ]
  },
];

const MOCK_PLOTS_FARM_2_1: Plot[] = [
  { 
    id: 'plot-2-1', 
    farmId: 'farm-2-1',
    name: 'West Plot A', 
    crop: 'Soybeans',
    soilType: 'Silty Clay',
    cropInfo: {
      variety: 'Roundup Ready Flex',
      plantingDate: new Date(today.getFullYear(), today.getMonth() - 1, 5).toISOString(),
      healthStatus: 'Excellent',
      growthStage: 'Flowering'
    },
    dailyLogs: [] as DailyPlotLog[],
    polygon: [
        { lat: 30.271, lng: -97.746 },
        { lat: 30.273, lng: -97.746 },
        { lat: 30.273, lng: -97.743 },
        { lat: 30.271, lng: -97.743 },
    ]
  },
  { 
    id: 'plot-2-2', 
    farmId: 'farm-2-1',
    name: 'East Plot B', 
    crop: 'Cotton',
    soilType: 'Sandy Loam',
    cropInfo: {
      variety: 'Deltaapine',
      plantingDate: new Date(today.getFullYear(), today.getMonth() - 1, 20).toISOString(),
      healthStatus: 'Fair - some pest activity noted',
      growthStage: 'Boll Development'
    },
    dailyLogs: [] as DailyPlotLog[],
  },
];

const MOCK_PLOTS_FARM_2_2: Plot[] = [
 {
    id: 'plot-2-3',
    farmId: 'farm-2-2',
    name: 'Central Orchard',
    crop: 'Apples',
    soilType: 'Loam',
    cropInfo: {
        variety: 'Honeycrisp',
        plantingDate: new Date(today.getFullYear() - 3, 3, 10).toISOString(), 
        healthStatus: 'Good, pruning due',
        growthStage: 'Fruiting'
    },
    dailyLogs: [] as DailyPlotLog[],
  }
];


const MOCK_FARMS_FARMER_1: Farm[] = [
  {
    id: 'farm-1',
    farmerId: 'farmer-1',
    name: 'Doe Family Farm',
    areaHectares: 50,
    locationAddress: '123 Green Valley Rd, CA',
    locationCoords: { lat: 34.0522, lng: -118.2437 },
    plots: MOCK_PLOTS_FARM_1,
  }
];

const MOCK_FARMS_FARMER_2: Farm[] = [
  {
    id: 'farm-2-1',
    farmerId: 'farmer-2',
    name: 'Smith Agriculture Holdings',
    areaHectares: 100,
    locationAddress: '456 Sunny Meadows Ln, TX',
    locationCoords: { lat: 30.2672, lng: -97.7431 },
    plots: MOCK_PLOTS_FARM_2_1,
  },
  {
    id: 'farm-2-2',
    farmerId: 'farmer-2',
    name: 'Smith Orchard Extension',
    areaHectares: 20,
    locationAddress: '789 Orchard Dr, TX',
    locationCoords: { lat: 30.28, lng: -97.76 },
    plots: MOCK_PLOTS_FARM_2_2,
  }
];

export const MOCK_FARMERS: Farmer[] = [
  {
    id: 'farmer-1',
    name: 'John Doe',
    location: 'Green Valley, CA',
    email: 'john.doe@example.com',
    farmingExperience: {
      years: 15,
      cropsGrown: ['Corn', 'Wheat', 'Alfalfa'],
      farmSizeHectares: 50,
      farmingType: 'Conventional',
    },
    farms: MOCK_FARMS_FARMER_1,
  },
  {
    id: 'farmer-2',
    name: 'Jane Smith',
    location: 'Sunny Meadows, TX',
    email: 'jane.smith@example.com',
    farmingExperience: {
      years: 20,
      cropsGrown: ['Soybeans', 'Cotton', 'Apples', 'Peaches'],
      farmSizeHectares: 120,
      farmingType: 'Integrated Pest Management',
    },
    farms: MOCK_FARMS_FARMER_2,
  },
  {
    id: 'farmer-3',
    name: 'Baba Yaga',
    location: 'Misty Forests, OR',
    email: 'b.yaga@magicfarm.org',
    farmingExperience: {
      years: 100, 
      cropsGrown: ['Special Herbs', 'Enchanted Mushrooms', 'Moonpetal Flowers'],
      farmSizeHectares: 15,
      farmingType: 'Mystical Agriculture',
    },
    farms: [
      {
        id: 'farm-3',
        farmerId: 'farmer-3',
        name: 'Whispering Woods Farm',
        areaHectares: 15,
        locationAddress: 'Deep in the Misty Forest, OR',
        locationCoords: { lat: 45.5231, lng: -122.6765 },
        plots: [
          { 
            id: 'plot-3-1', 
            farmId: 'farm-3',
            name: 'Moonlit Patch', 
            crop: 'Special Herbs',
            soilType: 'Rich Dark Earth',
            cropInfo: {
              variety: 'Nightshade Elixir',
              plantingDate: new Date(today.getFullYear(), 0, 1).toISOString(),
              healthStatus: 'Vibrant',
              growthStage: 'Perpetual Bloom'
            },
            dailyLogs: [] as DailyPlotLog[],
          },
        ],
      }
    ],
  },
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'activity-1',
    farmerId: 'farmer-1',
    farmerName: 'John Doe',
    farmId: 'farm-1',
    farmName: 'Doe Family Farm',
    plotId: 'plot-1-1',
    plotName: 'North Field',
    type: ActivityType.SOWED,
    timestamp: twoDaysAgo.toISOString(),
    details: 'Sowed Golden Bantam corn seeds using precision planter.',
  },
  {
    id: 'activity-2',
    farmerId: 'farmer-1',
    farmerName: 'John Doe',
    farmId: 'farm-1',
    farmName: 'Doe Family Farm',
    plotId: 'plot-1-2',
    plotName: 'South Field',
    type: ActivityType.SPRAYED,
    timestamp: yesterday.toISOString(),
    details: 'Sprayed PestAway X2 on wheat crop for aphid control. Applied at recommended dosage.',
    photoUrl: 'https://picsum.photos/seed/pest/300/200',
  },
  {
    id: 'activity-3',
    farmerId: 'farmer-2',
    farmerName: 'Jane Smith',
    farmId: 'farm-2-1',
    farmName: 'Smith Agriculture Holdings',
    plotId: 'plot-2-1',
    plotName: 'West Plot A',
    type: ActivityType.IRRIGATED,
    timestamp: today.toISOString(),
    details: 'Irrigated for 2 hours using drip system. Soil moisture at 60% post-irrigation.',
  },
  {
    id: 'activity-4',
    farmerId: 'farmer-2',
    farmerName: 'Jane Smith',
    farmId: 'farm-2-1',
    farmName: 'Smith Agriculture Holdings',
    plotId: 'plot-2-2',
    plotName: 'East Plot B',
    type: ActivityType.PHOTO_LOG, // This can be a manual photo log
    timestamp: yesterday.toISOString(),
    details: 'Checked cotton bolls development. Looking good. Minor leaf spots observed on 5% of plants.',
    photoUrl: 'https://picsum.photos/seed/cotton/300/200',
  },
   {
    id: 'activity-5',
    farmerId: 'farmer-1',
    farmerName: 'John Doe',
    farmId: 'farm-1',
    farmName: 'Doe Family Farm',
    plotId: 'plot-1-1',
    plotName: 'North Field',
    type: ActivityType.PHOTO_LOG,
    timestamp: today.toISOString(),
    details: 'Strange yellow spots on lower corn leaves, uploading for general AI analysis (using the simpler AI query).',
    photoUrl: 'https://picsum.photos/seed/corndisease/300/200',
  },
  {
    id: 'activity-6',
    farmerId: 'farmer-2',
    farmerName: 'Jane Smith',
    farmId: 'farm-2-2',
    farmName: 'Smith Orchard Extension',
    plotId: 'plot-2-3',
    plotName: 'Central Orchard',
    type: ActivityType.FERTILIZED,
    timestamp: threeDaysAgo.toISOString(),
    details: 'Applied organic compost blend around apple trees.',
  },
   {
    id: 'activity-7',
    farmerId: 'farmer-3',
    farmerName: 'Baba Yaga',
    farmId: 'farm-3',
    farmName: 'Whispering Woods Farm',
    plotId: 'plot-3-1',
    plotName: 'Moonlit Patch',
    type: ActivityType.HARVESTED,
    timestamp: yesterday.toISOString(),
    details: 'Harvested Nightshade Elixir under the full moon. Yield was potent.',
  },
];

export const MOCK_NOTES: ConsultantNote[] = [
  {
    id: 'note-1',
    farmerId: 'farmer-1',
    timestamp: yesterday.toISOString(),
    text: 'Farmer John Doe is concerned about the yellow spots on his corn. Recommended a soil test to check for nitrogen deficiency.'
  },
  {
    id: 'note-2',
    farmerId: 'farmer-2',
    timestamp: twoDaysAgo.toISOString(),
    text: 'Jane Smith reports good progress with pest management on her cotton. No major issues observed during the last visit.'
  }
];