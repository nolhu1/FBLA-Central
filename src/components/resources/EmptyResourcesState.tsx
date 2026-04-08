import { EmptyState } from "@/components/feedback/EmptyState";

export const EmptyResourcesState = ({ title, body }: { title: string; body: string }) => (
  <EmptyState title={title} body={body} />
);
