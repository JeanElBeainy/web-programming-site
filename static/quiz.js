// ======================================================
// QUESTIONS
// ======================================================
// Each question object holds the question text, the possible answers,
// the index of the correct answer and a short explanation.
const questions = [
  {
    question: "What is JavaScript mainly used for?",
    choices: [
      "To style HTML pages",
      "To make HTML pages dynamic and interactive",
      "To store data in a database",
      "To design images",
    ],
    answer: 1,
    explanation: "JavaScript runs in the browser and makes HTML pages more dynamic and interactive.",
  },
  {
    question: "Which HTML tag is used to insert JavaScript code in a page?",
    choices: ["<jscript>", "<script>", "<js>", "<javascript>"],
    answer: 1,
    explanation: "JavaScript code goes inside <script> tags, in the head, in the body, or in an external file.",
  },
  {
    question: "Which part of an HTML page can hold a script?",
    choices: ["Only the head", "Only the body", "The head and the body", "Only an external file"],
    answer: 2,
    explanation: "A page can hold any number of scripts, in the head, in the body, or in both.",
  },
  {
    question: "Which keyword declares a variable whose value cannot be reassigned?",
    choices: ["var", "let", "const", "static"],
    answer: 2,
    explanation: "const declares a variable that cannot be reassigned, while let and var can still change.",
  },
  {
    question: "Which data type is used for a series of characters written between quotes?",
    choices: ["string", "number", "boolean", "bigInt"],
    answer: 0,
    explanation: "A string is a series of characters written with single or double quotes, for example 'GIN446'.",
  },
  {
    question: "What does the typeof operator return?",
    choices: [
      "The value of a variable",
      "The type of a value",
      "The name of a variable",
      "The number of characters",
    ],
    answer: 1,
    explanation: 'typeof returns the type of a value, for example "number", "string" or "boolean".',
  },
  {
    question: "Which operator compares both the value and the type?",
    choices: ["=", "==", "===", "!="],
    answer: 2,
    explanation: '=== is the strict comparison: 5 === "5" is false, while 5 == "5" is true.',
  },
  {
    question: "Which syntax creates an array with three elements?",
    choices: [
      'const cars = ("A", "B", "C");',
      'const cars = ["A", "B", "C"];',
      'const cars = {"A", "B", "C"};',
      'const cars = array("A", "B", "C");',
    ],
    answer: 1,
    explanation: 'An array is written with square brackets and commas: const cars = ["A", "B", "C"];',
  },
  {
    question: "Which array method adds a new element at the end of an array?",
    choices: ["push()", "pop()", "shift()", "join()"],
    answer: 0,
    explanation: "push() adds an element at the end of the array, while pop() removes the last element.",
  },
  {
    question: "Which keyword is used to define a function?",
    choices: ["def", "func", "function", "fun"],
    answer: 2,
    explanation: "A function is defined with the function keyword, a name, parentheses and a block of code.",
  },
];

// ======================================================
// APPLICATION STATE
// ======================================================
let currentQuestion = 0;
const userAnswers = new Array(questions.length);

// ======================================================
// SAVE AN ANSWER
// ======================================================
function saveAnswer(choiceIndex) {
  //   Save the user's answer for the current question.
  userAnswers[currentQuestion] = choiceIndex;
}

// ======================================================
// NAVIGATION
// ======================================================
function goNext() {
  //   Move to the next question if not at the last question.
  if (currentQuestion < questions.length - 1)
    currentQuestion++;

  renderQuestion();
}

function goPrevious() {
  //   Move to the previous question if not at the first question.
  if (currentQuestion > 0)
    currentQuestion--;

  renderQuestion();
}

function goFirst() {
  //   Move to the first question.
  currentQuestion = 0;

  renderQuestion();
}
function goLast() {
  //   Move to the last question.
  currentQuestion = questions.length - 1;

  renderQuestion();
}

// ======================================================
// CALCULATE SCORE
// ======================================================
function calculateScore() {
  //   Calculate the user's score based on their answers.
  let score = 0;

  for (let i = 0; i < questions.length; i++)
    if (userAnswers[i] === questions[i].answer)
      score++;

  return score;
}

