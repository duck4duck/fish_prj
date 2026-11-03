import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Check, RotateCcw } from 'lucide-react';
import { colors } from '../theme/tokens';

const CATEGORIES = [
  { id: 'All', label: 'All Species' },
  { id: 'Popular', label: 'Popular' },
  { id: 'Cichlids', label: 'Cichlids' },
  { id: 'Coldwater', label: 'Coldwater' },
  { id: 'Catfish', label: 'Catfish' },
  { id: 'Marine Reef', label: 'Marine Reef' },
  { id: 'Nano Tank', label: 'Nano Tank' },
];

const WATER_TYPES = ['All', 'Freshwater', 'Marine'];
const SORT_OPTIONS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price_asc', label: 'Price: Low' },
  { id: 'price_desc', label: 'Price: High' },
  { id: 'rating', label: 'Top Rated' },
];

interface FilterBarProps {
  category: string;
  setCategory: (val: string) => void;
  waterType: string;
  setWaterType: (val: string) => void;
  careLevel: string;
  setCareLevel: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  onResetFilters: () => void;
  totalFound: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  category,
  setCategory,
  waterType,
  setWaterType,
  sortBy,
  setSortBy,
  inStockOnly,
  setInStockOnly,
  onResetFilters,
  totalFound,
}) => {
  return (
    <View style={styles.container}>
      {/* Title & Structure Row matching screenshot 2 */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.sectionSubtitle}>EXPLORE SELECTION</Text>
          <Text style={styles.sectionMainTitle}>
            Premium Aquarium <Text style={styles.highlightText}>Fish</Text>
          </Text>
        </View>

        <View style={styles.counterPill}>
          <Text style={styles.counterText}>{totalFound} species available</Text>
        </View>
      </View>

      {/* Category Pills matching screenshot 2 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {CATEGORIES.map((cat) => {
          const isActive = category === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.8}
              // @ts-ignore
              className="category-pill-interactive"
              style={[
                styles.categoryPill,
                isActive && styles.categoryPillActive,
              ]}
              onPress={() => setCategory(cat.id)}
            >
              <Text
                style={[
                  styles.categoryPillText,
                  isActive && styles.categoryPillTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Secondary Controls Bar */}
      <View style={styles.secondaryBar}>
        {/* Water Type Tabs */}
        <View style={styles.segmentedControl}>
          {WATER_TYPES.map((wt) => {
            const active = waterType === wt;
            return (
              <TouchableOpacity
                key={wt}
                activeOpacity={0.7}
                // @ts-ignore
                className="segment-btn-interactive"
                style={[styles.segmentBtn, active && styles.segmentBtnActive]}
                onPress={() => setWaterType(wt)}
              >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                  {wt === 'All' ? 'All Water' : wt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Sorting Dropdown Pills */}
        <View style={styles.segmentedControl}>
          {SORT_OPTIONS.map((opt) => {
            const active = sortBy === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                activeOpacity={0.7}
                // @ts-ignore
                className="segment-btn-interactive"
                style={[styles.segmentBtn, active && styles.segmentBtnActive]}
                onPress={() => setSortBy(opt.id)}
              >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* In Stock Toggle */}
        <TouchableOpacity
          style={[styles.stockToggle, inStockOnly && styles.stockToggleActive]}
          activeOpacity={0.8}
          onPress={() => setInStockOnly(!inStockOnly)}
        >
          {inStockOnly ? (
            <Check size={13} color={colors.accentRose} />
          ) : (
            <View style={styles.emptyCircleDot} />
          )}
          <Text style={[styles.stockToggleText, inStockOnly && styles.stockToggleTextActive]}>
            In Stock Only
          </Text>
        </TouchableOpacity>

        {/* Reset button if active */}
        {(category !== 'All' || waterType !== 'All' || inStockOnly || sortBy !== 'featured') && (
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={onResetFilters}
            activeOpacity={0.7}
          >
            <RotateCcw size={12} color={colors.danger} />
            <Text style={styles.resetBtnText}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 1280,
    marginHorizontal: 'auto',
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 12,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: colors.textDim,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  sectionMainTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.textLight,
  },
  highlightText: {
    color: colors.accentRose,
  },
  counterPill: {
    backgroundColor: '#281C25',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  counterText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  categoryScroll: {
    gap: 10,
    paddingBottom: 14,
  },
  categoryPill: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 22,
    backgroundColor: '#281C25',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  categoryPillActive: {
    backgroundColor: '#482F42',
    borderColor: colors.accentRose,
  },
  categoryPillText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  categoryPillTextActive: {
    color: '#FFF',
    fontWeight: '800',
  },
  secondaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 14,
    paddingTop: 8,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#20161E',
    borderRadius: 16,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  segmentBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 13,
  },
  segmentBtnActive: {
    backgroundColor: '#382333',
  },
  segmentText: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: colors.textLight,
    fontWeight: '700',
  },
  stockToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#20161E',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  stockToggleActive: {
    borderColor: colors.accentRose,
    backgroundColor: 'rgba(229, 57, 116, 0.12)',
  },
  emptyCircleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.textDim,
  },
  stockToggleText: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '600',
  },
  stockToggleTextActive: {
    color: colors.accentRose,
    fontWeight: '700',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 51, 102, 0.3)',
  },
  resetBtnText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '700',
  },
});
