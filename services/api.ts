const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'https://thefittingroom.app';

const APP_SECRET = process.env.EXPO_PUBLIC_APP_SECRET || '';

interface GenerateParams {
  deviceId: string;
  prompt: string;
  imageData: { mimeType: string; data: string }[];
  aspectRatio: string;
  modelName?: string;
}

export interface GenerationsInfo {
  freeUsed: number;
  freeLimit: number;
  credits: number;
  subUsed: number;
  subLimit: number;
}

export interface GenerateResponse {
  imageUrl: string | null;
  text: string | null;
  generations: GenerationsInfo;
  safetyBlock?: boolean;
  error?: string;
}

export interface StatusResponse {
  freeUsed: number;
  freeLimit: number;
  credits: number;
  subscription: {
    active: boolean;
    used: number;
    limit: number;
    proModelAccess: boolean;
  };
}

export class ApiError extends Error {
  status: number;
  body: any;

  constructor(status: number, body: any) {
    const message =
      body?.error || `Request failed with status ${status}`;
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export async function apiGenerate(
  params: GenerateParams
): Promise<GenerateResponse> {
  const res = await fetch(`${API_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-App-Secret': APP_SECRET,
    },
    body: JSON.stringify(params),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(res.status, data);
  }

  // Safety block returns 200 but with error field
  if (data.safetyBlock) {
    throw new Error(
      data.error ||
        'Image rejected due to safety guidelines. Please try different images or prompts.'
    );
  }

  return data;
}

export async function apiGetStatus(
  deviceId: string
): Promise<StatusResponse> {
  const res = await fetch(`${API_BASE_URL}/api/status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-App-Secret': APP_SECRET,
    },
    body: JSON.stringify({ deviceId }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(res.status, data);
  }

  return data;
}
