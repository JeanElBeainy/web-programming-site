// ======================================================
// QUESTIONS
// ======================================================
// Each question object holds the question text, the possible answers,
// the index of the correct answer and a short explanation.
let total = 0; // how many questions (from the server)
const cache = {}; // cache[i] = a fetched question object

async function getQuestion(index) {
  if (cache[index] !== undefined)
    return cache[index];

  const response = await fetch(`/api/question/${index}`);
  if (!response.ok)
    throw new Error("HTTP " + response.status);

  const data = await response.json();
  cache[index] = data;
  return data;
}

// ======================================================
// APPLICATION STATE
// ======================================================
let currentQuestion = 0;
const userAnswers = []; // the length isn't known until you fetch the count

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
  if (currentQuestion < total - 1)
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
  currentQuestion = total - 1;

  renderQuestion();
}

// ======================================================
// CALCULATE SCORE
// ======================================================
async function calculateScore() {
  //   Calculate the user's score based on their answers.
  let score = 0;

  for (let i = 0; i < total; i++) {
    const q = await getQuestion(i);
    if (userAnswers[i] === q.answer)
      score++;
  }

  return score;
}

// ======================================================
// CALCULATE PERCENTAGE
// ======================================================
function calculatePercentage(score) {
  //   Calculate the percentage score based on the total number of questions.
  return Math.round((score / total) * 100);
}

// ======================================================
// PERFORMANCE MESSAGE
// ======================================================
function getPerformanceMessage(percentage) {
  //   Return a performance message based on the percentage score.
  if (percentage >= 90)
    return "Excellent";
  else if (percentage >= 70)
    return "Good";
  else if (percentage >= 60)
    return "Pass";
  else
    return "Fail";
}

// ======================================================
// BUILD CORRECTION
// ======================================================
async function buildCorrection() {
  let correction = "";

  //   Build a correction string that includes the question, the user's answer,
  //   the correct answer, and an explanation for each question.
  for (let i = 0; i < total; i++) {
    const q = await getQuestion(i);
    const userChoice = userAnswers[i];
    const correctChoice = q.answer;

    let userText = "Not Answered";
    if (userChoice !== undefined)
      userText = q.choices[userChoice];

    let result = "Incorrect";
    if (userChoice === correctChoice)
      result = "Correct";

    correction += `Question ${i + 1}: ${q.question}\n`;
    correction += `Your answer: ${userText}\n`;
    correction += `Correct answer: ${q.choices[correctChoice]}\n`;
    correction += `Result: ${result}\n`;
    correction += `Explanation: ${q.explanation}\n\n`;
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
async function submitQuiz() {
  const score = await calculateScore();
  const percentage = calculatePercentage(score);
  const message = getPerformanceMessage(percentage);
  const correction = await buildCorrection();
  showResults(score, percentage, message, correction);
}

async function renderQuestion() {
  const q = await getQuestion(currentQuestion);

  // --------------------------------------------------
  // QUESTION NUMBER
  // --------------------------------------------------
  document.getElementById("progress").textContent =
    `Question ${currentQuestion + 1} of ${total}`;

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
    currentQuestion === total - 1;
  document.getElementById("lastBtn").disabled =
    currentQuestion === total - 1;
}

// ======================================================
// DISPLAY RESULTS
// ======================================================
function showResults(score, percentage, message, correction) {
  document.getElementById("quizPanel").style.display = "none";
  document.getElementById("resultsPanel").style.display = "block";
  document.getElementById("scoreText").textContent =
``    `Score: ${score} / ${total}`;
  document.getElementById("percentageText").textContent =
    `Percentage: ${percentage}%`;
  document.getElementById("performanceText").textContent = message;
  document.getElementById("correction").textContent = correction;
}

// ======================================================
// START APPLICATION
// ======================================================
renderQuestion();
