import { cn } from "@/lib/utils";

export default function BackgroundShine() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div
        className={cn(
          "items-center justify-center rounded-full border border-white/10 font-medium text-neutral-200 px-3 py-1 text-xs"
        )}
      >
        Badge
      </div>
    </div>
  );
}
