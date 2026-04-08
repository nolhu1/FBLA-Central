import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppScreen } from "@/components/common/AppScreen";
import { AgendaSection } from "@/components/events/AgendaSection";
import { CalendarDayEventList } from "@/components/events/CalendarDayEventList";
import { CalendarMonthView } from "@/components/events/CalendarMonthView";
import { EventFilterBar } from "@/components/events/EventFilterBar";
import { EventsHeader } from "@/components/events/EventsHeader";
import { EventViewSwitcher } from "@/components/events/EventViewSwitcher";
import {
  EventCategoryFilter,
  EventScopeFilter,
  EventViewMode,
  applyEventFilters,
  buildAgendaGroups,
  buildCalendarMonth,
  buildEventRecords,
  buildSavedGroups,
  formatMonthLabel,
  getCalendarSubtitle,
  getEmptyStateCopy,
  getRecordsForDate,
  moveMonth,
  pickInitialSelectedDate
} from "@/domain/services/events";
import { useGetEventSavesQuery, useGetEventsQuery, useGetOrganizationsQuery, useUpdateEventSaveMutation } from "@/store/services/fblaApi";
import { palette, theme } from "@/theme";

export const EventsScreen = ({ navigation }: any) => {
  const { data: events = [] } = useGetEventsQuery();
  const { data: saves = [] } = useGetEventSavesQuery();
  const { data: organizations = [] } = useGetOrganizationsQuery();
  const [updateEventSave] = useUpdateEventSaveMutation();

  const today = useMemo(() => new Date(), []);
  const [view, setView] = useState<EventViewMode>("calendar");
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(today);
  const [category, setCategory] = useState<EventCategoryFilter>("all");
  const [scope, setScope] = useState<EventScopeFilter>("all");
  const [savedOnly, setSavedOnly] = useState(false);
  const [showCalendarLink, setShowCalendarLink] = useState(false);
  const [showCopiedState, setShowCopiedState] = useState(false);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const overlayTranslateY = useRef(new Animated.Value(-8)).current;

  const records = useMemo(
    () => buildEventRecords(events, saves, organizations, today),
    [events, organizations, saves, today]
  );

  const visibleRecords = useMemo(
    () =>
      applyEventFilters(records, {
        month,
        category,
        scope,
        savedOnly: view === "saved" ? true : savedOnly
      }),
    [category, month, records, savedOnly, scope, view]
  );

  useEffect(() => {
    setSelectedDate(pickInitialSelectedDate(month, visibleRecords, today));
  }, [month, today, visibleRecords]);

  const calendarDays = useMemo(
    () => buildCalendarMonth(month, visibleRecords, selectedDate, today),
    [month, selectedDate, today, visibleRecords]
  );

  const dayRecords = useMemo(() => getRecordsForDate(visibleRecords, selectedDate), [selectedDate, visibleRecords]);
  const agendaGroups = useMemo(() => buildAgendaGroups(visibleRecords), [visibleRecords]);
  const savedGroups = useMemo(() => buildSavedGroups(visibleRecords), [visibleRecords]);
  const activeGroups = view === "saved" ? savedGroups : agendaGroups;

  const hasFilters = category !== "all" || scope !== "all" || savedOnly || view === "saved";
  const emptyState = getEmptyStateCopy(view, hasFilters);
  const totalSavedThisMonth = visibleRecords.filter((item) => item.isSaved).length;
  const urgentCount = visibleRecords.filter((item) => item.urgency === "urgent").length;

  const handleMonthChange = (offset: number) => {
    setMonth((current) => moveMonth(current, offset));
  };

  const handleToggleSave = async (eventId: string, isSaved: boolean) => {
    await updateEventSave({ eventId, isSaved: !isSaved });
  };

  const subtitle =
    view === "saved"
      ? `${formatMonthLabel(month)} • your schedule`
      : view === "calendar"
        ? getCalendarSubtitle(month, visibleRecords.length)
        : `${formatMonthLabel(month)} • agenda view`;
  const isCalendarView = view === "calendar";
  const calendarLink = useMemo(() => {
    const eventIds = dayRecords.slice(0, 4).map((record) => record.event.id).join(",");
    const dateLabel = selectedDate.toISOString().slice(0, 10);
    return `https://calendar.google.com/calendar/u/0/r?cid=fbla-central%40group.calendar.google.com&date=${encodeURIComponent(dateLabel)}&events=${encodeURIComponent(eventIds || "calendar-view")}`;
  }, [dayRecords, selectedDate]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: showCalendarLink ? 1 : 0,
        duration: showCalendarLink ? 180 : 140,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      }),
      Animated.timing(overlayTranslateY, {
        toValue: showCalendarLink ? 0 : -8,
        duration: showCalendarLink ? 180 : 140,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      })
    ]).start();
  }, [overlayOpacity, overlayTranslateY, showCalendarLink]);

  useEffect(() => {
    if (!showCopiedState) return;
    const timeout = setTimeout(() => setShowCopiedState(false), 1300);
    return () => clearTimeout(timeout);
  }, [showCopiedState]);

  return (
    <AppScreen scroll={false} includeTopSafeArea={false} showBackButton={false} hideDefaultHeader title="">
      <View style={styles.screen}>
        <EventsHeader
          title="Events"
          subtitle={subtitle}
          onPressSearch={() => navigation.navigate("Search")}
          onPressSaved={() => setView("saved")}
        />

        <View style={styles.switcherRow}>
          <EventViewSwitcher value={view} onChange={setView} />
          {isCalendarView ? (
            <Pressable
              style={({ pressed }) => [styles.calendarLinkButton, pressed ? styles.pressed : null]}
              onPress={() => setShowCalendarLink((current) => !current)}
            >
              <Ionicons name="logo-google" size={14} color={palette.cream} />
              <Text style={styles.calendarLinkButtonLabel}>Calendar</Text>
              <Ionicons
                name={showCalendarLink ? "chevron-up-outline" : "chevron-down-outline"}
                size={14}
                color={palette.sky}
              />
            </Pressable>
          ) : null}
        </View>

        {isCalendarView && showCalendarLink ? (
          <Animated.View
            style={[
              styles.calendarOverlay,
              {
                opacity: overlayOpacity,
                transform: [{ translateY: overlayTranslateY }]
              }
            ]}
          >
            <Text style={styles.calendarOverlayTitle}>Google Calendar link</Text>
            <Text style={styles.calendarOverlayBody}>
              Share this calendar view for a clean Google Calendar handoff during the presentation.
            </Text>
            <View style={styles.calendarLinkShell}>
              <Text style={styles.calendarLinkText} numberOfLines={2}>
                {calendarLink}
              </Text>
            </View>
            <View style={styles.calendarOverlayActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.copyButton,
                  showCopiedState ? styles.copyButtonActive : null,
                  pressed ? styles.pressed : null
                ]}
                onPress={() => setShowCopiedState(true)}
              >
                <Ionicons
                  name={showCopiedState ? "checkmark-outline" : "copy-outline"}
                  size={14}
                  color={showCopiedState ? palette.ink : palette.cream}
                />
                <Text style={[styles.copyButtonLabel, showCopiedState ? styles.copyButtonLabelActive : null]}>
                  {showCopiedState ? "Copied" : "Copy link"}
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        ) : null}

        {!isCalendarView ? (
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{visibleRecords.length}</Text>
              <Text style={styles.statLabel}>In view</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{urgentCount}</Text>
              <Text style={styles.statLabel}>Urgent</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalSavedThisMonth}</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
          </View>
        ) : null}

        <EventFilterBar
          month={month}
          onMonthChange={handleMonthChange}
          category={category}
          onCategoryChange={setCategory}
          scope={scope}
          onScopeChange={setScope}
          savedOnly={savedOnly}
          onToggleSavedOnly={view === "saved" ? undefined : () => setSavedOnly((current) => !current)}
        />

        {isCalendarView ? (
          <View style={styles.calendarBody}>
            <CalendarMonthView days={calendarDays} onSelectDate={setSelectedDate} compact />
            <CalendarDayEventList
              compact
              title={selectedDate.toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric"
              })}
              records={dayRecords}
              onOpenEvent={(eventId) => navigation.navigate("EventDetail", { eventId })}
              onToggleSave={handleToggleSave}
            />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {activeGroups.length ? (
              activeGroups.map((group) => (
                <AgendaSection
                  key={group.key}
                  group={group}
                  onOpenEvent={(eventId) => navigation.navigate("EventDetail", { eventId })}
                  onToggleSave={handleToggleSave}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>{emptyState.title}</Text>
                <Text style={styles.emptyBody}>{emptyState.body}</Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: theme.spacing.md,
    minHeight: 0,
    paddingBottom: 4
  },
  switcherRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm
  },
  calendarLinkButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: palette.border
  },
  calendarLinkButtonLabel: {
    ...theme.typography.label,
    color: palette.cream
  },
  calendarOverlay: {
    borderRadius: theme.radius.md,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border,
    gap: 8
  },
  calendarOverlayTitle: {
    ...theme.typography.label,
    color: palette.sky,
    textTransform: "uppercase"
  },
  calendarOverlayBody: {
    ...theme.typography.body,
    color: palette.mist
  },
  calendarLinkShell: {
    borderRadius: theme.radius.sm,
    padding: 10,
    backgroundColor: "rgba(3,10,18,0.26)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)"
  },
  calendarLinkText: {
    ...theme.typography.label,
    color: palette.cream
  },
  calendarOverlayActions: {
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  copyButton: {
    minHeight: 34,
    paddingHorizontal: 12,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "rgba(255,255,255,0.06)",
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  copyButtonActive: {
    backgroundColor: palette.gold,
    borderColor: palette.gold
  },
  copyButtonLabel: {
    ...theme.typography.label,
    color: palette.cream
  },
  copyButtonLabelActive: {
    color: palette.ink
  },
  statsRow: {
    flexDirection: "row",
    gap: 10
  },
  statCard: {
    flex: 1,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border,
    gap: 2
  },
  statValue: {
    ...theme.typography.title,
    color: palette.cream
  },
  statLabel: {
    ...theme.typography.label,
    color: palette.slate
  },
  calendarBody: {
    flex: 1,
    minHeight: 0,
    gap: 10,
    justifyContent: "flex-start"
  },
  content: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xl
  },
  emptyState: {
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border,
    gap: 6
  },
  emptyTitle: {
    ...theme.typography.title,
    color: palette.cream
  },
  emptyBody: {
    ...theme.typography.body,
    color: palette.mist
  },
  pressed: {
    opacity: 0.94
  }
});
