// app/_layout.tsx
import { Stack } from "expo-router";
import AppWrapper from '../src/components/AppWrapper';

const StackLayout = () => {
  return (
    <AppWrapper>
      <Stack>
        {/* Tab layout entry point */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Login screen, no header */}
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
    </AppWrapper>
  );
};

export default StackLayout;
