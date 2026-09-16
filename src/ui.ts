export function getEl<T extends HTMLElement>(id: string): T {
    return document.getElementById(id) as T;
}

export const gameMap = getEl<HTMLImageElement>('game-map');
export const userPin = getEl<HTMLDivElement>('user-pin');
export const animalNameEl = getEl<HTMLDivElement>('animal-name');
export const lengthSlider = getEl<HTMLInputElement>('length-slider');
export const lengthValue = getEl<HTMLSpanElement>('length-value');
export const weightSlider = getEl<HTMLInputElement>('weight-slider');
export const weightValue = getEl<HTMLSpanElement>('weight-value');
export const btnGuess = getEl<HTMLButtonElement>('btn-guess');
export const statusBadge = getEl<HTMLDivElement>('status-badge');
export const roundCounter = getEl<HTMLDivElement>('round-counter');
export const scoreCounter = getEl<HTMLDivElement>('score-counter');
export const animalPic = getEl<HTMLImageElement>('animal-pic');
export const animalCard = getEl<HTMLDivElement>('animal-card');
export const foodTiles = document.querySelectorAll<HTMLElement>('.food-tile');

export const startOverlay = getEl<HTMLDivElement>('start-overlay');
export const btnStart = getEl<HTMLButtonElement>('btn-start');

export const resultsOverlay = getEl<HTMLDivElement>('results-overlay');
export const btnNextAnimal = getEl<HTMLButtonElement>('btn-next-animal');
export const resChosenDiet = getEl<HTMLTableCellElement>('res-chosen-diet');
export const resActualDiet = getEl<HTMLTableCellElement>('res-actual-diet');
export const resDietPoints = getEl<HTMLTableCellElement>('res-diet-points');
export const resChosenLength = getEl<HTMLTableCellElement>('res-chosen-length');
export const resActualLength = getEl<HTMLTableCellElement>('res-actual-length');
export const resLengthPoints = getEl<HTMLTableCellElement>('res-length-points');
export const resChosenWeight = getEl<HTMLTableCellElement>('res-chosen-weight');
export const resActualWeight = getEl<HTMLTableCellElement>('res-actual-weight');
export const resWeightPoints = getEl<HTMLTableCellElement>('res-weight-points');
export const resGeoDetail = getEl<HTMLTableCellElement>('res-geo-detail');
export const resGeoPoints = getEl<HTMLTableCellElement>('res-geo-points');
export const resTotalScore = getEl<HTMLSpanElement>('res-total-score');

export const finalOverlay = getEl<HTMLDivElement>('final-overlay');
export const finalTableBody = getEl<HTMLTableSectionElement>('final-table-body');
export const finalScoreGlobal = getEl<HTMLSpanElement>('final-score-global');
export const btnNewGame = getEl<HTMLButtonElement>('btn-new-game');

export const modalOverlay = getEl<HTMLDivElement>('modal-overlay');
export const modalCloseBtn = getEl<HTMLButtonElement>('modal-close-btn');
export const modalAnimalImg = getEl<HTMLImageElement>('modal-animal-img');
export const modalAnimalName = getEl<HTMLDivElement>('modal-animal-name');

export const alertOverlay = getEl<HTMLDivElement>('alert-overlay');
export const alertText = getEl<HTMLParagraphElement>('alert-text');
export const btnAlertClose = getEl<HTMLButtonElement>('btn-alert-close');

export const svgLayer = document.getElementById('map-svg-layer') as unknown as SVGSVGElement;
export const pathEl = document.getElementById('distribution-polygon') as unknown as SVGPathElement;

export function showAlert(message: string): void {
    alertText.textContent = message;
    alertOverlay.classList.remove('hidden');
}