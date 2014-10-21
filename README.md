Robot
=======

An Easy to Use Sprite Animation

See a live demo at http://zackargyle.github.io/Robot/

Creating a Sprite

1. Instance the Robot, passing in the body part images.
```
var robot = new Robot({
  container: "robot",
  leftArm: "img/leftArm.png",
  leftLeg: "img/leftLeg.png",
  rightArm: "img/rightArm.png",
  rightLeg: "img/rightLeg.png",
  belly: "img/body.png",
  head: "img/head.png"
});
```
2. Add Listeners to the body parts
```
robot.onReady(function() {

  robot.addListener("leftArm", function() {
    robot.wave(3, "Sup bro?");
  });
  
  robot.addListener("belly", function() {
    robot.tickle(2, "Hee hee hee. That tickles!");
  });
  
});
```
Available robot animations are:
 - wave
 - tickle
 - dance
 - jump 
 - scare

3. Or just make it party!
```
robot.onReady(function() {
  robot.dance(1000); // Will make dance motion 1000 times
});
```
- Each animation takes an animation count, and a message that can be displayed in a popup next to the robot.

For a demo, see zackargyle.github.io/Robot/
