export const AnimatedBorderButton = ({ children, className = "" }) => {
  return (
    <button
      className={`
        rounded-xl border border-border bg-surface/50 px-8 py-4
        text-lg font-semibold text-foreground shadow-lg shadow-black/10
        transition-all duration-300 hover:-translate-y-0.5
        hover:border-primary/60 hover:bg-primary/10 hover:text-primary
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
        focus-visible:ring-offset-2 focus-visible:ring-offset-background
        ${className}
      `}
    >
      {children}
    </button>
  );
};
