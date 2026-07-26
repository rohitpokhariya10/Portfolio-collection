/**
 * Renders the secondary button primitive. `type="button"` is the safe default
 * inside forms, while callers can still opt into submit/reset behavior.
 * @param {object} props
 * @param {string} [props.className] - Allows section-level spacing overrides.
 */
export const AnimatedBorderButton = ({
  children,
  className = "",
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      className={`inline-flex max-w-full flex-wrap items-center justify-center rounded-full border-2 border-ink bg-paper px-5 py-4 text-center font-mono text-sm font-semibold uppercase tracking-[0.08em] text-ink transition-[color,background-color,border-color] hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-55 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
