import { EmptyState } from "@/components/feedback/EmptyState";

interface EmptyStudyStateProps {
  title: string;
  body: string;
}

export const EmptyStudyState = ({ title, body }: EmptyStudyStateProps) => (
  <EmptyState title={title} body={body} />
);
