import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { ShoppingBag, X, CheckCircle, Plus, Minus, Trash2, Box, ShieldCheck, ArrowRight } from 'lucide-react';
import { colors } from '../theme/tokens';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

export const CartDrawer: React.FC = () => {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('Aqua-Thermobox with pure O2 (48h safe)');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  if (!isCartOpen) return null;

  const packagingFee = cart.length > 0 ? 15.0 : 0;
  const grandTotal = subtotal + packagingFee;

  const handleCheckout = async () => {
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      alert('Please fill in Name, Phone, and Delivery Address.');
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        delivery_method: deliveryMethod,
        notes: notes,
        items: cart.map((item) => ({
          fish_id: item.fish.id,
          quantity: item.quantity,
        })),
      };

      const result = await api.createOrder(orderPayload);
      setCompletedOrder(result);
      clearCart();
    } catch (err: any) {
      alert(err.message || 'Error processing order');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setCompletedOrder(null);
    setIsCartOpen(false);
  };

  return (
    <Modal visible={isCartOpen} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <View style={styles.drawerBox}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleWrap}>
              <ShoppingBag size={20} color={colors.accentRose} />
              <Text style={styles.headerTitle}>Shopping Cart</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
              <X size={15} color="#FFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
            {completedOrder ? (
              /* Order Confirmation Screen */
              <View style={styles.successScreen}>
                <View style={styles.successIconBadge}>
                  <CheckCircle size={32} color={colors.accentRose} />
                </View>

                <Text style={styles.successHeading}>Order Placed Successfully!</Text>
                <Text style={styles.orderNumberText}>
                  Tracking Number:{' '}
                  <Text style={styles.orderNumberHighlight}>{completedOrder.order_number}</Text>
                </Text>

                <View style={styles.orderSummaryCard}>
                  <Text style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Customer: </Text>
                    {completedOrder.customer_name} ({completedOrder.customer_phone})
                  </Text>
                  <Text style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Address: </Text>
                    {completedOrder.customer_address}
                  </Text>
                  <Text style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Delivery: </Text>
                    {completedOrder.delivery_method}
                  </Text>
                  <Text style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total Due: </Text>
                    <Text style={styles.summaryPriceHighlight}>
                      ${Number(completedOrder.total_amount).toFixed(2)}
                    </Text>
                  </Text>
                </View>

                <View style={styles.oxygenBadge}>
                  <ShieldCheck size={20} color={colors.accentRose} style={{ marginBottom: 6 }} />
                  <Text style={styles.oxygenText}>
                    Our ichthyologist has begun preparing your temperature-controlled oxygen thermobox. We will contact you within 15 minutes to verify the schedule!
                  </Text>
                </View>

                <TouchableOpacity style={styles.finishBtn} onPress={handleClose}>
                  <Text style={styles.finishBtnText}>Return to Catalog</Text>
                </TouchableOpacity>
              </View>
            ) : cart.length === 0 ? (
              /* Empty Cart */
              <View style={styles.emptyCartWrap}>
                <ShoppingBag size={48} color={colors.textDim} style={{ marginBottom: 12 }} />
                <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
                <Text style={styles.emptyCartSub}>
                  Explore our selection of popular aquarium species and add them to your cart.
                </Text>
                <TouchableOpacity style={styles.emptyBrowseBtn} onPress={handleClose}>
                  <Text style={styles.emptyBrowseBtnText}>Browse Fish</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* Normal Cart Content */
              <View style={styles.cartList}>
                {cart.map((item) => {
                  const price = item.fish.discount_price || item.fish.price;
                  const itemTotal = price * item.quantity;

                  return (
                    <View key={item.fish.id} style={styles.cartItem}>
                      <Image source={{ uri: item.fish.image_url }} style={styles.itemImg} />
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName} numberOfLines={1}>{item.fish.name}</Text>
                        <Text style={styles.itemWaterType}>
                          {item.fish.water_type} • {item.fish.category}
                        </Text>
                        <Text style={styles.itemPriceSingle}>
                          ${price.toFixed(2)} / pc
                        </Text>
                      </View>

                      {/* Qty controls */}
                      <View style={styles.itemActions}>
                        <View style={styles.qtyBox}>
                          <TouchableOpacity
                            // @ts-ignore
                            className="arrow-btn-interactive"
                            style={styles.qtyActionBtn}
                            onPress={() => updateQuantity(item.fish.id, item.quantity - 1)}
                          >
                            <Minus size={12} color="#FFF" />
                          </TouchableOpacity>
                          <Text style={styles.qtyValue}>{item.quantity}</Text>
                          <TouchableOpacity
                            // @ts-ignore
                            className="arrow-btn-interactive"
                            style={styles.qtyActionBtn}
                            onPress={() => updateQuantity(item.fish.id, item.quantity + 1)}
                          >
                            <Plus size={12} color="#FFF" />
                          </TouchableOpacity>
                        </View>

                        <Text style={styles.itemTotalPrice}>
                          ${itemTotal.toFixed(2)}
                        </Text>

                        <TouchableOpacity
                          // @ts-ignore
                          className="btn-hover-scale"
                          style={styles.removeBtn}
                          onPress={() => removeFromCart(item.fish.id)}
                        >
                          <Trash2 size={12} color={colors.danger} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}

                {/* Packaging Fee Card */}
                <View style={styles.packagingBox}>
                  <Box size={22} color={colors.accentRose} />
                  <View style={styles.packagingTextWrap}>
                    <Text style={styles.packagingTitle}>
                      Oxygen Thermobox with Heat Pod (+${packagingFee.toFixed(2)})
                    </Text>
                    <Text style={styles.packagingDesc}>
                      Required safe packaging for live fish delivery: maintains optimal temperature and oxygen for up to 48 hours.
                    </Text>
                  </View>
                </View>

                {/* Order Totals */}
                <View style={styles.totalsBox}>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalRowLabel}>Fish ({cart.length} items):</Text>
                    <Text style={styles.totalRowVal}>${subtotal.toFixed(2)}</Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalRowLabel}>Thermobox Packaging:</Text>
                    <Text style={styles.totalRowVal}>${packagingFee.toFixed(2)}</Text>
                  </View>
                  <View style={[styles.totalRow, styles.grandTotalRow]}>
                    <Text style={styles.grandTotalLabel}>Total:</Text>
                    <Text style={styles.grandTotalVal}>${grandTotal.toFixed(2)}</Text>
                  </View>
                </View>

                {/* Checkout Form */}
                <View style={styles.checkoutForm}>
                  <Text style={styles.formTitle}>Shipping Details</Text>

                  <View style={styles.formField}>
                    <Text style={styles.fieldLabel}>Recipient Name *</Text>
                    <TextInput
                      style={styles.fieldInput}
                      placeholder="Alex Miller"
                      placeholderTextColor={colors.textDim}
                      value={customerName}
                      onChangeText={setCustomerName}
                    />
                  </View>

                  <View style={styles.formField}>
                    <Text style={styles.fieldLabel}>Phone Number *</Text>
                    <TextInput
                      style={styles.fieldInput}
                      placeholder="+1 (555) 019-2834"
                      placeholderTextColor={colors.textDim}
                      value={customerPhone}
                      onChangeText={setCustomerPhone}
                    />
                  </View>

                  <View style={styles.formField}>
                    <Text style={styles.fieldLabel}>Delivery Address *</Text>
                    <TextInput
                      style={styles.fieldInput}
                      placeholder="742 Evergreen Terrace, Springfield, OR"
                      placeholderTextColor={colors.textDim}
                      value={customerAddress}
                      onChangeText={setCustomerAddress}
                    />
                  </View>

                  <View style={styles.formField}>
                    <Text style={styles.fieldLabel}>Delivery Method</Text>
                    <View style={styles.deliverySelector}>
                      {[
                        'Aqua-Thermobox with pure O2 (48h safe)',
                        'Express Courier with heated container',
                        'Local Pickup from Showroom',
                      ].map((method) => {
                        const active = deliveryMethod === method;
                        return (
                          <TouchableOpacity
                            key={method}
                            style={[styles.deliveryOption, active && styles.deliveryOptionActive]}
                            onPress={() => setDeliveryMethod(method)}
                          >
                            <Text style={[styles.deliveryText, active && styles.deliveryTextActive]}>
                              {active ? '● ' : '○ '}
                              {method}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  <View style={styles.formField}>
                    <Text style={styles.fieldLabel}>Notes (optional)</Text>
                    <TextInput
                      style={[styles.fieldInput, { height: 60 }]}
                      placeholder="Special instructions or preferred delivery time..."
                      placeholderTextColor={colors.textDim}
                      value={notes}
                      onChangeText={setNotes}
                      multiline
                    />
                  </View>

                  {/* Submit button */}
                  <TouchableOpacity
                    // @ts-ignore
                    className="main-cta-button"
                    style={[styles.checkoutBtn, submitting && { opacity: 0.7 }]}
                    onPress={handleCheckout}
                    disabled={submitting}
                    activeOpacity={0.88}
                  >
                    {submitting ? (
                      <ActivityIndicator color="#FFF" />
                    ) : (
                      <Text style={styles.checkoutBtnText}>
                        Place Order • ${grandTotal.toFixed(2)}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
  drawerBox: {
    backgroundColor: '#1C131A',
    width: '100%',
    maxWidth: 640,
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
    gap: 10,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textLight,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentScroll: {
    padding: 20,
  },
  emptyCartWrap: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyCartTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textLight,
    marginBottom: 6,
  },
  emptyCartSub: {
    fontSize: 13,
    color: colors.textDim,
    textAlign: 'center',
    maxWidth: 360,
    marginBottom: 20,
  },
  emptyBrowseBtn: {
    backgroundColor: '#3D2838',
    borderWidth: 1,
    borderColor: colors.accentRose,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  emptyBrowseBtnText: {
    color: '#FFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  cartList: {
    gap: 14,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#251922',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 12,
    alignItems: 'center',
  },
  itemImg: {
    width: 64,
    height: 64,
    borderRadius: 14,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: colors.textLight,
    fontSize: 13.5,
    fontWeight: '800',
  },
  itemWaterType: {
    color: colors.accentRose,
    fontSize: 11,
    marginTop: 2,
  },
  itemPriceSingle: {
    color: colors.textDim,
    fontSize: 11.5,
    marginTop: 2,
  },
  itemActions: {
    alignItems: 'flex-end',
    gap: 4,
  },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E141C',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  qtyActionBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  qtyValue: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '800',
    paddingHorizontal: 6,
  },
  itemTotalPrice: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '900',
  },
  removeBtn: {
    padding: 4,
  },
  packagingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(229, 57, 116, 0.08)',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(229, 57, 116, 0.25)',
  },
  packagingTextWrap: {
    flex: 1,
  },
  packagingTitle: {
    color: colors.accentRose,
    fontSize: 12.5,
    fontWeight: '800',
  },
  packagingDesc: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  totalsBox: {
    backgroundColor: '#251922',
    borderRadius: 18,
    padding: 16,
    gap: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalRowLabel: {
    color: colors.textDim,
    fontSize: 12.5,
  },
  totalRowVal: {
    color: colors.textLight,
    fontSize: 12.5,
    fontWeight: '600',
  },
  grandTotalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 10,
    marginTop: 4,
  },
  grandTotalLabel: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '800',
  },
  grandTotalVal: {
    color: colors.accentRose,
    fontSize: 18,
    fontWeight: '900',
  },
  checkoutForm: {
    backgroundColor: '#221820',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 12,
    marginTop: 8,
  },
  formTitle: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  formField: {
    gap: 5,
  },
  fieldLabel: {
    color: colors.textDim,
    fontSize: 11.5,
  },
  fieldInput: {
    backgroundColor: '#2A1C27',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: colors.textLight,
    fontSize: 13,
    outlineStyle: 'none',
  },
  deliverySelector: {
    gap: 6,
  },
  deliveryOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#2A1C27',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  deliveryOptionActive: {
    borderColor: colors.accentRose,
    backgroundColor: 'rgba(229, 57, 116, 0.12)',
  },
  deliveryText: {
    color: colors.textDim,
    fontSize: 12,
  },
  deliveryTextActive: {
    color: colors.accentRose,
    fontWeight: '700',
  },
  checkoutBtn: {
    backgroundColor: '#4D3346',
    borderWidth: 1,
    borderColor: 'rgba(229, 57, 116, 0.6)',
    borderRadius: 22,
    paddingVertical: 14,
    alignItems: 'center',
    boxShadow: '0 0 25px rgba(229, 57, 116, 0.35)',
    marginTop: 8,
  },
  checkoutBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  successScreen: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 14,
  },
  successIconBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(229, 57, 116, 0.15)',
    borderWidth: 2,
    borderColor: colors.accentRose,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successHeading: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.textLight,
  },
  orderNumberText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  orderNumberHighlight: {
    color: colors.accentRose,
    fontWeight: '900',
    fontSize: 16,
  },
  orderSummaryCard: {
    backgroundColor: '#251922',
    borderRadius: 18,
    padding: 16,
    width: '100%',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  summaryRow: {
    color: colors.textLight,
    fontSize: 12.5,
    lineHeight: 18,
  },
  summaryLabel: {
    color: colors.textDim,
  },
  summaryPriceHighlight: {
    color: colors.accentRose,
    fontWeight: '900',
  },
  oxygenBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(229, 57, 116, 0.08)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(229, 57, 116, 0.25)',
  },
  oxygenText: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  finishBtn: {
    backgroundColor: '#3D2838',
    borderWidth: 1,
    borderColor: colors.accentRose,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  finishBtnText: {
    color: '#FFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
});
