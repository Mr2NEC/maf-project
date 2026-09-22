import { clsx } from "clsx";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { FC, ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import Navigation from "./navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type BaseLayoutProps = {
  children: ReactNode;
  locale: string;
};

export const BaseLayout: FC<BaseLayoutProps> = ({ children, locale }) => {
  return (
    <html className="h-full" lang={locale} suppressHydrationWarning>
      <body
        className={clsx(
          geistSans.variable,
          geistMono.variable,
          "flex h-full flex-col antialiased"
        )}
      >
        {/* Since next-intl v4 the provider inherits messages from i18n/request.ts */}
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <Navigation />
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};
