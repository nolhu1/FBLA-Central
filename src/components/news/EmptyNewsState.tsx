import { EmptyState } from "@/components/feedback/EmptyState";

interface EmptyNewsStateProps {
  title: string;
  body: string;
}

export const EmptyNewsState = ({ title, body }: EmptyNewsStateProps) => <EmptyState title={title} body={body} />;
