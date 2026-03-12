interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export function Skeleton({
  width = '100%',
  height = '1rem',
  borderRadius = '8px',
  className = '',
}: SkeletonProps) {
  return (
    <div
      className={className}
      role="status"
      aria-label="Carregando conteúdo"
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s ease-in-out infinite',
      }}
    >
      <span className="sr-only">Carregando...</span>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div
      role="status"
      aria-label="Carregando card"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      <Skeleton width="60%" height="1.25rem" />
      <Skeleton width="40%" height="0.875rem" />
      <Skeleton width="100%" height="2.5rem" />
      <Skeleton width="80%" height="0.875rem" />
      <span className="sr-only">Carregando...</span>
    </div>
  );
}
