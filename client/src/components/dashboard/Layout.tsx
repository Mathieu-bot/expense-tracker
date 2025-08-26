import type { ReactNode } from "react";

export default function Layout({
  title,
  children,
  graphClassName,
}: {
  title?: string;
  children: ReactNode;
  graphClassName?: string;
}) {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-5">
      {" "}
      {title && (
        <h2 className="text-white font-semibold text-2xl text-center">
          {title}
        </h2>
      )}
      <div
        className={`w-[400px] min-h-[250px] rounded-xl bg-white/5 p-2 ${graphClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
