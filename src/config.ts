export const MAX_ROUNDS = 10;

export const STATUS_CONFIG: Record<string, { text: string; class: string }> = {
    'éteint à l’état sauvage': { text: 'EW', class: 'status-ew' },
    'en danger critique': { text: 'CR', class: 'status-cr' },
    'en danger': { text: 'EN', class: 'status-en' },
    'vulnérable': { text: 'VU', class: 'status-vu' },
    'quasi menacé': { text: 'NT', class: 'status-nt' },
    'préoccupation mineure': { text: 'LC', class: 'status-lc' },
};

export const MAX_TOLERATED_DISTANCE = 25.0;

export const KM_PER_EQUATOR_UNIT = 400.75;