import { ReactElement } from 'react';
import { AppRoot } from './AppRoot';
import { Stage } from './Stage';

export function App(): ReactElement {
  return (
    <AppRoot>
      <Stage objects={[]} />
    </AppRoot>
  );
}
