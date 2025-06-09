import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spaceCardVariants = cva(
  "rounded-lg border shadow-md transition-all duration-300 overflow-hidden relative group",
  {
    variants: {
      variant: {
        default:
          "bg-card/60 backdrop-blur-md border-blue-500/20 hover:border-blue-500/40 hover:shadow-blue-500/20 hover:shadow-lg",
        cosmic:
          "bg-gradient-to-br from-indigo-950/80 via-purple-950/80 to-slate-900/80 backdrop-blur-md border-purple-500/20 hover:border-purple-500/40 hover:shadow-purple-500/30 hover:shadow-xl",
        nebula:
          "bg-gradient-to-br from-pink-950/80 via-purple-950/80 to-indigo-950/80 backdrop-blur-md border-pink-400/20 hover:border-pink-400/40 hover:shadow-pink-500/30 hover:shadow-xl",
        mars:
          "bg-gradient-to-br from-red-950/80 via-orange-950/80 to-red-900/80 backdrop-blur-md border-red-500/20 hover:border-red-500/40 hover:shadow-red-500/30 hover:shadow-xl",
        earth:
          "bg-gradient-to-br from-blue-950/80 via-cyan-950/80 to-blue-900/80 backdrop-blur-md border-blue-400/20 hover:border-blue-400/40 hover:shadow-blue-500/30 hover:shadow-xl",
        galaxy:
          "bg-gradient-to-br from-violet-950/80 via-indigo-950/80 to-purple-950/80 backdrop-blur-md border-violet-400/20 hover:border-violet-400/40 hover:shadow-violet-500/30 hover:shadow-xl",
        solar:
          "bg-gradient-to-br from-yellow-950/80 via-orange-950/80 to-red-950/80 backdrop-blur-md border-yellow-400/20 hover:border-yellow-400/40 hover:shadow-yellow-500/30 hover:shadow-xl",
      },
      size: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8",
        xl: "p-10",
      },
      glass: {
        true: "backdrop-blur-xl bg-opacity-10",
        false: "",
      },
      interactive: {
        true: "transform transition-all duration-300 hover:-translate-y-2 hover:scale-105 cursor-pointer",
        false: "",
      },
      glow: {
        true: "before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      glass: false,
      interactive: false,
      glow: false,
    },
  }
);

export interface SpaceCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spaceCardVariants> {
  pulseAnimation?: boolean;
}

const SpaceCard = React.forwardRef<HTMLDivElement, SpaceCardProps>(
  ({ className, variant, size, glass, interactive, glow, pulseAnimation, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          spaceCardVariants({ variant, size, glass, interactive, glow }), 
          pulseAnimation && "animate-pulse",
          className
        )}
        {...props}
      >
        {/* Animated background sparkles */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-4 left-4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0s' }} />
          <div className="absolute top-8 right-6 w-1 h-1 bg-blue-300 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-6 left-8 w-1 h-1 bg-purple-300 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-4 right-4 w-1 h-1 bg-pink-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
        </div>
        
        {/* Content wrapper */}
        <div className="relative z-10">
          {props.children}
        </div>
      </div>
    );
  }
);
SpaceCard.displayName = "SpaceCard";

const SpaceCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5", className)}
    {...props}
  />
));
SpaceCardHeader.displayName = "SpaceCardHeader";

const SpaceCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
SpaceCardTitle.displayName = "SpaceCardTitle";

const SpaceCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
SpaceCardDescription.displayName = "SpaceCardDescription";

const SpaceCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-4", className)} {...props} />
));
SpaceCardContent.displayName = "SpaceCardContent";

const SpaceCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
));
SpaceCardFooter.displayName = "SpaceCardFooter";

export {
  SpaceCard,
  SpaceCardHeader,
  SpaceCardTitle,
  SpaceCardDescription,
  SpaceCardContent,
  SpaceCardFooter,
};
