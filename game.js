// the game itself
var game;

var gameOptions = {

	// maximum length of the sum
	maxSumLen: 5,

	// local storage name used to save high score
	localStorageName: "oneplustwo",

	// time allowed to answer a question, in milliseconds
	timeToAnswer: 3000,

	// score needed to increase difficulty
	nextLevel: 400
}

// once the window has been loaded...
window.onload = function () {

	// game configuration object
	var gameConfig = {
		width: 500,
		height: 500,
		scene: [playGame],
		backgroundColor: 0x444444
	}

	// creation of the game itself
	game = new Phaser.Game(gameConfig);
}

// "PlayGame" scene
class playGame extends Phaser.Scene {
	constructor() {
		super("PlayGame");

		// Element
		this.firstNumText = null;
		this.scndNumText = null;
		this.operatorText = null;
		this.resultText = null;
		this.scoreText = null;
		this.timeLeftText = null;
		this.btnRight = null;
		this.btnWrong = null;
		this.equalMark = null;

		// Number
		this.firstNum = null;
		this.scndNum = null;
		this.result = null;
		this.score = null;
		this.timeLeft = null;
		this.operator = null;

	}

	preload() {
		this.load.image("rightBtn", "right.png");
		this.load.image("wrongBtn", "wrong.jpg");
	}

	create() {
		this.renderUI();
		this.gameStart();
	}

	renderUI() {
		// Set game default
		this.gameWidth = 500;
		this.gameHeight = 500;
		this.isGameOver = false;
		this.score = 0;
		this.correctAnswers = 0;
		this.timeLeft = 60;

		this.timeLeftText = this.add.text(
			this.gameWidth * 0.1,
			this.gameHeight * 0.1,
			"Time left: " + this.timeLeft + "s"
		)
			.setOrigin(0)
			.setFontSize(30)
			.setFontStyle('bold')

		this.scoreText = this.add.text(
			this.gameWidth * 0.1,
			this.gameHeight * 0.2,
			"Score: " + this.score
		)
			.setOrigin(0)
			.setFontSize(30)
			.setFontStyle('bold')

		this.firstNumText = this.add.text(
			this.gameWidth * 0.1,
			this.gameHeight * 0.5,
			"12"
		).setOrigin(0)
			.setFontSize(50)
			.setFontStyle('bold')

		this.operatorText = this.add.text(
			this.gameWidth * 0.25,
			this.gameHeight * 0.5,
			"+"
		).setOrigin(0)
			.setFontSize(50)
			.setFontStyle('bold')

		this.scndNumText = this.add.text(
			this.gameWidth * 0.4,
			this.gameHeight * 0.5,
			"13"
		).setOrigin(0)
			.setFontSize(50)
			.setFontStyle('bold')

		this.equalMark = this.add.text(
			this.gameWidth * 0.55,
			this.gameHeight * 0.5,
			"="
		).setOrigin(0)
			.setFontSize(50)
			.setFontStyle('bold')

		this.resultText = this.add.text(
			this.gameWidth * 0.7,
			this.gameHeight * 0.5,
			"13"
		).setOrigin(0)
			.setFontSize(50)
			.setFontStyle('bold')

		this.btnRight = this.add.sprite(
			this.gameWidth * 0.5 * 0.5,
			this.gameHeight * 0.8, "rightBtn")
			.setOrigin(0.5)
			.setScale(0.2)
			.setInteractive()
			.on('pointerdown', this.onRightBtnClick.bind(this));

		this.btnWrong = this.add.sprite(
			this.gameWidth * 0.5 * 0.5 * 3,
			this.gameHeight * 0.8, "wrongBtn")
			.setOrigin(0.5)
			.setScale(0.2)
			.setInteractive()
			.on('pointerdown', this.onWrongBtnClick.bind(this));
	}

	gameStart() {
		// Timeout
		const timer = setInterval(() => {
			if (this.timeLeft == 1) {
				clearInterval(timer);
				this.gameOver();
				return;
			}
			this.timeLeft--
			this.timeLeftText.setText("Time left: " + this.timeLeft + "s");
		}, 1000)

		this.createNewExpression();
	}

	gameOver() {
		this.firstNumText.destroy();
		this.scndNumText.destroy();
		this.operatorText.destroy();
		this.resultText.destroy();
		this.scoreText.destroy();
		this.timeLeftText.destroy();
		this.btnRight.destroy();
		this.btnWrong.destroy();
		this.equalMark.destroy();

		const score = this.add.text(
			this.gameWidth * 0.5,
			this.gameHeight * 0.5,
			"Score: " + this.score
		).setOrigin(0.5)
			.setFontSize(55)
			.setFontStyle('bold')

		const again = this.add.text(
			this.gameWidth * 0.5,
			this.gameHeight * 0.75,
			"Play again ?"
		).setOrigin(0.5)
			.setFontSize(30)
			.setFontStyle('bold')
			.setInteractive()
			.on('pointerdown', () => {
				this.create();
				score.destroy();
				again.destroy();
			})
	}

	onRightBtnClick() {
		console.log(this.firstNum + this.operator + this.scndNum + " = " + this.result);
		if (eval(this.firstNum + this.operator + this.scndNum) == this.result) {
			this.score++
			this.scoreText.setText("Score: " + this.score);
		}
		this.createNewExpression();
	}

	onWrongBtnClick() {
		console.log(this.firstNum + this.operator + this.scndNum + " = " + this.result);
		if (eval(this.firstNum + this.operator + this.scndNum) != this.result) {
			this.score++
			this.scoreText.setText("Score: " + this.score);
		}
		this.createNewExpression();
	}

	createNewExpression() {
		// We will make an correctly expression when random return 2 
		const isCorrect = (Math.floor(Math.random() * 3) == 1);

		this.firstNum = Math.floor(Math.random() * 21);
		this.scndNum = Math.floor(Math.random() * 21);
		this.operator = Math.floor(Math.random() * 2) == 0 ? "+" : "-";

		this.firstNumText.setText(this.firstNum);
		this.scndNumText.setText(this.scndNum);
		this.operatorText.setText(this.operator);

		if (isCorrect) {
			this.result = eval(this.firstNum + this.operator + this.scndNum);
		}
		else {
			this.result = eval(this.firstNum + this.operator + this.scndNum) + Math.floor(Math.random() * 4);
		}

		this.resultText.setText(this.result);
	}
}
