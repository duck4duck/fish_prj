import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { ArrowRight, Dna, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { colors } from '../theme/tokens';

interface HeroBannerProps {
  onExploreCatalog: () => void;
  onOpenCompatibility: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreCatalog, onOpenCompatibility }) => {
  return (
    <View style={styles.heroOuter}>
      <View style={styles.heroInner}>
        {/* Left Side: Headline & Copy */}
        <View style={styles.heroContent}>
          <View style={styles.heroTagBadge}>
            <Sparkles size={12} color={colors.accentRose} />
            <Text style={styles.heroTagText}>COLLECTOR’S SELECTION</Text>
          </View>

          <Text style={styles.heroTitle}>
            Build Your <Text style={styles.accentText}>Dream Aquarium</Text>
          </Text>

          <Text style={styles.heroSubtitle}>
            Shop premium fish, tanks, and accessories delivered safely to your doorstep with guaranteed live arrival.
          </Text>

          {/* Action Row */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              // @ts-ignore
              className="explore-cta-button"
              style={styles.pillCtaBtn}
              activeOpacity={0.85}
              onPress={onExploreCatalog}
            >
              <View style={styles.ctaIconCircle}>
                <ArrowRight size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.ctaBtnText}>Get Started</Text>
              <Text style={styles.ctaArrowsText}>»»</Text>
            </TouchableOpacity>

            <TouchableOpacity
              // @ts-ignore
              className="secondary-cta-button"
              style={styles.secondaryPillBtn}
              activeOpacity={0.85}
              onPress={onOpenCompatibility}
            >
              <Dna size={16} color={colors.textMuted} />
              <Text style={styles.secondaryText}>Check Compatibility</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Right Side: Hero Visual Card (Redesigned & Beautiful) */}
        <View
          // @ts-ignore
          className="card-luxury"
          style={styles.heroVisualCard}
        >
          {/* Ambient Glowing Orbs */}
          <View style={styles.glowCircleTopRight} />
          <View style={styles.glowCircleBottomLeft} />

          {/* Stylized Frosted "Fish" Watermark */}
          <Text style={styles.giantFishWord}>Fish</Text>

          {/* Floating Fish with Soft Vignette Frame & Swimming Animation */}
          <View style={styles.fishFrameContainer}>
            <View style={styles.fishAuraBackdrop} />
            <Image
              source={{ uri: '/images/betta.jpg' }}
              style={styles.heroFishImg}
              resizeMode="cover"
            />
          </View>

          {/* Bottom Luxury Pill Badge */}
          <View style={styles.featuredFloatingBadge}>
            <View style={styles.floatingBadgeLeft}>
              <View style={styles.shieldIconWrap}>
                <ShieldCheck size={14} color={colors.accentRose} />
              </View>
              <View>
                <Text style={styles.floatingTitle}>Red Dragon Betta</Text>
                <View style={styles.ratingInline}>
                  <Star size={10} color={colors.accentGold} fill={colors.accentGold} />
                  <Text style={styles.ratingText}>4.9</Text>
                </View>
              </View>
            </View>

            <View style={styles.floatingBadgeRight}>
              <Text style={styles.floatingPrice}>$38.99</Text>
              <Text style={styles.floatingUnit}>/pc</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroOuter: {
    paddingVertical: 45,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  heroInner: {
    maxWidth: 1280,
    marginHorizontal: 'auto',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 36,
  },
  heroContent: {
    flex: 1.2,
    minWidth: 320,
  },
  heroTagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(229, 57, 116, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(229, 57, 116, 0.3)',
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 20,
  },
  heroTagText: {
    color: colors.accentRose,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.textLight,
    lineHeight: 56,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  accentText: {
    color: colors.accentRose,
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 25,
    color: colors.textMuted,
    maxWidth: 520,
    marginBottom: 32,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },
  pillCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E202B',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 22,
    borderRadius: 30,
    gap: 12,
  },
  ctaIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.accentRose,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaBtnText: {
    color: '#FFF',
    fontSize: 14.5,
    fontWeight: '800',
  },
  ctaArrowsText: {
    color: colors.textDim,
    fontSize: 13,
    fontWeight: '900',
  },
  secondaryPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  secondaryText: {
    color: colors.textMuted,
    fontSize: 13.5,
    fontWeight: '700',
  },
  heroVisualCard: {
    flex: 0.9,
    minWidth: 320,
    height: 360,
    borderRadius: 36,
    backgroundColor: '#221720',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65)',
  },
  glowCircleTopRight: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(184, 51, 106, 0.28)',
    filter: 'blur(35px)',
  },
  glowCircleBottomLeft: {
    position: 'absolute',
    bottom: 10,
    left: -20,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(229, 57, 116, 0.25)',
    filter: 'blur(35px)',
  },
  giantFishWord: {
    position: 'absolute',
    top: 30,
    fontSize: 88,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.07)',
    letterSpacing: 4,
    zIndex: 1,
  },
  fishFrameContainer: {
    width: 250,
    height: 200,
    borderRadius: 28,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    backgroundColor: 'rgba(30, 20, 27, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
  },
  fishAuraBackdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at center, rgba(229, 57, 116, 0.2) 0%, transparent 80%)',
  },
  heroFishImg: {
    width: '100%',
    height: '100%',
  },
  featuredFloatingBadge: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(38, 27, 36, 0.94)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backdropFilter: 'blur(12px)',
    zIndex: 3,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
  },
  floatingBadgeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  shieldIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(229, 57, 116, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingTitle: {
    color: colors.textLight,
    fontSize: 13.5,
    fontWeight: '800',
  },
  ratingInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ratingText: {
    color: colors.accentGold,
    fontSize: 11,
    fontWeight: '800',
  },
  floatingBadgeRight: {
    alignItems: 'flex-end',
  },
  floatingPrice: {
    color: colors.accentRose,
    fontSize: 16,
    fontWeight: '900',
  },
  floatingUnit: {
    color: colors.textDim,
    fontSize: 10.5,
    fontWeight: '600',
  },
});
