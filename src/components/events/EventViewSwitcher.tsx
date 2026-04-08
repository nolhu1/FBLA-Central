import { SegmentedControl } from "@/components/common/SegmentedControl";
import { EventViewMode } from "@/domain/services/events";

interface EventViewSwitcherProps {
  value: EventViewMode;
  onChange: (value: EventViewMode) => void;
}

export const EventViewSwitcher = ({ value, onChange }: EventViewSwitcherProps) => (
  <SegmentedControl
    value={value}
    onChange={onChange}
    options={[
      { value: "calendar", label: "Calendar" },
      { value: "agenda", label: "Agenda" },
      { value: "saved", label: "Saved" }
    ]}
  />
);
