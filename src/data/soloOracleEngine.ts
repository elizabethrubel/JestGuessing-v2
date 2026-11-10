import { Character } from '../types';
import { VERIFIED_CATEGORIES } from './verifiedCharacterSets';
import { CURATED_THEMES } from './themes';

export type OracleVerdict = 'YES' | 'NO' | 'PARTIAL';

export interface OracleEvaluation {
  verdict: OracleVerdict;
  answerText: string;
  isDirectGuess?: boolean;
  guessedCharacterMatch?: boolean;
}

export interface SuggestedQuestion {
  id: string;
  label: string;
  question: string;
  category: 'identity' | 'medium' | 'role' | 'traits';
}

export const SOLO_SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  // Identity & Species
  { id: 'q-human', label: 'Human?', question: 'Is my character a human?', category: 'identity' },
  { id: 'q-female', label: 'Female?', question: 'Is my character female?', category: 'identity' },
  { id: 'q-male', label: 'Male?', question: 'Is my character male?', category: 'identity' },
  { id: 'q-real', label: 'Real / Historical?', question: 'Is my character a real historical or living person?', category: 'identity' },
  { id: 'q-animal', label: 'Animal / Creature?', question: 'Is my character an animal or non-human creature?', category: 'identity' },

  // Realm & Medium
  { id: 'q-movie', label: 'From a Movie?', question: 'Is my character primarily known from movies / film?', category: 'medium' },
  { id: 'q-tv', label: 'From a TV Show?', question: 'Is my character from a television series?', category: 'medium' },
  { id: 'q-animated', label: 'Animated?', question: 'Is my character animated or a cartoon?', category: 'medium' },
  { id: 'q-comics', label: 'Comics / Superhero?', question: 'Is my character from comic books (such as Marvel or DC)?', category: 'medium' },
  { id: 'q-game', label: 'Video Game?', question: 'Is my character from a video game?', category: 'medium' },
  { id: 'q-anime', label: 'Anime / Manga?', question: 'Is my character from Japanese anime or manga?', category: 'medium' },
  { id: 'q-book', label: 'Literature / Myth?', question: 'Did my character originate in literature, books, or mythology?', category: 'medium' },

  // Role & Alignment
  { id: 'q-villain', label: 'Villain / Antagonist?', question: 'Is my character a villain or antagonist?', category: 'role' },
  { id: 'q-hero', label: 'Hero / Protagonist?', question: 'Is my character a hero or main protagonist?', category: 'role' },
  { id: 'q-royalty', label: 'Royalty / Ruler?', question: 'Is my character royalty, a monarch, or a noble ruler?', category: 'role' },
  { id: 'q-detective', label: 'Sleuth / Detective?', question: 'Does my character solve mysteries or investigate crimes?', category: 'role' },
  { id: 'q-young', label: 'Child / Teenager?', question: 'Is my character a child, teenager, or student?', category: 'role' },

  // Powers & Traits
  { id: 'q-powers', label: 'Superpowers / Magic?', question: 'Does my character possess magic or superhuman powers?', category: 'traits' },
  { id: 'q-weapon', label: 'Uses a Weapon?', question: 'Does my character fight with a signature weapon or sword?', category: 'traits' },
  { id: 'q-scifi', label: 'Sci-Fi / Space?', question: 'Is my character from a science-fiction or space setting?', category: 'traits' },
  { id: 'q-fantasy', label: 'Fantasy / Magic Realm?', question: 'Is my character from a fantasy or medieval world?', category: 'traits' },
  { id: 'q-glasses', label: 'Wears Glasses?', question: 'Does my character wear glasses, spectacles, or goggles?', category: 'traits' },
  { id: 'q-mask', label: 'Mask or Helmet?', question: 'Does my character wear a mask or helmet?', category: 'traits' },
  { id: 'q-hat', label: 'Wears a Hat?', question: 'Does my character wear a signature hat?', category: 'traits' },
];

/**
 * Converts a plural party commonality title into a single-player personal clue.
 */
export function formatSoloClue(rawThemeOrTrait: string): string {
  let text = rawThemeOrTrait.trim().replace(/\.$/, '');

  // Specific clean grammatical transformations for known themes
  const exactMap: Record<string, string> = {
    'all characters wear glasses, spectacles, or goggles':
      'Your character wears prominent glasses, spectacles, or goggles',
    'all characters wear prominent glasses, spectacles, or goggles':
      'Your character wears prominent glasses, spectacles, or goggles',
    'all characters wear an iconic hat':
      'Your character wears an iconic hat that rarely comes off',
    'all characters are completely bald or lack head hair':
      'Your character is completely bald or lacks head hair',
    'all characters conceal their face behind a mask or helmet':
      'Your character conceals their face behind a mask or helmet',
    'all characters have artificial, robotic, or cybernetic limbs':
      'Your character has an artificial, robotic, or cybernetic limb',
    'all characters are detectives or crime investigators':
      'Your character works as a detective, sleuth, or crime investigator',
    'all characters are wizards, witches, or magic wielders':
      'Your character is a wizard, witch, or wielder of magic',
    'all characters are fathers':
      'Your character is a father',
    'all characters can travel through time or manipulate time':
      'Your character can travel through time or manipulate the flow of time',
    'all characters are chefs, cooks, or food obsessed':
      'Your character is a chef, cook, or famously obsessed with food',
    'all characters are predominantly green':
      'Your character is predominantly green in design or wardrobe',
    'all characters are predominantly blue':
      'Your character is predominantly blue in design or wardrobe',
    'all characters wield a legendary named weapon':
      'Your character wields a legendary, named weapon',
    'all characters have an iconic scar, eyepatch, or facial marking':
      'Your character is known for an iconic scar, eyepatch, or facial marking',
    'all characters possess superhuman durability or regenerative healing':
      'Your character possesses superhuman durability or regenerative healing',
    'all characters are accompanied by a loyal pet or animal familiar':
      'Your character is accompanied by a loyal pet or animal familiar',
    'all characters regularly break the fourth wall and acknowledge the audience':
      'Your character breaks the fourth wall and addresses the audience',
    'all characters are royalty who were exiled or renounced their throne':
      'Your character is royalty who was exiled or renounced their throne',
    'all characters were frozen or trapped in stasis for centuries':
      'Your character was frozen, sealed away, or trapped in stasis before awakening',
    'all characters are wise mentors guiding an impulsive protégé':
      'Your character is a wise mentor who guides an impulsive protégé',
    'all characters wear a cape, cowl, or disguise mask':
      'Your character wears a cape, cowl, or disguise mask',
    'all characters are famous for solving mysteries, crimes, or intricate puzzles':
      'Your character is famous for solving mysteries, crimes, or puzzles',
    'all characters practice medicine, healing, surgery, or therapy':
      'Your character practices medicine, healing, surgery, or science',
    'all characters travel through the stars, outer space, or distant galaxies':
      'Your character travels through outer space or distant galaxies',
    'all characters held royal court, wore crowns, or commanded empires':
      'Your character held royal court, wore a crown, or commanded an empire',
    'all characters are known for making, serving, judging, or obsessing over food':
      'Your character is known for making, serving, judging, or loving food',
    'all characters are figures, monsters, or deities of mythology and folklore':
      'Your character is a figure, monster, or deity from mythology or folklore',
  };

  const lower = text.toLowerCase();
  if (exactMap[lower]) {
    return exactMap[lower];
  }

  // Generic grammatical transform from "All characters ..." / "Both characters ..."
  let converted = text
    .replace(/^(All|Both) characters\s+/i, '')
    .replace(/\btheir\b/gi, 'their')
    .replace(/^are\s+/i, 'is ')
    .replace(/^were\s+/i, 'was ')
    .replace(/^have\s+/i, 'has ')
    .replace(/^wear\s+/i, 'wears ')
    .replace(/^wield\s+/i, 'wields ')
    .replace(/^possess\s+/i, 'possesses ')
    .replace(/^work\s+/i, 'works ')
    .replace(/^conceal\s+/i, 'conceals ')
    .replace(/^travel\s+/i, 'travels ')
    .replace(/^practice\s+/i, 'practices ')
    .replace(/^break\s+/i, 'breaks ')
    .replace(/^mentor\s+/i, 'mentors ');

  return `Your character ${converted}`;
}

