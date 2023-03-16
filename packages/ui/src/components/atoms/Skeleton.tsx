/**
 * Common loading indicator
 */
export const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={`min-h-2 skeleton-container h-full w-full backdrop-blur-sm ${className}`}
    >
      <div className="skeleton h-[12px] rounded-md" />
    </div>
  );
};
