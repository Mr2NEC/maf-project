"use client";

import { PageLayout } from "@/components/shared";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

type ErrorProps = {
  error: Error;
  reset(): void;
};

export default function Error({ error, reset }: ErrorProps) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageLayout title={t("title")}>
      <div>
        {t.rich("description", {
          p: (chunks) => <p className="mt-4">{chunks}</p>,
          retry: (chunks) => (
            <button
              className="text-white underline underline-offset-2"
              onClick={reset}
              type="button"
            >
              {chunks}
            </button>
          ),
        })}
      </div>
    </PageLayout>
  );
}
