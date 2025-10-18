import { GUI } from 'lil-gui';

interface SquareCityParams {
    buildingCount: number;
    maxHeight: number;
    // maxHeightMin: number;
    // maxHeightMax: number;
    groundSize: number;
    groundColor: number;
    buildingColor: number;
    gridSquareWidth: number;
    gridDividerWidth: number;
}
interface HexagonCityParams {
    maxHeight: number;
    groundSize: number;
    groundColor: number;
    hexagonRadius: number;
    hexagonBuffer: number;
}
interface ModeParams{
    mode: 'Hexagon' | 'Square';
}


export const squareCityParams: SquareCityParams = {
    buildingCount: 500,
    maxHeight: 90,
    // maxHeightMin: 5,
    // maxHeightMax: 200,
    groundSize: 300,
    // groundColor: 0x99cc99,
    groundColor: 0xffffff,
    buildingColor: 0xaaaaaa,
    gridSquareWidth: 6,
    gridDividerWidth: 1,
};

export const hexCityParams: HexagonCityParams = {
    maxHeight: 44,
    groundSize: 300,
    groundColor: 0xffffff,
    hexagonRadius: 3,
    hexagonBuffer: 1,
}

export const modeParams: ModeParams = {
    mode: 'Hexagon',
}
export const gui = new GUI();


let squareFolder: GUI = gui.addFolder(`Square Mode`);
squareFolder.addColor(squareCityParams, 'groundColor');
squareFolder.add(squareCityParams, 'maxHeight', 5, 150, 1).name('Max Height');
squareFolder.add(squareCityParams, 'gridSquareWidth', 2, 12, 1).name('Square Width')
squareFolder.add(squareCityParams, 'gridDividerWidth', 1, 3, 0.5).name('Divider Width')

let hexFolder: GUI = gui.addFolder(`Hex Mode`);
hexFolder.add(hexCityParams, 'maxHeight', 5, 60, 1).name('Max Height');
hexFolder.add(hexCityParams, 'hexagonRadius', 1, 15, 1).name('Hexagon Radius')
hexFolder.add(hexCityParams, 'hexagonBuffer', 0.5, 6, 0.5).name('Buffer Width')
hexFolder.addColor(hexCityParams, 'groundColor');

let modeFolder: GUI = gui.addFolder("Mode Toggle");
modeFolder.add( modeParams, 'mode', ['Square', 'Hexagon']).name('Mode');
modeFolder.open();
