export interface DisplayedMeasurement {
  value: number;
  unit: string;
  prefix: string;
}

export function formatMeasurement(m: DisplayedMeasurement): string {
  return `${m.prefix}${m.value} ${m.unit}`;
}

export function notchToLengthCm(notch: number): number {
  const m = notchToLength(notch);
  return m.unit === 'm' ? m.value * 100 : m.value;
}

export function notchToLength(notch: number): DisplayedMeasurement {
  if (notch === 0) return { value: 10, unit: 'cm', prefix: '< ' };
  if (notch <= 20) return { value: notch * 10, unit: 'cm', prefix: '' };
  if (notch <= 26) return { value: (200 + (notch - 20) * 50) / 100, unit: 'm', prefix: '' };
  return { value: (500 + (notch - 26) * 100) / 100, unit: 'm', prefix: '' };
}

export function notchToWeight(notch: number): DisplayedMeasurement {
  if (notch === 0) return { value: 1, unit: 'kg', prefix: '< ' };
  if (notch <= 20) return { value: notch, unit: 'kg', prefix: '' };
  if (notch <= 36) return { value: 20 + (notch - 20) * 5, unit: 'kg', prefix: '' };
  if (notch <= 54) return { value: 100 + (notch - 36) * 50, unit: 'kg', prefix: '' };
  return { value: 1000 + (notch - 54) * 500, unit: 'kg', prefix: '' };
}

export function lengthToNotch(cm: number): number {
  if (cm === 0) return 0;

  let bestNotch = 1;
  let bestDiff = Infinity;

  for (let n = 1; n <= 31; n++) {
    const r = notchToLength(n);
    const valCm = r.unit === 'm' ? r.value * 100 : r.value;
    const diff = Math.abs(valCm - cm);

    if (diff < bestDiff) {
      bestDiff = diff;
      bestNotch = n;
    }
  }

  return bestNotch;
}

export function weightToNotch(kg: number): number {
  if (kg === 0) return 0;

  let bestNotch = 1;
  let bestDiff = Infinity;

  for (let n = 1; n <= 64; n++) {
    const r = notchToWeight(n);
    const diff = Math.abs(r.value - kg);

    if (diff < bestDiff) {
      bestDiff = diff;
      bestNotch = n;
    }
  }

  return bestNotch;
}