// Explicit Sets for rock-solid character classification across all verified characters
const FEMALE_CHARACTERS = new Set([
  'velma dinkley',
  'edna mode',
  'roz',
  'tina belcher',
  'daria morgendorffer',
  'carmen sandiego',
  'imperator furiosa',
  'furiosa',
  'nancy drew',
  'miss marple',
  'veronica mars',
  'hermione granger',
  'scarlet witch (wanda maximoff)',
  'scarlet witch',
  'wanda maximoff',
  'maleficent',
  'zatanna',
  'julia child',
  'monica geller',
  'gamora',
  'poison ivy',
  'dory',
  'sadness',
  'mystique',
  'wonder woman (diana prince)',
  'wonder woman',
  'dorothy gale',
  'fleabag',
  'she-hulk (jennifer walters)',
  'she-hulk',
  'daenerys targaryen',
  'princess leia organa',
  'princess leia',
  'demona',
  'florence nightingale',
  'meredith grey',
  'clara barton',
  'ellen ripley',
  'sally ride',
  'cleopatra',
  'queen elizabeth ii',
  'queen victoria',
  'medusa',
  'pandora',
]);

const NON_HUMAN_CHARACTERS = new Set([
  'arthur read',
  'simon seville',
  'professor farnsworth', // human, wait - remove from non-human
  'roz',
  'the cat in the hat',
  'paddington bear',
  'saitama', // human
  'lord voldemort', // human/dark wizard
  'thanos',
  'drax the destroyer',
  'kratos', // demigod/god
  'master chief', // human cyborg
  'general grievous',
  'scooby-doo',
  'mufasa',
  'marlin',
  'goofy',
  'the doctor',
  'the terminator (t-800)',
  'trunks', // half-saiyan
  'remy (ratatouille)',
  'spongebob squarepants',
  'garfield',
  'cookie monster',
  'hulk (bruce banner)', // human/mutate
  'yoda',
  'shrek',
  'kermit the frog',
  'the grinch',
  'piccolo',
  'mike wazowski',
  'gamora',
  'sonic the hedgehog',
  'mega man',
  'genie',
  'dory',
  'sadness',
  'stitch (experiment 626)',
  'papa smurf',
  'megamind',
  'sulley',
  'thor',
  'frodo baggins',
  'link',
  'wonder woman (diana prince)',
  'inuyasha',
  'bilbo baggins',
  'scar',
  'majin buu',
  'godzilla',
  'bugs bunny',
  'simba',
  'demona',
  'philoctetes',
  'e.t. the extra-terrestrial',
  'spock',
  'count dracula',
  'zeus',
  'medusa',
  'loch ness monster',
  'anubis',
  'poseidon',
]);
NON_HUMAN_CHARACTERS.delete('professor farnsworth');
NON_HUMAN_CHARACTERS.delete('saitama');
NON_HUMAN_CHARACTERS.delete('lord voldemort');
NON_HUMAN_CHARACTERS.delete('master chief');
NON_HUMAN_CHARACTERS.delete('hulk (bruce banner)');

const ANIMAL_CHARACTERS = new Set([
  'arthur read',
  'simon seville',
  'the cat in the hat',
  'paddington bear',
  'scooby-doo',
  'mufasa',
  'marlin',
  'goofy',
  'remy (ratatouille)',
  'spongebob squarepants',
  'garfield',
  'kermit the frog',
  'sonic the hedgehog',
  'dory',
  'stitch (experiment 626)',
  'scar',
  'godzilla',
  'bugs bunny',
  'simba',
  'loch ness monster',
]);

const REAL_HISTORICAL_PEOPLE = new Set([
  'john lennon',
  'abraham lincoln',
  'slash',
  'gordon ramsay',
  'julia child',
  'guy fieri',
  'rey mysterio',
  'florence nightingale',
  'sigmund freud',
  'hippocrates',
  'doc holliday',
  'patch adams',
  'alexander fleming',
  'clara barton',
  'neil armstrong',
  'yuri gagarin',
  'sally ride',
  'cleopatra',
  'queen elizabeth ii',
  'julius caesar',
  'napoleon bonaparte',
  'alexander the great',
  'queen victoria',
  'genghis khan',
  'henry viii',
  'king tutankhamun',
  'colonel sanders',
  'paul hollywood',
  'wolfgang puck',
  'anthony bourdain',
]);

const VILLAIN_CHARACTERS = new Set([
  'walter white',
  'walter white (heisenberg)',
  'freddy krueger',
  'carmen sandiego',
  'lord voldemort',
  'gru',
  'lex luthor',
  'thanos',
  'dr. evil',
  'ernst stavro blofeld',
  'darth vader',
  'boba fett',
  'ghostface',
  'the phantom of the opera',
  'jason voorhees',
  'kylo ren',
  'bane',
  'shredder',
  'general grievous',
  'captain hook',
  'maleficent',
  'the terminator (t-800)',
  'the grinch',
  'poison ivy',
  'megamind',
  'mystique',
  'scar',
  'tony montana',
  'majin buu',
  'godzilla',
  'demona',
  'count dracula',
  'medusa',
]);

