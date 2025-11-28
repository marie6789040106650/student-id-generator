import { GoogleGenAI, Type } from "@google/genai";

// Helper to get AI instance safely
const getAiInstance = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please provide a valid API key.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateStudentProfile = async () => {
  try {
    const ai = getAiInstance();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a realistic fictional student profile for 'Bydgoskie Kolegium Nauk Społecznych' (Poland). Return JSON only. Include realistic issueDate (YYYY-MM-DD) and expiryDate (YYYY-MM-DD) based on typical university academic calendars (e.g. starting Oct 1st for Poland). The student could be in any year of study.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            studentName: { type: Type.STRING },
            schoolName: { type: Type.STRING },
            studentId: { type: Type.STRING },
            major: { type: Type.STRING },
            address: { type: Type.STRING },
            issueDate: { type: Type.STRING },
            expiryDate: { type: Type.STRING },
          },
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No data returned from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating student profile:", error);
    // Fallback data if API fails
    
    // Logic to vary the date for fallback data as well
    const now = new Date();
    const currentYear = now.getFullYear();
    const baseAcademicYear = now.getMonth() < 9 ? currentYear - 1 : currentYear;
    
    // Simulate randomly that student started 0, 1, or 2 years ago
    const yearsStudy = Math.floor(Math.random() * 3);
    const startYear = baseAcademicYear - yearsStudy;
    
    return {
      studentName: "Marek Kamiński",
      schoolName: "Bydgoskie Kolegium Nauk Społecznych",
      studentId: "BKNS-202488",
      major: "Socjologia",
      address: "ul. Gdańska 24, 85-006 Bydgoszcz, POLSKA",
      issueDate: `${startYear}-10-01`,
      expiryDate: `${startYear + 3}-10-31`,
    };
  }
};

// Curated list of high-quality student portraits from Unsplash for fallback
const MALE_PORTRAITS = [
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300&h=300", // Man in suit
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300", // Man neutral
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300&h=300", // Man portrait
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300", // Man smiling
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300&h=300", // Man young
];

const FEMALE_PORTRAITS = [
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=300&h=300", // Woman neutral
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300", // Woman expressive
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300", // Woman portrait
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=300&h=300", // Woman professional
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300&h=300", // Woman smiling
];

// Heuristic to guess gender from first name
// Especially effective for Polish names where female names end in 'a'
const guessGender = (name: string): 'male' | 'female' => {
  if (!name) return Math.random() > 0.5 ? 'male' : 'female';
  
  const firstName = name.trim().split(' ')[0].toLowerCase();
  
  // Polish/Slavic heuristic: Names ending in 'a' are typically female (Anna, Maria, Katarzyna)
  // There are exceptions (Kuba, Barnaba), but this covers 99% of cases for this context.
  if (firstName.endsWith('a')) {
    return 'female';
  }
  
  // Default to male for others (Marek, Piotr, Jan)
  return 'male';
}

export const generateStudentPortrait = async (context?: { major?: string; schoolName?: string; studentName?: string }) => {
  // Determine gender for Prompt and Fallback
  const gender = guessGender(context?.studentName || '');
  
  try {
    const ai = getAiInstance();
    
    // Improved prompt with Gender
    let prompt = `Passport style ID photo of a ${gender} university student, head and shoulders portrait, looking directly at camera, neutral expression, plain light background, high quality, realistic photography, sharp focus.`;
    
    if (context) {
      if (context.major) prompt += ` The student studies ${context.major}, professional attire suitable for this major.`;
      if (context.schoolName) prompt += ` Student at ${context.schoolName}.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    // Iterate parts to find the image
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Error generating portrait:", error);
    
    // Pick a random fallback image based on gender
    const pool = gender === 'female' ? FEMALE_PORTRAITS : MALE_PORTRAITS;
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  }
};