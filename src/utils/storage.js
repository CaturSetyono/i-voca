import { sanitizeInput } from './security.js';

// LocalStorage Keys
const STORAGE_KEYS = {
  VOCAB: 'vocab_forge_data',
  PROFILE: 'vocab_forge_profile',
  PENDING: 'vocab_forge_pending'
};

// 8 Hours in milliseconds
const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;
const MAX_SYNC_CHARGES = 3;

// Initial Profile State
const DEFAULT_PROFILE = {
  current_xp: 0,
  level: 1,
  unlocked_badges: [],
  streak_count: 0,
  last_active_date: '',
  sync_charges: MAX_SYNC_CHARGES,
  last_recharge_timestamp: Date.now()
};

/**
 * Get current local date string (YYYY-MM-DD)
 */
const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Calculate date difference in full calendar days
 */
const getDaysDifference = (dateStr1, dateStr2) => {
  if (!dateStr1 || !dateStr2) return 999;
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Emit custom event when data changes
 */
const emitChange = (key, data) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('vocab-forge-change', { 
      detail: { key, data } 
    }));
  }
};

/**
 * Get all phrase data (with automatic legacy migration and sanitization)
 */
export const getVocabData = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VOCAB);
    if (!raw) return [];
    const list = JSON.parse(raw);
    
    if (!Array.isArray(list)) return [];

    return list.map(item => ({
      id: sanitizeInput(item.id || Date.now().toString()),
      phrase_id: sanitizeInput(item.phrase_id || item.word_id || ''),
      phrase_en: sanitizeInput(item.phrase_en || item.word_en || ''),
      created_at: item.created_at || new Date().toISOString(),
      sync_status: ['pending', 'valid', 'invalid'].includes(item.sync_status) ? item.sync_status : 'pending',
      ai_feedback: item.ai_feedback ? sanitizeInput(item.ai_feedback) : null
    }));
  } catch (e) {
    console.error('Failed to parse phrase data', e);
    return [];
  }
};

/**
 * Get user profile data with auto-recharging sync quota
 */
export const getUserProfile = () => {
  const clone = () => JSON.parse(JSON.stringify(DEFAULT_PROFILE));
  if (typeof window === 'undefined') return clone();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    let profile = raw ? JSON.parse(raw) : clone();

    profile.current_xp = typeof profile.current_xp === 'number' && profile.current_xp >= 0 ? profile.current_xp : 0;
    profile.level = typeof profile.level === 'number' && profile.level >= 1 ? profile.level : 1;
    profile.unlocked_badges = Array.isArray(profile.unlocked_badges) ? profile.unlocked_badges : [];
    profile.streak_count = typeof profile.streak_count === 'number' && profile.streak_count >= 0 ? profile.streak_count : 0;
    profile.last_active_date = typeof profile.last_active_date === 'string' ? profile.last_active_date : '';
    profile.sync_charges = typeof profile.sync_charges === 'number' ? Math.min(MAX_SYNC_CHARGES, Math.max(0, profile.sync_charges)) : MAX_SYNC_CHARGES;
    profile.last_recharge_timestamp = typeof profile.last_recharge_timestamp === 'number' ? profile.last_recharge_timestamp : Date.now();

    // Check quota auto-recharge (1 charge per 8 hours)
    const now = Date.now();
    const timeElapsed = now - profile.last_recharge_timestamp;
    if (timeElapsed >= EIGHT_HOURS_MS && profile.sync_charges < MAX_SYNC_CHARGES) {
      const chargesToAdd = Math.floor(timeElapsed / EIGHT_HOURS_MS);
      profile.sync_charges = Math.min(MAX_SYNC_CHARGES, profile.sync_charges + chargesToAdd);
      profile.last_recharge_timestamp = now;
      saveProfile(profile);
    }

    return profile;
  } catch (e) {
    console.error('Failed to parse profile data', e);
    return clone();
  }
};

