// Shared editorial button primitive kept for future small actions.
// It matches the pill-and-border system used across the portfolio.
/**
 * Renders a flat pill button.
 * @param {object} props
 * @param {"sm" | "default" | "lg"} [props.size] - Selects the compact sizing token.
 */
export const Button = ({
  className = "",
  size = "default",
  children,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-full border-2 border-ink bg-paper font-mono font-semibold uppercase tracking-[0.08em] text-ink hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-55";
  const sizeClasses = {
    sm: "px-3 py-2 text-xs",
    default: "px-4 py-3 text-xs",
    lg: "px-5 py-4 text-sm",
  };
  const classes = `${baseClasses} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      <span className="flex items-center justify-center gap-2">{children}</span>
    </button>
  );
};
