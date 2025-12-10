type SkeletonProps = {
  width?: string | number;
  height?: string | number;
  className?: string;
};

export default function Skeleton({ width, height, className }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className ?? ""}`}
      style={{
        width: width,
        height: height
      }}
    />
  );
}
