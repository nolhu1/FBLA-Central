import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text } from "react-native";

import { APP_MODE_LABEL } from "@/constants/config";
import { useAppSelector } from "@/store/hooks";
import { palette } from "@/theme";
import { useAppDispatch } from "@/store/hooks";
import { useRestoreSessionQuery } from "@/store/services/fblaApi";

import { SignInScreen } from "@/screens/auth/SignInScreen";
import { OnboardingScreen } from "@/screens/auth/OnboardingScreen";
import { HomeScreen } from "@/screens/home/HomeScreen";
import { EventsScreen } from "@/screens/events/EventsScreen";
import { EventDetailScreen } from "@/screens/events/EventDetailScreen";
import { ResourcesScreen } from "@/screens/resources/ResourcesScreen";
import { NewsScreen } from "@/screens/news/NewsScreen";
import { SocialHubScreen } from "@/screens/social/SocialHubScreen";
import { StudyScreen } from "@/screens/study/StudyScreen";
import { CommunityScreen } from "@/screens/community/CommunityScreen";
import { ThreadDetailScreen } from "@/screens/community/ThreadDetailScreen";
import { ProfileScreen } from "@/screens/profile/ProfileScreen";
import { AIScreen } from "@/screens/ai/AIScreen";
import { SearchScreen } from "@/screens/search/SearchScreen";
import { useEffect } from "react";
import { setBootstrapped, setUser } from "@/store/slices/sessionSlice";

const RootStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const appTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: palette.ink,
    card: palette.navy,
    text: palette.cream,
    primary: palette.gold,
    border: palette.border,
    notification: palette.gold
  }
};

const MainTabs = () => (
  <Tabs.Navigator
    screenOptions={({ route, navigation }) => ({
      headerStyle: { backgroundColor: palette.ink },
      headerTintColor: palette.cream,
      headerShadowVisible: false,
      tabBarStyle: {
        backgroundColor: "#08111e",
        borderTopColor: "rgba(255,255,255,0.08)",
        height: 72,
        paddingTop: 8
      },
      tabBarActiveTintColor: palette.gold,
      tabBarInactiveTintColor: palette.slate,
      tabBarIcon: ({ color, size }) => {
        const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
          Home: "home-outline",
          Events: "calendar-outline",
          Study: "school-outline",
          Community: "people-outline",
          Profile: "person-outline"
        };
        return <Ionicons name={iconMap[route.name]} size={size} color={color} />;
      },
      headerRight: () => (
        <Pressable onPress={() => navigation.navigate("Search" as never)} style={{ paddingHorizontal: 8 }}>
          <Ionicons name="search-outline" size={22} color={palette.cream} />
        </Pressable>
      ),
      headerLeft: () => (
        <Pressable onPress={() => navigation.navigate("AI" as never)} style={{ paddingHorizontal: 8 }}>
          <Text style={{ color: palette.sky, fontWeight: "700" }}>AI</Text>
        </Pressable>
      )
    })}
  >
    <Tabs.Screen name="Home" component={HomeScreen} options={{ headerTitle: APP_MODE_LABEL + " Mode" }} />
    <Tabs.Screen name="Events" component={EventsScreen} />
    <Tabs.Screen name="Study" component={StudyScreen} />
    <Tabs.Screen name="Community" component={CommunityScreen} />
    <Tabs.Screen name="Profile" component={ProfileScreen} />
  </Tabs.Navigator>
);

export const RootNavigator = () => {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useRestoreSessionQuery();
  const user = useAppSelector((state) => state.session.user);
  const isBootstrapped = useAppSelector((state) => state.session.isBootstrapped);

  useEffect(() => {
    if (!isLoading) {
      dispatch(setUser(data ?? null));
      dispatch(setBootstrapped(true));
    }
  }, [data, dispatch, isLoading]);

  if (!isBootstrapped) {
    return <ActivityIndicator style={{ flex: 1, backgroundColor: palette.ink }} color={palette.gold} />;
  }

  return (
    <NavigationContainer theme={appTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <RootStack.Screen name="SignIn" component={SignInScreen} />
        ) : !user.onboardingComplete ? (
          <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <>
            <RootStack.Screen name="MainTabs" component={MainTabs} />
            <RootStack.Screen name="EventDetail" component={EventDetailScreen} />
            <RootStack.Screen name="Resources" component={ResourcesScreen} />
            <RootStack.Screen name="News" component={NewsScreen} />
            <RootStack.Screen name="SocialHub" component={SocialHubScreen} />
            <RootStack.Screen name="AI" component={AIScreen} />
            <RootStack.Screen name="Search" component={SearchScreen} />
            <RootStack.Screen name="ThreadDetail" component={ThreadDetailScreen} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
