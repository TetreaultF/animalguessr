export interface Animal {
    id: string;
    name: string;
    status: string;
    class: string;
    imagePath: string;
    zonePath: string;
    length: number;
    weight: number;
    diet: string;
}

export interface RoundHistory {
    number: number;
    animalName: string;
    scoreObtained: number;
}