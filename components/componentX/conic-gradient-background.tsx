const ConicGradientBackground = () => {
  return (
    <div
      className="absolute inset-0 overflow-hidden z-[-3]"
      style={{
        maskImage:
          "radial-gradient(circle at 100% 50%, rgb(255, 255, 255,0.6), rgba(255, 255, 255,0))",
        opacity: 0.5,
      }}
    >
      <div
        className="w-full h-full"
        style={{
          background: `conic-gradient(from 180deg at 100% 50%, hsl(var(--muted-foreground)) 30deg, hsl(var(--primary)) 90deg,hsl(var(--muted-foreground)) 150deg)`,
        }}
      />
    </div>
  );
};

export default ConicGradientBackground;
