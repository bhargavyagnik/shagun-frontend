export function GradientText({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <span
        className={`bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-transparent bg-clip-text ${className}`}
      >
        {children}
      </span>
    );
  }