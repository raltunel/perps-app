export const leverageIntervalsMap = new Map([
    [3, [1, 1.5, 2, 2.5, 3]],
    [5, [1, 1.5, 2, 3, 4, 5]],
    [10, [1, 2, 3, 5, 7, 10]],
    [20, [1, 3, 5, 10, 15, 20]],
    [25, [1, 3, 5, 10, 15, 20, 25]],
    [40, [1, 3, 5, 10, 20, 30, 40]],
]);

export const getLeverageIntervals = (maxLeverage: number): number[] => {
    return leverageIntervalsMap.get(maxLeverage) || [];
};
