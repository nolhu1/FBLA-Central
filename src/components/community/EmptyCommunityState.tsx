import { EmptyState } from "@/components/feedback/EmptyState";

export const EmptyCommunityState = ({ title, body }: { title: string; body: string }) => (
  <EmptyState title={title} body={body} />
);
