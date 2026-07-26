/**
 * Renders the shared editorial button while preserving native button semantics.
 * @param {object} props
 * @param {"sm" | "default" | "lg"} [props.size] - Selects the compact sizing token.
 */
export const Button = ({
  className = "",
  size = "default",
  type = "button",
  children,
  ...props
}) => {
  const baseClasses =
    "inline-flex max-w-full items-center justify-center rounded-full border-2 border-ink bg-paper text-center font-mono font-semibold uppercase tracking-[0.08em] text-ink transition-[color,background-color,border-color] hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-55";
  const sizeClasses = {
    sm: "px-3 py-2 text-xs",
    default: "px-4 py-3 text-xs",
    lg: "px-5 py-4 text-sm",
  };
  const classes = `${baseClasses} ${sizeClasses[size] || sizeClasses.default} ${className}`;

  return (
    <button type={type} className={classes} {...props}>
      <span className="flex min-w-0 flex-wrap items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};
