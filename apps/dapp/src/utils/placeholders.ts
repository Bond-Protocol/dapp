import { environment } from "src/environment";

export const PLACEHOLDER_TOKEN_LOGO_URL = !environment.isProduction
  ? "/placeholders/girth.webp"
  : "/placeholders/token.png";

export default { PLACEHOLDER_TOKEN_LOGO_URL };
