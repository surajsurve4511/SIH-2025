



interface Translations {
  [key: string]: any;
}

const en: Translations = {
  app: {
    loading: "Loading Smart Farm...",
  },
  login: {
    welcome: "Welcome to AgriSmart",
    tagline: "Your AI-Powered Farm Management Hub",
    selectProfile: "Select Your Profile",
    loginButton: "Login",
    noProfiles: "No farmer profiles available",
    selectFarmerAlert: "Please select a farmer to log in."
  },
  dashboard: {
    title: "Dashboard",
    tagline: "Manage farms, plots, and activities.",
    overviewFor: "{{name}}'s Dashboard",
    farmers: "FARMERS",
    logout: "Logout",
    selectFarmer: "Select a farmer to view their dashboard.",
    loading: "Loading farmer data...",
    noPlots: "No plots added to this farm yet.",
    loadingMap: "Loading Map API...",
    weatherForecast: "Weather Forecast for {{location}}",
    farmsAndPlots: "Farms & Plots",
    mapView: "Farm Map View",
    addFarm: "Add Farm",
    activityFeed: "Activity & Notes Feed",
    nav: {
      dashboard: "Dashboard",
      plots: "Farms & Plots",
      map: "Map View",
      feed: "Activity Feed",
      assistant: "AI Assistant"
    },
    statCards: {
      totalFarms: "Total Farms",
      totalPlots: "Total Plots",
      recentActivities: "Activities (Last 7 Days)"
    },
    suggestions: {
        title: "Personalized Suggestions",
        weather: "Rain is forecast for {{location}}. Check your irrigation schedule and ensure proper drainage.",
        plotHealth: "The health of '{{plotName}}' needs monitoring. Consider uploading a recent photo to the AI Assistant for analysis.",
        logActivity: "It has been over a week since the last activity was logged for '{{plotName}}'. Consider adding a note or a photo log."
    },
    market: {
        title: "Market Watch",
        crop: "Market for {{cropName}}",
        currentPrice: "Current Price",
        priceUnit: "quintal",
        forecast: "5-Day Trend",
        summary: "Market Summary"
    },
    yield: {
        title: "Yield Forecast",
        crop: "Forecast for {{cropName}}",
        predictedYield: "Predicted Yield",
        confidence: "Confidence",
        factors: "Key Factors"
    }
  },
  assistant: {
    title: "AI Assistant",
    description: "Chat with your personal farming expert. Ask questions about your crops, upload photos for analysis, or get advice on market trends.",
    placeholder: "Type your message or upload an image...",
    send: "Send",
    compressing: "Compressing image...",
    analyzing: "AI is thinking...",
    welcome: "Hello! I'm AgriSmart, your AI farming assistant. How can I help you today? You can ask me about crop diseases, get fertilizer recommendations, or inquire about market prices.",
    imageUploaded: "Image selected. Add a question or send for analysis.",
    compressError: "Failed to process image.",
    notInitialized: "AI Service not initialized. API_KEY might be missing or invalid.",
    defaultImagePrompt: "Please analyze this image of my crop and provide a detailed assessment of its health, including any potential diseases, pests, or nutrient deficiencies you observe. Suggest actionable steps I can take.",
    systemPrompt: "You are AgriSmart, an expert AI agronomist and farming assistant. Your goal is to help farmers. The current farmer is located in {{location}}, has a farm of {{farmSize}} hectares, and primarily grows {{crops}}. Be concise, clear, and provide actionable advice. If you analyze an image, describe what you see before providing your diagnosis or advice.",
    contextualSystemPrompt: "You are AgriSmart, an expert AI agronomist. The farmer is asking about a specific context: Farm '{{farmName}}', Plot '{{plotName}}'. Use this information to give a highly relevant and specific response. The farmer is located in {{location}} and mainly grows {{crops}}. Be concise and provide actionable advice.",
    errorResponse: "Sorry, I encountered an error and couldn't process your request:",
    selectFarm: "Select a Farm for Context",
    selectPlot: "Select a Plot for Context",
    allPlots: "All Plots",
    capabilities: {
      title: "What I can help with:",
      features: [
        "Real-time Crop Recommendations",
        "Pest & Disease Detection from Images",
        "Soil Health & Fertilizer Management",
        "Weather-based Irrigation Advice",
        "Crop Yield Prediction & Optimization",
        "Live Market Price Tracking & Analysis"
      ]
    }
  },
  modals: {
      addFarm: {
          title: "Add New Farm"
      }
  },
  forms: {
      labels: {
          farmName: "Farm Name",
          area: "Area (Hectares)",
          location: "Location Address"
      },
      buttons: {
          cancel: "Cancel",
          addFarm: "Add Farm",
          adding: "Adding..."
      },
      errors: {
          farmNameRequired: "Farm name is required.",
          areaPositive: "Area must be a positive number.",
          locationRequired: "Location address is required."
      }
  },
  notifications: {
      farmAdded: "Farm '{{name}}' added successfully!",
      farmAddFailed: "Failed to add the farm. Please try again.",
      weatherError: "Could not retrieve weather information.",
      marketError: "Could not retrieve market price data.",
      yieldError: "Could not generate yield prediction."
  }
};