const ANIMATED_CHARACTERS = new Set([
  'velma dinkley',
  'edna mode',
  'arthur read',
  'milhouse van houten',
  'simon seville',
  'carl wheezer',
  'professor farnsworth',
  'roz',
  'tina belcher',
  'daria morgendorffer',
  'dexter',
  'woody',
  'monkey d. luffy',
  'carmen sandiego',
  'paddington bear',
  'ash ketchum',
  'inspector gadget',
  'saitama',
  'homer simpson',
  'gru',
  'aang',
  'krillin',
  'mr. clean',
  'popeye the sailor',
  'charlie brown',
  'shredder',
  'edward elric',
  'captain hook',
  'finn the human',
  'scooby-doo',
  'maleficent',
  'mufasa',
  'bob parr (mr. incredible)',
  'peter griffin',
  'marlin',
  'geppetto',
  'goofy',
  'trunks',
  'remy (ratatouille)',
  'spongebob squarepants',
  'sanji',
  'garfield',
  'shrek',
  'the grinch',
  'piccolo',
  'mike wazowski',
  'peter pan',
  'sonic the hedgehog',
  'genie',
  'dory',
  'sadness',
  'stitch (experiment 626)',
  'papa smurf',
  'megamind',
  'sulley',
  'inuyasha',
  'scar',
  'prince zuko',
  'kakashi hatake',
  'majin buu',
  'shaggy rogers',
  'tintin',
  'wallace',
  'hiccup horrendous haddock iii',
  'aladdin',
  'emperor kuzco',
  'bugs bunny',
  'simba',
  'philip j. fry',
  'demona',
  'philoctetes',
  'buzz lightyear',
]);

const ANIME_MANGA_CHARACTERS = new Set([
  'monkey d. luffy',
  'ash ketchum',
  'saitama',
  'krillin',
  'edward elric',
  'trunks',
  'sanji',
  'piccolo',
  'inuyasha',
  'kakashi hatake',
  'majin buu',
]);

const VIDEO_GAME_CHARACTERS = new Set([
  'mario',
  'master chief',
  'raiden',
  'barret wallace',
  'jax briggs',
  'joel miller',
  'luigi',
  'sonic the hedgehog',
  'mega man',
  'link',
  'cloud strife',
  'geralt of rivia',
  'big boss (naked snake)',
  'kratos',
  'ash ketchum',
  'carmen sandiego',
]);

const COMIC_SUPERHERO_CHARACTERS = new Set([
  'clark kent',
  'cyclops (scott summers)',
  'professor x (charles xavier)',
  'lex luthor',
  'thanos',
  'drax the destroyer',
  'batman (bruce wayne)',
  'batman',
  'spider-man (peter parker)',
  'spider-man',
  'deadpool (wade wilson)',
  'deadpool',
  'rorschach',
  'v (v for vendetta)',
  'iron man (tony stark)',
  'bane',
  'winter soldier (bucky barnes)',
  'cyborg (victor stone)',
  'cable (nathan summers)',
  'cable',
  'doctor strange',
  'scarlet witch (wanda maximoff)',
  'zatanna',
  'john constantine',
  'the flash (barry allen)',
  'hulk (bruce banner)',
  'gamora',
  'poison ivy',
  'mystique',
  'thor',
  'wonder woman (diana prince)',
  'nick fury',
  'wolverine (logan)',
  'superman (clark kent)',
  'superman',
  'luke cage',
  'she-hulk (jennifer walters)',
  'aquaman (arthur curry)',
  'captain america (steve rogers)',
  'edna mode',
  'bob parr (mr. incredible)',
  'saitama',
  'the mask (stanley ipkiss)',
]);

const YOUNG_CHARACTERS = new Set([
  'harry potter',
  'velma dinkley',
  'arthur read',
  'milhouse van houten',
  'simon seville',
  'steve urkel',
  'carl wheezer',
  'tina belcher',
  'daria morgendorffer',
  'dexter',
  'monkey d. luffy',
  'ash ketchum',
  'aang',
  'charlie brown',
  'spider-man (peter parker)',
  'spider-man',
  'edward elric',
  'finn the human',
  'nancy drew',
  'veronica mars',
  'hermione granger',
  'marty mcfly',
  'trunks',
  'bill s. preston',
  'peter pan',
  'link',
  'percy jackson',
  'prince zuko',
  'shaggy rogers',
  'dorothy gale',
  'tintin',
  'hiccup horrendous haddock iii',
  'aladdin',
  'ferris bueller',
  'zack morris',
  'malcolm',
  'emperor kuzco',
  'simba',
  'king tutankhamun',
]);

/**
 * Helper to find all verified categories and themes a character belongs to.
 */
function getCharacterCategories(charName: string): string[] {
  const lower = charName.toLowerCase();
  const baseName = lower.replace(/\s*\(.*?\)\s*/g, '').trim();
  const traits: string[] = [];

  for (const cat of VERIFIED_CATEGORIES) {
    const found = cat.characters.some((c) => {
      const cLow = c.name.toLowerCase();
      const cBase = cLow.replace(/\s*\(.*?\)\s*/g, '').trim();
      return cLow === lower || cBase === baseName;
    });
    if (found) {
      traits.push(cat.id, cat.trait.toLowerCase(), cat.name.toLowerCase());
    }
  }

  for (const theme of CURATED_THEMES) {
    const found = theme.characters.some((c) => {
      const cLow = c.name.toLowerCase();
      const cBase = cLow.replace(/\s*\(.*?\)\s*/g, '').trim();
      return cLow === lower || cBase === baseName;
    });
    if (found) {
      traits.push(theme.id, theme.name.toLowerCase());
    }
  }

  return traits;
}

/**
 * Normalize string for fuzzy character name comparison
 */
