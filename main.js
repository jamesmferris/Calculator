// Variables
let displayValue = "0";
let mainDisplay = document.getElementById("main-display");
let secondaryDisplay = document.getElementById("secondary-display");
let numberButtons = document.querySelectorAll(".number");
let operatorButtons = document.querySelectorAll(".operator");
let clearButton = document.getElementById("clear");
let equalsButton = document.getElementById("equals");
let toggleSignButton = document.getElementById("toggle-sign");
let percentageButton = document.getElementById("percentage");

let operatorSelected = false;

// variables to hold the parts of the operation
let firstNumber = null;
let secondNumber = null;
let operator = null;
let currentExpression = "";

// Function to update displays
function updateDisplays(value, isOperator = false) {
  if (!isOperator) {
    if (operatorSelected || displayValue === "0") {
      displayValue = value === "." ? "0." : value;
      operatorSelected = false;
    } else if (displayValue.length < 9) {
      if (value === "." && displayValue.includes(".")) {
        return; // Don't add another decimal point
      }
      displayValue += value;
    }
    mainDisplay.textContent = displayValue;

    // Update secondary display
    if (currentExpression.includes("=")) {
      currentExpression = "";
    }
    if (operator === null) {
      currentExpression = displayValue;
    } else {
      let parts = currentExpression.split(" ");
      parts[parts.length - 1] = displayValue;
      currentExpression = parts.join(" ");
    }
    secondaryDisplay.textContent = currentExpression;
  }
}

// Event listeners for number buttons
numberButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const value = this.textContent;
    if (value === "." && displayValue.includes(".")) {
      return; // Don't add another decimal point
    }
    if (value === "." && displayValue === "0") {
      updateDisplays("0.");
    } else {
      updateDisplays(value);
    }
  });
});

// Event listeners for operator buttons
operatorButtons.forEach((button) => {
  button.addEventListener("click", function () {
    handleOperator(this.textContent);
  });
});

// Function to reset calculator
function clearCalculator() {
  displayValue = "0";
  firstNumber = null;
  secondNumber = null;
  operator = null;
  operatorSelected = false;
  currentExpression = "";
  mainDisplay.textContent = displayValue;
  secondaryDisplay.textContent = currentExpression;
  clearOperatorSelection();
}

// Function to calculate result
function calculateResult() {
  if (firstNumber !== null && operator !== null) {
    secondNumber = parseFloat(displayValue);
    const result = operate(operator, firstNumber, secondNumber);
    displayValue = formatResult(result);
    mainDisplay.textContent = displayValue;
    currentExpression = `${formatResult(firstNumber)} ${operator} ${formatResult(secondNumber)} = ${displayValue}`;
    secondaryDisplay.textContent = currentExpression;
    firstNumber = parseFloat(result);
    secondNumber = null;
    operator = null;
    operatorSelected = false;
    clearOperatorSelection();
  }
}

// Function to handle operators
function handleOperator(op) {
  clearOperatorSelection();
  const operatorButton = document.querySelector(`.operator[textContent="${op}"]`);
  if (operatorButton) {
    operatorButton.classList.add("selected-operator");
  } else {
    console.warn(`No operator button found for "${op}"`);
  }

  if (firstNumber === null) {
    firstNumber = parseFloat(displayValue);
    currentExpression = displayValue;
  } else if (operator !== null && !operatorSelected) {
    calculateResult();
    firstNumber = parseFloat(displayValue);
    currentExpression = displayValue;
  } else {
    firstNumber = parseFloat(displayValue);
    currentExpression = displayValue;
  }

  operator = op;
  operatorSelected = true;

  currentExpression += ` ${op} `;
  secondaryDisplay.textContent = currentExpression;
}

// Event listener for equals button
equalsButton.addEventListener("click", function () {
  if (operator !== null) {
    calculateResult();
  }
  currentExpression = "";
});

// Event listener for clear button
clearButton.addEventListener("click", function () {
  displayValue = "0";
  firstNumber = null;
  secondNumber = null;
  operator = null;
  operatorSelected = false;
  currentExpression = "";
  mainDisplay.textContent = displayValue;
  secondaryDisplay.textContent = currentExpression;
  clearOperatorSelection();
});

// Event listener for toggle sign button
toggleSignButton.addEventListener("click", function () {
  if (displayValue !== "0") {
    displayValue = displayValue.charAt(0) === "-" ? displayValue.slice(1) : "-" + displayValue;
    mainDisplay.textContent = displayValue;

    // Update the current expression
    if (currentExpression.includes("=")) {
      currentExpression = displayValue;
    } else {
      let parts = currentExpression.split(" ");
      parts[parts.length - 1] = displayValue;
      currentExpression = parts.join(" ");
    }
    secondaryDisplay.textContent = currentExpression;
  }
});

// Function to handle percentage operation
function handlePercentage() {
  let currentValue = parseFloat(displayValue);
  if (!isNaN(currentValue)) {
    if (operator !== null && firstNumber !== null) {
      // If we're in the middle of an operation, calculate percentage of the first number
      currentValue = (firstNumber * currentValue) / 100;
    } else {
      // Otherwise, just convert the current value to a percentage
      currentValue = currentValue / 100;
    }
    displayValue = formatResult(currentValue);
    mainDisplay.textContent = displayValue;

    // Update the current expression
    if (currentExpression.includes("=") || currentExpression === "") {
      currentExpression = displayValue;
    } else {
      let parts = currentExpression.split(" ");
      parts[parts.length - 1] = displayValue;
      currentExpression = parts.join(" ");
    }
    secondaryDisplay.textContent = currentExpression;

    // Reset the operation if we're not in the middle of one
    if (operator === null) {
      firstNumber = null;
    }
  }
}

// Event listener for percentage button
percentageButton.addEventListener("click", function () {
  handlePercentage();
});

// Function to clear operator selection
function clearOperatorSelection() {
  operatorButtons.forEach((button) => button.classList.remove("selected-operator"));
}

// Function to round the result and convert it to scientific notation if necessary
function formatResult(number) {
  if (typeof number !== "number") {
    return number;
  }
  if (number === 0) {
    return "0";
  }
  const maxDigits = 9;
  let formattedNumber = number.toString();

  if (Math.abs(number) >= 1e9 || (Math.abs(number) < 1e-3 && Math.abs(number) > 0)) {
    // Use scientific notation for very large or very small non-zero numbers
    return number.toExponential(maxDigits - 6).slice(0, maxDigits); // 6 for "e+xxx" part
  } else {
    // For all other numbers
    if (formattedNumber.includes(".")) {
      const [intPart, decPart] = formattedNumber.split(".");
      const availableDecimalPlaces = Math.max(0, maxDigits - intPart.length - 1);
      return parseFloat(number.toFixed(availableDecimalPlaces)).toString();
    } else if (formattedNumber.length > maxDigits) {
      return formattedNumber.slice(0, maxDigits);
    }
    return formattedNumber;
  }
}

// Basic math functions
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
    return "NaN";
  }
  return a / b;
}

// Object mapping operators to functions
const operations = {
  "+": add,
  "-": subtract,
  "*": multiply,
  "/": divide,
};

// Function to operate based on the operator and the two numbers
function operate(operator, a, b) {
  if (operator in operations) {
    let result = operations[operator](a, b);
    return formatResult(result);
  } else {
    return null;
  }
}
