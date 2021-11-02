import { ReactElement, ReactNode, useEffect, useState } from 'react';

export interface IFullHeightProps {
  className?: string;
  children?: ReactNode;
}

export function FullHeight({ className, children }: IFullHeightProps): ReactElement {
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const onResize = () => setHeight(window.innerHeight);

    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className={className} style={{ height: `${height}px` }}>
      {children}
    </div>
  );
}
