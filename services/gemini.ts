import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import { apiGenerate, GenerateResponse, ApiError } from './api';
import { getDeviceId } from './device';

export type AspectRatio = "1:1" | "16:9" | "4:3" | "3:4" | "9:16";

export interface ImageGenerationResult {
    imageUrl: string | null;
    text: string | null;
    generations?: GenerateResponse['generations'];
}

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
            return uri;
        }
    }
    return uri;
};

/**
 * Resizes an image to max 1024px on the longest side and converts to JPEG.
 */
const resizeImage = async (uri: string): Promise<string> => {
    try {
        const result = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 1024 } }],
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );
        return result.uri;
    } catch (e) {
        console.warn("Failed to resize image, using original:", e);
        return uri;
    }
};

/**
 * Generates an image using the server proxy to Gemini API.
 */
export const generateImage = async (
    prompt: string,
    imageUris: string[] = [],
    aspectRatio: AspectRatio = "1:1",
    modelName: string = 'gemini-2.5-flash-image'
): Promise<ImageGenerationResult> => {
    const deviceId = await getDeviceId();

    // Prepare images: ensure local, resize, then convert to base64
    const imageData: { mimeType: string; data: string }[] = [];

    for (const uri of imageUris) {
        const localUri = await ensureLocalUri(uri);
        const resizedUri = await resizeImage(localUri);
        const base64 = await FileSystem.readAsStringAsync(resizedUri, {
            encoding: 'base64',
        });
        imageData.push({
            mimeType: 'image/jpeg',
            data: base64,
        });
    }

    try {
        const response = await apiGenerate({
            deviceId,
            prompt,
            imageData,
            aspectRatio,
            modelName,
        });

        return {
            imageUrl: response.imageUrl,
            text: response.text,
            generations: response.generations,
        };
    } catch (error: any) {
        if (error instanceof ApiError) {
            switch (error.status) {
                case 402:
                    throw new Error('NO_GENERATIONS');
                case 403:
                    if (error.message.includes('Pro model')) {
                        throw new Error('PRO_REQUIRED');
                    }
                    throw error;
                case 429:
                    throw new Error('GENERATION_IN_PROGRESS');
                case 504:
                    throw new Error('Generation timed out. Please try again.');
                default:
                    throw error;
            }
        }
        throw error;
    }
};
