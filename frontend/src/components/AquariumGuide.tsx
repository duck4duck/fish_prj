import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Thermometer, Droplets, ArrowRight, Moon } from 'lucide-react';
import { colors } from '../theme/tokens';

const STEPS = [
  {
    num: '01',
    title: 'Temperature Balance',
    desc: 'Float the sealed bag in the aquarium for 20 minutes to equalize water temperature without thermal shock.',
    Icon: Thermometer,
    color: colors.accentRose,
  },
  {
    num: '02',
    title: 'Drip Acclimation',
    desc: 'Slowly siphon aquarium water into the acclimation container (2-3 drops per second) to gradually adjust pH and hardness.',
    Icon: Droplets,
    color: '#D8315B',
  },
  {
    num: '03',
    title: 'Net Transfer',
    desc: 'Gently transfer the fish into the tank with a soft net. Never pour the transport bag water into your main aquarium.',
    Icon: ArrowRight,
    color: '#FF6B6B',
  },
  {
    num: '04',
    title: 'Rest & Dim Light',
    desc: 'Keep tank lights off for the first 6-8 hours. The semi-darkness calms the fish and allows it to safely explore hiding spots.',
    Icon: Moon,
    color: colors.accentGold,
  },
];

export const AquariumGuide: React.FC = () => {
  return (
    <View style={styles.sectionWrap}>
      <View style={styles.innerWrap}>
        <View style={styles.header}>
          <Text style={styles.preTitle}>ICHTHYOLOGIST PROTOCOL</Text>
          <Text style={styles.mainTitle}>
            How to Acclimate Your Fish Safely
          </Text>
          <Text style={styles.subtitle}>
            Following standard drip acclimation ensures zero stress and 100% adaptation for all aquatic species.
          </Text>
        </View>

        <View style={styles.stepsGrid}>
          {STEPS.map((step) => {
            const Icon = step.Icon;
            return (
              <View key={step.num} style={styles.stepCard}>
                <View style={styles.stepTopRow}>
                  <View style={[styles.stepNumWrap, { borderColor: step.color }]}>
                    <Text style={[styles.stepNum, { color: step.color }]}>{step.num}</Text>
                  </View>
                  <Icon size={20} color={step.color} />
                </View>

                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDesc}>{step.desc}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionWrap: {
    backgroundColor: '#181116',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 50,
    paddingHorizontal: 24,
    marginTop: 40,
  },
  innerWrap: {
    maxWidth: 1280,
    marginHorizontal: 'auto',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 35,
  },
  preTitle: {
    color: colors.accentRose,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 6,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 620,
  },
  stepsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  stepCard: {
    flex: 1,
    minWidth: 250,
    maxWidth: 290,
    backgroundColor: '#251922',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 22,
    padding: 20,
  },
  stepTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  stepNumWrap: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  stepNum: {
    fontSize: 13,
    fontWeight: '900',
  },
  stepTitle: {
    color: colors.textLight,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 8,
  },
  stepDesc: {
    color: colors.textMuted,
    fontSize: 12.5,
    lineHeight: 18,
  },
});
