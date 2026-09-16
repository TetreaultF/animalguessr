import './style.css';
import { animalList } from './data';
import type { Animal, RoundHistory } from './types';
import { MAX_ROUNDS, STATUS_CONFIG } from './config';
import { notchToLength, notchToWeight, lengthToNotch, weightToNotch, formatMeasurement } from './converters';
import { calculateSliderScore, calculateGeoScore } from './scoring';
import {
    gameMap, userPin, animalNameEl,
    lengthSlider, lengthValue, weightSlider, weightValue,
    btnGuess, statusBadge, roundCounter, scoreCounter,
    animalPic, animalCard, foodTiles,
    startOverlay, btnStart,
    resultsOverlay, btnNextAnimal,
    resChosenDiet, resActualDiet, resDietPoints,
    resChosenLength, resActualLength, resLengthPoints,
    resChosenWeight, resActualWeight, resWeightPoints,
    resGeoDetail, resGeoPoints, resTotalScore,
    finalOverlay, finalTableBody, finalScoreGlobal, btnNewGame,
    modalOverlay, modalCloseBtn, modalAnimalImg, modalAnimalName,
    alertOverlay, btnAlertClose,
    svgLayer, pathEl,
    showAlert,
} from './ui';

let currentRound = 1;
let totalScore = 0;
let selectedDiet: string | null = null;
let currentAnimal: Animal;
let gameAnimals: Animal[] = [];
const gameHistory: RoundHistory[] = [];

function prepareGameAnimals(catalog: Animal[]): void {
    const shuffled = [...catalog];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    gameAnimals = shuffled.slice(0, MAX_ROUNDS);
}

function updateStatusBadge(): void {
    const info = STATUS_CONFIG[currentAnimal.status];
    statusBadge.className = '';

    if (info) {
        statusBadge.textContent = info.text;
        statusBadge.classList.add(info.class);
    } else {
        statusBadge.textContent = '??';
        statusBadge.style.backgroundColor = '#777';
    }
}

function loadAnimal(animal: Animal): void {
    currentAnimal = animal;
    animalNameEl.textContent = animal.name;
    animalPic.src = animal.imagePath;
    updateStatusBadge();

    if (animal.zonePath && pathEl) {
        pathEl.setAttribute('d', animal.zonePath);
    }
}

function pickNextAnimal(): void {
    loadAnimal(gameAnimals[currentRound - 1]);
}

function resetRound(): void {
    selectedDiet = null;
    foodTiles.forEach(t => t.classList.remove('selected'));

    userPin.classList.add('hidden');
    userPin.style.left = '';
    userPin.style.top = '';

    lengthSlider.value = '0';
    weightSlider.value = '0';
    lengthValue.textContent = '< 10 cm';
    weightValue.textContent = '< 1 kg';

    if (pathEl) {
        pathEl.style.fill = 'rgba(255, 0, 50, 0.0)';
        pathEl.style.stroke = 'transparent';
    }
}

