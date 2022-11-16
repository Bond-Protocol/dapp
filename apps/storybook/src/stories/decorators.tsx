import { HashRouter as Router } from "react-router-dom";
import { ReactQueryProvider } from "context/react-query-provider";

export const ReactQueryDecorator = (Story) => (
  <ReactQueryProvider>
    <Story />
  </ReactQueryProvider>
);

export const RouterDecorator = (Story) => (
  <Router>
    <Story />
  </Router>
);
