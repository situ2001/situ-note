import { atom } from 'nanostores';

import config from 'config';
const greeting = config.hero.greeting;

const heroSectionHint = atom(greeting);
const resetHeroSectionHint = () => heroSectionHint.set(greeting);

export default {
  /**
   * Hero section hint. Used in the home page.
   */
  heroSectionHint: {
    state: heroSectionHint,
    action: {
      resetHint: resetHeroSectionHint,
    }
  }
}
