class Level {
    enemies;
    clouds;
    Backgrounds;
    level_end_x = 2600;

constructor(enemies, clouds, Backgrounds, collectableObject) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.Backgrounds = Backgrounds;
    this.collectableObject = collectableObject;
    }
}
