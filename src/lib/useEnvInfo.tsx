import { useMediaQuery } from 'react-responsive';

import defaultTheme from 'tailwindcss/defaultTheme'

export default function useEnvInfo() {
  const isMobile = useMediaQuery({ query: `(max-width: ${defaultTheme.screens.md})` });
  const isTouch = useMediaQuery({ query: "(hover: none)" });

  return { isMobile, isTouch };
}