// ======================================================
// CALCULATE PERCENTAGE
// ======================================================
function calculatePercentage(score) {
  //   Calculate the percentage score based on the total number of questions.
  return Math.round((score / questions.length) * 100);
}

// ======================================================
// PERFORMANCE MESSAGE
// ======================================================
function getPerformanceMessage(percentage) {
  //   Return a performance message based on the percentage score.
  if (percentage >= 80)
    return "Excellent";
  else if (percentage >= 60)
    return "Good";
  else if (percentage >= 50)
    return "Pass";
  else
    return "Needs improvement";
}

// ======================================================
// BUILD CORRECTION
// ======================================================
function buildCorrection() {
  let correction = "";

  //   Build a correction string that includes the question, the user's answer,
  //   the correct answer, and an explanation for each question.
  for (let i = 0; i < questions.length; i++) {
    const userChoice = userAnswers[i];
    const correctChoice = questions[i].answer;
    
    let userText = "Not Answered";
    if (userChoice !== undefined)
      userText = questions[i].choices[userChoice];

    let result = "Incorrect";
    if (userChoice === correctChoice)
      result = "Correct";

    correction += `Question ${i + 1}: ${questions[i].question}\n`;
    correction += `Your answer: ${userText}\n`;
    correction += `Correct answer: ${questions[i].choices[correctChoice]}\n`;
    correction += `Result: ${result}\n`;
    correction += `Explanation: ${questions[i].explanation}\n\n`;
  }

  return correction;
}

// ======================================================
// PROVIDED INTERFACE CODE
//
// DOM manipulation and events will be studied later.
// ======================================================

// ======================================================
// SUBMIT QUIZ
// ======================================================
function submitQuiz() {
  const score = calculateScore();
  const percentage = calculatePercentage(score);
  const message = getPerformanceMessage(percentage);
  const correction = buildCorrection();
  showResults(score, percentage, message, correction);
}

function renderQuestion() {
  const q = questions[currentQuestion];

  // --------------------------------------------------
  // QUESTION NUMBER
  // --------------------------------------------------
  document.getElementById("progress").textContent =
    `Question ${currentQuestion + 1} of ${questions.length}`;

  // --------------------------------------------------
  // QUESTION
  // --------------------------------------------------
  document.getElementById("questionText").textContent = q.question;

  // --------------------------------------------------
  // CHOICES
  // --------------------------------------------------
  const choicesContainer = document.getElementById("choices");
  choicesContainer.innerHTML = "";
  for (let i = 0; i < q.choices.length; i++) {
    const label = document.createElement("label");
    label.className = "choice";
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "answer";
    radio.value = i;
    // Restore an answer previously selected
    // by the user.
    if (userAnswers[currentQuestion] === i) {
      radio.checked = true;
    }
    // When the user selects this answer,
    // save its index.
    radio.onclick = function () {
      saveAnswer(i);
    };
    label.appendChild(radio);
    label.appendChild(document.createTextNode(" " + q.choices[i]));
    choicesContainer.appendChild(label);
  }

  // --------------------------------------------------
  // NAVIGATION BUTTONS
  // --------------------------------------------------
  document.getElementById("firstBtn").disabled = currentQuestion === 0;
  document.getElementById("previousBtn").disabled = currentQuestion === 0;
  document.getElementById("nextBtn").disabled =
    currentQuestion === questions.length - 1;
  document.getElementById("lastBtn").disabled =
    currentQuestion === questions.length - 1;
}

// ======================================================
// DISPLAY RESULTS
// ======================================================
function showResults(score, percentage, message, correction) {
  document.getElementById("quizPanel").style.display = "none";
  document.getElementById("resultsPanel").style.display = "block";
  document.getElementById("scoreText").textContent =
    `Score: ${score} / ${questions.length}`;
  document.getElementById("percentageText").textContent =
    `Percentage: ${percentage}%`;
  document.getElementById("performanceText").textContent = message;
  document.getElementById("correction").textContent = correction;
}

// ======================================================
// START APPLICATION
// ======================================================
renderQuestion();
