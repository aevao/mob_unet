import { Image, ImageStyle, StyleProp } from 'react-native';

interface BackgroundLogoProps {
  size?: number;
  style?: StyleProp<ImageStyle>;
}

export const BackgroundLogo = ({ size = 80, style }: BackgroundLogoProps) => {
  return (
    <Image
      source={require('../../assets/backgroundLogo.jpg')}
      style={[{ width: size, height: size, borderRadius: 16 }, style]}
      resizeMode="contain"
    />
  );
};


