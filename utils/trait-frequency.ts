export const traitFrequency = {
  Background: {
    'Baby Blue': 399,
    Cyan: 304,
    Orange: 345,
    Peach: 427,
    Pink: 553,
    Purple: 466,
    Red: 425,
    Yellow: 431,
  },

  Base: { Alien: 262, Ape: 508, Normal: 1540, Zombie: 1040 },

  Eye: {
    'Blue Eye Shadow': 486,
    'Clown Eyes Blue': 380,
    'Clown Eyes Green': 286,
    'Eye Mask': 520,
    'Green Eye Shadow': 555,
    'Purple Eye Shadow': 508,
    None: 615,
  },

  Headgear: {
    Beanie: 278,
    Cap: 184,
    'Cap Forward': 191,
    None: 160,
    'Cowboy Hat': 175,
    'Do Rag': 175,
    Fedora: 271,
    Fez: 163,
    Hat: 186,
    Headband: 189,
    'Knitted Cap': 181,
    'Pilot Helmet': 187,
    'Police Cap': 53,
    'Tassle Hat': 275,
    Tiara: 182,
    'Top Hat': 186,
    'Viking Hat': 314,
  },

  Mouth: { Cigarette: 518, Pipe: 497, Vape: 469, None: 1866 },
} as const; /* "as const" allows strongly-typed importing */
