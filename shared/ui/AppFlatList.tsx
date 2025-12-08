import { FlatList, FlatListProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppFlatListProps<ItemT> extends FlatListProps<ItemT> {
  withTabBar?: boolean;
  withPadding?: boolean;
}

export function AppFlatList<ItemT>({
  contentContainerStyle,
  withTabBar = true,
  withPadding = true,
  ...rest
}: AppFlatListProps<ItemT>) {
  const insets = useSafeAreaInsets();

  // Высота таб бара обычно около 60-80px, добавляем небольшой отступ
  const tabBarHeight = withTabBar ? 80 : 0;
  const bottomPadding = tabBarHeight + (insets.bottom || 0) + 16;

  const defaultStyles = withPadding
    ? {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: bottomPadding,
      }
    : {
        paddingBottom: bottomPadding,
      };

  return (
    <FlatList
      {...rest}
      contentContainerStyle={[defaultStyles, contentContainerStyle]}
    />
  );
}

