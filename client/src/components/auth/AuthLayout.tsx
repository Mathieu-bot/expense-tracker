
import FeatureShowcase from "./FeatureShowcase";

type Props = {
  children: React.ReactNode;
  title?: string;
  subtitle?: React.ReactNode;
  sideImageUrl?: string;
};

export default function AuthLayout({ children, title, subtitle, sideImageUrl = "/auth-side.jpg" }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-end w-full bg-gradient-to-br from-light to-white relative !pr-0">
      <div className="z-10 absolute top-8 left-6 md:left-12 flex items-center gap-2">
        <img src="/Monogram.png" alt="Logo" className="h-10" />
        <span className="text-primary text-3xl md:text-4xl">PennyPal</span>
      </div>

      <div className="container mx-auto !px-0 md:px-10 py-10">
        <div className="grid md:grid-cols-8 items-center gap-8">
          <div className="flex items-center justify-center md:col-span-3 pl-6">
            <div className="w-full max-w-md bg-white/40 backdrop-blur-sm rounded-2xl p-6 md:p-8">
              {title ? (
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">{title}</h1>
              ) : null}
              {subtitle ? <div className="text-gray-600 mb-6 text-sm md:text-base">{subtitle}</div> : null}

              <div className="">
                {children}
              </div>
            </div>
          </div>

          <FeatureShowcase sideImageUrl={sideImageUrl}/>
        </div>
      </div>
    </div>
  );
}
