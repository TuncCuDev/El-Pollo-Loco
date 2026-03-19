let collectables = [];


let coinsPositions = [
    {x: 500, y: 50 },
    {x: 700, y: 280},
    {x: 850, y: 50},
    {x: 1000, y: 190},
    {x: 1200, y: 110},
    {x: 1450, y: 300},
    {x: 1600, y: 280},
    {x: 1750, y: 80},
    {x: 1800, y: 190},
    {x: 2050, y: 300}
];

// Flaschen: feste X- und Y-Positionen
let bottlesPositions = [
    {x: 350, y: 100},
    {x: 450, y: 200},
    {x: 600, y: 80},
    {x: 700, y: 120},
    {x: 900, y: 200},
    {x: 1020, y: 200},
    {x: 1150, y: 150},
    {x: 1300, y: 50},
    {x: 1380, y: 170},
    {x: 1490, y: 100},
    {x: 1600, y: 190},
    {x: 1750, y: 80},
    {x: 1800, y: 200},
    {x: 1900, y: 190},
    {x: 2150, y: 100} 
];

// Collectables erzeugen
coinsPositions.forEach(pos => {
    collectables.push(new CollectableObject(pos.x, pos.y, '8_coin/coin_1.png'));
});

bottlesPositions.forEach(pos => {
    collectables.push(new CollectableObject(pos.x, pos.y, '6_salsa_bottle/2_salsa_bottle_on_ground.png'));
});