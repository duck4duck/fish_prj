import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { AlertCircle, Sparkles, RotateCcw } from 'lucide-react';
import { colors } from './theme/tokens';
import { useCart } from './context/CartContext';
import { useFishes } from './hooks/useFishes';
import { Fish, FilterParams } from './types/fish';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { FilterBar } from './components/FilterBar';
import { FishCard } from './components/FishCard';
import { FishDetailModal } from './components/FishDetailModal';
import { CompatibilityChecker } from './components/CompatibilityChecker';
import { CartDrawer } from './components/CartDrawer';
import { AquariumGuide } from './components/AquariumGuide';
import { Footer } from './components/Footer';
import { AquariumBubbles } from './components/AquariumBubbles';

export const App: React.FC = () => {
  // Filter state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [waterType, setWaterType] = useState('All');
  const [careLevel, setCareLevel] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Detail Modal
  const [selectedFish, setSelectedFish] = useState<Fish | null>(null);

  const { setIsCompatibilityOpen } = useCart();

  const filterParams: FilterParams = {
    category,
    water_type: waterType,
    care_level: careLevel,
    search,
    sort_by: sortBy,
    in_stock_only: inStockOnly,
  };

  const { fishes, setFishes, allFishes, loading, error, refresh } = useFishes(filterParams);

  const handleResetFilters = () => {
    setCategory('All');
    setWaterType('All');
    setCareLevel('All');
    setSearch('');
    setSortBy('featured');
    setInStockOnly(false);
  };

  const scrollToCatalog = () => {
    if (typeof window !== 'undefined') {
      const el = document.getElementById('catalog-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFishUpdated = (updatedFish: Fish) => {
    setSelectedFish(updatedFish);
    setFishes((prev) => prev.map((f) => (f.id === updatedFish.id ? updatedFish : f)));
  };

  return (
    <View style={styles.appContainer}>
      {/* Bioluminescent Canvas Background Bubbles */}
      <AquariumBubbles />

      {/* Sticky Header */}
      <Header
        search={search}
        setSearch={setSearch}
        onScrollToCatalog={scrollToCatalog}
      />

      <ScrollView style={styles.mainScrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <HeroBanner
          onExploreCatalog={scrollToCatalog}
          onOpenCompatibility={() => setIsCompatibilityOpen(true)}
        />

        {/* Catalog Section Anchor */}
        <View nativeID="catalog-section" style={styles.catalogAnchor}>
          {/* Filter Bar */}
          <FilterBar
            category={category}
            setCategory={setCategory}
            waterType={waterType}
            setWaterType={setWaterType}
            careLevel={careLevel}
            setCareLevel={setCareLevel}
            sortBy={sortBy}
            setSortBy={setSortBy}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
            onResetFilters={handleResetFilters}
            totalFound={fishes.length}
          />

          {/* Fish Grid Area */}
          <View style={styles.gridContainer}>
            {loading ? (
              <View style={styles.centerBox}>
                <ActivityIndicator size="large" color={colors.accentRose} />
                <Text style={styles.loadingText}>Loading aquarium collection...</Text>
              </View>
            ) : error ? (
              <View style={styles.centerBox}>
                <AlertCircle size={38} color={colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={refresh}>
                  <RotateCcw size={14} color="#FFF" />
                  <Text style={styles.retryBtnText}>Retry Connection</Text>
                </TouchableOpacity>
              </View>
            ) : fishes.length === 0 ? (
              <View style={styles.centerBox}>
                <Sparkles size={42} color={colors.textDim} />
                <Text style={styles.emptyTitle}>No species found</Text>
                <Text style={styles.emptyDesc}>Try resetting filters or adjusting search terms.</Text>
                <TouchableOpacity style={styles.resetBigBtn} onPress={handleResetFilters}>
                  <Text style={styles.resetBigBtnText}>Reset All Filters</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.fishGrid}>
                {fishes.map((fish) => (
                  <View key={fish.id} style={styles.gridItem}>
                    <FishCard fish={fish} onSelect={setSelectedFish} />
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Acclimation Protocol Guide */}
        <AquariumGuide />

        {/* Footer */}
        <Footer />
      </ScrollView>

      {/* Detail Modal */}
      {selectedFish && (
        <FishDetailModal
          fish={selectedFish}
          onClose={() => setSelectedFish(null)}
          onFishUpdated={handleFishUpdated}
        />
      )}

      {/* Compatibility Scanner Modal */}
      <CompatibilityChecker allFishes={allFishes} />

      {/* Cart Drawer */}
      <CartDrawer />
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    minHeight: '100vh',
    position: 'relative',
  },
  mainScrollView: {
    flex: 1,
  },
  catalogAnchor: {
    paddingTop: 10,
  },
  gridContainer: {
    maxWidth: 1280,
    marginHorizontal: 'auto',
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  fishGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -10,
  },
  gridItem: {
    width: '33.333%',
    paddingHorizontal: 10,
    marginBottom: 24,
    minWidth: 280,
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  loadingText: {
    color: colors.accentRose,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 8,
  },
  errorText: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    maxWidth: 400,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.accentRose,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  retryBtnText: {
    color: '#FFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textLight,
  },
  emptyDesc: {
    fontSize: 13,
    color: colors.textDim,
    textAlign: 'center',
    maxWidth: 360,
  },
  resetBigBtn: {
    backgroundColor: '#32232E',
    borderWidth: 1.5,
    borderColor: colors.accentRose,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 22,
    marginTop: 8,
  },
  resetBigBtnText: {
    color: colors.accentRose,
    fontSize: 13.5,
    fontWeight: '800',
  },
});
