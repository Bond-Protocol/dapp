import * as contractLibrary from '@bond-labs/contract-library';
import * as bondLibrary from '@bond-labs/bond-library';

import { providers } from 'services/read-providers';

export const useProtocol = () => {
  return { contractLibrary, bondLibrary, providers };
};
