import { EventItem, EventSave, EventType, Organization, ScopeType } from "@/domain/models/types";

export type EventViewMode = "calendar" | "agenda" | "saved";
export type EventCategoryFilter = "all" | "deadlines" | "meetings" | "conferences" | "workshops" | "milestones";
export type EventScopeFilter = "all" | ScopeType;

export interface EventRecord {
  event: EventItem;
  save?: EventSave;
  isSaved: boolean;
  dayKey: string;
  date: Date;
  startLabel: string;
  endLabel: string;
  dateTimeLabel: string;
  dayLabel: string;
  monthDayLabel: string;
  timeRangeLabel: string;
  typeLabel: string;
  scopeLabel: string;
  scopeContext: string;
  urgency: "urgent" | "soon" | "planned" | "normal";
  category: Exclude<EventCategoryFilter, "all">;
  reminderSummary?: string;
}

export interface CalendarDayCell {
  key: string;
  date: Date;
  dayNumber: number;
  dayKey: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  records: EventRecord[];
  hasUrgent: boolean;
  hasSaved: boolean;
}

export interface AgendaGroup {
  key: string;
  label: string;
  caption: string;
  records: EventRecord[];
}

const eventTypeLabels: Record<EventType, string> = {
  chapter_meeting: "Meeting",
  chapter_activity: "Activity",
  subdivision_event: "Section Event",
  state_conference: "State Conference",
  national_conference: "National Conference",
  competitive_deadline: "Deadline",
  workshop: "Workshop",
  milestone: "Milestone"
};

const scopeLabels: Record<ScopeType, string> = {
  chapter: "Chapter",
  subdivision: "Section",
  state: "State",
  national: "National"
};

const eventTypeCategories: Record<EventType, Exclude<EventCategoryFilter, "all">> = {
  chapter_meeting: "meetings",
  chapter_activity: "meetings",
  subdivision_event: "meetings",
  state_conference: "conferences",
  national_conference: "conferences",
  competitive_deadline: "deadlines",
  workshop: "workshops",
  milestone: "milestones"
};

const weekdayFormatter = new Intl.DateTimeFormat(undefined, { weekday: "short" });
const dayFormatter = new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" });
const monthDayFormatter = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" });
const monthFormatter = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" });
const timeFormatter = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });

const startOfDay = (value: Date) => new Date(value.getFullYear(), value.getMonth(), value.getDate());
const dayKeyForDate = (value: Date) => startOfDay(value).toISOString().slice(0, 10);
const isSameDay = (left: Date, right: Date) => dayKeyForDate(left) === dayKeyForDate(right);
const daysBetween = (left: Date, right: Date) =>
  Math.round((startOfDay(left).getTime() - startOfDay(right).getTime()) / 86400000);

const formatTimeRange = (start: Date, end: Date) => {
  if (start.getTime() === end.getTime()) return timeFormatter.format(start);
  return `${timeFormatter.format(start)} - ${timeFormatter.format(end)}`;
};

const formatReminderSummary = (save?: EventSave) => {
  if (!save) return undefined;
  const reminders = [save.reminder1, save.reminder2].filter(Boolean) as string[];
  if (!reminders.length) return undefined;
  if (reminders.length === 1) return `1 reminder set`;
  return `${reminders.length} reminders set`;
};

const getScopeContext = (event: EventItem, organizationsById: Record<string, Organization>) => {
  const org = organizationsById[event.organizationId];
  if (!org) return scopeLabels[event.scopeType];
  if (event.scopeType === "chapter" && org.schoolName) return org.schoolName;
  return org.shortName || org.name || scopeLabels[event.scopeType];
};

const getUrgency = (event: EventItem, isSaved: boolean, now: Date) => {
  const start = new Date(event.startTime);
  const deltaDays = daysBetween(start, now);

  if (event.eventType === "competitive_deadline" || event.eventType === "milestone") {
    if (deltaDays <= 2) return "urgent";
    if (deltaDays <= 7) return "soon";
  }

  if (isSaved && deltaDays <= 5) return "planned";
  if (deltaDays <= 10) return "soon";
  return "normal";
};

export const buildEventRecords = (
  events: EventItem[],
  saves: EventSave[],
  organizations: Organization[],
  now = new Date()
): EventRecord[] => {
  const savesByEventId = Object.fromEntries(saves.map((item) => [item.eventId, item]));
  const organizationsById = Object.fromEntries(organizations.map((item) => [item.id, item]));

  return [...events]
    .sort((left, right) => new Date(left.startTime).getTime() - new Date(right.startTime).getTime())
    .map((event) => {
      const start = new Date(event.startTime);
      const end = new Date(event.endTime);
      const save = savesByEventId[event.id];
      return {
        event,
        save,
        isSaved: Boolean(save),
        dayKey: dayKeyForDate(start),
        date: start,
        startLabel: timeFormatter.format(start),
        endLabel: timeFormatter.format(end),
        dateTimeLabel: `${dayFormatter.format(start)}${start.getTime() === end.getTime() ? `, ${timeFormatter.format(start)}` : `, ${formatTimeRange(start, end)}`}`,
        dayLabel: dayFormatter.format(start),
        monthDayLabel: monthDayFormatter.format(start),
        timeRangeLabel: formatTimeRange(start, end),
        typeLabel: eventTypeLabels[event.eventType],
        scopeLabel: scopeLabels[event.scopeType],
        scopeContext: getScopeContext(event, organizationsById),
        urgency: getUrgency(event, Boolean(save), now),
        category: eventTypeCategories[event.eventType],
        reminderSummary: formatReminderSummary(save)
      };
    });
};

