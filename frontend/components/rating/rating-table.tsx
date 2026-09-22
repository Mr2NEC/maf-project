import { getFormatter, getTranslations } from "next-intl/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { RatingQuery } from "@/gql/graphql";
import { Link } from "@/i18n/navigation";

type Entry = RatingQuery["rating"][number];

export async function RatingTable({ entries, compact = false }: { entries: Entry[]; compact?: boolean }) {
  const t = await getTranslations("rating");
  const format = await getFormatter();

  if (entries.length === 0) {
    return <p className="text-muted-foreground">{t("empty")}</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>{t("player")}</TableHead>
          <TableHead className="text-right">{t("points")}</TableHead>
          {!compact && (
            <>
              <TableHead className="text-right">{t("games")}</TableHead>
              <TableHead className="text-right">{t("wins")}</TableHead>
              <TableHead className="text-right">{t("win-rate")}</TableHead>
            </>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map((entry) => (
          <TableRow key={entry.user.id}>
            <TableCell className="font-mono">{entry.place}</TableCell>
            <TableCell>
              <Link
                href={{ pathname: "/players/[id]", params: { id: entry.user.id } }}
                className="font-medium hover:underline"
              >
                {entry.user.username}
              </Link>
            </TableCell>
            <TableCell className="text-right font-semibold">{format.number(entry.points)}</TableCell>
            {!compact && (
              <>
                <TableCell className="text-right">{entry.games}</TableCell>
                <TableCell className="text-right">{entry.wins}</TableCell>
                <TableCell className="text-right">
                  {format.number(entry.winRate, { style: "percent", maximumFractionDigits: 0 })}
                </TableCell>
              </>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
