import type { FC } from 'react';
import { Route, Routes as Switch } from 'react-router-dom';
import { Home, Hello } from 'views';
import { NetworkView } from 'views/network';

export const Routes: FC = () => {
  return (
    <Switch>
      <Route index element={<Home />} />
      <Route path="/hello" element={<Hello />} />
      <Route path="/wallet" element={<NetworkView />} />
    </Switch>
  );
};
