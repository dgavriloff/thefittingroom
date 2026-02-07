import Purchases, {
  PurchasesOfferings,
  PurchasesPackage,
  CustomerInfo,
} from 'react-native-purchases';
import { Platform } from 'react-native';

const RC_APPLE_KEY = process.env.EXPO_PUBLIC_RC_APPLE_KEY || '';
const RC_GOOGLE_KEY = process.env.EXPO_PUBLIC_RC_GOOGLE_KEY || '';

let initialized = false;

export async function initPurchases(deviceId: string): Promise<void> {
  if (initialized) return;

  const apiKey = Platform.OS === 'ios' ? RC_APPLE_KEY : RC_GOOGLE_KEY;
  if (!apiKey) {
    console.warn('RevenueCat API key not configured');
    return;
  }

  Purchases.configure({ apiKey, appUserID: deviceId });
  initialized = true;
}

export async function getOfferings(): Promise<PurchasesOfferings | null> {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings;
  } catch (e) {
    console.error('Failed to get offerings:', e);
    return null;
  }
}

export async function purchasePackage(
  pkg: PurchasesPackage
): Promise<CustomerInfo | null> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo;
  } catch (e: any) {
    if (e.userCancelled) return null;
    throw e;
  }
}

export async function restorePurchases(): Promise<CustomerInfo | null> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo;
  } catch (e) {
    console.error('Failed to restore purchases:', e);
    throw e;
  }
}

export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  try {
    const info = await Purchases.getCustomerInfo();
    return info;
  } catch (e) {
    console.error('Failed to get customer info:', e);
    return null;
  }
}