function showFinalResults(): void {
    finalTableBody.innerHTML = '';

    for (const round of gameHistory) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${round.number}</td>
            <td style="text-transform: uppercase;">${round.animalName}</td>
            <td>${round.scoreObtained} / 1000</td>
        `;
        finalTableBody.appendChild(tr);
    }

    finalScoreGlobal.textContent = totalScore.toString();
    finalOverlay.classList.remove('hidden');
}

btnAlertClose.addEventListener('click', () => alertOverlay.classList.add('hidden'));

btnStart.addEventListener('click', () => {
    startOverlay.classList.add('hidden');
    animalCard.classList.remove('hidden');
    prepareGameAnimals(animalList);
    pickNextAnimal();
});

btnNextAnimal.addEventListener('click', () => {
    resultsOverlay.classList.add('hidden');

    if (currentRound < MAX_ROUNDS) {
        currentRound++;
        roundCounter.textContent = `RONDE ${currentRound} / ${MAX_ROUNDS}`;
        pickNextAnimal();
        resetRound();
    } else {
        showFinalResults();
    }
});

btnNewGame.addEventListener('click', () => window.location.reload());

gameMap.addEventListener('click', (e: MouseEvent) => {
    const rect = gameMap.getBoundingClientRect();
    userPin.classList.remove('hidden');
    userPin.style.left = `${((e.clientX - rect.left) / rect.width) * 100}%`;
    userPin.style.top = `${((e.clientY - rect.top) / rect.height) * 100}%`;
});

lengthSlider.addEventListener('input', () => {
    lengthValue.textContent = formatMeasurement(
        notchToLength(parseInt(lengthSlider.value))
    );
});

weightSlider.addEventListener('input', () => {
    weightValue.textContent = formatMeasurement(
        notchToWeight(parseInt(weightSlider.value))
    );
});

foodTiles.forEach(tile => {
    tile.addEventListener('click', () => {
        foodTiles.forEach(t => t.classList.remove('selected'));
        tile.classList.add('selected');
        selectedDiet = tile.dataset.food ?? null;
    });
});

btnGuess.addEventListener('click', () => {
    const pinX = parseFloat(userPin.style.left);
    const pinY = parseFloat(userPin.style.top);

    if (isNaN(pinX) || isNaN(pinY)) {
        showAlert("Vous n'avez pas placé de point sur la carte !");
        return;
    }

    if (!selectedDiet) {
        showAlert("Vous n'avez pas sélectionné une alimentation !");
        return;
    }

    const { score: geoScore, detail: geoDetail } = calculateGeoScore(
        pinX, pinY, currentAnimal.zonePath, svgLayer, pathEl,
    );

    const chosenLengthNotch = parseInt(lengthSlider.value);
    const chosenWeightNotch = parseInt(weightSlider.value);
    const expectedLengthNotch = lengthToNotch(currentAnimal.length);
    const expectedWeightNotch = weightToNotch(currentAnimal.weight);

    const lengthScore = calculateSliderScore(
        chosenLengthNotch, expectedLengthNotch, 15
    );
    const weightScore = calculateSliderScore(
        chosenWeightNotch, expectedWeightNotch, 20
    );

    const dietScore = selectedDiet === currentAnimal.diet ? 100 : 0;

    const roundScore = geoScore + lengthScore + weightScore + dietScore;

    gameHistory.push({
        number: currentRound,
        animalName: currentAnimal.name,
        scoreObtained: roundScore
    });

    totalScore += roundScore;
    scoreCounter.textContent = `SCORE: ${totalScore}`;

    btnNextAnimal.textContent = currentRound === MAX_ROUNDS
        ? 'VOIR LE BULLETIN FINAL'
        : 'ANIMAL SUIVANT';

    resChosenDiet.textContent = selectedDiet.toUpperCase();
    resActualDiet.textContent = currentAnimal.diet.toUpperCase();
    resDietPoints.textContent = `${dietScore} / 100`;

    resChosenLength.textContent = formatMeasurement(
        notchToLength(chosenLengthNotch)
    );
    resActualLength.textContent = formatMeasurement(
        notchToLength(expectedLengthNotch)
    );
    resLengthPoints.textContent = `${lengthScore} / 250`;

    resChosenWeight.textContent = formatMeasurement(
        notchToWeight(chosenWeightNotch)
    );
    resActualWeight.textContent = formatMeasurement(
        notchToWeight(expectedWeightNotch)
    );
    resWeightPoints.textContent = `${weightScore} / 250`;

    resGeoDetail.textContent = geoDetail;
    resGeoPoints.textContent = `${geoScore} / 400`;
    resTotalScore.textContent = roundScore.toString();

    resultsOverlay.classList.remove('hidden');
});

animalCard.addEventListener('click', (e) => {
    e.stopPropagation();
    modalAnimalName.textContent = currentAnimal.name;
    modalAnimalImg.src = animalPic.src || 'https://placehold.co/250x250/fff/121212?text=No+Sprite';
    modalOverlay.classList.remove('hidden');
});

modalCloseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    modalOverlay.classList.add('hidden');
});

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.add('hidden');
    }
});