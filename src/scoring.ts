import { KM_PER_EQUATOR_UNIT, MAX_TOLERATED_DISTANCE } from './config';

export function calculateSliderScore(
    chosenNotch: number,
    expectedNotch: number,
    penaltyPerNotch: number,
    maxPoints: number = 250
): number {
    const notchGap = Math.abs(chosenNotch - expectedNotch);

    return Math.max(0, maxPoints - notchGap * penaltyPerNotch);
}

export function percentToKm(distancePct: number, pinY: number): number {
    const latDeg = 90 - pinY * 1.8;
    const latRad = latDeg * (Math.PI / 180);
    const factor = (1 + Math.cos(latRad)) / 2;

    return Math.round(distancePct * KM_PER_EQUATOR_UNIT * factor);
}

export function minBorderDistance(
    pinX: number,
    pinY: number,
    path: SVGPathElement,
): number {
    const originalD = path.getAttribute('d') ?? '';
    const subPolygons = originalD.split(/(?=m\s*)/i);
    let minDist = Infinity;

    for (const poly of subPolygons) {
        const trimmed = poly.trim();
        if (!trimmed) continue;

        path.setAttribute('d', trimmed);
        const totalLength = path.getTotalLength();

        for (let i = 0; i <= 100; i++) {
            const pt = path.getPointAtLength((i / 100) * totalLength);
            const dx = pinX - pt.x;
            const dy = pinY - pt.y;
            const d = Math.sqrt(dx * dx + dy * dy);

            if (d < minDist) minDist = d;
        }
    }

    path.setAttribute('d', originalD);
    return minDist;
}

export function calculateGeoScore(
    pinX: number,
    pinY: number,
    zonePath: string,
    svgLayer: SVGSVGElement,
    pathEl: SVGPathElement,
): { score: number; detail: string } {
    const point = svgLayer.createSVGPoint();
    point.x = pinX;
    point.y = pinY;

    let isInside = false;
    const subPolygons = zonePath.split(/(?=m\s*)/i);

    for (const poly of subPolygons) {
        const trimmed = poly.trim();
        if (!trimmed) continue;

        pathEl.setAttribute('d', trimmed);

        if (pathEl.isPointInFill(point)) {
            isInside = true;
            break;
        }
    }

    pathEl.setAttribute('d', zonePath);

    if (isInside) {
        return { score: 400, detail: 'Dans la zone !' };
    }

    const dist = minBorderDistance(pinX, pinY, pathEl);
    const distKm = percentToKm(dist, pinY);
    const detail = `À ${distKm} km de la zone`;

    if (dist >= MAX_TOLERATED_DISTANCE) {
        return { score: 0, detail };
    }

    const score = Math.round(
        ((MAX_TOLERATED_DISTANCE - dist) / MAX_TOLERATED_DISTANCE) * 400
    );

    return { score, detail };
}