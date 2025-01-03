import { useMediaQuery } from 'react-responsive';

import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from "../../tailwind.config.mjs";

const fullConfig = resolveConfig(tailwindConfig);

export default function useEnvInfo() {
  const isMobile = useMediaQuery({ query: `(max-width: ${fullConfig.theme.screens.md})` });
  const isTouch = useMediaQuery({ query: "(hover: none)" });

  return { isMobile, isTouch };
}
