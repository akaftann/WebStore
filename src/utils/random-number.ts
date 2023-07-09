export function getRandomNumber(min: number, max: number): number{
    return Math.floor(Math.random() * (min-max+1)+ min)
}