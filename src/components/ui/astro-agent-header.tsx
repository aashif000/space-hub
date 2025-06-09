import * as React from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Star, Rocket } from "lucide-react";

interface AstroAgentHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: "default" | "cosmos" | "mars" | "earth";
}

export function AstroAgentHeader({
  title = "AstroAgent",
  subtitle = "Your Personal Guide to the Universe",
  icon,
  variant = "default",
  className,
  ...props
}: AstroAgentHeaderProps) {
  const variantClasses = {
    default: "from-blue-600 via-indigo-600 to-purple-600",
    cosmos: "from-purple-600 via-violet-600 to-indigo-600",
    mars: "from-red-600 via-orange-600 to-amber-600",
    earth: "from-emerald-600 via-teal-600 to-cyan-600",
  };

  return (
    <div
      className={cn(
        "relative flex items-center gap-4 overflow-hidden rounded-lg p-4",
        className
      )}
      {...props}
    >
      {/* Background stars effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars-small"></div>
        <div className="stars-medium"></div>
        <div className="stars-large"></div>
      </div>

      {/* Content with backdrop blur */}
      <div className="relative z-10 flex w-full items-center gap-4">
        {/* Icon container */}
        <div className={cn(
          "flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r shadow-lg",
          variantClasses[variant]
        )}>
          {icon || <Rocket className="h-7 w-7 text-white" />}
        </div>

        {/* Text content */}
        <div className="flex flex-col">
          <h1 className={cn(
            "bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent",
            variantClasses[variant]
          )}>
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-3 -top-3 opacity-20">
          <Sparkles className="h-12 w-12 text-white" />
        </div>
        <div className="absolute -bottom-3 right-12 opacity-10">
          <Star className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  );
}

// Add these styles to your global CSS
export const astroAgentStyles = `
@keyframes twinkle {
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
}

.stars-small,
.stars-medium,
.stars-large {
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: repeat;
}

.stars-small {
  background-image: radial-gradient(1px 1px at calc(100% * var(--x, 0.2)) calc(100% * var(--y, 0.5)), white, transparent),
                    radial-gradient(1px 1px at calc(100% * var(--x1, 0.9)) calc(100% * var(--y1, 0.3)), white, transparent),
                    radial-gradient(1px 1px at calc(100% * var(--x2, 0.7)) calc(100% * var(--y2, 0.8)), white, transparent),
                    radial-gradient(1px 1px at calc(100% * var(--x3, 0.3)) calc(100% * var(--y3, 0.2)), white, transparent);
  background-size: 100% 100%;
  animation: twinkle 4s infinite;
}

.stars-medium {
  background-image: radial-gradient(1.5px 1.5px at calc(100% * var(--x, 0.5)) calc(100% * var(--y, 0.2)), white, transparent),
                    radial-gradient(1.5px 1.5px at calc(100% * var(--x1, 0.1)) calc(100% * var(--y1, 0.8)), white, transparent),
                    radial-gradient(1.5px 1.5px at calc(100% * var(--x2, 0.3)) calc(100% * var(--y2, 0.5)), white, transparent);
  background-size: 100% 100%;
  animation: twinkle 7s infinite;
}

.stars-large {
  background-image: radial-gradient(2px 2px at calc(100% * var(--x, 0.8)) calc(100% * var(--y, 0.7)), white, transparent),
                    radial-gradient(2px 2px at calc(100% * var(--x1, 0.2)) calc(100% * var(--y1, 0.4)), white, transparent);
  background-size: 100% 100%;
  animation: twinkle 10s infinite;
}
`;
