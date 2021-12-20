export const getTokens = (sentence: string) => {
  // make lowercase
  const standardisedSentence = sentence.toLowerCase();
  // split sentence into tokens, remove punctuation
  const tokens = standardisedSentence
    .split(/\W+/)
    .map((item) => item.replace(/[^0-9a-z]/gi, ''));
  return tokens;
};
