import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { Dna, X, AlertTriangle, CheckCircle, Thermometer, Droplets, Box, ShoppingBag, Trash2 } from 'lucide-react';
import { colors } from '../theme/tokens';
import { Fish, CompatibilityResponse } from '../types/fish';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

interface CompatibilityCheckerProps {
  allFishes?: Fish[];
}

export const CompatibilityChecker: React.FC<CompatibilityCheckerProps> = ({ allFishes = [] }) => {
  const {
    isCompatibilityOpen,
    setIsCompatibilityOpen,
    aquariumFish,
    removeAquariumFish,
    toggleAquariumFish,
    clearAquarium,
    addToCart,
    setIsCartOpen,
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompatibilityResponse | null>(null);

  useEffect(() => {
    if (!isCompatibilityOpen) return;

    if (aquariumFish.length === 0) {
      setResult(null);
      return;
    }

    const runAnalysis = async () => {
      setLoading(true);
      try {
        const ids = aquariumFish.map((f) => f.id);
        const res = await api.checkCompatibility(ids);
        setResult(res);
      } catch (err) {
        console.error('Compatibility error:', err);
      } finally {
        setLoading(false);
      }
    };

    runAnalysis();
  }, [aquariumFish, isCompatibilityOpen]);

  if (!isCompatibilityOpen) return null;

  const handleAddAllToCart = () => {
    aquariumFish.forEach((fish) => {
      addToCart(fish, 1);
    });
    setIsCompatibilityOpen(false);
    setIsCartOpen(true);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return colors.success;
    if (score >= 50) return colors.warning;
    return colors.danger;
  };

  return (
    <Modal visible={isCompatibilityOpen} transparent animationType="fade" onRequestClose={() => setIsCompatibilityOpen(false)}>
      <View style={styles.backdrop}>
        <View style={styles.modalBox}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleWrap}>
              <Dna size={22} color={colors.accentRose} />
              <View>
                <Text style={styles.headerTitle}>Tank Compatibility Scanner</Text>
                <Text style={styles.headerSub}>
                  Biological analysis of water chemistry, pH and temperament
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setIsCompatibilityOpen(false)}
              activeOpacity={0.7}
            >
              <X size={16} color="#FFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.bodyScroll} showsVerticalScrollIndicator={false}>
            {/* Virtual Tank Container */}
            <View style={styles.virtualTankCard}>
              <View style={styles.tankHeader}>
                <Text style={styles.tankTitle}>Virtual Tank Simulator ({aquariumFish.length}/6 species)</Text>
                {aquariumFish.length > 0 && (
                  <TouchableOpacity onPress={clearAquarium} style={styles.clearTankBtn}>
                    <Trash2 size={12} color={colors.danger} />
                    <Text style={styles.clearTankText}>Clear Tank</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Tank Fish Chips */}
              {aquariumFish.length === 0 ? (
                <View style={styles.emptyTank}>
                  <Dna size={32} color={colors.textDim} style={{ marginBottom: 8 }} />
                  <Text style={styles.emptyTankTitle}>Tank is empty</Text>
                  <Text style={styles.emptyTankSub}>
                    Add species from the catalog using "+ Compatibility" to simulate cohabitation.
                  </Text>
                </View>
              ) : (
                <View style={styles.fishChipGrid}>
                  {aquariumFish.map((fish) => (
                    <View key={fish.id} style={styles.fishChip}>
                      <Image source={{ uri: fish.image_url }} style={styles.chipImg} />
                      <View style={styles.chipInfo}>
                        <Text style={styles.chipName} numberOfLines={1}>{fish.name}</Text>
                        <Text style={styles.chipMeta}>
                          {fish.water_type} • {fish.temp_min}–{fish.temp_max}°C
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.chipRemove}
                        onPress={() => removeAquariumFish(fish.id)}
                      >
                        <X size={12} color={colors.textDim} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* Quick Add Suggestions */}
              {aquariumFish.length < 6 && (
                <View style={styles.quickAddBar}>
                  <Text style={styles.quickAddLabel}>Quick test with popular species:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickScroll}>
                    {allFishes
                      .filter((f) => !aquariumFish.some((af) => af.id === f.id))
                      .slice(0, 6)
                      .map((f) => (
                        <TouchableOpacity
                          key={f.id}
                          // @ts-ignore
                          className="scanner-btn-interactive"
                          style={styles.quickAddChip}
                          onPress={() => toggleAquariumFish(f)}
                        >
                          <Text style={styles.quickAddChipText}>+ {f.name}</Text>
                        </TouchableOpacity>
                      ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Analysis Results */}
            {loading ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color={colors.accentRose} />
                <Text style={styles.loadingText}>Simulating hydrochemistry & species behavior...</Text>
              </View>
            ) : result && aquariumFish.length > 0 ? (
              <View style={styles.resultsWrapper}>
                {/* Score & Verdict Card */}
                <View
                  style={[
                    styles.verdictCard,
                    { borderColor: getScoreColor(result.score) },
                  ]}
                >
                  <View style={styles.verdictLeft}>
                    <View
                      style={[
                        styles.scoreBadge,
                        { borderColor: getScoreColor(result.score) },
                      ]}
                    >
                      <Text style={[styles.scoreValue, { color: getScoreColor(result.score) }]}>
                        {result.score}%
                      </Text>
                      <Text style={styles.scoreSub}>score</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={[styles.verdictStatus, { color: getScoreColor(result.score) }]}>
                        {result.status}
                      </Text>
                      <Text style={styles.verdictRec}>{result.recommendation}</Text>
                    </View>
                  </View>
                </View>

                {/* Hydrochemistry Balance Grid */}
                <View style={styles.balanceGrid}>
                  <View style={styles.balanceItem}>
                    <Thermometer size={18} color={colors.accentRose} />
                    <View>
                      <Text style={styles.balanceLabel}>Temperature Window</Text>
                      <Text style={styles.balanceVal}>{result.temp_range}</Text>
                    </View>
                  </View>

                  <View style={styles.balanceItem}>
                    <Droplets size={18} color={colors.accentRose} />
                    <View>
                      <Text style={styles.balanceLabel}>Overlapping pH</Text>
                      <Text style={styles.balanceVal}>{result.ph_range}</Text>
                    </View>
                  </View>

                  <View style={styles.balanceItem}>
                    <Box size={18} color={colors.accentRose} />
                    <View>
                      <Text style={styles.balanceLabel}>Suggested Tank Size</Text>
                      <Text style={styles.balanceVal}>from {result.min_tank_liters} L</Text>
                    </View>
                  </View>
                </View>

                {/* Issues & Warnings List */}
                {result.issues && result.issues.length > 0 ? (
                  <View style={styles.issuesWrap}>
                    <Text style={styles.issuesHeader}>Critical Factors & Advice:</Text>
                    {result.issues.map((issue, idx) => {
                      const isDanger = issue.type === 'danger';
                      return (
                        <View
                          key={idx}
                          style={[
                            styles.issueCard,
                            isDanger ? styles.issueDanger : styles.issueWarning,
                          ]}
                        >
                          <AlertTriangle size={18} color={isDanger ? colors.danger : colors.warning} />
                          <View style={styles.issueContent}>
                            <Text style={styles.issueTitle}>{issue.title}</Text>
                            <Text style={styles.issueMsg}>{issue.message}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                ) : (
                  <View style={styles.perfectBanner}>
                    <CheckCircle size={18} color={colors.success} />
                    <Text style={styles.perfectText}>
                      No biological conflicts detected. These species will thrive together peacefully!
                    </Text>
                  </View>
                )}

                {/* Order All Button */}
                {result.is_compatible && (
                  <TouchableOpacity
                    // @ts-ignore
                    className="main-cta-button"
                    style={styles.addAllBtn}
                    onPress={handleAddAllToCart}
                    activeOpacity={0.88}
                  >
                    <ShoppingBag size={16} color="#FFF" style={{ marginRight: 8 }} />
                    <Text style={styles.addAllBtnText}>
                      Add Entire Cohort ({aquariumFish.length} species) to Cart
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 10, 14, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backdropFilter: 'blur(16px)',
  },
  modalBox: {
    backgroundColor: '#1C131A',
    width: '100%',
    maxWidth: 820,
    maxHeight: '92%',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    boxShadow: '0 24px 70px rgba(0, 0, 0, 0.8)',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: '#221820',
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textLight,
  },
  headerSub: {
    fontSize: 11.5,
    color: colors.textDim,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyScroll: {
    padding: 22,
  },
  virtualTankCard: {
    backgroundColor: '#261B23',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
  },
  tankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  tankTitle: {
    color: colors.textLight,
    fontSize: 13.5,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clearTankBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  clearTankText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyTank: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyTankTitle: {
    color: colors.textLight,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptyTankSub: {
    color: colors.textDim,
    fontSize: 12.5,
    textAlign: 'center',
    maxWidth: 420,
  },
  fishChipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  fishChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#32232E',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 6,
    gap: 8,
    minWidth: 180,
  },
  chipImg: {
    width: 38,
    height: 38,
    borderRadius: 10,
  },
  chipInfo: {
    flex: 1,
  },
  chipName: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: '700',
  },
  chipMeta: {
    color: colors.textDim,
    fontSize: 10,
  },
  chipRemove: {
    padding: 6,
  },
  quickAddBar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 12,
  },
  quickAddLabel: {
    color: colors.textDim,
    fontSize: 11,
    marginBottom: 8,
  },
  quickScroll: {
    gap: 8,
  },
  quickAddChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  quickAddChipText: {
    color: colors.accentRose,
    fontSize: 11.5,
    fontWeight: '700',
  },
  loadingBox: {
    alignItems: 'center',
    paddingVertical: 35,
    gap: 12,
  },
  loadingText: {
    color: colors.accentRose,
    fontSize: 13.5,
    fontWeight: '700',
  },
  resultsWrapper: {
    gap: 16,
  },
  verdictCard: {
    backgroundColor: '#261B23',
    borderRadius: 22,
    borderWidth: 1.5,
    padding: 16,
  },
  verdictLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scoreBadge: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E141C',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '900',
  },
  scoreSub: {
    fontSize: 9,
    color: colors.textDim,
    textTransform: 'uppercase',
  },
  verdictStatus: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
  },
  verdictRec: {
    color: colors.textMuted,
    fontSize: 12.5,
    lineHeight: 18,
  },
  balanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  balanceItem: {
    flex: 1,
    minWidth: 180,
    backgroundColor: '#261B23',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  balanceLabel: {
    color: colors.textDim,
    fontSize: 10.5,
  },
  balanceVal: {
    color: colors.textLight,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
  issuesWrap: {
    gap: 10,
  },
  issuesHeader: {
    color: colors.textLight,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },
  issueCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },
  issueDanger: {
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    borderColor: 'rgba(255, 51, 102, 0.35)',
  },
  issueWarning: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.35)',
  },
  issueContent: {
    flex: 1,
  },
  issueTitle: {
    color: colors.textLight,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 3,
  },
  issueMsg: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
  },
  perfectBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 16,
    padding: 14,
  },
  perfectText: {
    color: colors.success,
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  addAllBtn: {
    flexDirection: 'row',
    backgroundColor: '#4D3346',
    borderWidth: 1,
    borderColor: 'rgba(229, 57, 116, 0.5)',
    borderRadius: 22,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 20px rgba(229, 57, 116, 0.35)',
    marginTop: 6,
  },
  addAllBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
