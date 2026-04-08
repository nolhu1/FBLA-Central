import { SegmentedControl } from "@/components/common/SegmentedControl";
import { SocialScope } from "@/domain/services/social";

interface ScopeSwitcherProps {
  value: SocialScope;
  onChange: (value: SocialScope) => void;
}

export const ScopeSwitcher = ({ value, onChange }: ScopeSwitcherProps) => (
  <SegmentedControl
    value={value}
    onChange={onChange}
    options={[
      { value: "chapter", label: "My Chapter" },
      { value: "state", label: "My State" },
      { value: "national", label: "National" }
    ]}
  />
);
