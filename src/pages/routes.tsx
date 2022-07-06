import type { FC } from 'react';
import { Route, Routes as Switch } from 'react-router-dom';
import { Home, NetworkView } from 'pages';

export const Routes: FC = () => {
  return (
    <Switch>
      <Route index element={<Home />} />
      <Route path="/wallet" element={<NetworkView />} />
    </Switch>
  );
};
