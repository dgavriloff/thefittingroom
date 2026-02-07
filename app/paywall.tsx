import { useApp } from '@/context/AppContext';
import { getOfferings, purchasePackage, restorePurchases } from '@/services/purchases';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PurchasesPackage } from 'react-native-purchases';

const CREDIT_MAP: Record<string, number> = {
  credits_5: 5,
  credits_20: 20,
  credits_50: 50,
};

function FeatureRow({ text }: { text: string }) {
  return (
    <View style={styles.featureRow}>
      <MaterialIcons name="check" size={18} color="rgba(255,255,255,0.85)" />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

export default function PaywallScreen() {
  const { quota, refreshQuota, isProSubscriber } = useApp();
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    try {
      const offerings = await getOfferings();
      if (offerings?.current?.availablePackages) {
        setPackages(offerings.current.availablePackages);
      }
    } catch (e) {
      console.error('Failed to load offerings:', e);
    } finally {
      setLoading(false);
    }
  };

  // Separate subscription from credit packs
  const { subscriptionPkg, creditPkgs } = useMemo(() => {
    const sub = packages.find(
      (p) => p.packageType === 'MONTHLY' || p.identifier === '$rc_monthly'
    );
    const credits = packages
      .filter((p) => p !== sub)
      .sort((a, b) => a.product.price - b.product.price);
    return { subscriptionPkg: sub, creditPkgs: credits };
  }, [packages]);

  const handlePurchase = useCallback(
    async (pkg: PurchasesPackage) => {
      setPurchasing(true);
      try {
        const customerInfo = await purchasePackage(pkg);
        if (customerInfo) {
          const hasProEntitlement =
            customerInfo.entitlements.active['pro'] !== undefined;

          await refreshQuota();

          if (hasProEntitlement) {
            Alert.alert('Subscription Active', 'Pro mode is now available!', [
              { text: 'OK', onPress: () => router.back() },
            ]);
          } else {
            await new Promise((r) => setTimeout(r, 3000));
            await refreshQuota();
            Alert.alert('Purchase Successful', 'Your generations have been added!', [
              { text: 'OK', onPress: () => router.back() },
            ]);
          }
        }
      } catch (e: any) {
        Alert.alert('Purchase Failed', e.message || 'Something went wrong. Please try again.');
      } finally {
        setPurchasing(false);
      }
    },
    [refreshQuota]
  );

  const handleRestore = useCallback(async () => {
    setPurchasing(true);
    try {
      await restorePurchases();
      await refreshQuota();
      Alert.alert('Purchases Restored', 'Your purchases have been restored successfully.');
    } catch (e: any) {
      Alert.alert('Restore Failed', e.message || 'Could not restore purchases.');
    } finally {
      setPurchasing(false);
    }
  }, [refreshQuota]);

  return (
    <View style={styles.container}>
      {/* Close button */}
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <MaterialIcons name="close" size={22} color="#999" />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Upgrade Your{'\n'}Wardrobe</Text>
          <Text style={styles.heroSubtitle}>
            Try on any outfit, anywhere, anytime
          </Text>
        </View>

        {/* Current balance */}
        {quota && (
          <View style={styles.balanceBar}>
            {isProSubscriber && (
              <View style={styles.balanceItem}>
                <MaterialIcons name="verified" size={16} color="#22C55E" />
                <Text style={styles.balanceLabel}>Pro Active</Text>
              </View>
            )}
            {(quota.credits > 0) && (
              <View style={styles.balanceItem}>
                <MaterialIcons name="toll" size={16} color="#000" />
                <Text style={styles.balanceLabel}>{quota.credits} credit{quota.credits !== 1 ? 's' : ''}</Text>
              </View>
            )}
            {!isProSubscriber && (
              <View style={styles.balanceItem}>
                <MaterialIcons name="auto-awesome" size={16} color="#000" />
                <Text style={styles.balanceLabel}>{Math.max(0, quota.freeLimit - quota.freeUsed)} free left</Text>
              </View>
            )}
          </View>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#000" style={{ marginTop: 32 }} />
        ) : (
          <>
            {/* Subscription Card */}
            {subscriptionPkg && (
              <TouchableOpacity
                style={[styles.subCard, isProSubscriber && styles.subCardActive]}
                onPress={() => !isProSubscriber && handlePurchase(subscriptionPkg)}
                disabled={purchasing || isProSubscriber}
                activeOpacity={isProSubscriber ? 1 : 0.8}
              >
                <View style={[styles.subBadge, isProSubscriber && styles.subBadgeActive]}>
                  <Text style={styles.subBadgeText}>
                    {isProSubscriber ? 'ACTIVE' : 'RECOMMENDED'}
                  </Text>
                </View>
                <View style={styles.subHeader}>
                  <Text style={styles.subTitle}>Pro Monthly</Text>
                  <Text style={styles.subPrice}>
                    {subscriptionPkg.product.priceString}
                    <Text style={styles.subPricePeriod}>/mo</Text>
                  </Text>
                </View>
                <View style={styles.featureList}>
                  <FeatureRow text="Unlimited generations" />
                  <FeatureRow text="Pro model for better results" />
                  <FeatureRow text="No ads" />
                </View>
                {isProSubscriber ? (
                  <View style={styles.subCtaActive}>
                    <MaterialIcons name="check-circle" size={20} color="#22C55E" />
                    <Text style={styles.subCtaActiveText}>Subscribed</Text>
                  </View>
                ) : (
                  <View style={styles.subCta}>
                    <Text style={styles.subCtaText}>Subscribe Now</Text>
                  </View>
                )}
                <Text style={styles.cancelText}>
                  {isProSubscriber ? 'Manage in Settings > Subscriptions' : 'Cancel anytime'}
                </Text>
              </TouchableOpacity>
            )}

            {/* Credit Packs */}
            {creditPkgs.length > 0 && (
              <View style={styles.creditsSection}>
                <Text style={styles.creditsSectionTitle}>Or buy credits</Text>
                <View style={styles.creditsGrid}>
                  {creditPkgs.map((pkg, index) => {
                    const creditCount =
                      CREDIT_MAP[pkg.product.identifier] ??
                      CREDIT_MAP[pkg.identifier] ??
                      0;
                    const perGen =
                      creditCount > 0
                        ? (pkg.product.price / creditCount).toFixed(2)
                        : null;
                    const isBestValue = index === creditPkgs.length - 1;

                    return (
                      <TouchableOpacity
                        key={pkg.identifier}
                        style={[
                          styles.creditCard,
                          isBestValue && styles.creditCardBest,
                        ]}
                        onPress={() => handlePurchase(pkg)}
                        disabled={purchasing}
                        activeOpacity={0.8}
                      >
                        {isBestValue && (
                          <View style={styles.bestBadge}>
                            <Text style={styles.bestBadgeText}>BEST VALUE</Text>
                          </View>
                        )}
                        <Text style={styles.creditCount}>{creditCount}</Text>
                        <Text style={styles.creditLabel}>credits</Text>
                        <Text style={styles.creditPrice}>
                          {pkg.product.priceString}
                        </Text>
                        {perGen && (
                          <Text style={styles.creditPerGen}>
                            ${perGen}/gen
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
          </>
        )}

        {/* Restore */}
        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={purchasing}
        >
          <Text style={styles.restoreText}>Restore Purchases</Text>
        </TouchableOpacity>
      </ScrollView>

      {purchasing && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#FFF" />
          <Text style={styles.overlayText}>Processing purchase...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBF7',
  },
  closeButton: {
    position: 'absolute',
    top: 56,
    right: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0EDE8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 80,
  },

  // Hero
  hero: {
    marginBottom: 28,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#000',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#777',
    marginTop: 8,
  },

  // Balance bar
  balanceBar: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  balanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },

  // Subscription card
  subCard: {
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 24,
    marginBottom: 28,
  },
  subCardActive: {
    borderWidth: 2,
    borderColor: '#22C55E',
  },
  subBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 16,
  },
  subBadgeActive: {
    backgroundColor: '#22C55E',
  },
  subBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 1,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
  },
  subPrice: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
  },
  subPricePeriod: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.6)',
  },
  featureList: {
    gap: 12,
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
  },
  subCta: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  subCtaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  subCtaActive: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 16,
    backgroundColor: 'rgba(34,197,94,0.15)',
  },
  subCtaActiveText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#22C55E',
  },
  cancelText: {
    textAlign: 'center',
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 10,
  },

  // Credits section
  creditsSection: {
    marginBottom: 8,
  },
  creditsSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginBottom: 14,
    textAlign: 'center',
  },
  creditsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  creditCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  creditCardBest: {
    borderColor: '#000',
    borderWidth: 2,
  },
  bestBadge: {
    position: 'absolute',
    top: -9,
    backgroundColor: '#000',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  bestBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  creditCount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
    marginTop: 4,
  },
  creditLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  creditPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginTop: 10,
  },
  creditPerGen: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },

  // Restore
  restoreButton: {
    marginTop: 20,
    alignItems: 'center',
    padding: 16,
  },
  restoreText: {
    fontSize: 14,
    color: '#AAA',
  },

  // Overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayText: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
  },
});