function normalizeForMatch(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’`".-]/g, ' ')
    .replace(/\b(the|mr|mrs|ms|dr|sir|lord|lady|captain|capt|professor|prof|prince|princess|king|queen|emperor|master|general|inspector)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Compute Levenshtein edit distance for typo forgiveness
 */
function editDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 3) return 99;
  const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[a.length][b.length];
}

/**
 * Checks if a user's character guess matches the secret character.
 * Also detects if the guess is from the same franchise/origin ("warm" guess!).
 */
export function checkCharacterGuess(
  rawGuess: string,
  secretChar: Character
): { isCorrect: boolean; isSameOrigin: boolean } {
  const cleanedGuess = rawGuess
    .replace(/^(am i|is it|is my character|are they|could it be|i guess|my guess is)\s+/i, '')
    .replace(/[?!.]+$/g, '')
    .trim();

  if (!cleanedGuess || cleanedGuess.length < 2) {
    return { isCorrect: false, isSameOrigin: false };
  }

  const guessNorm = normalizeForMatch(cleanedGuess);
  const fullSecretNorm = normalizeForMatch(secretChar.name);

  // Extract primary name and parenthetical alias, e.g. "Din Djarin (The Mandalorian)" -> ["din djarin", "mandalorian"]
  const aliasMatches = [...secretChar.name.matchAll(/\(([^)]+)\)/g)].map((m) =>
    normalizeForMatch(m[1])
  );
  const outsideParens = normalizeForMatch(secretChar.name.replace(/\([^)]*\)/g, ''));

  const candidateTargets = new Set<string>([
    fullSecretNorm,
    outsideParens,
    ...aliasMatches,
  ]);

  // Add individual distinctive tokens (length >= 5) like "Potter", "Dumbledore", "Voldemort", "Velma", "SpongeBob", "Gandalf", "Fieri", "Schrute"
  for (const part of [outsideParens, ...aliasMatches]) {
    const tokens = part.split(' ').filter((t) => t.length >= 4);
    if (tokens.length === 1) {
      candidateTargets.add(tokens[0]);
    } else if (tokens.length >= 2) {
      // Allow last name or distinctive first name if >= 5 chars and not generic ("john", "james", "peter", "walter", "charles", "arthur", "robert")
      const genericFirstNames = new Set([
        'john', 'james', 'peter', 'walter', 'charles', 'arthur', 'robert', 'william', 'michael', 'david', 'richard', 'thomas', 'martin', 'scott', 'bruce', 'clark', 'barry', 'steve', 'tony', 'luke', 'simon', 'victor', 'nathan',
      ]);
      const first = tokens[0];
      const last = tokens[tokens.length - 1];
      if (last.length >= 4) candidateTargets.add(last);
      if (first.length >= 5 && !genericFirstNames.has(first)) {
        candidateTargets.add(first);
      }
    }
  }

  for (const target of candidateTargets) {
    if (!target) continue;
    if (guessNorm === target) {
      return { isCorrect: true, isSameOrigin: true };
    }
    // Allow 1-2 character typo for longer names
    if (target.length >= 6 && guessNorm.length >= 5 && editDistance(guessNorm, target) <= 1) {
      return { isCorrect: true, isSameOrigin: true };
    }
    if (target.length >= 9 && guessNorm.length >= 7 && editDistance(guessNorm, target) <= 2) {
      return { isCorrect: true, isSameOrigin: true };
    }
  }

  // Check if the guessed character is another known character from the same franchise/origin
  let isSameOrigin = false;
  if (secretChar.origin) {
    const secretOriginNorm = secretChar.origin.toLowerCase();
    for (const cat of VERIFIED_CATEGORIES) {
      for (const c of cat.characters) {
        const cNorm = normalizeForMatch(c.name.replace(/\([^)]*\)/g, ''));
        if (cNorm === guessNorm && c.origin.toLowerCase() === secretOriginNorm) {
          isSameOrigin = true;
          break;
        }
      }
    }
  }

  return { isCorrect: false, isSameOrigin };
}

/**
 * Evaluates any Yes/No question about the secret character using our deterministic
 * Character Knowledge Engine.
 */
export function evaluateSoloQuestion(
  rawQuestion: string,
  secretChar: Character,
  themeName: string = ''
): OracleEvaluation {
  const q = rawQuestion.trim().toLowerCase();
  const charLower = secretChar.name.toLowerCase();
  const charBase = charLower.replace(/\s*\(.*?\)\s*/g, '').trim();
  const originLower = (secretChar.origin || '').toLowerCase();
  const hintLower = (secretChar.hint || '').toLowerCase();
  const verifyLower = (secretChar.traitVerification || '').toLowerCase();
  const combinedCorpus = `${charLower} ${originLower} ${hintLower} ${verifyLower} ${themeName.toLowerCase()}`;
  const charCategories = getCharacterCategories(secretChar.name);
  const fullCorpus = `${combinedCorpus} ${charCategories.join(' ')}`;

  // 1. Check if the user actually typed a character guess as a question (e.g. "Am I Harry Potter?")
  const { isCorrect } = checkCharacterGuess(rawQuestion, secretChar);
  if (isCorrect) {
    return {
      verdict: 'YES',
      answerText: `By the Royal Crown—YES! You have unmasked your secret identity!`,
      isDirectGuess: true,
      guessedCharacterMatch: true,
    };
  }

  // Helper flags for this character
  const isFemale = FEMALE_CHARACTERS.has(charLower) || FEMALE_CHARACTERS.has(charBase);
  const isReal = REAL_HISTORICAL_PEOPLE.has(charLower) || REAL_HISTORICAL_PEOPLE.has(charBase);
  const isNonHuman = NON_HUMAN_CHARACTERS.has(charLower) || NON_HUMAN_CHARACTERS.has(charBase);
  const isAnimal = ANIMAL_CHARACTERS.has(charLower) || ANIMAL_CHARACTERS.has(charBase);
  const isVillain = VILLAIN_CHARACTERS.has(charLower) || VILLAIN_CHARACTERS.has(charBase);
  const isAnimated = ANIMATED_CHARACTERS.has(charLower) || ANIMATED_CHARACTERS.has(charBase);
  const isAnime = ANIME_MANGA_CHARACTERS.has(charLower) || ANIME_MANGA_CHARACTERS.has(charBase);
  const isVideoGame = VIDEO_GAME_CHARACTERS.has(charLower) || VIDEO_GAME_CHARACTERS.has(charBase);
  const isComic = COMIC_SUPERHERO_CHARACTERS.has(charLower) || COMIC_SUPERHERO_CHARACTERS.has(charBase);
  const isYoung = YOUNG_CHARACTERS.has(charLower) || YOUNG_CHARACTERS.has(charBase);

  // 2. GENDER QUESTIONS
  if (/\b(female|woman|women|girl|lady|she|her|actress|queen|princess|mother|mom|sister|daughter)\b/.test(q) && !/\b(male|man|boy)\b/.test(q)) {
    return isFemale
      ? { verdict: 'YES', answerText: 'Aye! Your secret identity is female.' }
      : { verdict: 'NO', answerText: 'Nay! Your character is not female.' };
  }

  if (/\b(male|man|men|boy|guy|he|him|his|gentleman|king|prince)\b/.test(q)) {
    if (/\b(father|dad|paternal)\b/.test(q)) {
      const isFather = charCategories.includes('fathers') || /\b(father|dad|son|daughter)\b/.test(fullCorpus);
      return isFather
        ? { verdict: 'YES', answerText: 'Aye! Your character is indeed a father.' }
        : { verdict: 'NO', answerText: 'Nay, they are not known for being a father.' };
    }
    return !isFemale
      ? { verdict: 'YES', answerText: 'Aye! Your secret identity is male.' }
      : { verdict: 'NO', answerText: 'Nay! Your character is not male.' };
  }

  // 3. REAL / HISTORICAL VS FICTIONAL
  if (/\b(real|historical|real life|actual person|non-fiction|existed|living|celebrity|biographical)\b/.test(q)) {
    return isReal
      ? { verdict: 'YES', answerText: 'Aye! They walked the real world as a historical or living figure.' }
      : { verdict: 'NO', answerText: 'Nay! Your character hails from the realms of fiction.' };
  }

  if (/\b(fictional|fiction|made up|imaginary)\b/.test(q)) {
    return !isReal
      ? { verdict: 'YES', answerText: 'Aye! Your character is a fictional creation.' }
      : { verdict: 'NO', answerText: 'Nay! They are a real figure from history or our world.' };
  }

  // 4. SPECIES: HUMAN / ANIMAL / ALIEN / ROBOT / MONSTER
  if (/\b(human|mortal|person)\b/.test(q) && !/\b(superhuman|non-human)\b/.test(q)) {
    return !isNonHuman
      ? { verdict: 'YES', answerText: 'Aye! Your character is human.' }
      : { verdict: 'NO', answerText: 'Nay! They are not an ordinary human.' };
  }

  if (/\b(animal|beast|creature|dog|cat|bear|frog|fish|rat|lion|monkey|hedgehog|bird|monster)\b/.test(q)) {
    if (/\b(pet|companion|familiar|sidekick)\b/.test(q)) {
      const hasPet = charCategories.includes('animal-companions') || /\b(pet|dog|companion|pikachu|scooby|toto|snowy|gromit|toothless|abu|snoopy|fang)\b/.test(fullCorpus);
      return hasPet
        ? { verdict: 'YES', answerText: 'Aye! They are accompanied by a loyal animal companion.' }
        : { verdict: 'NO', answerText: 'Nay, they are not known for a signature pet or animal familiar.' };
    }
    const isCreature = isAnimal || isNonHuman;
    return isCreature
      ? { verdict: 'YES', answerText: 'Aye! They are a non-human creature, animal, or extraordinary being.' }
      : { verdict: 'NO', answerText: 'Nay! Your character is human, not an animal or monster.' };
  }

  if (/\b(alien|extraterrestrial|outer space|another planet|martian|kryptonian)\b/.test(q)) {
    const isAlien = /\b(alien|extraterrestrial|krypton|titan|namekian|gallifrey|time lord|vulcan|dagobah|experiment 626|zehoberei|apokolip)\b/.test(fullCorpus) ||
      ['yoda', 'thanos', 'drax the destroyer', 'gamora', 'superman (clark kent)', 'clark kent', 'superman', 'stitch (experiment 626)', 'megamind', 'the doctor', 'piccolo', 'trunks', 'majin buu', 'spock', 'e.t. the extra-terrestrial'].includes(charLower);
    return isAlien
      ? { verdict: 'YES', answerText: 'Aye! They hail from beyond Earth or an extraterrestrial lineage.' }
      : { verdict: 'NO', answerText: 'Nay! They are not an alien from another planet.' };
  }

  if (/\b(robot|cyborg|android|machine|bionic|prosthetic|cybernetic|artificial|automail)\b/.test(q)) {
    const isCyber = charCategories.includes('cybernetic-robotic-limbs') ||
      /\b(robot|cyborg|android|cybernetic|prosthetic|bionic|automail|hyperalloy|mechanical)\b/.test(fullCorpus) ||
      ['mega man', 'the terminator (t-800)', 'darth vader', 'cyborg (victor stone)', 'general grievous', 'inspector gadget', 'raiden'].includes(charLower);
    return isCyber
      ? { verdict: 'YES', answerText: 'Aye! They possess cybernetic, robotic, or prosthetic enhancements.' }
      : { verdict: 'NO', answerText: 'Nay! They are neither robot nor cyborg.' };
  }

  // 5. MEDIUM: MOVIE / TV / ANIMATED / ANIME / VIDEO GAME / COMICS / LITERATURE
  if (/\b(anime|manga|japanese)\b/.test(q)) {
    const isJp = isAnime || /\b(nintendo|sega|capcom|final fantasy|pokemon|zelda|mario|luigi|sonic|naruto|one piece|dragon ball|fullmetal|one punch|toho|godzilla|metal gear)\b/.test(fullCorpus);
    return isJp
      ? { verdict: 'YES', answerText: 'Aye! They hail from anime, manga, or Japanese pop culture.' }
      : { verdict: 'NO', answerText: 'Nay! They are not from anime or Japanese media.' };
  }

  if (/\b(animated|animation|cartoon|pixar|dreamworks|disney|2d|3d|drawn)\b/.test(q)) {
    const matchesAnim = isAnimated || /\b(disney|pixar|dreamworks|nickelodeon|cartoon|simpsons|futurama|scooby|looney tunes|muppet|pbs|peanuts|hanna-barbera)\b/.test(fullCorpus);
    return matchesAnim
      ? { verdict: 'YES', answerText: 'Aye! Your character is famously depicted in animation or cartoons.' }
      : { verdict: 'NO', answerText: 'Nay! They are primarily known from live-action, history, or non-animated works.' };
  }

  if (/\b(video game|videogame|game|gaming|gamer|nintendo|playstation|xbox|arcade)\b/.test(q)) {
    return isVideoGame
      ? { verdict: 'YES', answerText: 'Aye! They are iconic in the world of video games.' }
      : { verdict: 'NO', answerText: 'Nay! They did not originate as a video game character.' };
  }

  if (/\b(comic|comics|superhero|marvel|dc|avengers|justice league|x-men|mutant)\b/.test(q)) {
    if (/\b(marvel|avengers|x-men)\b/.test(q) && !/\bdc\b/.test(q)) {
      const isMarvel = /\b(marvel|x-men)\b/.test(fullCorpus);
      return isMarvel
        ? { verdict: 'YES', answerText: 'Aye! They belong to the Marvel universe.' }
        : { verdict: 'NO', answerText: 'Nay! They are not from Marvel.' };
    }
    if (/\b(dc|gotham|krypton|justice league)\b/.test(q) && !/\bmarvel\b/.test(q)) {
      const isDC = /\b(dc comics|dc \/ vertigo|gotham|watchmen)\b/.test(fullCorpus);
      return isDC
        ? { verdict: 'YES', answerText: 'Aye! They belong to the DC Comics pantheon.' }
        : { verdict: 'NO', answerText: 'Nay! They are not from DC Comics.' };
    }
    return isComic
      ? { verdict: 'YES', answerText: 'Aye! They are a comic book or superhero figure.' }
      : { verdict: 'NO', answerText: 'Nay! They are not from comic books or superhero lore.' };
  }

  if (/\b(tv|television|series|show|sitcom)\b/.test(q)) {
    const isTV = /\b(tv|simpsons|office|breaking bad|scooby|stranger things|game of thrones|friends|family guy|futurama|doctor who|star trek|avatar|bob's burgers|daria|dexter|family matters|jimmy neutron|arthur|monk|columbo|veronica mars|heroes|saved by the bell|malcolm|fleabag|gargoyles|muppets|sesame street|food network|nickelodeon|bbc|mtv|pbs)\b/.test(fullCorpus);
    return isTV
      ? { verdict: 'YES', answerText: 'Aye! They are famous from television.' }
      : { verdict: 'NO', answerText: 'Nay! They are not primarily a television character.' };
  }

  if (/\b(movie|movies|film|cinema)\b/.test(q)) {
    const isMovie = !isReal && (
      /\b(star wars|harry potter|lord of the rings|hobbit|matrix|indiana jones|back to the future|toy story|incredibles|monsters, inc|finding nemo|ratatouille|inside out|lion king|aladdin|sleeping beauty|emperor's new groove|lilo|shrek|megamind|despicable me|how to train|ghostbusters|austin powers|nightmare on elm street|scream|friday the 13th|pirates of the caribbean|fast & furious|mad max|terminator|bill & ted|knives out|pink panther|ace ventura|scarface|princess bride|wizard of oz|ferris bueller|the mask|hunger games|karate kid|alien|james bond|007|marvel|dc comics)\b/.test(fullCorpus)
    );
    return isMovie
      ? { verdict: 'YES', answerText: 'Aye! They have starred on the silver screen in film.' }
      : { verdict: 'NO', answerText: 'Nay! They are not primarily known as a movie character.' };
  }

  if (/\b(book|novel|literature|myth|mythology|folklore|legend|fairy tale)\b/.test(q)) {
    const isLit = /\b(harry potter|lord of the rings|hobbit|doyle|sherlock|agatha christie|roald dahl|seuss|michael bond|mcculley|alice in wonderland|folklore|robin hood|gaston leroux|barrie|peter pan|carolyn keene|arthurian|merlin|king arthur|pinocchio|riordan|witcher|herge|wizard of oz|washington irving|hunger games|bram stoker|mythology|greek|norse|egyptian)\b/.test(fullCorpus);
    return isLit
      ? { verdict: 'YES', answerText: 'Aye! Their tale is rooted in literature, books, or mythic folklore.' }
      : { verdict: 'NO', answerText: 'Nay! They did not originate primarily from classic books or mythology.' };
  }

  // 6. ALIGNMENT & ROLE: VILLAIN / HERO / ROYALTY / DETECTIVE / PARENT / MENTOR / CHEF / YOUNG
  if (/\b(villain|antagonist|bad guy|evil|dark lord|criminal|enemy|terrorist|slasher)\b/.test(q)) {
    return isVillain
      ? { verdict: 'YES', answerText: 'Aye! They are known as a villain, antagonist, or outlaw.' }
      : { verdict: 'NO', answerText: 'Nay! They are not a villain.' };
  }

  if (/\b(hero|protagonist|good guy|main character|savior|champion)\b/.test(q)) {
    return !isVillain
      ? { verdict: 'YES', answerText: 'Aye! They stand as a protagonist, hero, or leading figure.' }
      : { verdict: 'NO', answerText: 'Nay! They walk the darker path of a villain or antagonist.' };
  }

  if (/\b(royal|royalty|king|queen|prince|princess|monarch|emperor|throne|crown|ruler|lord)\b/.test(q)) {
    const isRoyal = charCategories.includes('exiled-royalty') ||
      charCategories.includes('legendary-rulers') ||
      /\b(king|queen|prince|princess|emperor|pharaoh|royal|throne|monarch|lord of winterfell|ruler)\b/.test(fullCorpus);
    return isRoyal
      ? { verdict: 'YES', answerText: 'Aye! Royal blood, a crown, or high rule belongs to their story.' }
      : { verdict: 'NO', answerText: 'Nay! They are not royalty or a crowned monarch.' };
  }

  if (/\b(detective|sleuth|investigator|mystery|mysteries|crime|police|cop|sheriff|agent)\b/.test(q)) {
    const isSleuth = charCategories.includes('sleuths-and-detectives') ||
      charCategories.includes('master-sleuths') ||
      /\b(detective|sleuth|investigator|mystery|police|homicide|sheriff|agent|fbi|shield)\b/.test(fullCorpus);
    return isSleuth
      ? { verdict: 'YES', answerText: 'Aye! They are known for investigating mysteries, crimes, or enforcing the law.' }
      : { verdict: 'NO', answerText: 'Nay! They are not a detective or investigator.' };
  }

  if (/\b(father|dad|parent|children|kids|son|daughter|family)\b/.test(q)) {
    const isParent = charCategories.includes('fathers') ||
      /\b(father|dad|son|daughter|children|patriarch)\b/.test(fullCorpus);
    return isParent
      ? { verdict: 'YES', answerText: 'Aye! They are a parent or father figure.' }
      : { verdict: 'NO', answerText: 'Nay! Being a parent is not a defining trait of their story.' };
  }

  if (/\b(kid|child|teen|teenager|young|student|school|boy|girl)\b/.test(q)) {
    return isYoung
      ? { verdict: 'YES', answerText: 'Aye! They are depicted as a child, teenager, or young student.' }
      : { verdict: 'NO', answerText: 'Nay! Your character is a grown adult (or ancient being).' };
  }

  if (/\b(mentor|teacher|professor|master|old|elderly|wise)\b/.test(q)) {
    const isMentor = charCategories.includes('legendary-mentors') ||
      /\b(mentor|teacher|professor|headmaster|master|grand master|elderly|ancient|sensei)\b/.test(fullCorpus);
    return isMentor
      ? { verdict: 'YES', answerText: 'Aye! They are known as a mentor, teacher, or wise elder.' }
      : { verdict: 'NO', answerText: 'Nay! They are not primarily a wise elder or mentor.' };
  }

  if (/\b(chef|cook|food|baker|kitchen|culinary|restaurant|eat)\b/.test(q)) {
    const isFood = charCategories.includes('food-culinary') ||
      charCategories.includes('famous-cooks') ||
      /\b(chef|cook|baker|culinary|food|kitchen|krabby|lasagna|cookie|donut|spinach|marmalade)\b/.test(fullCorpus);
    return isFood
      ? { verdict: 'YES', answerText: 'Aye! Cooking, cuisine, or a famous appetite defines them.' }
      : { verdict: 'NO', answerText: 'Nay! They are not a chef or culinary figure.' };
  }

  if (/\b(doctor|physician|nurse|surgeon|scientist|inventor|genius|chemist)\b/.test(q)) {
    const isSciDoc = charCategories.includes('iconic-healers') ||
      /\b(doctor|dr\.|surgeon|nurse|physician|scientist|inventor|genius|chemist|professor|science)\b/.test(fullCorpus);
    return isSciDoc
      ? { verdict: 'YES', answerText: 'Aye! They are a doctor, healer, scientist, or brilliant inventor.' }
      : { verdict: 'NO', answerText: 'Nay! They are neither a doctor nor a scientist.' };
  }

  // 7. POWERS, APPEARANCE & EQUIPMENT
  if (/\b(magic|magical|wizard|witch|sorcerer|spell|powers|superpower|superhuman|force|telepath|mutant)\b/.test(q)) {
    const hasMagicOrPower = charCategories.includes('magic-wizards-witches') ||
      charCategories.includes('superhuman-durability') ||
      /\b(magic|wizard|witch|sorcerer|spell|superpower|superhuman|mutant|telepath|force|jedi|sith|avatar|airbender|saiyan|god|demigod|goddess|enchanted|curse|speedster|time lord|chronokinesis|gamma|krypton|spider|lasso)\b/.test(fullCorpus);
    return hasMagicOrPower
      ? { verdict: 'YES', answerText: 'Aye! They wield magic, the Force, or superhuman powers.' }
      : { verdict: 'NO', answerText: 'Nay! They rely on mortal skill, wit, or technology rather than magic or superpowers.' };
  }

  if (/\b(glasses|spectacles|goggles|visor|eyewear|sunglasses)\b/.test(q)) {
    const wearsGlasses = charCategories.includes('glasses-spectacles-goggles') ||
      /\b(glasses|spectacles|goggles|visor|sunglasses|eyewear)\b/.test(fullCorpus);
    return wearsGlasses
      ? { verdict: 'YES', answerText: 'Aye! They wear signature glasses, spectacles, goggles, or a visor.' }
      : { verdict: 'NO', answerText: 'Nay! They do not wear signature glasses.' };
  }

  if (/\b(hat|fedora|cap|top hat|cowboy hat|headwear|helmet|crown)\b/.test(q) && !/\bmask\b/.test(q)) {
    const wearsHat = charCategories.includes('iconic-hats') ||
      charCategories.includes('masks-helmets-disguises') ||
      /\b(hat|fedora|cap|top hat|deerstalker|helmet|tricorn|bycocket|phrygian|crown)\b/.test(fullCorpus);
    return wearsHat
      ? { verdict: 'YES', answerText: 'Aye! They wear an iconic hat, cap, helmet, or crown.' }
      : { verdict: 'NO', answerText: 'Nay! They are not known for wearing a signature hat.' };
  }

  if (/\b(mask|helmet|disguise|cowl|hide their face|conceal)\b/.test(q)) {
    const wearsMask = charCategories.includes('masks-helmets-disguises') ||
      charCategories.includes('caped-masked') ||
      /\b(mask|helmet|cowl|disguise)\b/.test(fullCorpus);
    return wearsMask
      ? { verdict: 'YES', answerText: 'Aye! They conceal their face behind a mask, cowl, or helmet.' }
      : { verdict: 'NO', answerText: 'Nay! Their face is not hidden behind a mask or helmet.' };
  }

  if (/\b(bald|hairless|no hair|shaved head)\b/.test(q)) {
    const isBald = charCategories.includes('bald-hairless') ||
      /\b(bald|hairless|shaves his head|shaven)\b/.test(fullCorpus);
    return isBald
      ? { verdict: 'YES', answerText: 'Aye! They are bald or lack head hair.' }
      : { verdict: 'NO', answerText: 'Nay! They have hair (or fur/headgear).' };
  }

  if (/\b(scar|eyepatch|eye patch|facial mark|burn|tattoo)\b/.test(q)) {
    const hasScar = charCategories.includes('scars-eyepatches') ||
      /\b(scar|eyepatch|eye patch|burn mark|tattoo)\b/.test(fullCorpus);
    return hasScar
      ? { verdict: 'YES', answerText: 'Aye! They bear an iconic scar, eyepatch, or facial marking.' }
      : { verdict: 'NO', answerText: 'Nay! They are not defined by a facial scar or eyepatch.' };
  }

  if (/\b(weapon|sword|blade|hammer|lightsaber|gun|shield|lasso|wand|bow|machete)\b/.test(q)) {
    const hasWeapon = charCategories.includes('legendary-weapons') ||
      /\b(weapon|sword|blade|hammer|mjolnir|excalibur|lightsaber|dagger|sting|buster sword|wand|machete|gun|gatling|shield|lasso|trident|saber)\b/.test(fullCorpus);
    return hasWeapon
      ? { verdict: 'YES', answerText: 'Aye! They wield a signature weapon, blade, wand, or armament.' }
      : { verdict: 'NO', answerText: 'Nay! They do not carry a signature weapon.' };
  }

  if (/\b(space|galaxy|star wars|star trek|sci-fi|science fiction|future|time travel|time)\b/.test(q)) {
    if (/\bstar wars\b/.test(q)) {
      return originLower.includes('star wars')
        ? { verdict: 'YES', answerText: 'Aye! They hail from a galaxy far, far away (Star Wars).' }
        : { verdict: 'NO', answerText: 'Nay! They are not from Star Wars.' };
    }
    if (/\b(time travel|travel through time|time machine)\b/.test(q)) {
      const isTime = charCategories.includes('time-travelers') || /\b(time travel|time machine|tardis|delorean|time-turner|flux capacitor)\b/.test(fullCorpus);
      return isTime
        ? { verdict: 'YES', answerText: 'Aye! They travel through or manipulate time.' }
        : { verdict: 'NO', answerText: 'Nay! Time travel is not their domain.' };
    }
    const isSciFi = charCategories.includes('cosmic-explorers') ||
      charCategories.includes('time-travelers') ||
      charCategories.includes('cybernetic-robotic-limbs') ||
      /\b(star wars|star trek|futurama|matrix|back to the future|doctor who|terminator|halo|alien|space|galaxy|sci-fi|cybernetic|lilo|megamind|rick|guardians)\b/.test(fullCorpus);
    return isSciFi
      ? { verdict: 'YES', answerText: 'Aye! Their story involves sci-fi, outer space, or futuristic technology.' }
      : { verdict: 'NO', answerText: 'Nay! They are not from a sci-fi or outer-space setting.' };
  }

  if (/\b(fantasy|medieval|dragon|elf|hobbit|magic|hogwarts|middle-earth|westeros)\b/.test(q)) {
    const isFantasy = charCategories.includes('magic-wizards-witches') ||
      /\b(harry potter|lord of the rings|hobbit|game of thrones|witcher|zelda|arthurian|sleeping beauty|aladdin|lion king|shrek|peter pan|wizard of oz|avatar|how to train|inuyasha|fullmetal|norse|greek|mythology|fantasy)\b/.test(fullCorpus);
    return isFantasy
      ? { verdict: 'YES', answerText: 'Aye! They belong to a fantasy, magical, or mythic realm.' }
      : { verdict: 'NO', answerText: 'Nay! They are not from a medieval or fantasy realm.' };
  }

  if (/\b(green)\b/.test(q)) {
    const isGreen = charCategories.includes('green-design') || /\bgreen\b/.test(fullCorpus);
    return isGreen
      ? { verdict: 'YES', answerText: 'Aye! Green is their signature color.' }
      : { verdict: 'NO', answerText: 'Nay! They are not predominantly green.' };
  }

  if (/\b(blue)\b/.test(q)) {
    const isBlue = charCategories.includes('blue-design') || /\bblue\b/.test(fullCorpus);
    return isBlue
      ? { verdict: 'YES', answerText: 'Aye! Blue is strongly tied to their look.' }
      : { verdict: 'NO', answerText: 'Nay! They are not predominantly blue.' };
  }

  // 8. SPECIFIC FRANCHISE / KEYWORD MATCH IN CORPUS
  // Extract meaningful words (length >= 4) from the question and check if they appear in the character's origin/hint/verification
  const stopWords = new Set([
    'does', 'have', 'they', 'their', 'character', 'from', 'with', 'that', 'this', 'were', 'what', 'when', 'where', 'which', 'about', 'known', 'famous', 'wear', 'wears', 'into', 'like', 'some', 'more', 'very', 'only', 'ever', 'been', 'make', 'made', 'good', 'main', 'part',
  ]);
  const queryWords = q
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !stopWords.has(w));

  if (queryWords.length > 0) {
    const matchedKeyword = queryWords.find((w) => fullCorpus.includes(w));
    if (matchedKeyword) {
      return {
        verdict: 'YES',
        answerText: 'Aye! The royal chronicles confirm that connection to your character.',
      };
    }
  }

  return {
    verdict: 'NO',
    answerText: 'Nay! That does not describe your secret identity according to the royal archives.',
  };
}

let cachedAllNames: string[] | null = null;
export function getAllKnownCharacterNames(): string[] {
  if (cachedAllNames) return cachedAllNames;
  const set = new Set<string>();
  for (const cat of VERIFIED_CATEGORIES) {
    for (const c of cat.characters) {
      set.add(c.name);
    }
  }
  for (const theme of CURATED_THEMES) {
    for (const c of theme.characters) {
      set.add(c.name);
    }
  }
  cachedAllNames = Array.from(set).sort((a, b) => a.localeCompare(b));
  return cachedAllNames;
}

/**
 * Curated set of universally recognizable mainstream pop-culture & historical icons.
 * Excludes anime/manga deep-cuts and niche RPG/comic characters so Solo players
 * always get a character they actually know.
 */
const HOUSEHOLD_ICON_NAMES = new Set<string>([
  'harry potter',
  'velma dinkley',
  'clark kent',
  'edna mode',
  'doc brown',
  'walter white',
  'walter white (heisenberg)',
  'arthur read',
  "where's waldo",
  'albus dumbledore',
  'steve urkel',
  'austin powers',
  'john lennon',
  'dwight schrute',
  'indiana jones',
  'gandalf',
  'sherlock holmes',
  'willy wonka',
  'the cat in the hat',
  'freddy krueger',
  'mario',
  'woody',
  'abraham lincoln',
  'paddington bear',
  'zorro',
  'captain jack sparrow',
  'mad hatter',
  'robin hood',
  'inspector gadget',
  'professor x (charles xavier)',
  'lord voldemort',
  'homer simpson',
  'gru',
  'lex luthor',
  'captain jean-luc picard',
  'thanos',
  'mr. clean',
  'popeye the sailor',
  'charlie brown',
  'dr. evil',
  'batman (bruce wayne)',
  'batman',
  'spider-man (peter parker)',
  'spider-man',
  'darth vader',
  'deadpool (wade wilson)',
  'deadpool',
  'boba fett',
  'ghostface',
  'the phantom of the opera',
  'jason voorhees',
  'iron man (tony stark)',
  'luke skywalker',
  'captain hook',
  'dr. john watson',
  'hercule poirot',
  'columbo',
  'nancy drew',
  'ace ventura',
  'scooby-doo',
  'hermione granger',
  'doctor strange',
  'scarlet witch (wanda maximoff)',
  'severus snape',
  'maleficent',
  'merlin',
  'mufasa',
  'bob parr (mr. incredible)',
  'peter griffin',
  'marlin',
  'geppetto',
  'goofy',
  'marty mcfly',
  'the terminator (t-800)',
  'the flash (barry allen)',
  'gordon ramsay',
  'julia child',
  'remy (ratatouille)',
  'spongebob squarepants',
  'garfield',
  'cookie monster',
  'guy fieri',
  'hulk (bruce banner)',
  'yoda',
  'shrek',
  'kermit the frog',
  'the grinch',
  'luigi',
  'mike wazowski',
  'peter pan',
  'poison ivy',
  'sonic the hedgehog',
  'genie',
  'dory',
  'sadness',
  'stitch (experiment 626)',
  'papa smurf',
  'megamind',
  'sulley',
  'mystique',
  'thor',
  'king arthur',
  'frodo baggins',
  'aragorn',
  'wonder woman (diana prince)',
  'bilbo baggins',
  'nick fury',
  'scar',
  'wolverine (logan)',
  'superman (clark kent)',
  'superman',
  'godzilla',
  'shaggy rogers',
  'dorothy gale',
  'wallace',
  'aladdin',
  'rubeus hagrid',
  'ferris bueller',
  'the mask (stanley ipkiss)',
  'emperor kuzco',
  'bugs bunny',
  'simba',
  'daenerys targaryen',
  'princess leia organa',
  'aquaman (arthur curry)',
  'captain america (steve rogers)',
  'rip van winkle',
  'obi-wan kenobi',
  'mr. miyagi',
]);

export function isHouseholdIcon(char: Character): boolean {
  const lower = char.name.toLowerCase().trim();
  const base = lower.replace(/\s*\(.*?\)\s*/g, '').trim();
  return HOUSEHOLD_ICON_NAMES.has(lower) || HOUSEHOLD_ICON_NAMES.has(base);
}


