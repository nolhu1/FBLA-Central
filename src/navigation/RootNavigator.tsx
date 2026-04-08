import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable } from "react-native";
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { palette } from "@/theme";
import { useRestoreSessionQuery } from "@/store/services/fblaApi";
import { AppLogoMark } from "@/components/branding/AppLogoMark";

import { SignInScreen } from "@/screens/auth/SignInScreen";
import { OnboardingScreen } from "@/screens/auth/OnboardingScreen";
import { HomeScreen } from "@/screens/home/HomeScreen";
import { EventsScreen } from "@/screens/events/EventsScreen";
import { EventDetailScreen } from "@/screens/events/EventDetailScreen";
import { ResourcesScreen } from "@/screens/resources/ResourcesScreen";
import { ResourceDetailScreen } from "@/screens/resources/ResourceDetailScreen";
import { PdfViewerScreen } from "@/screens/resources/PdfViewerScreen";
import { NewsScreen } from "@/screens/news/NewsScreen";
import { NewsDetailScreen } from "@/screens/news/NewsDetailScreen";
import { SocialHubScreen } from "@/screens/social/SocialHubScreen";
import { StudyScreen } from "@/screens/study/StudyScreen";
import { StudyTrackDetailScreen } from "@/screens/study/StudyTrackDetailScreen";
import { StudyPracticeBrowserScreen } from "@/screens/study/StudyPracticeBrowserScreen";
import { StudyPracticeDetailScreen } from "@/screens/study/StudyPracticeDetailScreen";
import { FlashcardPracticeScreen } from "@/screens/study/FlashcardPracticeScreen";
import { QuizPracticeScreen } from "@/screens/study/QuizPracticeScreen";
import { CommunityScreen } from "@/screens/community/CommunityScreen";
import { CommunityThreadListScreen } from "@/screens/community/CommunityThreadListScreen";
import { CreateThreadScreen } from "@/screens/community/CreateThreadScreen";
import { ThreadDetailScreen } from "@/screens/community/ThreadDetailScreen";
import { ProfileScreen } from "@/screens/profile/ProfileScreen";
import { PreferencesScreen } from "@/screens/profile/PreferencesScreen";
import { EditProfileScreen } from "@/screens/profile/EditProfileScreen";
import { AIScreen } from "@/screens/ai/AIScreen";
import { SearchScreen } from "@/screens/search/SearchScreen";
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
      animation: "fade",
      headerStyle: { backgroundColor: palette.ink },
      headerTintColor: palette.cream,
      headerShadowVisible: false,
      headerTitle: "FBLA Central",
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
      headerLeft: () => <AppLogoMark />
    })}
  >
    <Tabs.Screen name="Home" component={HomeScreen} />
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
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "fade_from_bottom",
          contentStyle: { backgroundColor: palette.ink }
        }}
      >
        {!user ? (
          <RootStack.Screen name="SignIn" component={SignInScreen} />
        ) : !user.onboardingComplete ? (
          <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <>
            <RootStack.Screen name="MainTabs" component={MainTabs} />
            <RootStack.Screen name="EventDetail" component={EventDetailScreen} />
            <RootStack.Screen name="Resources" component={ResourcesScreen} />
            <RootStack.Screen name="ResourceDetail" component={ResourceDetailScreen} />
            <RootStack.Screen name="PdfViewer" component={PdfViewerScreen} />
            <RootStack.Screen name="News" component={NewsScreen} />
            <RootStack.Screen name="NewsDetail" component={NewsDetailScreen} />
            <RootStack.Screen name="SocialHub" component={SocialHubScreen} />
            <RootStack.Screen name="AI" component={AIScreen} />
            <RootStack.Screen name="Search" component={SearchScreen} />
            <RootStack.Screen name="StudyTrackDetail" component={StudyTrackDetailScreen} />
            <RootStack.Screen name="StudyPracticeBrowser" component={StudyPracticeBrowserScreen} />
            <RootStack.Screen name="StudyPracticeDetail" component={StudyPracticeDetailScreen} />
            <RootStack.Screen name="FlashcardPractice" component={FlashcardPracticeScreen} />
            <RootStack.Screen name="QuizPractice" component={QuizPracticeScreen} />
            <RootStack.Screen name="CommunityThreadList" component={CommunityThreadListScreen} />
            <RootStack.Screen name="CreateThread" component={CreateThreadScreen} />
            <RootStack.Screen name="ThreadDetail" component={ThreadDetailScreen} />
            <RootStack.Screen name="Preferences" component={PreferencesScreen} />
            <RootStack.Screen name="EditProfile" component={EditProfileScreen} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
