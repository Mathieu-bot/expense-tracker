import { StarFilledIcon } from "@radix-ui/react-icons";
import { features, landingContent } from "./constants";

type Props = {
    sideImageUrl?: string;
}

export default function FeatureShowcase({ sideImageUrl }: Props) {
  return (
    <div className="hidden md:flex items-center md:col-span-5 relative h-[580px]">
        <div className="h-full overflow-hidden relative ">
            <img
            src={sideImageUrl}
            alt="Auth side"
            className="absolute w-full h-auto top-44 inset-0 rounded-2xl object-cover"
            />

            <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="space-y-8">
                <div className="space-y-4 pl-6">
                <h2 className="text-4xl font-bold text-primary-dark">
                    {landingContent.hero.title} <span className="text-primary-light">{landingContent.hero.titleHighlight}</span>
                </h2>
                <p className="text-lg text-black max-w-md">
                    {landingContent.hero.subtitle}
                </p>
                </div>

                <div className="w-1/2 bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/50 relative left-88 bottom-6">
                <div className="absolute -top-6 left-[calc(100%-2rem)] w-full h-full bg-gradient-to-br from-primary/20 via-accent/10 to-light/30 rounded-tl-full">
                    <img src="sarah.jpg" alt="" className="w-12 h-12 object-cover rounded-full"/>
                </div>
                <blockquote className="text-primary text-sm italic mb-4">
                    "{landingContent.testimonial.quote}"
                </blockquote>
                <div className="flex items-center justify-between">
                    <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                        <StarFilledIcon key={i} className="w-4 h-4" />
                    ))}
                    </div>
                    <span className="text-primary text-sm font-medium">{landingContent.testimonial.author}</span>
                </div>
                </div>

                {/* Feature highlights - Auto-sliding carousel */}
                <div className="relative overflow-hidden mr-22 top-36">
                <div className="flex gap-4 animate-[slide_15s_linear_infinite] hover:[animation-play-state:paused]">
                    {features.map((feature) => {
                    const IconComponent = feature.icon;
                    return (
                        <div key={feature.id} className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-lg p-4 min-w-[320px]">
                        <div className={`w-10 h-10 ${feature.bgColor} rounded-full flex items-center justify-center`}>
                            <IconComponent className={`w-5 h-5 ${feature.iconColor}`} />
                        </div>
                        <div>
                            <h3 className={`font-semibold ${feature.titleColor}`}>{feature.title}</h3>
                            <p className={`text-sm ${feature.descriptionColor}`}>{feature.description}</p>
                        </div>
                        </div>
                    );
                    })}
                    
                    {features.map((feature) => {
                    const IconComponent = feature.icon;
                    return (
                        <div key={`${feature.id}-duplicate`} className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-lg p-4 min-w-[320px]">
                        <div className={`w-10 h-10 ${feature.bgColor} rounded-full flex items-center justify-center`}>
                            <IconComponent className={`w-5 h-5 ${feature.iconColor}`} />
                        </div>
                        <div>
                            <h3 className={`font-semibold ${feature.titleColor}`}>{feature.title}</h3>
                            <p className={`text-sm ${feature.descriptionColor}`}>{feature.description}</p>
                        </div>
                        </div>
                    );
                    })}
                </div>
                </div>
            </div>
            </div>
        </div>
    </div>  
  )
};