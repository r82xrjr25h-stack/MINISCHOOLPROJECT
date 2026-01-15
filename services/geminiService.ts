import { GoogleGenAI, Type, Modality } from "@google/genai";
import { QuizData, StudyPlan, ResearchResult, ResearchSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const GeminiService = {
  /**
   * Explains a concept using the text model.
   */
  explainConcept: async (topic: string, level: 'simple' | 'detailed' = 'detailed'): Promise<string> => {
    try {
      const prompt = level === 'simple' 
        ? `Explain the concept of "${topic}" like I am 10 years old. Keep it engaging, simple, and use analogies.`
        : `Provide a comprehensive and structured explanation of "${topic}". Include key definitions, historical context (if applicable), and examples. Format with Markdown.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "You are EduMind, a helpful and encouraging academic tutor.",
        }
      });
      return response.text || "I couldn't generate an explanation at this time.";
    } catch (error) {
      console.error("Error explaining concept:", error);
      throw error;
    }
  },

  /**
   * Converts text to speech using Gemini TTS.
   */
  speakText: async (text: string): Promise<ArrayBuffer> => {
    try {
      // Clean markdown symbols for better speech
      const cleanText = text.replace(/[*#`]/g, '');
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: cleanText.slice(0, 4000) }] }], // Limit length for safety
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) throw new Error("No audio generated");

      // Decode base64 to ArrayBuffer
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    } catch (error) {
      console.error("TTS Error:", error);
      throw error;
    }
  },

  /**
   * Generates a quiz based on a topic using JSON schema.
   */
  generateQuiz: async (topic: string): Promise<QuizData> => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a multiple-choice quiz about "${topic}" with 5 questions.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    options: { 
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    },
                    correctAnswerIndex: { type: Type.INTEGER },
                    explanation: { type: Type.STRING }
                  },
                  required: ['question', 'options', 'correctAnswerIndex', 'explanation']
                }
              }
            },
            required: ['title', 'questions']
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response from model");
      return JSON.parse(text) as QuizData;
    } catch (error) {
      console.error("Error generating quiz:", error);
      throw error;
    }
  },

  /**
   * Analyzes an image (e.g., homework problem, diagram).
   */
  analyzeImage: async (base64Image: string, prompt: string): Promise<string> => {
    try {
      const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: cleanBase64
              }
            },
            { text: prompt || "Analyze this image and explain what is shown. If it's a problem, solve it step-by-step." }
          ]
        }
      });
      
      return response.text || "Could not analyze the image.";
    } catch (error) {
      console.error("Error analyzing image:", error);
      throw error;
    }
  },

  /**
   * Performs research using Google Search Grounding.
   */
  performResearch: async (query: string): Promise<ResearchResult> => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "No results found.";
      
      // Extract sources from grounding metadata
      const sources: ResearchSource[] = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || "Web Source",
            uri: chunk.web.uri
          });
        }
      });

      return { content: text, sources };
    } catch (error) {
      console.error("Research error:", error);
      throw error;
    }
  },

  /**
   * Generates a study plan using JSON Schema.
   */
  generateStudyPlan: async (subjects: string, daysUntilExam: number): Promise<StudyPlan> => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a ${daysUntilExam}-day study plan for these subjects: ${subjects}. Structure it day by day.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              tips: { type: Type.ARRAY, items: { type: Type.STRING } },
              schedule: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    day: { type: Type.STRING },
                    focus: { type: Type.STRING },
                    tasks: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          time: { type: Type.STRING },
                          activity: { type: Type.STRING }
                        },
                        required: ['time', 'activity']
                      }
                    }
                  },
                  required: ['day', 'focus', 'tasks']
                }
              }
            },
            required: ['title', 'schedule', 'tips']
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("No study plan generated");
      return JSON.parse(text) as StudyPlan;
    } catch (error) {
      console.error("Planner error:", error);
      throw error;
    }
  }
};