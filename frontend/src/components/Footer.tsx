import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { colors } from '../theme/tokens';

export const Footer: React.FC = () => {
  return (
    <View style={styles.footerWrap}>
      <View style={styles.innerFooter}>
        {/* Brand Column */}
        <View style={styles.brandCol}>
          <View style={styles.brandRow}>
            <Sparkles size={22} color={colors.accentRose} />
            <Text style={styles.brandName}>AQUAVIBE</Text>
          </View>
          <Text style={styles.brandDesc}>
            Premium aquatic boutique & certified quarantine laboratory. Specializing in healthy, captive-bred popular and rare freshwater & marine species.
          </Text>
          <View style={styles.citesBadge}>
            <ShieldCheck size={14} color={colors.accentRose} />
            <Text style={styles.citesText}>100% Guaranteed Live Arrival • 21-Day Lab Quarantine</Text>
          </View>
        </View>

        {/* Contacts & Showroom */}
        <View style={styles.col}>
          <Text style={styles.colTitle}>Showroom & Lab</Text>
          <Text style={styles.colItem}>108 Marine Way, Suite 400, Seattle, WA</Text>
          <Text style={styles.colItem}>Daily: 10:00 AM — 9:00 PM EST (7 days a week)</Text>
          <Text style={styles.colItem}>Toll-Free: +1 (800) 555-AQUA</Text>
          <Text style={styles.colItem}>Support / Chat: +1 (555) 888-FISH</Text>
        </View>

        {/* Standards */}
        <View style={styles.col}>
          <Text style={styles.colTitle}>Quality Assurance</Text>
          <Text style={styles.colItem}>Live Arrival Guarantee or 100% Refund</Text>
          <Text style={styles.colItem}>Veterinary Certifications & CITES compliance</Text>
          <Text style={styles.colItem}>Autonomous Medical O₂ Thermoboxes</Text>
          <Text style={styles.colItem}>Complimentary 24/7 Ichthyologist Guidance</Text>
        </View>
      </View>

      <View style={styles.bottomBar}>
        <Text style={styles.copyText}>
          © 2026 AQUAVIBE Reef & Freshwater Biosphere. All rights reserved.
        </Text>
        <Text style={styles.techText}>
          TypeScript • React Native Web • FastAPI • PostgreSQL • Docker Powered
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerWrap: {
    backgroundColor: '#100B0E',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 24,
  },
  innerFooter: {
    maxWidth: 1280,
    marginHorizontal: 'auto',
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 32,
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  brandCol: {
    flex: 1.4,
    minWidth: 280,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 2,
  },
  brandDesc: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  citesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(229, 57, 116, 0.1)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(229, 57, 116, 0.25)',
    alignSelf: 'flex-start',
  },
  citesText: {
    color: colors.accentRose,
    fontSize: 11,
    fontWeight: '700',
  },
  col: {
    flex: 1,
    minWidth: 220,
    gap: 8,
  },
  colTitle: {
    color: colors.textLight,
    fontSize: 13.5,
    fontWeight: '800',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  colItem: {
    color: colors.textDim,
    fontSize: 12.5,
    lineHeight: 18,
  },
  bottomBar: {
    maxWidth: 1280,
    marginHorizontal: 'auto',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  copyText: {
    color: colors.textDim,
    fontSize: 12,
  },
  techText: {
    color: colors.textDim,
    fontSize: 11.5,
    fontWeight: '600',
  },
});
