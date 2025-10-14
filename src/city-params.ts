export interface CityParams {
    buildingCount: number;
    maxHeight: number;
    // maxHeightMin: number;
    // maxHeightMax: number;
    groundSize: number;
    groundColor: number;
    gridSquareWidth: number;
    gridDividerWidth: number;
}

export const cityParams: CityParams = {
    buildingCount: 200,
    maxHeight: 50,
    // maxHeightMin: 5,
    // maxHeightMax: 200,
    groundSize: 200,
    // groundColor: 0x99cc99,
    groundColor: 0xffffff,
    gridSquareWidth: 6,
    gridDividerWidth: 1,
};