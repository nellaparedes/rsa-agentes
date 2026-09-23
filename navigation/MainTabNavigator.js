import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@react-navigation/native';
// Components
import TabBarIcon from '../components/TabBarIcon';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ComplianceScreen from '../screens/details/ComplianceScreen';
import CommissionsScreen from '../screens/details/CommissionsScreen';
import QuestionsScreen from '../screens/details/QuestionsScreen';
import PoliciesScreen from '../screens/PoliciesScreen';
import ConventionsScreen from '../screens/ConventionsScreen';
import MoreScreen from '../screens/MoreScreen';
import ProfileScreen from '../screens/more/ProfileScreen';
import PotentialScreen from '../screens/more/PotentialsScreen';
import AddPotentialStep1 from '../screens/more/AddPotentialStep1';
import AddPotentialStep2 from '../screens/more/AddPotentialStep2';
import SacScreen from '../screens/more/SacScreen';
import BirthdaysScreen from '../screens/more/BirthdaysScreen';
import NotificationsScreen from '../screens/more/NotificationsScreen';
import FolioScreen from '../screens/details/FolioScreen';
import ContractScreen from '../screens/details/ContractScreen';
import ClaimsScreen from '../screens/details/ClaimsScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBullseye, faDollar, faHome, faHomeAlt, faHomeLg, faPlus, faSackDollar, faShirt, faTShirt } from '@fortawesome/free-solid-svg-icons';

// Create a stack navigator
const Stack = createNativeStackNavigator();

// Home Stack
const HomeStackScreen = () => (
  <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Compliance" component={ComplianceScreen} />
    <Stack.Screen name="Folio" component={FolioScreen} />
    <Stack.Screen name="Contract" component={ContractScreen} />
    <Stack.Screen name="Claims" component={ClaimsScreen} />
    <Stack.Screen name="Questions" component={QuestionsScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Sac" component={SacScreen} />
    <Stack.Screen name="Potentials" component={PotentialScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="Birthdays" component={BirthdaysScreen} />
  </Stack.Navigator>
);

// ... Repeat the same pattern for other stacks ...

// Create a bottom tab navigator
const Tab = createBottomTabNavigator();

// Main Tab Navigator
const MainTabNavigator = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeStackScreen} options={{
        tabBarLabel: 'Inicio',
        tabBarIcon: ({ color, size }) => (
          <FontAwesomeIcon icon={faHomeLg} color={color} size={size} />
        ),
      }} />
      <Tab.Screen name="Commissions" component={CommissionsScreen} options={{
        tabBarLabel: 'Comisiones',
        tabBarIcon: ({ color, size }) => (
          <FontAwesomeIcon icon={faDollar} color={color} size={size} />
        ),
      }} />
      <Tab.Screen name="Policies" component={PoliciesScreen} options={{
        tabBarLabel: 'Polizas',
        tabBarIcon: ({ color, size }) => (
          <FontAwesomeIcon icon={faSackDollar} color={color} size={size} />
        ),
      }} />
      <Tab.Screen name="Conventions" component={ConventionsScreen} options={{
        tabBarLabel: 'Convenciones',
        tabBarIcon: ({ color, size }) => (
          <FontAwesomeIcon icon={faBullseye} color={color} size={size} />
        ),
      }} />
      <Tab.Screen name="More" component={MoreScreen} options={{
        tabBarLabel: 'Más',
        tabBarIcon: ({ color, size }) => (
          <FontAwesomeIcon icon={faPlus} color={color} size={size} />
        ),
      }} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
