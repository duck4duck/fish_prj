import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ShoppingBag, ArrowRight, Star, Dna } from 'lucide-react';
import { colors } from '../theme/tokens';
import { Fish } from '../types/fish';
import { useCart } from '../context/CartContext';

interface FishCardProps {
  fish: Fish;
  onSelect: (fish: Fish) => void;
}

export const FishCard: React.FC<FishCardProps> = ({ fish, onSelect }) => {
  const { addToCart, aquariumFish, toggleAquariumFish } = useCart();
  const isInAquarium = aquariumFish.some((f) => f.id === fish.id);

  const price = fish.discount_price || fish.price;

  const handleAddToCart = (e: any) => {
    e?.stopPropagation?.();
    addToCart(fish, 1);
  };

  const handleToggleScanner = (e: any) => {
    e?.stopPropagation?.();
    toggleAquariumFish(fish);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      // @ts-ignore
      className="card-luxury"
      style={styles.cardContainer}
      onPress={() => onSelect(fish)}
    >
      {/* Top Header inside Card: Price on Left, Frosted Bag Button on Right */}
      <View style={styles.cardTopRow}>
        <View>
          <Text style={styles.cardPrice}>
            ${price.toFixed(2)}
          </Text>
          {fish.discount_price && (
            <Text style={styles.oldPrice}>
              ${fish.price.toFixed(2)}
            </Text>
          )}
        </View>

        {/* Circular Action Button (Changes color on hover) */}
        <TouchableOpacity
          activeOpacity={0.8}
          // @ts-ignore
          className="buy-button-interactive"
          style={styles.circularCartBtn}
          onPress={handleAddToCart}
        >
          <ShoppingBag size={15} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Center: Hero Fish Image */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: fish.image_url }}
          style={styles.fishImage}
          resizeMode="cover"
        />

        {/* Water Type Tag */}
        <View style={styles.habitatTag}>
          <Text style={styles.habitatText}>
            {fish.water_type === 'Marine' ? 'Marine' : 'Freshwater'}
          </Text>
        </View>
      </View>

      {/* Bottom Floating Pill with Name and Arrow Button */}
      <View style={styles.cardBottomRow}>
        <View style={styles.nameCapsule}>
          <Text style={styles.fishNameText} numberOfLines={1}>
            {fish.name}
          </Text>
          <TouchableOpacity
            // @ts-ignore
            className="arrow-btn-interactive"
            style={styles.arrowCircleBtn}
            onPress={() => onSelect(fish)}
          >
            <ArrowRight size={13} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Sub-row with Rating & Scanner Quick Button */}
        <View style={styles.subMetaRow}>
          <View style={styles.ratingBadge}>
            <Star size={12} color={colors.accentGold} fill={colors.accentGold} />
            <Text style={styles.ratingNumber}>{fish.rating}</Text>
          </View>

          <TouchableOpacity
            // @ts-ignore
            className="scanner-btn-interactive"
            style={[styles.scannerChip, isInAquarium && styles.scannerChipActive]}
            onPress={handleToggleScanner}
          >
            <Dna size={12} color={isInAquarium ? colors.accentRose : colors.textDim} />
            <Text style={[styles.scannerChipText, isInAquarium && styles.scannerChipTextActive]}>
              {isInAquarium ? 'In Tank' : '+ Compatibility'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#261B23',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 16,
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45)',
    position: 'relative',
    overflow: 'hidden',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    zIndex: 2,
  },
  cardPrice: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  oldPrice: {
    fontSize: 12,
    color: colors.textDim,
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  circularCartBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    height: 185,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1E141C',
    marginVertical: 10,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fishImage: {
    width: '100%',
    height: '100%',
  },
  habitatTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(25, 17, 23, 0.88)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  habitatText: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  cardBottomRow: {
    gap: 8,
    zIndex: 2,
  },
  nameCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#342430',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 22,
    paddingVertical: 6,
    paddingLeft: 14,
    paddingRight: 6,
  },
  fishNameText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
    flex: 1,
    marginRight: 6,
  },
  arrowCircleBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4D3647',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingTop: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingNumber: {
    color: colors.accentGold,
    fontSize: 12,
    fontWeight: '800',
  },
  scannerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  scannerChipActive: {
    backgroundColor: 'rgba(229, 57, 116, 0.15)',
    borderColor: colors.accentRose,
  },
  scannerChipText: {
    color: colors.textDim,
    fontSize: 10.5,
    fontWeight: '700',
  },
  scannerChipTextActive: {
    color: colors.accentRose,
  },
});
