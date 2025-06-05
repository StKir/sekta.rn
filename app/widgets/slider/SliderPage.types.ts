import { StyleProp, ViewStyle } from 'react-native';

type PlaceId = string;
type PlaceTitle = string;
type PlaceType = string;
type PlaceDescription = string;
type PlaceImage = string;
type PlaceLink = string;

export interface Place {
  id: PlaceId;
  title: PlaceTitle;
  type: PlaceType;
  description: PlaceDescription;
  image: PlaceImage;
  link: PlaceLink;
}

export type SliderPageProps = {
  containerStyle?: StyleProp<ViewStyle>;
};
