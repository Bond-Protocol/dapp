import type { FC } from 'react';
import { Route, Routes as Switch } from 'react-router-dom';
import { Home, Hello } from 'views';

export const Routes: FC = () => {
  return (
    <Switch>
      <Route index element={<Home />} />
      <Route path="/hello" element={<Hello />} />
    </Switch>
  );
};
