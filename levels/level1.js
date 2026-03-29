let level1; 
let endBoss = new Endboss();
level1 = new Level(
    [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new SmallChicken(), 
        new SmallChicken(),
        new SmallChicken(),
        new SmallChicken(), 
        new SmallChicken(),
        new SmallChicken(),
        endBoss
    ],
    [
        new Cloud(),
        new Cloud(),
        new Cloud()
    ],
    [
        new Background('5_background/layers/air.png', -720),
        new Background('5_background/layers/3_third_layer/2.png', -720),
        new Background('5_background/layers/2_second_layer/2.png', -720),
        new Background('5_background/layers/1_first_layer/2.png', -720),

        new Background('5_background/layers/air.png', 0),
        new Background('5_background/layers/3_third_layer/1.png', 0),
        new Background('5_background/layers/2_second_layer/1.png', 0),
        new Background('5_background/layers/1_first_layer/1.png', 0),

        new Background('5_background/layers/air.png', 720),
        new Background('5_background/layers/3_third_layer/2.png', 720),
        new Background('5_background/layers/2_second_layer/2.png', 720),
        new Background('5_background/layers/1_first_layer/2.png', 720),

        new Background('5_background/layers/air.png', 720 * 2),
        new Background('5_background/layers/3_third_layer/1.png', 720 * 2),
        new Background('5_background/layers/2_second_layer/1.png', 720 * 2),
        new Background('5_background/layers/1_first_layer/1.png', 720 * 2),
        new Background('5_background/layers/air.png', 720 * 3),
        new Background('5_background/layers/3_third_layer/2.png', 720 * 3),
        new Background('5_background/layers/2_second_layer/2.png', 720 * 3),
        new Background('5_background/layers/1_first_layer/2.png', 720 * 3),
        new Background('5_background/layers/air.png', 720 * 4),
        new Background('5_background/layers/3_third_layer/1.png', 720 * 4),
        new Background('5_background/layers/2_second_layer/1.png', 720 * 4),
        new Background('5_background/layers/1_first_layer/1.png', 720 * 4),
    ],
        collectables
);