/**
 * Save user profile data
 */
export const saveProfile = (profile) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  emitChange(STORAGE_KEYS.PROFILE, profile);
};

/**
 * Add a new phrase entry & update daily streak
 */
export const addPhraseEntry = (phraseId, phraseEn) => {
  const cleanId = sanitizeInput(phraseId);
  const cleanEn = sanitizeInput(phraseEn);

  if (!cleanId || !cleanEn) {
    throw new Error('Both Indonesian and English phrases are required.');
  }

  const phrases = getVocabData();
  const today = getTodayDateString();
  const profile = getUserProfile();

  // Streak calculation logic
  let { streak_count, last_active_date } = profile;
  if (!last_active_date) {
    streak_count = 1;
  } else if (last_active_date === today) {
    // Already active today
  } else {
    const diff = getDaysDifference(last_active_date, today);
    if (diff === 1) {
      streak_count += 1;
    } else {
      streak_count = 1;
    }
  }

  profile.streak_count = streak_count;
  profile.last_active_date = today;

  const newEntry = {
    id: Date.now().toString(),
    phrase_id: cleanId,
    phrase_en: cleanEn,
    created_at: new Date().toISOString(),
    sync_status: 'pending',
    ai_feedback: null
  };

  const updatedPhrases = [newEntry, ...phrases];
  localStorage.setItem(STORAGE_KEYS.VOCAB, JSON.stringify(updatedPhrases));
  emitChange(STORAGE_KEYS.VOCAB, updatedPhrases);

  saveProfile(profile);
  updateXP(10);

  return newEntry;
};

/**
 * Update an existing phrase entry
 */
export const updatePhraseEntry = (id, phraseId, phraseEn) => {
  const cleanId = sanitizeInput(phraseId);
  const cleanEn = sanitizeInput(phraseEn);

  if (!cleanId || !cleanEn) {
    throw new Error('Both Indonesian and English phrases are required.');
  }

  const phrases = getVocabData();
  const updatedPhrases = phrases.map(item => {
    if (item.id === id) {
      return {
        ...item,
        phrase_id: cleanId,
        phrase_en: cleanEn,
        sync_status: 'pending',
        ai_feedback: null
      };
    }
    return item;
  });

  localStorage.setItem(STORAGE_KEYS.VOCAB, JSON.stringify(updatedPhrases));
  emitChange(STORAGE_KEYS.VOCAB, updatedPhrases);
  return updatedPhrases;
};

/**
 * Delete a phrase entry
 */
export const deleteVocabEntry = (id) => {
  const phrases = getVocabData();
  const updatedPhrases = phrases.filter(entry => entry.id !== id);
  localStorage.setItem(STORAGE_KEYS.VOCAB, JSON.stringify(updatedPhrases));
  emitChange(STORAGE_KEYS.VOCAB, updatedPhrases);
  return updatedPhrases;
};

/**
 * Apply AI Batch Sync Results
 */
export const applySyncResults = (results) => {
  const phrases = getVocabData();
  let xpDelta = 0;
  const resultMap = new Map(results.map(r => [r.id, r]));

  const updatedPhrases = phrases.map(phrase => {
    const res = resultMap.get(phrase.id);
    if (!res) return phrase;

    if (res.isValid) {
      if (phrase.sync_status !== 'valid') {
        xpDelta += 5;
      }
      return {
        ...phrase,
        sync_status: 'valid',
        ai_feedback: null
      };
    } else {
      xpDelta -= 5;
      return {
        ...phrase,
        sync_status: 'invalid',
        ai_feedback: sanitizeInput(res.feedback || 'Inaccurate translation or grammar issue detected.')
      };
    }
  });

  localStorage.setItem(STORAGE_KEYS.VOCAB, JSON.stringify(updatedPhrases));
  emitChange(STORAGE_KEYS.VOCAB, updatedPhrases);

  if (xpDelta !== 0) {
    updateXP(xpDelta);
  }

  return updatedPhrases;
};

