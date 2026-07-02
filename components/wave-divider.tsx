export function WaveDivider({
  className = "",
  fill = "var(--background)",
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M0,32 C120,52 240,8 360,20 C480,32 540,52 660,44 C780,36 840,8 960,16 C1080,24 1140,44 1200,32 L1200,60 L0,60 Z"
        fill={fill}
      />
    </svg>
  );
}
