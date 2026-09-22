import { Alert } from "@/components/ui";

export function CommandError({ error }: { error: string | null }) {
  return error ? <Alert variant="destructive">{error}</Alert> : null;
}
