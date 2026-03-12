import { type ReactNode, useState } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            whiteSpace: 'nowrap',
            zIndex: 50,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            pointerEvents: 'none',
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
