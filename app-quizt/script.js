// lấy id

function $(id) {
  return document.getElementById(id);
}
// hiện thị quiz ra màn hình và xử lý trắc nghiệm của quiz
function quizScreen() {
  let startButton = $("start-button");
  let submitButton = $("submit-button");
  let playAgainButton = $("play-again-button");
  let mainScreen = $("main-screen");
  let quizScreen = $("quiz-screen");
  let resultScreen = $("result-screen");
  let questionElement = $("question");
  let answersElement = $("answers");
  let resultElement = $("result");
  let timeElement = $("time");
  let passMessageElement = $("pass-message");
  let failMessageElement = $("fail-message");

  let currentQuestionIndex = 0;
  let correctAnswers = 0;
  let startTime, endTime;
  let questions = [];
// nhấp vào nút start để vào quiz sử dụng fetch để gọi api lấy câu hỏi
// Xử lý dữ liệu nhận được từ API và lưu trữ các câu hỏi và đáp án
// ẩn màn hình chính và hiện thị màn hình quiz
  function startQuiz() {
    fetch("https://opentdb.com/api.php?amount=5")
      .then(response => response.json())
      .then(data => {
        questions = data.results.map(result => {
          let question = {
            question: result.question,
            answers: result.incorrect_answers.concat(result.correct_answer),
            correctAnswer: result.correct_answer
          };
          return question;
        });
        mainScreen.style.display = "none";
        quizScreen.style.display = "block";
        loadQuestion(currentQuestionIndex);
        startTime = new Date();
      })
      .catch(error => {
        console.log("Error fetching questions from API:", error);
      });
  }
// Hiển thị câu hỏi và các tùy chọn câu trả lời trên giao diện
// Sử dụng DOM manipulation để tạo các phần tử HTML cho mỗi tùy chọn câu trả lời
  function loadQuestion(index) {
    let question = questions[index];
    questionElement.textContent = question.question;

    answersElement.innerHTML = "";
    let questionCountElement = $("question-count");
    questionCountElement.textContent = "Question " + (index + 1) + " of " + questions.length;
    for (let i = 0; i < question.answers.length; i++) {
      let li = document.createElement("li");
      let label = document.createElement("label");
      let input = document.createElement("input");
      input.type = "radio";
      input.name = "answer";
      input.value = i;
      input.addEventListener("change", function () {
        this.parentElement.classList.toggle("selected");
      });
      label.appendChild(input);
      label.appendChild(document.createTextNode(question.answers[i]));
      li.appendChild(label);
      answersElement.appendChild(li);
    }
  }
// Kiểm tra xem người dùng đã chọn câu trả lời hay chưa và so sánh với câu trả lời đúng
// correctAnswer nếu trả lời đúng và đánh câu trả lời đã chọn là đúng hoặc sai trên giao diện
  function submitAnswer() {
    let selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (selectedAnswer) {
      let answerIndex = parseInt(selectedAnswer.value);
      let selectedAnswerText = questions[currentQuestionIndex].answers[answerIndex];
      let correctAnswerText = questions[currentQuestionIndex].correctAnswer;
      if (selectedAnswerText === correctAnswerText) {
        correctAnswers++;
        selectedAnswer.parentElement.classList.add("correct");
      } else {
        selectedAnswer.parentElement.classList.add("selected");
      }
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        loadQuestion(currentQuestionIndex);
      } else {
        endQuiz();
      }
    }
  }
// được gọi khi kết thúc bài quiz
// tính thời gian làm bài và hiện thị số câu hỏi và hình ảnh đúng or sai 
// ẩn màn hình quiz và hiển thị màn hình kết quả
  function endQuiz() {
    endTime = new Date();
    let passImage = $("pass-image");
    let failImage = $("fail-image");
    let totalTime = endTime - startTime;
    let seconds = Math.floor(totalTime / 1000);
    resultElement.textContent =
      "You answered " +
      correctAnswers +
      " out of " +
      questions.length +
      " questions correctly.";
    timeElement.textContent = "Total time: " + formatTime(seconds);

    if (correctAnswers >= Math.floor(questions.length / 2)) {
      passMessageElement.textContent = "Congratulations!.";
      failMessageElement.textContent = "";
      passImage.style.display = "block";
      failImage.style.display = "none";
    } else {
      passMessageElement.textContent = "";
      passImage.style.display = "none";
      failImage.style.display = "block";
      failMessageElement.textContent = "You failed the quiz!.";
    }

    quizScreen.style.display = "none";
    resultScreen.style.display = "block";
  }
// khi nhấp vào nút playagain sẽ reset các biến và mảng để bắt đầu quiz mới ẩn màn hình và hiện màn hình Home
  function playAgain() {
    currentQuestionIndex = 0;
    correctAnswers = 0;
    questions = [];
    resultScreen.style.display = "none";
    mainScreen.style.display = "block";
  }
// thời gian làm quiz (phút giây )
  function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
    return minutes + "m " + remainingSeconds + "s";
  }

  startButton.addEventListener("click", startQuiz);
  submitButton.addEventListener("click", submitAnswer);
  playAgainButton.addEventListener("click", playAgain);
}

window.addEventListener("load", function () {
  quizScreen();
});
