let collectables = [];


let coinsPositions = [
    {x: 500, y: 250 },
    {x: 700, y: 150 },
    {x: 850, y: 180},
    {x: 1000, y: 230},
    {x: 1200, y: 150},
    {x: 1450, y: 250},
    {x: 1600, y: 180},
    {x: 1750, y: 150},
    {x: 1800, y: 200},
    {x: 2050, y: 250}
];

// Flaschen: feste X- und Y-Positionen
let bottlesPositions = [
    {x: 350, y: 150},
    {x: 450, y: 200},
    {x: 600, y: 180},
    {x: 700, y: 220},
    {x: 900, y: 200},
    {x: 1020, y: 200},
    {x: 1150, y: 150},
    {x: 1300, y: 250},
    {x: 1380, y: 170},
    {x: 1490, y: 190},
    {x: 1600, y: 240},
    {x: 1750, y: 180},
    {x: 1800, y: 200},
    {x: 1900, y: 190},
    {x: 2150, y: 160} 
];

// Collectables erzeugen
coinsPositions.forEach(pos => {
    collectables.push(new CollectableObject(pos.x, pos.y, '8_coin/coin_1.png'));
});

bottlesPositions.forEach(pos => {
    collectables.push(new CollectableObject(pos.x, pos.y, '6_salsa_bottle/2_salsa_bottle_on_ground.png'));
});