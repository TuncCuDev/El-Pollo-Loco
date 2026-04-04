let coinsPositions = [
    {x: 500, y: 250},
    {x: 700, y: 280},
    {x: 850, y: 200},
    {x: 1000, y: 230},
    {x: 1200, y: 200},
    {x: 1450, y: 250},
    {x: 1600, y: 300},
    {x: 1750, y: 230},
    {x: 1800, y: 210},
    {x: 2050, y: 250}
];

let bottlesPositions = [
    {x: 350, y: 330},
    {x: 450, y: 330},
    {x: 600, y: 330},
    {x: 700, y: 330},
    {x: 900, y: 330},
    {x: 1020, y: 330},
    {x: 1150, y: 330},
    {x: 1300, y: 330},
    {x: 1380, y: 330},
    {x: 1490, y: 330},
    {x: 1600, y: 330},
    {x: 1750, y: 330},
    {x: 1800, y: 330},
    {x: 1900, y: 330},
    {x: 2150, y: 330} 
];

function initCollactables() {
    const collectables = [];

    coinsPositions.forEach(pos => {
        collectables.push(new CollectableObject(pos.x, pos.y, 'assets/8_coin/coin_1.png', 50, 50));
    });
    bottlesPositions.forEach(pos => {
        collectables.push(new CollectableObject(pos.x, pos.y, 'assets/6_salsa_bottle/2_salsa_bottle_on_ground.png', 30 ,10));
    });
    
    return collectables;
};


