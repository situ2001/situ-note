import { atom } from 'nanostores';

const INITIAL_HERO_SECTION_HINT = "I am situ2001.";
const heroSectionHint = atom(INITIAL_HERO_SECTION_HINT);
const resetHeroSectionHint = () => heroSectionHint.set(INITIAL_HERO_SECTION_HINT);

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
