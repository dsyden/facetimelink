const adjectives = [
  "red", "blue", "cold", "fast", "calm", "bold", "dark", "soft", "warm", "cool",
  "deep", "fair", "fond", "glad", "gold", "keen", "kind", "late", "lean", "long",
  "loud", "mild", "neat", "pale", "pure", "rare", "rich", "safe", "slim", "tall",
  "tiny", "vast", "weak", "wide", "wild", "wise", "aged", "bare", "dear", "dull",
  "firm", "flat", "free", "grim", "hard", "high", "idle", "last", "live", "lost",
];

const nouns = [
  "moon", "star", "wolf", "tree", "rain", "fire", "hawk", "lake", "wind", "bear",
  "dove", "fern", "haze", "jade", "lark", "mist", "nest", "opal", "pine", "reef",
  "sage", "tide", "vale", "wave", "yarn", "dawn", "dusk", "echo", "flax", "glen",
  "hive", "iris", "jazz", "knot", "leaf", "mare", "nova", "pear", "quay", "rose",
  "silk", "thorn", "vine", "wren", "arch", "bay", "cove", "dune", "elm", "ford",
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
