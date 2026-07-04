// Secondary button primitive retained without animation-heavy styling.
// The v2 direction uses flat borders and restrained hover states.
/**
 * Renders a secondary flat pill button with caller-provided content.
 * @param {object} props
 * @param {string} [props.className] - Allows section-level spacing overrides.
 */
export const AnimatedBorderButton = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full border-2 border-ink bg-paper px-5 py-4 font-mono text-sm font-semibold uppercase tracking-[0.08em] text-ink hover:bg-ink hover:text-paper ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
