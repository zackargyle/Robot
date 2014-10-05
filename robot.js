/*
	TODO
		- test touch
*/
var Robot = (function() {

	// Animations
	var ANIM = {
		time: 350,
		shake: [-4,4],
		wave: [150,90],
		grow: [.8,1.2],
		jump: [-30,0]
	};

	// Model
	function Robot(options) {
		this._loadImage("belly", options.belly);
		this._loadImage("leftLeg", options.leftLeg);
		this._loadImage("head", options.head);
		this._loadImage("rightLeg", options.rightLeg);
		this._loadImage("leftArm", options.leftArm);
		this._loadImage("rightArm", options.rightArm);

		this.inAnimation   = false;
		this.imagesLoaded  = 0;
		this.loadListeners = [];

		this.robot = document.getElementById(options.container);
		this.robot.style.width = this.robot.style.width || "1px";
	}

	Robot.prototype.dance = function(count, msg) {
		if (this.inAnimation) return ;
		this.inAnimation = true;

		var shakeArray = animArray(count, ANIM.shake);
		var waveArray  = animArray(count, ANIM.wave);

		this.rightLeg.tAnimation = shakeArray;
		this.rightLeg.shake();

		this.head.tAnimation = shakeArray;
		this.head.shake();

		this.belly.tAnimation = shakeArray;
		this.belly.jump();

		this.leftArm.rAnimation = waveArray;
		this.leftArm.wave();

		this.rightArm.rAnimation = waveArray;
		this.rightArm.wave();

		msg && this.popup.show(msg);
		this._end(count);
	}

	Robot.prototype.jump = function(count, msg) {
		if (this.inAnimation) return ;
		this.inAnimation = true;

		var jumpArray = animArray(count, ANIM.jump);
		var limbs = ["rightLeg", "rightArm", "leftLeg", "leftArm", "belly", "head"];

		this.leftArm.rotate = 5;
		this.leftLeg.translateX = 5;
		this.rightArm.rotate = -5;
		this.rightLeg.translateX = -5;

		for (var i = 0; i < limbs.length; i++) {
			this[limbs[i]].tAnimation = jumpArray;
			this[limbs[i]].jump();
		}

		msg && this.popup.show(msg);
		this._end(count);
	}

	Robot.prototype.scare = function(msg) {
		if (this.inAnimation) return ;
		this.inAnimation = true;

		this.leftArm.rotate = 200;
		this.rightArm.rotate = -200;
		this.head.translateY = 20;
		this.leftArm.draw();
		this.rightArm.draw();
		this.head.draw();

		this.belly.tAnimation = animArray(3,ANIM.shake);
		this.belly.shake();
		
		setTimeout(function() {
			this.leftArm.rotate = 0;
			this.rightArm.rotate = 0;
			this.head.translateY = 0;
			this.leftArm.draw();
			this.rightArm.draw();
			this.head.draw();
			this._end(1);
		}.bind(this), 1200);

		msg && this.popup.show(msg);
	}

	Robot.prototype.wave = function(count, msg) {
		if (this.inAnimation) return ;
		this.inAnimation = true;

		this.leftArm.rAnimation = animArray(count, ANIM.wave);
		this.leftArm.wave();

		msg && this.popup.show(msg);
		this._end(count);
	}

	Robot.prototype.tickle = function(count, msg) {
		if (this.inAnimation) return ;
		this.inAnimation = true;

		this.leftArm.rotate = -50;
		this.leftArm.draw();
		this.rightArm.rotate = 50;
		this.rightArm.draw();

		this.belly.gAnimation = animArray(count, ANIM.grow);
		this.belly.grow();

		this.head.tAnimation = animArray(count, ANIM.shake);
		this.head.shake();

		setTimeout(function() {
			this.leftArm.rotate = 0;
			this.leftArm.draw();
			this.rightArm.rotate = 0;
			this.rightArm.draw();
			this.inAnimation = false;
			this._end(1);
		}.bind(this), (count||1) * ANIM.time);

		msg && this.popup.show(msg);
	}

	Robot.prototype.addListener = function(appendage, callback) {
		var elem = this[appendage].elem;
		elem.addEventListener(touch ? "touchstart" : "click", callback, false);
	}

	Robot.prototype.onReady = function(fn) {
		if (this.imagesLoaded === 6) {
			fn();
		} else {
			this.loadListeners.push(fn);
		}
	}

	Robot.prototype._end = function(count) {
		setTimeout(function() {
			this.popup.hide();
			this.inAnimation = false;
		}.bind(this), (count||1)*ANIM.time);
	}

	Robot.prototype._createRobot = function() {
		// Add Images
		this.robot.appendChild(this.belly.elem);
		this.robot.appendChild(this.head.elem);
		this.robot.appendChild(this.leftLeg.elem);
		this.robot.appendChild(this.rightLeg.elem);
		this.robot.appendChild(this.leftArm.elem);
		this.robot.appendChild(this.rightArm.elem);

		// Setup Elements
		var pos = this.belly.elem.getBoundingClientRect();

		this.leftArm.setPosition(pos.left - this.leftArm.elem.width - 5, pos.top + 5);
		this.leftArm.elem.style[transformOrigin] = "50% 0%";

		this.leftLeg.setPosition(pos.left - this.leftLeg.elem.width + 5, pos.bottom);
		this.leftLeg.elem.style[transformOrigin] = "50% 0%";

		this.rightArm.setPosition(pos.right, pos.top);
		this.rightArm.elem.style[transformOrigin] = "50% 0%";

		this.rightLeg.setPosition(pos.right, pos.bottom);
		this.rightLeg.elem.style[transformOrigin] = "50% 0%";

		this.head.setPosition(pos.left - 35, pos.top - this.head.elem.height - 5);
		this.head.elem.style[transformOrigin] = "50% 50%";

		this.belly.setPosition(pos.left,pos.top);

		this.popup = new Popup(pos.right + 50, pos.top - this.head.elem.height);
		document.body.appendChild(this.popup.elem);
	}

	Robot.prototype._loadImage = function(name, path) {
		var image = new Image();
		image.src = path;
		image.onload = function() {
			this[name] = new Appendage(name, image, this.robot);
			this._onImageLoad();
		}.bind(this);
	}

	Robot.prototype._onImageLoad = function() {
		if (++this.imagesLoaded === 6) {
			this._createRobot();
			this.loadListeners.forEach(function(fn) { fn(); });
		}
	}

	function Appendage(name, appendage, robot) {
		this.elem = appendage;
		this.reverse = name.indexOf("right") !== -1;

		// Animation State
		this.translateX = 0;
		this.translateY = 0;
		this.rotate  = 0;
		this.scale   = 1;

		// Animation Index
		this.txIndex = 0;
		this.tyIndex = 0;
		this.rIndex  = 0;
		this.gIndex  = 0;

		// Initialize
		this.elem.style.position = "absolute";
		this.elem.style[transition] = "transform .18s linear";

		// Add listener
		this.elem.addEventListener(transitionEnd, this, false);
	}

	Appendage.prototype.handleEvent = function(e) {
		if (this.inTranslateX) this.shake();
		else this.translateX = 0;
		
		if (this.inTranslateY) this.jump();
		else this.translateY = 0;
		
		if (this.inRotate) this.wave();
		else this.rotate = 0;
		
		if (this.inGrow) this.grow();
		else this.scale = 1;
	}

	Appendage.prototype.setPosition = function(x,y) {
		this.elem.style.left = x + "px";
		this.elem.style.top  = y + "px";
	}

	Appendage.prototype.animate = function(prop, index, animation, inProgress) {
		this[inProgress] = this[index] < this[animation].length;
		if (this[inProgress]) {
			this[prop] = this[animation][this[index]++];
			this.reverse && prop === "rotate" && (this[prop] = -this[prop]);
		} else {
			this[prop] = prop === "scale" ? 1 : 0;
			this[index] = 0;
		}
		this.draw();
	}

	Appendage.prototype.wave = function() {
		this.animate("rotate", "rIndex", "rAnimation", "inRotate");
	}

	Appendage.prototype.shake = function() {
		this.animate("translateX", "txIndex", "tAnimation", "inTranslateX");
	}

	Appendage.prototype.jump = function() {
		this.animate("translateY", "tyIndex", "tAnimation", "inTranslateY");
	}

	Appendage.prototype.grow = function() {
		this.animate("scale", "gIndex", "gAnimation", "inGrow");
	}

	Appendage.prototype.draw = function() {
		var rotate = "rotate(" + this.rotate + "deg) "
		  , translateX = "translateX(" + this.translateX + "px) "
		  , translateY = "translateY(" + this.translateY + "px) "
		  , scale = "scale(" + this.scale + "," + this.scale + ")";
		this.elem.style[transform] = rotate + translateX + translateY + scale;
	}

	function Popup(left, top) {
		this.elem = document.createElement("div");
		this.elem.className = "popup";
		this.elem.style.left = left + "px";
		this.elem.style.top = top + "px";

		this.text = document.createElement("div");
		this.text.className = "popup-text";

		this.elem.appendChild(this.text);
	}

	Popup.prototype.show = function(msg) {
		this.text.innerHTML = msg;
		this.elem.style.visibility = "visible";
	}

	Popup.prototype.hide = function() {
		this.elem.style.visibility = "hidden";
	}

	function animArray(count, array) {
		count = count || 1;

		var animation = [];
		while(count-- > 0) {
			for (var i = 0; i < array.length; i++) {
				animation.push(array[i]);
			}
		}
		return animation;
	}

	// Property Detection
	var prefix = getPrefix()
	  , transform = prefix ? prefix + "Transform" : "transform"
	  , transformOrigin = transform + "Origin"
	  , transition = prefix ? prefix + "Transition" : "transition"
	  , transitionEnd  = prefix ? prefix.toLowerCase() + "TransitionEnd" : "transitionend"
	  , touch = document.ontouchmove !== undefined;

	function getPrefix() {
		var prefixes = ["Webkit","Moz","O","ms"]
		  , element  = document.createElement("div");
		for (var i = 0; i < prefixes.length; i++) {
			if (typeof element.style[prefixes[i] + "Transform"] !== "undefined") {
				return prefixes[i];
			}
		}
		return null;
	}

	return Robot;
}())