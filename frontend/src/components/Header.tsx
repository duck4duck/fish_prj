import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Search, X, ShoppingBag, Dna, Sparkles } from 'lucide-react';
import { colors } from '../theme/tokens';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  search: string;
  setSearch: (text: string) => void;
  onScrollToCatalog: () => void;
}

export const Header: React.FC<HeaderProps> = ({ search, setSearch, onScrollToCatalog }) => {
  const { totalItems, setIsCartOpen, aquariumFish, setIsCompatibilityOpen } = useCart();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.innerHeader}>
        {/* Brand with vector badge */}
        <TouchableOpacity
          style={styles.profileContainer}
          activeOpacity={0.85}
          onPress={onScrollToCatalog}
        >
          <View style={styles.avatarCircle}>
            <Sparkles size={20} color={colors.accentRose} />
          </View>
          <View>
            <Text style={styles.brandTag}>AQUAVIBE</Text>
            <Text style={styles.brandTitle}>Fish Boutique</Text>
          </View>
        </TouchableOpacity>

        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <Search size={16} color={colors.textDim} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search fish (Betta, Oranda, Guppy, Neon)..."
            placeholderTextColor={colors.textDim}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')} style={styles.clearSearchBtn}>
              <X size={14} color={colors.textDim} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Right Actions */}
        <View style={styles.actionsContainer}>
          {/* Compatibility Checker Pill */}
          <TouchableOpacity
            // @ts-ignore
            className="scanner-btn-interactive"
            style={[
              styles.actionPill,
              aquariumFish.length > 0 && styles.actionPillActive,
            ]}
            activeOpacity={0.85}
            onPress={() => setIsCompatibilityOpen(true)}
          >
            <Dna size={16} color={aquariumFish.length > 0 ? '#FFF' : colors.textMuted} />
            <Text
              style={[
                styles.actionPillText,
                aquariumFish.length > 0 && styles.actionPillTextActive,
              ]}
            >
              Compatibility
            </Text>
            {aquariumFish.length > 0 && (
              <View style={styles.actionBadge}>
                <Text style={styles.actionBadgeText}>{aquariumFish.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Cart Circular Button with Badge */}
          <TouchableOpacity
            // @ts-ignore
            className="cart-circle-interactive"
            style={styles.cartCircleBtn}
            activeOpacity={0.85}
            onPress={() => setIsCartOpen(true)}
          >
            <ShoppingBag size={18} color="#FFFFFF" />
            {totalItems > 0 && (
              <View style={styles.cartBadgeDot}>
                <Text style={styles.cartBadgeNumber}>{totalItems}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'rgba(20, 14, 19, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backdropFilter: 'blur(20px)',
  },
  innerHeader: {
    maxWidth: 1280,
    marginHorizontal: 'auto',
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#281C25',
    borderWidth: 1.5,
    borderColor: 'rgba(229, 57, 116, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTag: {
    fontSize: 11,
    color: colors.accentRose,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textLight,
  },
  searchWrapper: {
    flex: 1,
    minWidth: 260,
    maxWidth: 420,
    height: 44,
    backgroundColor: '#231821',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 10,
    opacity: 0.8,
  },
  searchInput: {
    flex: 1,
    color: colors.textLight,
    fontSize: 13.5,
    outlineStyle: 'none',
  },
  clearSearchBtn: {
    padding: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2C1D28',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 22,
  },
  actionPillActive: {
    backgroundColor: '#482F42',
    borderColor: colors.accentRose,
  },
  actionPillText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  actionPillTextActive: {
    color: '#FFF',
  },
  actionBadge: {
    backgroundColor: colors.accentRose,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  actionBadgeText: {
    color: '#FFF',
    fontSize: 10.5,
    fontWeight: '900',
  },
  cartCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2C1D28',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBadgeDot: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: colors.accentRose,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: '#140E13',
  },
  cartBadgeNumber: {
    color: '#FFF',
    fontSize: 10.5,
    fontWeight: '900',
  },
});
