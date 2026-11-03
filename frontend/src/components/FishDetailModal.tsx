import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, ScrollView, TextInput } from 'react-native';
import { ArrowLeft, Star, Scale, Ruler, Thermometer, Box, Plus, Minus, Check, Dna, Sparkles } from 'lucide-react';
import { colors } from '../theme/tokens';
import { Fish } from '../types/fish';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

interface FishDetailModalProps {
  fish: Fish | null;
  onClose: () => void;
  onFishUpdated?: (updated: Fish) => void;
}

export const FishDetailModal: React.FC<FishDetailModalProps> = ({ fish, onClose, onFishUpdated }) => {
  const { addToCart, toggleAquariumFish, aquariumFish, setIsCompatibilityOpen } = useCart();
  const [qty, setQty] = useState(1);
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  if (!fish) return null;

  const isInAquarium = aquariumFish.some((f) => f.id === fish.id);
  const price = fish.discount_price || fish.price;

  const handleAddToCart = () => {
    addToCart(fish, qty);
    onClose();
  };

  const handleOpenScanner = () => {
    if (!isInAquarium) toggleAquariumFish(fish);
    onClose();
    setIsCompatibilityOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!authorName.trim() || !comment.trim()) {
      alert('Please provide your name and review comment.');
      return;
    }
    setSubmittingReview(true);
    try {
      await api.addReview(fish.id, {
        author_name: authorName,
        rating: Number(rating),
        comment: comment,
      });
      setReviewSuccess(true);
      setComment('');
      setAuthorName('');
      if (onFishUpdated) {
        const updated = await api.getFishById(fish.id);
        onFishUpdated(updated);
      }
    } catch (err: any) {
      alert(err.message || 'Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <Modal visible={!!fish} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalBox}>
          {/* Top Bar matching screenshot 3 */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backCircleBtn} onPress={onClose} activeOpacity={0.7}>
              <ArrowLeft size={16} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.topBarCenterTitle}>Species Details</Text>

            <View style={styles.ratingPill}>
              <Star size={12} color={colors.accentGold} fill={colors.accentGold} />
              <Text style={styles.ratingPillText}>{fish.rating}</Text>
            </View>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Title and Price */}
            <View style={styles.titlePriceRow}>
              <View>
                <Text style={styles.mainTitle}>{fish.name}</Text>
                <Text style={styles.scientificTitle}>{fish.scientific_name}</Text>
              </View>

              <View style={styles.priceContainer}>
                <Text style={styles.mainPrice}>
                  ${price.toFixed(2)} <Text style={styles.perPiece}>/pc</Text>
                </Text>
                {fish.discount_price && (
                  <Text style={styles.oldPriceStriked}>
                    ${fish.price.toFixed(2)}
                  </Text>
                )}
              </View>
            </View>

            {/* Big Hero Fish Image */}
            <View style={styles.heroFishWrap}>
              <Image source={{ uri: fish.image_url }} style={styles.heroFishImage} resizeMode="cover" />

              <View style={styles.habitatBadge}>
                <Text style={styles.habitatBadgeText}>
                  {fish.water_type === 'Marine' ? 'Marine Reef' : 'Freshwater Biotope'}
                </Text>
              </View>
            </View>

            {/* Specifications Section matching screenshot 3 */}
            <Text style={styles.sectionHeading}>Specifications</Text>
            <View style={styles.specsGrid}>
              {/* Spec 1: Weight / Bio */}
              <View style={styles.specCard}>
                <View style={styles.specIconWrap}>
                  <Scale size={18} color={colors.accentRose} />
                  <Text style={styles.specTag}>Age: 1y</Text>
                </View>
                <Text style={styles.specTitle}>Weight</Text>
                <Text style={styles.specSubtitle}>Mature & healthy</Text>
                <Text style={styles.specValue}>40–90 g</Text>
              </View>

              {/* Spec 2: Size */}
              <View style={styles.specCard}>
                <View style={styles.specIconWrap}>
                  <Ruler size={18} color={colors.accentRose} />
                  <Text style={styles.specTag}>Stage: Med</Text>
                </View>
                <Text style={styles.specTitle}>Size</Text>
                <Text style={styles.specSubtitle}>Growth stage</Text>
                <Text style={styles.specValue}>4–7 cm</Text>
              </View>

              {/* Spec 3: Water Parameters */}
              <View style={styles.specCard}>
                <View style={styles.specIconWrap}>
                  <Thermometer size={18} color={colors.accentRose} />
                  <Text style={styles.specTag}>Optimal</Text>
                </View>
                <Text style={styles.specTitle}>Water</Text>
                <Text style={styles.specSubtitle}>pH {fish.ph_min}–{fish.ph_max}</Text>
                <Text style={styles.specValue}>{fish.temp_min}–{fish.temp_max}°C</Text>
              </View>

              {/* Spec 4: Tank Size */}
              <View style={styles.specCard}>
                <View style={styles.specIconWrap}>
                  <Box size={18} color={colors.accentRose} />
                  <Text style={styles.specTag}>Min Tank</Text>
                </View>
                <Text style={styles.specTitle}>Tank Size</Text>
                <Text style={styles.specSubtitle}>Recommended</Text>
                <Text style={styles.specValue}>from {fish.min_tank_liters} L</Text>
              </View>
            </View>

            {/* Description & Behavior */}
            <Text style={styles.sectionHeading}>Behavior & Origin</Text>
            <Text style={styles.bodyDescription}>{fish.description}</Text>

            {/* Expert Tips */}
            {fish.care_tips && (
              <View style={styles.expertTipsBox}>
                <View style={styles.expertTipsHeader}>
                  <Sparkles size={14} color={colors.accentRose} />
                  <Text style={styles.expertTipsTitle}>Ichthyologist Care Guide</Text>
                </View>
                <Text style={styles.expertTipsText}>{fish.care_tips}</Text>
              </View>
            )}

            {/* Quantity and Actions Bar */}
            <View style={styles.actionsBar}>
              <View style={styles.qtyPicker}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQty(Math.max(1, qty - 1))}
                >
                  <Minus size={14} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.qtyNumber}>{qty}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQty(qty + 1)}
                >
                  <Plus size={14} color="#FFF" />
                </TouchableOpacity>
              </View>

              {/* Main Glowing Button matching screenshot 3 */}
              <TouchableOpacity
                // @ts-ignore
                className="main-cta-button"
                style={styles.mainGlowButton}
                onPress={handleAddToCart}
                activeOpacity={0.88}
              >
                <Text style={styles.mainGlowButtonText}>
                  Add to Cart • ${(price * qty).toFixed(2)}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Compatibility Action */}
            <TouchableOpacity
              // @ts-ignore
              className="scanner-btn-interactive"
              style={styles.compatibilityCheckBtn}
              onPress={handleOpenScanner}
              activeOpacity={0.85}
            >
              <Dna size={14} color={colors.textMuted} />
              <Text style={styles.compatibilityCheckText}>
                {isInAquarium
                  ? 'View in Compatibility Scanner'
                  : 'Test in Virtual Aquarium Tank'}
              </Text>
            </TouchableOpacity>

            {/* Reviews Section */}
            <View style={styles.reviewsSection}>
              <View style={styles.reviewHeadingRow}>
                <Text style={styles.sectionHeading}>
                  Customer Reviews ({fish.reviews?.length || 0})
                </Text>
                <View style={styles.ratingBadgeWrap}>
                  <Star size={12} color={colors.accentGold} fill={colors.accentGold} />
                  <Text style={styles.ratingBadgeText}>{fish.rating}</Text>
                </View>
              </View>

              {fish.reviews && fish.reviews.length > 0 ? (
                fish.reviews.map((rev) => (
                  <View key={rev.id} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewAuthor}>{rev.author_name}</Text>
                      <View style={styles.starsRow}>
                        {Array.from({ length: rev.rating }).map((_, idx) => (
                          <Star key={idx} size={10} color={colors.accentGold} fill={colors.accentGold} />
                        ))}
                      </View>
                    </View>
                    <Text style={styles.reviewComment}>{rev.comment}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyReviews}>No reviews yet. Be the first to review!</Text>
              )}

              {/* Review Form */}
              <View style={styles.reviewFormBox}>
                <Text style={styles.reviewFormTitle}>Write a Review</Text>
                {reviewSuccess && (
                  <View style={styles.reviewSuccessRow}>
                    <Check size={14} color={colors.success} />
                    <Text style={styles.reviewSuccessMsg}>Review published successfully!</Text>
                  </View>
                )}
                <View style={styles.reviewFormRow}>
                  <TextInput
                    style={styles.reviewNameInput}
                    placeholder="Your Name"
                    placeholderTextColor={colors.textDim}
                    value={authorName}
                    onChangeText={setAuthorName}
                  />
                  <View style={styles.starPickerRow}>
                    {[5, 4, 3, 2, 1].map((s) => (
                      <TouchableOpacity
                        key={s}
                        style={[styles.starBtn, rating === s && styles.starBtnActive]}
                        onPress={() => setRating(s)}
                      >
                        <Text style={styles.starBtnText}>{s}★</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TextInput
                  style={[styles.reviewNameInput, styles.reviewTextArea]}
                  placeholder="Share details about fish vitality and acclimation..."
                  placeholderTextColor={colors.textDim}
                  value={comment}
                  onChangeText={setComment}
                  multiline
                />

                <TouchableOpacity
                  style={[styles.submitReviewBtn, submittingReview && { opacity: 0.6 }]}
                  onPress={handleSubmitReview}
                  disabled={submittingReview}
                >
                  <Text style={styles.submitReviewBtnText}>
                    {submittingReview ? 'Submitting...' : 'Post Review'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 10, 14, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backdropFilter: 'blur(16px)',
  },
  modalBox: {
    backgroundColor: '#1C131A',
    width: '100%',
    maxWidth: 720,
    maxHeight: '92%',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    boxShadow: '0 24px 70px rgba(0, 0, 0, 0.8)',
    overflow: 'hidden',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: '#221820',
  },
  backCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarCenterTitle: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 184, 0, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.3)',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  ratingPillText: {
    color: colors.accentGold,
    fontSize: 12.5,
    fontWeight: '800',
  },
  scrollArea: {
    padding: 24,
  },
  titlePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 12,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  scientificTitle: {
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.textDim,
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  mainPrice: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  perPiece: {
    fontSize: 14,
    color: colors.textDim,
    fontWeight: '600',
  },
  oldPriceStriked: {
    fontSize: 13,
    color: colors.textDim,
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  heroFishWrap: {
    height: 260,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#281C25',
    position: 'relative',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  heroFishImage: {
    width: '100%',
    height: '100%',
  },
  habitatBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(20, 14, 19, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  habitatBadgeText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 14,
    marginTop: 6,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  specCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#251922',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 20,
    padding: 14,
  },
  specIconWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  specTag: {
    fontSize: 9.5,
    color: colors.textDim,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  specTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textLight,
  },
  specSubtitle: {
    fontSize: 10.5,
    color: colors.textDim,
    marginVertical: 2,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.accentRose,
    marginTop: 4,
  },
  bodyDescription: {
    fontSize: 13.5,
    lineHeight: 22,
    color: colors.textMuted,
    marginBottom: 16,
  },
  expertTipsBox: {
    backgroundColor: 'rgba(229, 57, 116, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(229, 57, 116, 0.25)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
  },
  expertTipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  expertTipsTitle: {
    color: colors.accentRose,
    fontSize: 13,
    fontWeight: '800',
  },
  expertTipsText: {
    color: colors.textMuted,
    fontSize: 12.5,
    lineHeight: 19,
  },
  actionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  qtyPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#281C25',
    borderRadius: 20,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  qtyBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  qtyNumber: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
    paddingHorizontal: 12,
  },
  mainGlowButton: {
    flex: 1,
    backgroundColor: '#4D3346',
    borderWidth: 1,
    borderColor: 'rgba(229, 57, 116, 0.6)',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    boxShadow: '0 0 25px rgba(229, 57, 116, 0.35)',
  },
  mainGlowButtonText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
  },
  compatibilityCheckBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    paddingVertical: 12,
    marginBottom: 24,
  },
  compatibilityCheckText: {
    color: colors.textMuted,
    fontSize: 12.5,
    fontWeight: '700',
  },
  reviewsSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 16,
  },
  reviewCard: {
    backgroundColor: '#241921',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reviewAuthor: {
    color: colors.textLight,
    fontSize: 12.5,
    fontWeight: '700',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
  },
  emptyReviews: {
    color: colors.textDim,
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  reviewFormBox: {
    backgroundColor: '#20161E',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginTop: 10,
  },
  reviewFormTitle: {
    color: colors.textLight,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 10,
  },
  reviewSuccessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  reviewSuccessMsg: {
    color: colors.success,
    fontSize: 12,
    fontWeight: '700',
  },
  reviewFormRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  reviewNameInput: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#291C26',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: colors.textLight,
    fontSize: 12.5,
    outlineStyle: 'none',
  },
  starPickerRow: {
    flexDirection: 'row',
    gap: 4,
  },
  starBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  starBtnActive: {
    backgroundColor: colors.accentGold,
  },
  starBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  reviewTextArea: {
    height: 60,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  submitReviewBtn: {
    backgroundColor: colors.accentRose,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  reviewHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  ratingBadgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 184, 0, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  ratingBadgeText: {
    color: colors.accentGold,
    fontSize: 12,
    fontWeight: '800',
  },
  submitReviewBtnText: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
});
