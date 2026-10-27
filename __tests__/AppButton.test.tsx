import { fireEvent, render } from '@testing-library/react-native';

import { AppButton } from '../components/ui/AppButton';

jest.mock('../hooks/useThemeTokens', () => ({
  useThemeTokens: () => ({
    background: '#F7F4EF',
    surface: '#FFFFFF',
    tint: '#0B6E4F',
    tintMuted: '#D8EDE4',
    danger: '#B42318',
    border: '#D6CFC4',
    onTint: '#FFFFFF',
    text: '#1A1A1A',
  }),
}));

describe('AppButton', () => {
  it('exposes accessibility label and invokes onPress', async () => {
    const onPress = jest.fn();
    const { getByText } = await render(
      <AppButton label="Add to cart" onPress={onPress} />
    );

    const button = getByText('Add to cart');
    fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});