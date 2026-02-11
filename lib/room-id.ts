const adjectives = [
  "bold", "calm", "cold", "cool", "dark", "deep", "dull", "fair", "fast", "firm",
  "flat", "fond", "free", "glad", "gold", "good", "gray", "grim", "hard", "high",
  "huge", "idle", "keen", "kind", "last", "late", "lazy", "lean", "live", "long",
  "lost", "loud", "main", "mild", "near", "neat", "nice", "numb", "open", "pale",
  "past", "pink", "poor", "pure", "rare", "real", "rich", "ripe", "rude", "safe",
  "slim", "slow", "snug", "soft", "sore", "sour", "sure", "tall", "tame", "thin",
  "tidy", "tiny", "true", "ugly", "vast", "warm", "wavy", "weak", "wide", "wild",
  "wily", "wise", "worn", "aged", "airy", "bare", "blue", "busy", "cozy", "damp",
  "dear", "easy", "edgy", "epic", "even", "fine", "grey", "hazy", "iced", "inky",
  "iron", "lame", "lime", "lone", "lush", "mini", "oily", "oval", "rosy", "tart",
];

const nouns = [
  "arch", "axle", "bark", "barn", "bath", "bead", "beam", "bear", "bell", "belt",
  "bird", "boat", "bolt", "bone", "book", "boot", "bowl", "bulb", "burn", "cage",
  "cake", "camp", "cape", "card", "cart", "cave", "chip", "clam", "claw", "clay",
  "club", "coal", "coat", "code", "coil", "coin", "cone", "cord", "cork", "corn",
  "crab", "crow", "cube", "curl", "dawn", "deer", "desk", "disc", "dock", "dome",
  "door", "dove", "drum", "duck", "dune", "dusk", "dust", "echo", "edge", "fawn",
  "fern", "film", "fire", "fish", "flag", "foam", "fold", "font", "food", "fork",
  "form", "fort", "frog", "fuse", "gate", "gear", "gift", "glow", "glue", "goat",
  "gong", "gown", "grip", "gust", "hail", "hare", "harp", "hawk", "haze", "heap",
  "heat", "herb", "herd", "hill", "hint", "hive", "hole", "hood", "hook", "hope",
  "horn", "iris", "iron", "isle", "jade", "jazz", "kelp", "kite", "knob", "knot",
  "lace", "lake", "lamb", "lamp", "lane", "lark", "lava", "lawn", "leaf", "lily",
  "lime", "limb", "line", "link", "lion", "lock", "loft", "loop", "lore", "lynx",
  "mane", "maze", "mesh", "mill", "mint", "mist", "moat", "mole", "moon", "moss",
  "moth", "mule", "muse", "myth", "nail", "nest", "node", "noon", "note", "nova",
  "opal", "oven", "palm", "pane", "path", "peak", "pear", "pine", "plum", "poem",
  "pole", "pond", "pony", "pool", "port", "rain", "reed", "reef", "rice", "ring",
  "road", "robe", "rock", "roof", "root", "rope", "rose", "ruby", "ruin", "rush",
  "rust", "sage", "sail", "salt", "sand", "seal", "seed", "shed", "ship", "silk",
  "slug", "snow", "soap", "soil", "song", "soul", "soup", "star", "stem", "surf",
  "swan", "tail", "tale", "tank", "tape", "teal", "tent", "tide", "tile", "toad",
  "tomb", "tone", "tree", "tuna", "tune", "turf", "twig", "twin", "vale", "veil",
  "vein", "vest", "vine", "void", "volt", "wade", "wall", "wand", "wave", "weed",
  "well", "wick", "wind", "wine", "wing", "wire", "wolf", "wood", "wool", "worm",
  "wren", "yarn", "yoke", "zinc",
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateRoomId(): string {
  const adjective = randomItem(adjectives);
  const noun = randomItem(nouns);
  const number = Math.floor(Math.random() * 90) + 10; // 10-99
  return `${adjective}-${noun}-${number}`;
}
