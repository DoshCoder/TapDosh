class TapDoshCertification {
    constructor() {
        this.badges = {
            'tapdosh-certified': {
                emoji: '🏆',
                name: 'TapDosh Certified',
                description: 'Passed all certification tests',
                color: '#FFD700'
            },
            'speed-kitchen': {
                emoji: '⚡',
                name: 'Speed Kitchen',
                description: 'Fast preparation and delivery',
                color: '#FFA500'
            },
            'jollof-master': {
                emoji: '👑',
                name: 'Jollof Master',
                description: 'Exceptional jollof rice',
                color: '#FF6347'
            },
            'chicken-king': {
                emoji: '🍗',
                name: 'Chicken King',
                description: 'Best chicken in town',
                color: '#FF4500'
            },
            'student-favorite': {
                emoji: '🎓',
                name: 'Student Favorite',
                description: 'Top choice among students',
                color: '#1E90FF'
            },
            'late-night': {
                emoji: '🌙',
                name: 'Late Night',
                description: 'Open late for night owls',
                color: '#4B0082'
            },
            'premium-pick': {
                emoji: '💎',
                name: 'Premium Pick',
                description: 'Premium quality selection',
                color: '#9370DB'
            }
        };
    }

    getBadgeHTML(badgeId, size = 'medium') {
        const badge = this.badges[badgeId];
        if (!badge) return '';
        
        const sizes = {
            'small': '0.8rem',
            'medium': '1rem',
            'large': '1.2rem'
        };
        
        return `
            <span class="badge ${size}" 
                  style="background: ${badge.color}20; color: ${badge.color}; border: 1px solid ${badge.color}40;"
                  title="${badge.description}">
                ${badge.emoji} ${badge.name}
            </span>
        `;
    }

    getAllBadgesHTML(badgeIds, size = 'medium') {
        if (!Array.isArray(badgeIds)) return '';
        
        return badgeIds
            .map(badgeId => this.getBadgeHTML(badgeId, size))
            .join('');
    }
}

// Export for use in browser
if (typeof window !== 'undefined') {
    window.TapDoshCertification = TapDoshCertification;
}