// basic math functions
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    return "Error: Division by zero";
  }
  return a / b;
}

// object mapping operators to functions
const operations = {
  "+": add,
  "-": subtract,
  "*": multiply,
  "/": divide,
};

// function to operate based on the operator and the two numbers
function operate(operator, a, b) {
  if (operator in operations) {
    // check if the operator exists in the object
    return operations[operator](a, b); // call the corresponding function
  } else {
    return null; // return null if the operator is not found
  }
}

// variables to hold the parts of the operation
let firstNumber = null;
let secondNumber = null;
let operator = null;

// function to set the operation variables
function setOperation(a, op, b) {
  firstNumber = a;
  operator = op;
  secondNumber = b;
}

// Test the variables
setOperation(3, "+", 5);

console.log(`First number: ${firstNumber}`); // should print 3
console.log(`Operator: ${operator}`); // should print '+'
console.log(`Second number: ${secondNumber}`); // should print 5

console.log(operate(operator, firstNumber, secondNumber)); // should print 8
