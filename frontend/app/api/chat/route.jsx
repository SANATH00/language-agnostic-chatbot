// Import NextResponse to send API responses in Next.js
import { NextResponse } from 'next/server';

// Predefined chatbot responses categorized by topics
const RESPONSES = {

  // Fee-related responses in multiple languages
  fee: {
    English: "The fee deadline is March 20. Please check the official portal.",
    Hindi: "फीस जमा करने की अंतिम तिथि 20 मार्च है। कृपया आधिकारिक पोर्टल देखें।",
    Kannada: "ಶುಲ್ಕ ಪಾವತಿಯ ಕೊನೆಯ ದಿನಾಂಕ ಮಾರ್ಚ್ 20. ದಯವಿಟ್ಟು ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಪರಿಶೀಲಿಸಿ.",
    Tamil: "கட்டண காலக்கெடு மார்ச் 20. அதிகாரப்பூர்வ போர்டலை சரிபார்க்கவும்.",
    Telugu: "ఫీజు చెల్లింపు గడువు మార్చి 20. దయచేసి అధికారిక పోర్టల్ తనిఖీ చేయండి.",
    Marathi: "शुल्क भरण्याची शेवटची तारीख २० मार्च आहे. कृपया अधिकृत पोर्टल पहा.",
    Bengali: "ফি জমার শেষ তারিখ ২০ মার্চ। অনুগ্রহ করে অফিসিয়াল পোর্টাল দেখুন।",
    Gujarati: "ફી ભરવાની છેલ્લી તારીખ 20 માર્ચ છે. કૃપા કરીને સત્તાવાર પોર્ટલ જુઓ.",
    Malayalam: "ഫീസ് അടയ്ക്കുന്നതിനുള്ള അവസാന തീയതി മാർച്ച് 20 ആണ്. ഔദ്യോഗിക പോർട്ടൽ പരിശോധിക്കുക.",
    Punjabi: "ਫੀਸ ਜਮ੍ਹਾ ਕਰਨ ਦੀ ਆਖਰੀ ਮਿਤੀ 20 ਮਾਰਚ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਅਧਿਕਾਰਤ ਪੋਰਟਲ ਵੇਖੋ।",
    Odia: "ଫି ଜମା କରିବାର ଶେଷ ତାରିଖ ମାର୍ଚ୍ଚ ୨୦। ଦୟାକରି ଅଧିକୃତ ପୋର୍ଟାଲ ଦେଖନ୍ତୁ।",
  },

  // Exam-related responses
  exam: {
    English: "Exam timetables will be released soon. Check the notice board.",
    Hindi: "परीक्षा समय-सारणी जल्द जारी होगी। सूचना पट्ट देखें।",
    Kannada: "ಪರೀಕ್ಷೆಯ ವೇಳಾಪಟ್ಟಿ ಶೀಘ್ರದಲ್ಲೇ ಬಿಡುಗಡೆಯಾಗುತ್ತದೆ. ಸೂಚನಾ ಫಲಕ ನೋಡಿ.",
    Tamil: "தேர்வு அட்டவணை விரைவில் வெளியிடப்படும். அறிவிப்பு பலகையை சரிபார்க்கவும்.",
    Telugu: "పరీక్ష సమయపట్టిక త్వరలో విడుదలవుతుంది. నోటీసు బోర్డు తనిఖీ చేయండి.",
    Marathi: "परीक्षेचे वेळापत्रक लवकरच जाहीर होईल. सूचना फलक पहा.",
    Bengali: "পরীক্ষার সময়সূচী শীঘ্রই প্রকাশিত হবে। নোটিশ বোর্ড দেখুন।",
    Gujarati: "પરીક્ષાનું સમયપત્રક જલ્દી બહાર પડશે. નોટિસ બોર્ડ તપાસો.",
    Malayalam: "പരീക്ഷ ടൈംടേബിൾ ഉടൻ പ്രസിദ്ധീകരിക്കും. നോട്ടീസ് ബോർഡ് പരിശോധിക്കുക.",
    Punjabi: "ਪ੍ਰੀਖਿਆ ਦਾ ਸਮਾਂ-ਸਾਰਣੀ ਜਲਦੀ ਜਾਰੀ ਹੋਵੇਗੀ। ਨੋਟਿਸ ਬੋਰਡ ਦੇਖੋ।",
    Odia: "ପରୀକ୍ଷା ସମୟସୂଚୀ ଶୀଘ୍ର ପ୍ରକାଶ ପାଇବ। ନୋଟିସ ବୋର୍ଡ ଦେଖନ୍ତୁ।",
  },

  // Greeting responses
  hello: {
    English: "Hello! How can I help you today?",
    Hindi: "नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?",
    Kannada: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
    Tamil: "வணக்கம்! நான் உங்களுக்கு எப்படி உதவ முடியும்?",
    Telugu: "నమస్కారం! నేను మీకు ఎలా సహాయం చేయగలను?",
    Marathi: "नमस्कार! मी तुमची कशी मदत करू शकतो?",
    Bengali: "হ্যালো! আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
    Gujarati: "નમસ્તે! હું તમારી કેવી રીતે મદદ કરી શકું?",
    Malayalam: "നമസ്കാരം! ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കാം?",
    Punjabi: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
    Odia: "ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?",
  },

  // Scholarship-related responses
  scholarship: {
    English: "Scholarship applications are open. Visit the admin office.",
    Hindi: "छात्रवृत्ति आवेदन खुले हैं। प्रशासन कार्यालय जाएं।",
    Kannada: "ವಿದ್ಯಾರ್ಥಿವೇತನ ಅರ್ಜಿಗಳು ತೆರೆದಿವೆ. ಆಡಳಿತ ಕಚೇರಿಗೆ ಭೇಟಿ ನೀಡಿ.",
    Tamil: "உதவித்தொகை விண்ணப்பங்கள் திறந்துள்ளன. நிர்வாக அலுவலகத்தை சந்திக்கவும்.",
    Telugu: "స్కాలర్‌షిప్ దరఖాస్తులు తెరిచి ఉన్నాయి. పరిపాలన కార్యాలయాన్ని సందర్శించండి.",
    Marathi: "शिष्यवृत्ती अर्ज सुरू आहेत. प्रशासन कार्यालयास भेट द्या.",
    Bengali: "বৃত্তির আবেদন খোলা আছে। প্রশাসন অফিস পরিদর্শন করুন।",
    Gujarati: "શિષ્યવૃત્તિ અરજીઓ ખુલ્લી છે. વહીવટ કાર્યાલયની મુલાકાત લો.",
    Malayalam: "സ്കോളർഷിപ്പ് അപേക്ഷകൾ തുറന്നിരിക്കുന്നു. അഡ്മിൻ ഓഫീസ് സന്ദർശിക്കുക.",
    Punjabi: "ਸਕਾਲਰਸ਼ਿਪ ਅਰਜ਼ੀਆਂ ਖੁੱਲ੍ਹੀਆਂ ਹਨ। ਪ੍ਰਸ਼ਾਸਨ ਦਫ਼ਤਰ ਜਾਓ।",
    Odia: "ବୃତ୍ତି ଆବେଦନ ଖୋଲା ଅଛି। ପ୍ରଶାସନ କାର୍ଯ୍ୟାଳୟ ପରିଦର୍ଶନ କରନ୍ତୁ।",
  },

  // Library-related responses
  library: {
    English: "Library is open from 9am to 6pm on weekdays.",
    Hindi: "पुस्तकालय सोमवार से शुक्रवार सुबह 9 से शाम 6 बजे तक खुला है।",
    Kannada: "ಗ್ರಂಥಾಲಯ ವಾರದ ದಿನಗಳಲ್ಲಿ ಬೆಳಿಗ್ಗೆ 9 ರಿಂದ ಸಂಜೆ 6 ರವರೆಗೆ ತೆರೆದಿರುತ್ತದೆ.",
    Tamil: "நூலகம் வார நாட்களில் காலை 9 முதல் மாலை 6 வரை திறந்திருக்கும்.",
    Telugu: "లైబ్రరీ వారపు రోజులలో ఉదయం 9 నుండి సాయంత్రం 6 వరకు తెరిచి ఉంటుంది.",
    Marathi: "ग्रंथालय आठवड्याच्या दिवसांमध्ये सकाळी 9 ते संध्याकाळी 6 वाजेपर्यंत उघडे असते.",
    Bengali: "লাইব্রেরি সপ্তাহের দিনগুলিতে সকাল ৯টা থেকে সন্ধ্যা ৬টা পর্যন্ত খোলা থাকে।",
    Gujarati: "પુસ્તકાલય અઠવાડિયાના દિવસોમાં સવારે 9 થી સાંજે 6 સુધી ખુલ્લું રહે છે.",
    Malayalam: "ലൈബ്രറി പ്രവൃത്തിദിവസങ്ങളിൽ രാവിലെ 9 മുതൽ വൈകിട്ട് 6 വരെ തുറന്നിരിക്കും.",
    Punjabi: "ਲਾਇਬ੍ਰੇਰੀ ਹਫ਼ਤੇ ਦੇ ਦਿਨਾਂ ਵਿੱਚ ਸਵੇਰੇ 9 ਤੋਂ ਸ਼ਾਮ 6 ਵਜੇ ਤੱਕ ਖੁੱਲ੍ਹੀ ਰਹਿੰਦੀ ਹੈ।",
    Odia: "ଲାଇବ୍ରେରୀ ସପ୍ତାହ ଦିନଗୁଡ଼ିକରେ ସକାଳ 9 ରୁ ସନ୍ଧ୍ୟା 6 ପର୍ଯ୍ୟନ୍ତ ଖୋଲା ଥାଏ।",
  },

  // Hostel-related responses
  hostel: {
    English: "For hostel queries, contact the warden office.",
    Hindi: "छात्रावास संबंधित प्रश्नों के लिए वार्डन कार्यालय से संपर्क करें।",
    Kannada: "ಹಾಸ್ಟೆಲ್ ಪ್ರಶ್ನೆಗಳಿಗೆ ವಾರ್ಡನ್ ಕಚೇರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.",
    Tamil: "விடுதி கேள்விகளுக்கு வார்டன் அலுவலகத்தை தொடர்பு கொள்ளவும்.",
    Telugu: "హాస్టల్ విచారణలకు వార్డెన్ కార్యాలయాన్ని సంప్రదించండి.",
    Marathi: "वसतिगृह विचारणांसाठी वॉर्डन कार्यालयाशी संपर्क करा.",
    Bengali: "হোস্টেল সংক্রান্ত প্রশ্নের জন্য ওয়ার্ডেন অফিসে যোগাযোগ করুন।",
    Gujarati: "હોસ્ટેલ પ્રશ્નો માટે વોર્ડન ઓફિસ સાથે સંપર્ક કરો.",
    Malayalam: "ഹോസ്റ്റൽ ചോദ്യങ്ങൾക്ക് വാർഡൻ ഓഫീസ് ബന്ധപ്പെടുക.",
    Punjabi: "ਹੋਸਟਲ ਸਵਾਲਾਂ ਲਈ ਵਾਰਡਨ ਦਫ਼ਤਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।",
    Odia: "ହଷ୍ଟେଲ ପ୍ରଶ୍ନ ପାଇଁ ୱାର୍ଡେନ କାର୍ଯ୍ୟାଳୟ ସହ ଯୋଗାଯୋଗ କରନ୍ତୁ।",
  },

  // Explanation of how chatbot works
  howwork: {
    English: "I detect your language, understand your intent using NLP, search the knowledge base, and respond in your language.",
    Hindi: "मैं आपकी भाषा पहचानता हूँ, NLP से आशय समझता हूँ, और आपकी भाषा में उत्तर देता हूँ।",
    Kannada: "ನಾನು ನಿಮ್ಮ ಭಾಷೆ ಗುರುತಿಸುತ್ತೇನೆ, NLP ಬಳಸಿ ಉದ್ದೇಶ ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತೇನೆ ಮತ್ತು ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಉತ್ತರಿಸುತ್ತೇನೆ.",
    Tamil: "நான் உங்கள் மொழியை கண்டறிந்து, NLP மூலம் நோக்கத்தை புரிந்து, உங்கள் மொழியில் பதிலளிக்கிறேன்.",
    default: "I detect your language, understand your intent using NLP, search the knowledge base, and respond in your language.",
  },
};

