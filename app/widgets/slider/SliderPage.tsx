import Swiper from 'react-native-deck-swiper';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  StatusBar,
  Animated,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import React, { useRef, useEffect, useCallback } from 'react';

import { useTheme } from '../../shared/theme';
import { OPACITY, SCALE, SIZES } from '../../shared/constants';

import places from './places.json';
import { Place } from './SliderPage.types';
import { createStyles } from './SliderPage.styles';

const SCREEN_WIDTH = Dimensions.get('window').width;
const MAX_SWIPE_DISTANCE = SCREEN_WIDTH * 0.4;

const SliderPage = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const scaleAnim = useRef(new Animated.Value(SCALE.INITIAL)).current;
  const opacityAnim = useRef(new Animated.Value(OPACITY.INITIAL)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const animateBackCard = useCallback(() => {
    scaleAnim.setValue(SCALE.INITIAL);
    opacityAnim.setValue(OPACITY.INITIAL);

    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: SCALE.FULL,
        duration: SIZES.ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: OPACITY.FULL,
        duration: SIZES.ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim]);

  const handleSwipeRight = (cardIndex: number) => {
    const place = (places as Place[])[cardIndex];
    console.log('Пользователь лайкнул:', place);
  };

  const handleSwipeLeft = (cardIndex: number) => {
    const place = (places as Place[])[cardIndex];
    console.log('Пользователь не лайкнул:', place);
  };

  const handleSwiping = (x: number) => {
    const absX = Math.abs(x);
    const opacity = Math.min(absX / MAX_SWIPE_DISTANCE, 0.6);

    overlayOpacity.setValue(opacity);
  };

  const renderCard = (card: Place) => (
    <View style={styles.card}>
      <Image source={{ uri: card.image }} style={styles.image} />
      <View style={styles.text_container}>
        <Text style={styles.title}>{card.title}</Text>
        <Text style={styles.type}>{card.type}</Text>
        <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(card.link)}>
          <Text style={styles.buttonText}>Перейти</Text>
        </TouchableOpacity>
        <Text style={styles.description}>{card.description}</Text>
      </View>
    </View>
  );

  useEffect(() => {
    animateBackCard();
  }, [animateBackCard]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor='transparent' barStyle='light-content' />
      <Swiper
        animateCardOpacity
        infinite
        backgroundColor={'transparent'}
        cardIndex={0}
        cards={places as Place[]}
        overlayLabels={{
          left: {
            title: 'НЕТ',
            style: {
              label: {
                color: colors.DANGER,
                width: '100%',
                textAlign: 'right',
                fontSize: SIZES.FONT_SIZE.LARGE,
              },
            },
          },
          right: {
            title: 'ДА',
            style: {
              label: {
                color: colors.SUCCESS,
                fontSize: SIZES.FONT_SIZE.LARGE,
              },
            },
          },
        }}
        renderCard={renderCard}
        secondCardZoom={0.9}
        stackScale={8}
        stackSeparation={14}
        stackSize={6}
        swipeAnimationDuration={300}
        verticalSwipe={false}
        onSwipedLeft={(index) => {
          handleSwipeLeft(index);
          animateBackCard();
        }}
        onSwipedRight={(index) => {
          handleSwipeRight(index);
          animateBackCard();
        }}
        onSwiping={handleSwiping}
      />
    </SafeAreaView>
  );
};

export default SliderPage;