export const formatMonthLabel = (value: Date) => monthFormatter.format(value);

export const moveMonth = (value: Date, offset: number) => new Date(value.getFullYear(), value.getMonth() + offset, 1);

export const pickInitialSelectedDate = (month: Date, records: EventRecord[], today = new Date()) => {
  const todayInMonth = today.getFullYear() === month.getFullYear() && today.getMonth() === month.getMonth();
  if (todayInMonth) return startOfDay(today);

  const firstInMonth = records.find(
    (item) => item.date.getFullYear() === month.getFullYear() && item.date.getMonth() === month.getMonth()
  );
  return firstInMonth ? startOfDay(firstInMonth.date) : new Date(month.getFullYear(), month.getMonth(), 1);
};

export const applyEventFilters = (
  records: EventRecord[],
  filters: {
    month: Date;
    category: EventCategoryFilter;
    scope: EventScopeFilter;
    savedOnly?: boolean;
  }
) =>
  records.filter((record) => {
    const inMonth =
      record.date.getFullYear() === filters.month.getFullYear() &&
      record.date.getMonth() === filters.month.getMonth();
    if (!inMonth) return false;
    if (filters.category !== "all" && record.category !== filters.category) return false;
    if (filters.scope !== "all" && record.event.scopeType !== filters.scope) return false;
    if (filters.savedOnly && !record.isSaved) return false;
    return true;
  });

export const getRecordsForDate = (records: EventRecord[], value: Date) =>
  records.filter((record) => isSameDay(record.date, value));

export const buildCalendarMonth = (
  month: Date,
  records: EventRecord[],
  selectedDate: Date,
  today = new Date()
): CalendarDayCell[] => {
  const start = new Date(month.getFullYear(), month.getMonth(), 1);
  const firstGridDay = new Date(start);
  firstGridDay.setDate(start.getDate() - start.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstGridDay);
    date.setDate(firstGridDay.getDate() + index);
    const dayRecords = getRecordsForDate(records, date);

    return {
      key: dayKeyForDate(date),
      date,
      dayNumber: date.getDate(),
      dayKey: dayKeyForDate(date),
      isCurrentMonth: date.getMonth() === month.getMonth(),
      isToday: isSameDay(date, today),
      isSelected: isSameDay(date, selectedDate),
      records: dayRecords,
      hasUrgent: dayRecords.some((item) => item.urgency === "urgent"),
      hasSaved: dayRecords.some((item) => item.isSaved)
    };
  });
};

export const buildAgendaGroups = (records: EventRecord[]): AgendaGroup[] => {
  const groups = new Map<string, EventRecord[]>();
  records.forEach((record) => {
    const existing = groups.get(record.dayKey) ?? [];
    existing.push(record);
    groups.set(record.dayKey, existing);
  });

  return [...groups.entries()].map(([key, dayRecords]) => ({
    key,
    label: dayFormatter.format(dayRecords[0].date),
    caption: `${weekdayFormatter.format(dayRecords[0].date)} • ${dayRecords.length} event${dayRecords.length === 1 ? "" : "s"}`,
    records: dayRecords
  }));
};

export const buildSavedGroups = (records: EventRecord[]): AgendaGroup[] => {
  const saved = records.filter((item) => item.isSaved);
  return buildAgendaGroups(saved);
};

export const getCalendarSubtitle = (month: Date, total: number) =>
  `${formatMonthLabel(month)} • ${total} event${total === 1 ? "" : "s"}`;

export const getEmptyStateCopy = (view: EventViewMode, hasFilters: boolean) => {
  if (view === "saved") {
    return {
      title: "No saved events yet",
      body: "Save deadlines, meetings, and conferences to build your personal FBLA schedule."
    };
  }

  if (hasFilters) {
    return {
      title: "Nothing matches these filters",
      body: "Try another category or scope to widen the planning view."
    };
  }

  return {
    title: "This month is clear",
    body: "No events are scheduled in this view yet. Try moving to another month."
  };
};

export const getUrgencyLabel = (urgency: EventRecord["urgency"]) => {
  switch (urgency) {
    case "urgent":
      return "Urgent";
    case "soon":
      return "Soon";
    case "planned":
      return "Saved";
    default:
      return "Upcoming";
  }
};

export const getCategoryLabel = (category: EventCategoryFilter) => {
  switch (category) {
    case "deadlines":
      return "Deadlines";
    case "meetings":
      return "Meetings";
    case "conferences":
      return "Conferences";
    case "workshops":
      return "Workshops";
    case "milestones":
      return "Milestones";
    default:
      return "All";
  }
};

export const getScopeFilterLabel = (scope: EventScopeFilter) => {
  if (scope === "all") return "All scopes";
  return scopeLabels[scope];
};