// Function to fetch response based on category and language
function getResponse(category, language) {
  const cat = RESPONSES[category]; // Get category object
  if (!cat) return null; // If category doesn't exist, return null

  // Return response in selected language or fallback options
  return cat[language] || cat.English || cat.default || null;
}

// API POST handler (runs when frontend sends request)
export async function POST(req) {
  try {
    // Extract message and language from request body
    const { message, language } = await req.json();

    const m = (message || "").toLowerCase(); // Convert message to lowercase for matching
    const lang = language || "English"; // Default language is English

    let reply = "";

    // Check keywords in message and assign appropriate response
    if (m.includes("fee")) reply = getResponse("fee", lang);
    else if (m.includes("exam")) reply = getResponse("exam", lang);
    else if (m.includes("scholarship")) reply = getResponse("scholarship", lang);
    else if (m.includes("hello") || m.includes("hi")) reply = getResponse("hello", lang);
    else if (m.includes("library")) reply = getResponse("library", lang);
    else if (m.includes("hostel")) reply = getResponse("hostel", lang);
    else if (m.includes("how") && m.includes("work")) reply = getResponse("howwork", lang);

    // Default reply if no keyword matched
    if (!reply) reply = "Thank you for your query. Please contact the admin office.";

    // Send JSON response back to frontend
    return NextResponse.json({ reply });

  } catch (error) {

    // Handle any errors during processing
    return NextResponse.json({ reply: "Error processing request." });
  }
}