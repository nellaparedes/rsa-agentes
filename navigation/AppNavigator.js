import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/auth/LoginScreen';
import VerifyEmail from '../screens/VerifyEmail';
import SetPassword from '../screens/auth/SetPassword';
import ForgetPassword from '../screens/auth/ForgetPassword';
import MainTabNavigator from './MainTabNavigator';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Verify" component={VerifyEmail} />
        <Stack.Screen name="ForgetPass" component={ForgetPassword} />
        <Stack.Screen name="SetPass" component={SetPassword} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
