/** Shown while a page's server data loads. */
export default function Loading() {
  return (
    <div className="container flex grow flex-col gap-4 px-4 py-10" aria-busy="true">
      <div className="h-10 w-64 animate-pulse rounded-md bg-muted" />
      <div className="h-4 w-96 max-w-full animate-pulse rounded-md bg-muted" />
      <div className="mt-4 h-48 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}
