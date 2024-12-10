// Hämta referenser till de olika DOM-elementen i HTML-dokumentet
const setupDiv = document.getElementById('setup');
const quizDiv = document.getElementById('quiz');
const resultDiv = document.getElementById('result');
const questionText = document.getElementById('question-text');
const answersDiv = document.getElementById('answers');
const nextButton = document.getElementById('next-button');
const resultText = document.getElementById('result-text');
const restartButton = document.getElementById('restart-button');
const quizSetupForm = document.getElementById('quiz-setup-form');
const categorySelect = document.getElementById('category'); // Referens till kategori-dropdown

// Globala variabler
let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Hämta alla kategorier från API:t
async function fetchCategories() {
  const url = 'https://opentdb.com/api_category.php';
  const response = await fetch(url);
  const data = await response.json();
  return data.trivia_categories;
}

// Fyller kategori-dropdown
async function populateCategories() {
  const categories = await fetchCategories();
  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option); // Lägg till kategori som ett alternativ
  });
}

// Hämta frågor från API:t
async function fetchQuestions(numQuestions, category, difficulty) {
  const url = `https://opentdb.com/api.php?amount=${numQuestions}&category=${category}&difficulty=${difficulty}&type=multiple`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
}

// När användaren skickar in quizinställningarna
quizSetupForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Hämta användarens val
  const numQuestions = document.getElementById('num-questions').value;
  const category = categorySelect.value; // Använd till kategori-dropdown
  const difficulty = document.getElementById('difficulty').value;

  // Hämta frågor från API:t
  questions = await fetchQuestions(numQuestions, category, difficulty);
  currentQuestionIndex = 0;
  score = 0;

  setupDiv.classList.add('hidden');
  quizDiv.classList.remove('hidden');
  showQuestion();
});

// Visa den aktuella frågan
function showQuestion() {
  const question = questions[currentQuestionIndex];
  questionText.innerHTML = question.question;

  // Blanda svarsalternativen
  const answers = [...question.incorrect_answers];
  const correctAnswer = question.correct_answer;
  const randomIndex = Math.floor(Math.random() * (answers.length + 1));
  answers.splice(randomIndex, 0, correctAnswer);

  answersDiv.innerHTML = '';
  answers.forEach((answer) => {
    const button = document.createElement('button');
    button.innerHTML = answer;
    button.addEventListener('click', () => handleAnswerSelection(answer === correctAnswer));
    answersDiv.appendChild(button);
  });
}

// Hanterar när användaren väljer ett svar
function handleAnswerSelection(isCorrect) {
  if (isCorrect) {
    score++;
  }

  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

// Visar resultatet av quizet
function showResult() {
  quizDiv.classList.add('hidden');
  resultDiv.classList.remove('hidden');
  resultText.textContent = `You answered correctly on ${score} out of ${questions.length} questions!`;
}

// Starta om quizet
restartButton.addEventListener('click', () => {
  resultDiv.classList.add('hidden');
  setupDiv.classList.remove('hidden');
});

// Initiera kategori-dropdown vid sidladdning
document.addEventListener('DOMContentLoaded', populateCategories);
