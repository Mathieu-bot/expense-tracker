import type { ReactNode } from "react";

export default function Layout({
  title,
  children,
  graphClassName,
  titleClassName,
}: {
  title?: string;
  children: ReactNode;
  graphClassName?: string;
  titleClassName?: string;
}) {
  return (
    <div className="w-full  mx-auto flex flex-col items-center gap-2">
      {" "}
      {title && (
        <h2
          className={
            "text-white font-semibold text-xl text-center " + titleClassName
          }
        >
          {title}
        </h2>
      )}
      <div className={`w-full min-h-[300px] rounded-xl p-2 ${graphClassName}`}>
        {children}
      </div>
    </div>
  );
}
