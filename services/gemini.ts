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
/**
 * Ensures that a URI is local and readable by FileSystem.
 * If it's a remote URI (http/https), it downloads it to the cache.
 */
const ensureLocalUri = async (uri: string): Promise<string> => {
    if (uri.startsWith('http://') || uri.startsWith('https://')) {
        try {
            const filename = `cached_${Date.now()}_${Math.random().toString(36).substring(7)}`;
            const fileUri = `${FileSystem.cacheDirectory}${filename}`;
            const { uri: localUri } = await FileSystem.downloadAsync(uri, fileUri);
            return localUri;
        } catch (e) {
            console.warn("Failed to download remote image:", uri, e);
            // Fallback to original URI, though it will likely fail if it's http
            return uri;
        }
    }
    return uri;
};

export const generateImage = async (
    prompt: string,
    imageUris: string[] = [],
    aspectRatio: AspectRatio = "1:1",
    modelName: string = 'gemini-2.5-flash-image'
): Promise<ImageGenerationResult> => {
    try {
        const parts: Part[] = [{ text: prompt }];

        for (const uri of imageUris) {
            const localUri = await ensureLocalUri(uri);
            const base64 = await FileSystem.readAsStringAsync(localUri, { encoding: 'base64' });
            parts.push({
                inlineData: {
                    mimeType: 'image/jpeg', // Assuming JPEG for simplicity, could detect from URI
                    data: base64
                }
            });
        }

        const response = await ai.models.generateContent({
            model: modelName,
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
            const candidate = response.candidates[0];

            // Check for safety blocking
            const reason = candidate.finishReason;
            if (reason === 'SAFETY' || reason === 'IMAGE_SAFETY' || reason === 'BLOCKLIST' || reason === 'PROHIBITED_CONTENT' || reason === 'IMAGE_PROHIBITED_CONTENT') {
                throw new Error("Image rejected due to safety guidelines. Please contact support if you believe this is a mistake.");
            }

            if (reason === 'RECITATION') {
                throw new Error("Image rejected due to copyright/recitation guidelines.");
            }

            if (reason === 'LANGUAGE') {
                throw new Error("The request was in an unsupported language.");
            }

            const content = candidate.content;
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
            // Fallback for other finish reasons or empty response
            throw new Error("Generation failed. The model returned no content.");
        }

        return {
            imageUrl: resultImageUrl,
            text: resultText,
        };

    } catch (error) {
        throw error;
    }
};