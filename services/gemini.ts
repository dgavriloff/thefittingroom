import { GoogleGenAI, Part } from "@google/genai";
import * as FileSystem from 'expo-file-system/legacy';

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

if (!apiKey) {
    console.warn("Warning: No Gemini API Key found.");
}

const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-2.5-flash-image';

export type AspectRatio = "1:1" | "16:9" | "4:3" | "3:4" | "9:16";

export interface ImageGenerationResult {
    imageUrl: string | null;
    text: string | null;
}

/**
 * Generates an image using Gemini 2.5 Flash Image.
 */
export const generateImage = async (
    prompt: string,
    imageUris: string[] = [],
    aspectRatio: AspectRatio = "9:16"
): Promise<ImageGenerationResult> => {
    try {
        const parts: Part[] = [{ text: prompt }];

        for (const uri of imageUris) {
            const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
            parts.push({
                inlineData: {
                    mimeType: 'image/jpeg', // Assuming JPEG for simplicity, could detect from URI
                    data: base64
                }
            });
        }

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: { parts },
            config: {
                imageConfig: {
                    aspectRatio: aspectRatio,
                },
            },
        });

        let resultImageUrl: string | null = null;
        let resultText: string | null = null;

        if (response.candidates && response.candidates.length > 0) {
            const content = response.candidates[0].content;
            if (content && content.parts) {
                for (const part of content.parts) {
                    if (part.inlineData) {
                        const base64EncodeString = part.inlineData.data;
                        resultImageUrl = `data:image/png;base64,${base64EncodeString}`;
                    } else if (part.text) {
                        resultText = part.text;
                    }
                }
            }
        }

        if (!resultImageUrl && !resultText) {
            throw new Error("No content generated from the model.");
        }

        return {
            imageUrl: resultImageUrl,
            text: resultText,
        };

    } catch (error) {
        console.error("Error generating image:", error);
        throw error;
    }
};