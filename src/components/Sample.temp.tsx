import type { FC } from 'react';

export type SampleProps = {
  testProp?: string;
  children?: React.ReactNode;
};

export const SampleComponent: FC<SampleProps> = ({ testProp }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <p>nothing to see here {testProp}</p>
    </div>
  );
};
