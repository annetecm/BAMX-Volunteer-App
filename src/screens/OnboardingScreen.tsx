import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface OnboardingItem {
  id: string;
  title: string;
  description: string;
  image: any;
  imageType: 'illustration' | 'photo';
}

const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    title: 'Apoya a la comunidad',
    description: 'Acompaña a los voluntarios, brinda orientación y fomenta un ambiente de colaboración.',
    image: require('../../assets/man1.png'),
    imageType: 'illustration',
  },
  {
    id: '2',
    title: 'Lidera con propósito',
    description: 'Supervisa las actividades y guía a los voluntarios para lograr un impacto positivo.',
    image: require('../../assets/man2.png'),
    imageType: 'illustration',
  },
  {
    id: '3',
    title: 'Únete a nuestro equipo',
    description: 'Intégrate con nuestro equipo de voluntarios',
    image: require('../../assets/team1.png'),
    imageType: 'photo',
  },
];
const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList>(null);

  const renderOnboardingItem = ({ item }: { item: OnboardingItem }) => (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>
        <Image
          source={item.image}
          style={[
            styles.image,
            item.imageType === 'photo' ? styles.photoImage : styles.illustrationImage,
          ]}
          resizeMode={item.imageType === 'photo' ? 'cover' : 'contain'}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      {/* Contenido deslizable */}
      <View style={styles.contentArea}>
        <FlatList
          ref={flatListRef}
          data={onboardingData}
          renderItem={renderOnboardingItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumEnd}
        />

        {/* Puntos fijos */}
        <View style={styles.paginationFixed}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Sección naranja fija */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>Inicia sesión</Text>
        </TouchableOpacity>

        <View style={styles.skipContainer}>
          <Text style={styles.skipText}>o</Text>
        </View>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.signupButtonText}>Crea una cuenta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const DOT_SIZE = 8;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentArea: {
    flex: 1,
    position: 'relative',
  },
  slide: {
    width: screenWidth,
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  image: {
    width: screenWidth * 0.7,
    height: screenHeight * 0.35,
  },
  illustrationImage: {},
  photoImage: {
    borderRadius: 12,
  },
  textContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 50, 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  paginationFixed: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  activeDot: {
    backgroundColor: '#FF6B35',
  },
  inactiveDot: {
    backgroundColor: '#E0E0E0',
  },
  buttonContainer: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 50,
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
  signupButton: {
    backgroundColor: '#333333',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  skipContainer: {
    alignItems: 'center',
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default OnboardingScreen;