/**
 * Consume 1 Sync Quota Charge
 */
export const consumeSyncQuota = () => {
  const profile = getUserProfile();
  if (profile.sync_charges > 0) {
    profile.sync_charges -= 1;
    saveProfile(profile);
    return true;
  }
  return false;
};

/**
 * Backup / Data Export & Import Helpers with Sanitization & Schema Checks
 */
export const exportUserData = () => {
  const vocab = getVocabData();
  const profile = getUserProfile();
  const payload = {
    version: '1.0',
    exported_at: new Date().toISOString(),
    vocab,
    profile
  };
  return JSON.stringify(payload, null, 2);
};

export const importUserData = (jsonStr) => {
  try {
    const data = JSON.parse(jsonStr);
    if (!data || typeof data !== 'object' || !Array.isArray(data.vocab)) {
      throw new Error('Invalid backup file structure: missing phrases list.');
    }

    // Sanitize each phrase entry
    const sanitizedVocab = data.vocab.map(item => ({
      id: sanitizeInput(String(item.id || Date.now())),
      phrase_id: sanitizeInput(String(item.phrase_id || item.word_id || '')),
      phrase_en: sanitizeInput(String(item.phrase_en || item.word_en || '')),
      created_at: typeof item.created_at === 'string' ? item.created_at : new Date().toISOString(),
      sync_status: ['pending', 'valid', 'invalid'].includes(item.sync_status) ? item.sync_status : 'pending',
      ai_feedback: item.ai_feedback ? sanitizeInput(String(item.ai_feedback)) : null
    })).filter(item => item.phrase_id && item.phrase_en);

    localStorage.setItem(STORAGE_KEYS.VOCAB, JSON.stringify(sanitizedVocab));

    if (data.profile && typeof data.profile === 'object') {
      const sanitizedProfile = {
        current_xp: Math.max(0, Number(data.profile.current_xp) || 0),
        level: Math.max(1, Number(data.profile.level) || 1),
        unlocked_badges: Array.isArray(data.profile.unlocked_badges) ? data.profile.unlocked_badges : [],
        streak_count: Math.max(0, Number(data.profile.streak_count) || 0),
        last_active_date: String(data.profile.last_active_date || ''),
        sync_charges: Math.min(MAX_SYNC_CHARGES, Math.max(0, Number(data.profile.sync_charges) || MAX_SYNC_CHARGES)),
        last_recharge_timestamp: Number(data.profile.last_recharge_timestamp) || Date.now()
      };
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(sanitizedProfile));
      emitChange(STORAGE_KEYS.PROFILE, sanitizedProfile);
    }

    emitChange(STORAGE_KEYS.VOCAB, sanitizedVocab);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

/**
 * Reset All Application Data
 */
export const resetAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.VOCAB);
  localStorage.removeItem(STORAGE_KEYS.PROFILE);
  localStorage.removeItem(STORAGE_KEYS.PENDING);
  emitChange(STORAGE_KEYS.VOCAB, []);
  emitChange(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
};

/**
 * Pending Celebrations Queue
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
 * Update XP and handle leveling & badge milestones
 */
export const updateXP = (amount) => {
  const profile = getUserProfile();
  let { current_xp, level, unlocked_badges } = profile;

  current_xp += amount;
  if (current_xp < 0) current_xp = 0;

  while (current_xp >= 100) {
    current_xp -= 100;
    level += 1;
    addPendingCelebration('level-up', { level });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('level-up', { detail: { level } }));
    }
  }

  profile.current_xp = current_xp;
  profile.level = level;

  const phrases = getVocabData();
  const count = phrases.length;

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
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('badge-unlocked', { detail: { badgeId: m.id } }));
      }
    }
  });

  profile.unlocked_badges = unlocked_badges;
  saveProfile(profile);

  return profile;
};
