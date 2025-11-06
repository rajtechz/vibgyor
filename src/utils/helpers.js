/**
 * Extract hashtags from text content
 * @param {string} text - Text content to extract hashtags from
 * @returns {string[]} Array of hashtag strings (without #)
 */
export const extractHashtags = (text) => {
  if (!text || typeof text !== 'string') {
    return [];
  }
  
  // Match hashtags: # followed by alphanumeric characters and underscores
  const hashtagRegex = /#(\w+)/g;
  const matches = text.match(hashtagRegex);
  
  if (!matches) {
    return [];
  }
  
  // Remove # and return unique hashtags
  const hashtags = matches.map(match => match.substring(1).toLowerCase());
  return [...new Set(hashtags)]; // Remove duplicates
};

/**
 * Extract mentions from text content
 * @param {string} text - Text content to extract mentions from
 * @returns {string[]} Array of mention strings (without @)
 */
export const extractMentions = (text) => {
  if (!text || typeof text !== 'string') {
    return [];
  }
  
  // Match mentions: @ followed by alphanumeric characters and underscores
  const mentionRegex = /@(\w+)/g;
  const matches = text.match(mentionRegex);
  
  if (!matches) {
    return [];
  }
  
  // Remove @ and return unique mentions
  const mentions = matches.map(match => match.substring(1).toLowerCase());
  return [...new Set(mentions)]; // Remove duplicates
};

/**
 * Map visibility value from UI to API format
 * @param {string} visibility - UI visibility value (Public, Friends, Private)
 * @returns {string} API visibility value (public, followers, private)
 */
export const mapVisibilityToAPI = (visibility) => {
  const mapping = {
    'Public': 'public',
    'Friends': 'followers',
    'Private': 'private',
  };
  return mapping[visibility] || 'public';
};

/**
 * Map comment visibility value from UI to API format
 * @param {string} commentVisibility - UI comment visibility value (Public, Friends, Private)
 * @returns {string} API comment visibility value (everyone, followers, none)
 */
export const mapCommentVisibilityToAPI = (commentVisibility) => {
  const mapping = {
    'Public': 'everyone',
    'Friends': 'followers',
    'Private': 'none',
  };
  return mapping[commentVisibility] || 'everyone';
};

