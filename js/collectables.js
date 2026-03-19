let collectables = [];
let currentX = 200;  
let groundY = 350;  
let maxX = 2000;     

let totalCoins = 10;
let totalBottles = 15;

let items = [];

//push Coins 
for (let i = 0; i < totalCoins; i++)
     items.push('coin');
//push bottles
for (let i = 0; i < totalBottles; i++) 
    items.push('bottle');

// mix coins/bottles
items.sort(() => Math.random() - 0.5);

for (let i = 0; i < items.length; i++) {
    let gap = 50 + Math.random() * 150;
    currentX += gap;

    if (currentX > maxX) currentX = maxX; // Einfach auf maxX setzen

    let y;
    if (items[i] === 'coin') {
        y = groundY * Math.random();
        collectables.push(new CollectableObject(currentX, y, '8_coin/coin_1.png'));
    } else {
        y = groundY * Math.random();
        collectables.push(new CollectableObject(currentX, y, '6_salsa_bottle/2_salsa_bottle_on_ground.png'));
    }
}