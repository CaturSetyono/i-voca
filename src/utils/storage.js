// LocalStorage Keys
const STORAGE_KEYS = {
  VOCAB: 'vocab_forge_data',
  PROFILE: 'vocab_forge_profile',
  PENDING: 'vocab_forge_pending'
};

// Initial Profile State
const DEFAULT_PROFILE = {
  current_xp: 0,
  level: 1,
  unlocked_badges: []
};

/**
 * Get all vocabulary data
 */
export const getVocabData = () => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.VOCAB);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to parse vocab data', e);
    return [];
  }
};

/**
 * Get user profile data
 */
export const getUserProfile = () => {
  const clone = () => JSON.parse(JSON.stringify(DEFAULT_PROFILE));
  if (typeof window === 'undefined') return clone();
  try {
    const profile = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return profile ? JSON.parse(profile) : clone();
  } catch (e) {
    console.error('Failed to parse profile data', e);
    return clone();
  }
};

/**
 * Save user profile data
 */
const saveProfile = (profile) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
};

/**
 * Add a new word to vocabulary
 */
export const addVocabEntry = (wordId, wordEn) => {
  const vocab = getVocabData();
  const newEntry = {
    id: Date.now().toString(),
    word_id: wordId,
    word_en: wordEn,
    created_at: new Date().toISOString()
  };
  
  const updatedVocab = [newEntry, ...vocab];
  localStorage.setItem(STORAGE_KEYS.VOCAB, JSON.stringify(updatedVocab));
  
  // Award XP
  updateXP(10);
  
  return newEntry;
};

/**
 * Delete a word entry
 */
export const deleteVocabEntry = (id) => {
  const vocab = getVocabData();
  const updatedVocab = vocab.filter(entry => entry.id !== id);
  localStorage.setItem(STORAGE_KEYS.VOCAB, JSON.stringify(updatedVocab));
  return updatedVocab;
};

/**
 * Add a pending celebration
 */
const addPendingCelebration = (type, data) => {
  if (typeof window === 'undefined') return;
  try {
    const pending = JSON.parse(localStorage.getItem(STORAGE_KEYS.PENDING) || '[]');
    pending.push({ type, data });
    localStorage.setItem(STORAGE_KEYS.PENDING, JSON.stringify(pending));
  } catch (e) {
    localStorage.setItem(STORAGE_KEYS.PENDING, JSON.stringify([{ type, data }]));
  }
};

/**
 * Get and clear pending celebrations
 */
export const popPendingCelebrations = () => {
  if (typeof window === 'undefined') return [];
  try {
    const pending = JSON.parse(localStorage.getItem(STORAGE_KEYS.PENDING) || '[]');
    localStorage.removeItem(STORAGE_KEYS.PENDING);
    return pending;
  } catch (e) {
    return [];
  }
};

/**
 * Update XP and handle leveling
 */
export const updateXP = (amount) => {
  const profile = getUserProfile();
  let { current_xp, level, unlocked_badges } = profile;
  
  current_xp += amount;
  
  let leveledUp = false;
  // Leveling logic: 100 XP per level
  while (current_xp >= 100) {
    current_xp -= 100;
    level += 1;
    leveledUp = true;
    addPendingCelebration('level-up', { level });
    window.dispatchEvent(new CustomEvent('level-up', { detail: { level } }));
  }
  
  profile.current_xp = current_xp;
  profile.level = level;
  
  // Check for badges
  const vocab = getVocabData();
  const count = vocab.length;
  
  const milestones = [
    { id: 'badge_01', target: 10 },
    { id: 'badge_02', target: 25 },
    { id: 'badge_03', target: 50 },
    { id: 'badge_04', target: 100 }
  ];
  
  milestones.forEach(m => {
    if (count >= m.target && !unlocked_badges.includes(m.id)) {
      unlocked_badges.push(m.id);
      addPendingCelebration('badge-unlocked', { badgeId: m.id });
      window.dispatchEvent(new CustomEvent('badge-unlocked', { detail: { badgeId: m.id } }));
    }
  });
  
  profile.unlocked_badges = unlocked_badges;
  saveProfile(profile);
  
  return profile;
};
