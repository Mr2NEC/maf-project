import { FC, ReactNode } from "react";

type PageLayoutProps = {
  children?: ReactNode;
  title: ReactNode;
};

export const PageLayout: FC<PageLayoutProps> = (props) => {
  const { children, title } = props;
  //   const t = useTranslations("PageLayout");

  return (
    <div className="relative flex grow flex-col bg-slate-850 py-10">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-1 size-[20500px] translate-x-[-47.5%] rounded-full" />
      </div>
      <div className="container relative flex grow flex-col px-4">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          {title}
        </h1>
        <div className="mt-6 md:text-lg">{children}</div>
        <div className="mt-auto grid grid-cols-1 gap-4 pt-20 md:grid-cols-2 lg:gap-12"></div>
      </div>
    </div>
  );
};
