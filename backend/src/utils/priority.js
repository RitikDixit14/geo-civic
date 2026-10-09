// MEMBER 3 — BACKEND

// Configurable weights
const WEIGHTS = {
    severity: 0.5,
    duplicate: 0.3,
    time: 0.2
};

function calculatePriority(severityScore, duplicateCount, createdAt) {
    // severity is 0-100
    // duplicate count normalize: say max 10 duplicates for scaling
    const normalizedDuplicate = Math.min(duplicateCount * 10, 100);
    
    // time pending: say max 30 days for 100 score
    const now = new Date();
    const created = new Date(createdAt);
    const diffDays = (now - created) / (1000 * 60 * 60 * 24);
    const normalizedTime = Math.min(diffDays * (100/30), 100);
    
    const priority = (severityScore * WEIGHTS.severity) + 
                     (normalizedDuplicate * WEIGHTS.duplicate) + 
                     (normalizedTime * WEIGHTS.time);
                     
    return Math.min(Math.max(priority, 0), 100);
}

module.exports = { calculatePriority };
