import {evaluate} from 'mathjs';
import {re5, la5, mi5, la4, re6} from '../notes/index.js'

function randomNumber(max = 4, min = 0) {
  return parseInt((Math.random() * (max - min)) + min);
}

function reduceDouble(n, places) {
  let k = `${n}`;
  let regex = new RegExp(`[\\d]+[.][\\d]{${places}}`);
  return k.match(regex);
}
  
function putParenthesis(str) {
	let finalExpression = str.replace(/\d+\s[/*]\s\d+/g, '($&)');
	return finalExpression;
}

function putSpaces(str) {
	let finalExpression = str.replace(/[+-/*]/g, ' $& ');
	return finalExpression;
}

function getRandomOperation(max = 4, min = 0) {
	  let operations = ['+', '-', '*', '/'];
	  const opCode = parseInt((Math.random() * (max - min)) + min);
	  return operations[opCode];
}
	
function catchLevel(number = 0) {
	const level = {}
	
	switch(number) {
		case 0:
			level.operation = getRandomOperation(1)
			level.rangeA = [100, 1]
			level.rangeB = [10, 1]
			return level;
				
		case 1:
			level.operation = getRandomOperation(2)
			level.rangeA = [100, 1]
			level.rangeB = [(level.operation == '+') ? 100:20, 1]
			return level;

		case 2:
			level.operation = getRandomOperation(3)
			level.rangeA = [level.operation == '*' ? 10:100, 1]
			level.rangeB = [level.operation == '*' ? 10:100, 1]
			return level;

		case 3:
			level.operation = getRandomOperation()
			level.rangeA = [level.operation == '*' ? 20 : level.operation == '/' ? 5 : 500, 1]
			level.rangeB = [level.operation == '*' || level.operation == '/' ? 10 : 100, 1]
			return level;

		case 4:
			level.operation = getRandomOperation()
			level.rangeA = [level.operation == '/' ? 10 : level.operation == '*' ? 30 : 1000, 1]
			level.rangeB = [level.operation == '/' ? 10 : level.operation == '*' ? 20 : 1000, 1]
			return level;
		case 5:
			level.operation = getRandomOperation()
			level.rangeA = [level.operation == '/' ? 20 : level.operation == '*' ? 30 : 1000, 1]
			level.rangeB = [level.operation == '/' ? 10 : level.operation == '*' ? 20 : 1000, 1]
			return level;

		case 6:
			level.operation = getRandomOperation()
			level.rangeA = [level.operation == '*' ? 50 : level.operation == '/' ? 25 : 500, 1]
			level.rangeB = [level.operation == '*' ? 30 : level.operation == '/' ? 10 : 100, 1]
			return level;

		case 7:
			level.operation = getRandomOperation()
			level.rangeA = [level.operation == '/' ? 30 : level.operation == '*' ? 50 : 1000, 1]
			level.rangeB = [level.operation == '/' ? 10 : level.operation == '*' ? 40 : 1000, 1]
			return level;

		case 8:
			level.operation = getRandomOperation()
			level.rangeA = [level.operation == '/' ? 40 : level.operation == '*' ? 100 : 5000, 1]
			level.rangeB = [level.operation == '/' ? 20 : level.operation == '*' ? 40 : 3000, 1]
			return level;

		case 9:
			level.operation = getRandomOperation()
			level.rangeA = [level.operation == '/' ? 20 : level.operation == '*' ? 100 : 1000, 1]
			level.rangeB = [level.operation == '/' ? 10 : level.operation == '*' ? 20 : 1000, 1]
			level.rangeC = [level.operation == '/' ? 10 : level.operation == '*' ? 20 : 1000, 1]
			return level;

		default:
			level.operation = getRandomOperation()
			level.rangeA = [level.operation == '/' ? 20 : level.operation == '*' ? 100 : 1000, 1]
			level.rangeB = [level.operation == '/' ? 10 : level.operation == '*' ? 20 : 1000, 1]
			level.rangeC = [level.operation == '/' ? 10 : level.operation == '*' ? 20 : 1000, 1]
			return level;
	}
}

function expressionGenerator(n, level) {
	//the main purpose of this function is that, given a n number of operations, it returns an arithmetic expression, which the result is always an integer and (likely) positive.
    let  exp = []
    let lastOperator;
		let nIsEven = n % 2 == 0;
		
		for (let i = 0; i < n; i++) {
			if (i % 2 == 0) {    
				let {operation, rangeA, rangeB} = catchLevel(level);
				let x = randomNumber(...rangeA)
				let y = randomNumber(...rangeB)
			
				if (operation == '-') {
					//if it's a subtraction of two operands, this guarantees the result is >= 0
					if (y > x) {
						let aux = x;
						x = y;
						y = aux;
					}
				}
				else if (operation == '/') {
					//if it's a division, this guarantees result is always an integer
					x = x * y;
				}
				exp[i] = `${x + operation + y}`
				if (lastOperator == '-' && evaluate(exp[i]) > evaluate(exp[i - 2])) {//if it's more than 3 operands, this reduces the chance of a negative result, but it's still possible
						let aux2 = exp[i - 2];
						exp[i-2] = exp[i];
						exp[i] = aux2;
					}
				}
		 else {
			 //two consecutive multi or divi operations are only possible if it's an odd number of operations (n >= 3)
			 let operation = getRandomOperation((i == n - 1) && nIsEven ? 4:2);
				exp[i] = operation;
				lastOperator = exp[i];
			}
			
		}
		if (nIsEven) {
			let lastOperand = randomNumber(100, 1);
				if (lastOperator == '-' && lastOperand > evaluate(exp[n - 2])) {
					//this keeps the effort to place the highest results in front of the smallest when it's a subtraction, but it's not the best method, it just reduces the chance of a negative outcome
					let aux = exp[n - 2];
						exp[n - 2] = lastOperand;
						lastOperand = aux;
				}
				else if (lastOperator == '/') {
					//this condition is to guarantee an integer. If it's a multiplication or a division before a division, multiply the first numerator...
					let itsMultiOrDivi = /[*/]/.test(exp[n-2]);
					if (itsMultiOrDivi) {
						exp[n - 2] = exp[n - 2].replace(/\d+/, (match) => parseInt(match) * lastOperand);
					}
					else {
						//for any other operation that precedes a division, multiply both operands
						exp[n - 2] = exp[n - 2].replace(/\d+/g, (match) => parseInt(match) * lastOperand);
					}
				}
				exp[n] = lastOperand;
		}

	let expression = exp.join('');

	expression = putSpaces(expression);
	expression = putParenthesis(expression);

	return expression;
}

// function getAnswer(event) {
    
//     if (event.target.value == evaluate(expression)) {
//       const answerT = answerTim();
//       socket.emit('right-answer', answerT);
//       setSpin(true)
//       setTimeout(() => setSpin(false), 1000);
//       answerTimeCalc(); //also calculates totalTime
//       callNextQuestion();
//       event.target.value = '';
//     }
//   }

  function playAudio(path) {
	const sound = new Audio(path);
	sound.play();
  }

  const playTrack = (question) => {
	if (question % 6 == 0) playAudio(re5);
	else if (question % 6 == 1) playAudio(la5);
	else if (question % 6 == 2) playAudio(re6);
	else if (question % 6 == 3) playAudio(la4);
	else if (question % 6 == 4) playAudio(mi5);
	else if (question % 6 == 5) playAudio(la5);
  }

export {randomNumber, getRandomOperation, putParenthesis,
	 putSpaces, catchLevel, expressionGenerator,
	  reduceDouble, playAudio, playTrack};