const hi: Translations = {
  app: {
    loading: "स्मार्ट फार्म लोड हो रहा है...",
  },
  login: {
    welcome: "एग्रीस्मार्ट में आपका स्वागत है",
    tagline: "आपका एआई-संचालित कृषि प्रबंधन हब",
    selectProfile: "अपनी प्रोफ़ाइल चुनें",
    loginButton: "लॉग इन करें",
    noProfiles: "कोई किसान प्रोफ़ाइल उपलब्ध नहीं है",
    selectFarmerAlert: "लॉग इन करने के लिए कृपया एक किसान का चयन करें।"
  },
  dashboard: {
    title: "डैशबोर्ड",
    tagline: "खेतों, भूखंडों और गतिविधियों का प्रबंधन करें।",
    overviewFor: "{{name}} का डैशबोर्ड",
    farmers: "किसान",
    logout: "लॉग आउट",
    selectFarmer: "उनका डैशबोर्ड देखने के लिए एक किसान का चयन करें।",
    loading: "किसान डेटा लोड हो रहा है...",
    noPlots: "इस खेत में अभी तक कोई भूखंड नहीं जोड़ा गया है।",
    loadingMap: "मानचित्र एपीआई लोड हो रहा है...",
    weatherForecast: "{{location}} के लिए मौसम का पूर्वानुमान",
    farmsAndPlots: "खेत और भूखंड",
    mapView: "खेत का नक्शा",
    addFarm: "खेत जोड़ें",
    activityFeed: "गतिविधि और नोट्स फ़ीड",
    nav: {
      dashboard: "डैशबोर्ड",
      plots: "खेत और भूखंड",
      map: "नक्शा",
      feed: "गतिविधि फ़ीड",
      assistant: "एआई सहायक"
    },
    statCards: {
        totalFarms: "कुल खेत",
        totalPlots: "कुल भूखंड",
        recentActivities: "गतिविधियाँ (पिछले 7 दिन)"
    },
    suggestions: {
        title: "व्यक्तिगत सुझाव",
        weather: "{{location}} के लिए बारिश का पूर्वानुमान है। अपनी सिंचाई अनुसूची की जाँच करें और उचित जल निकासी सुनिश्चित करें।",
        plotHealth: "'{{plotName}}' के स्वास्थ्य की निगरानी की आवश्यकता है। विश्लेषण के लिए एआई सहायक को हाल की एक तस्वीर अपलोड करने पर विचार करें।",
        logActivity: "'{{plotName}}' के लिए अंतिम गतिविधि लॉग किए हुए एक सप्ताह से अधिक हो गया है। एक नोट या फोटो लॉग जोड़ने पर विचार करें।"
    },
    market: {
        title: "बाजार की जानकारी",
        crop: "{{cropName}} के लिए बाजार",
        currentPrice: "वर्तमान मूल्य",
        priceUnit: "क्विंटल",
        forecast: "5-दिन की प्रवृत्ति",
        summary: "बाजार सारांश"
    },
    yield: {
        title: "उपज का पूर्वानुमान",
        crop: "{{cropName}} के लिए पूर्वानुमान",
        predictedYield: "अनुमानित उपज",
        confidence: "आत्मविश्वास",
        factors: "मुख्य कारक"
    }
  },
  assistant: {
    title: "एआई सहायक",
    description: "अपने व्यक्तिगत कृषि विशेषज्ञ से चैट करें। अपनी फसलों के बारे में प्रश्न पूछें, विश्लेषण के लिए तस्वीरें अपलोड करें, या बाजार के रुझानों पर सलाह लें।",
    placeholder: "अपना संदेश लिखें या एक छवि अपलोड करें...",
    send: "भेजें",
    compressing: "छवि को कंप्रेस किया जा रहा है...",
    analyzing: "एआई सोच रहा है...",
    welcome: "नमस्ते! मैं एग्रीस्मार्ट हूं, आपका एआई कृषि सहायक। मैं आज आपकी कैसे मदद कर सकता हूं? आप मुझसे फसल रोगों के बारे में पूछ सकते हैं, उर्वरक सिफारिशें प्राप्त कर सकते हैं, या बाजार की कीमतों के बारे में पूछताछ कर सकते हैं।",
    imageUploaded: "छवि चुन ली गई है। कोई प्रश्न जोड़ें या विश्लेषण के लिए भेजें।",
    compressError: "छवि को संसाधित करने में विफल।",
    notInitialized: "एआई सेवा शुरू नहीं हुई है। एपीआई कुंजी गायब या अमान्य हो सकती है।",
    defaultImagePrompt: "कृपया मेरी फसल की इस छवि का विश्लेषण करें और इसके स्वास्थ्य का विस्तृत मूल्यांकन प्रदान करें, जिसमें आपके द्वारा देखे गए किसी भी संभावित रोग, कीट, या पोषक तत्वों की कमी शामिल है। कार्रवाई योग्य कदम सुझाएं जो मैं उठा सकता हूं।",
    systemPrompt: "आप एग्रीस्मार्ट हैं, एक विशेषज्ञ एआई कृषि विज्ञानी और कृषि सहायक। आपका लक्ष्य किसानों की मदद करना है। वर्तमान किसान {{location}} में स्थित है, उसके पास {{farmSize}} हेक्टेयर का खेत है, और मुख्य रूप से {{crops}} उगाता है। संक्षिप्त, स्पष्ट रहें और कार्रवाई योग्य सलाह प्रदान करें। यदि आप किसी छवि का विश्लेषण करते हैं, तो अपना निदान या सलाह देने से पहले बताएं कि आप क्या देखते हैं।",
    contextualSystemPrompt: "आप एग्रीस्मार्ट हैं, एक विशेषज्ञ एआई कृषि विज्ञानी। किसान एक विशिष्ट संदर्भ के बारे में पूछ रहा है: खेत '{{farmName}}', भूखंड '{{plotName}}'। अत्यधिक प्रासंगिक और विशिष्ट प्रतिक्रिया देने के लिए इस जानकारी का उपयोग करें। किसान {{location}} में स्थित है और मुख्य रूप से {{crops}} उगाता है। संक्षिप्त रहें और कार्रवाई योग्य सलाह प्रदान करें।",
    errorResponse: "क्षमा करें, मुझे एक त्रुटि का सामना करना पड़ा और मैं आपके अनुरोध को संसाधित नहीं कर सका:",
    selectFarm: "संदर्भ के लिए एक खेत चुनें",
    selectPlot: "संदर्भ के लिए एक भूखंड चुनें",
    allPlots: "सभी भूखंड",
    capabilities: {
      title: "मैं किसमें मदद कर सकता हूँ:",
      features: [
        "वास्तविक समय फसल सिफारिशें",
        "छवियों से कीट और रोग का पता लगाना",
        "मृदा स्वास्थ्य और उर्वरक प्रबंधन",
        "मौसम आधारित सिंचाई सलाह",
        "फसल उपज भविष्यवाणी और अनुकूलन",
        "लाइव बाजार मूल्य ट्रैकिंग और विश्लेषण"
      ]
    }
  },
  modals: {
      addFarm: {
          title: "नया खेत जोड़ें"
      }
  },
  forms: {
      labels: {
          farmName: "खेत का नाम",
          area: "क्षेत्र (हेक्टेयर)",
          location: "स्थान का पता"
      },
      buttons: {
          cancel: "रद्द करें",
          addFarm: "खेत जोड़ें",
          adding: "जोड़ा जा रहा है..."
      },
      errors: {
          farmNameRequired: "खेत का नाम आवश्यक है।",
          areaPositive: "क्षेत्र एक सकारात्मक संख्या होनी चाहिए।",
          locationRequired: "स्थान का पता आवश्यक है।"
      }
  },
  notifications: {
      farmAdded: "खेत '{{name}}' सफलतापूर्वक जोड़ा गया!",
      farmAddFailed: "खेत जोड़ने में विफल। कृपया पुन: प्रयास करें।",
      weatherError: "मौसम की जानकारी प्राप्त नहीं हो सकी।",
      marketError: "बाजार मूल्य डेटा प्राप्त नहीं हो सका।",
      yieldError: "उपज का पूर्वानुमान उत्पन्न नहीं हो सका।"
  }
};

export const translations: { [key: string]: Translations } = {
  en,
  hi,
};