import { Image, ImageStyle, StyleProp } from 'react-native';

interface KstuLogoProps {
  size?: number;
  style?: StyleProp<ImageStyle>;
}

export const KstuLogo = ({ size = 80, style }: KstuLogoProps) => {
  return (
    <Image
      source={require('../../assets/kstu.png')}
      style={[{ width: size, height: size, borderRadius: 16 }, style]}
      resizeMode="contain"
    />
  );
};


