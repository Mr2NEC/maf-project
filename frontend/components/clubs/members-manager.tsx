"use client";

import { useFormatter, useTranslations } from "next-intl";
import { CommandError } from "@/components/host/command-error";
import { useCommand } from "@/components/host/use-command";
import { Button, Select, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { ClubRole } from "@/gql/graphql";
import { approveMember, removeMember, setMemberRole } from "@/lib/clubs/actions";

type Member = {
  id: string;
  role?: ClubRole;
  createdAt: string;
  user: { id: string; username: string };
};

const ROLES: ClubRole[] = ["MEMBER", "HOST", "ADMIN"];

/** Join requests and the member list with roles, for club admins. */
export function MembersManager({ members, pending: requests }: { members: Member[]; pending: Member[] }) {
  const t = useTranslations("club-manage");
  const tRole = useTranslations("club-role");
  const format = useFormatter();
  const { pending, error, run } = useCommand();
  const date = (value: string) => format.dateTime(new Date(value), { dateStyle: "medium" });

  return (
    <div className="flex flex-col gap-6">
      <CommandError error={error} />
      <section className="flex flex-col gap-2">
        <h3 className="font-semibold">{t("requests", { count: requests.length })}</h3>
        {requests.length === 0 && <p className="text-sm text-muted-foreground">{t("no-requests")}</p>}
        {requests.map((request) => (
          <div key={request.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3">
            <span>
              <span className="font-medium">{request.user.username}</span>{" "}
              <span className="text-sm text-muted-foreground">{date(request.createdAt)}</span>
            </span>
            <span className="flex gap-2">
              <Button size="sm" disabled={pending} onClick={() => run(() => approveMember(Number(request.id)))}>
                {t("approve")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={pending}
                onClick={() => run(() => removeMember(Number(request.id)))}
              >
                {t("reject")}
              </Button>
            </span>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="font-semibold">{t("members", { count: members.length })}</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("player")}</TableHead>
              <TableHead>{t("joined")}</TableHead>
              <TableHead>{t("role")}</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.user.username}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{date(member.createdAt)}</TableCell>
                <TableCell>
                  <Select
                    aria-label={t("role")}
                    value={member.role}
                    disabled={pending}
                    className="h-8 w-32 py-0"
                    onChange={(e) => run(() => setMemberRole(Number(member.id), e.target.value as ClubRole))}
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {tRole(role)}
                      </option>
                    ))}
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={pending}
                    onClick={() => {
                      if (window.confirm(t("remove-confirm", { name: member.user.username }))) {
                        run(() => removeMember(Number(member.id)));
                      }
                    }}
                  >
                    {t("remove")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
