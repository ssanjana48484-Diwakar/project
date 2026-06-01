import { useEffect, useState } from 'react';
import { quizQuestions } from './quizData.js';

const platformLabels = [
  { id: 'web', label: 'Web' },
  { id: 'desktop', label: 'Desktop' },
  { id: 'mobile', label: 'Mobile' }
];

function getPlatformDescription(platform) {
  switch (platform) {
    case 'desktop':
      return 'Optimized for desktop systems with keyboard and large screen layout.';
    case 'mobile':
      return 'Optimized for mobile devices with touch-friendly buttons and responsive layout.';
    default:
      return 'Optimized for modern web browsers across desktop and mobile devices.';
  }
}

function App() {
  const [quiz, setQuiz] = useState(null);
  const [started, setStarted] = useState(false);
  const [platform, setPlatform] = useState('web');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answerResult, setAnswerResult] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (answerResult === 'correct') {
      setShowConfetti(true);
      const timer = window.setTimeout(() => {
        setShowConfetti(false);
      }, 1500);

      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [answerResult]);

  const loadQuiz = () => {
    setQuiz(quizQuestions);
    setStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedOption('');
    setScore(0);
    setFinished(false);
    setShowFeedback(false);
    setAnswerResult(null);
    setShowConfetti(false);
  };

  const currentQuestion = quiz?.[currentQuestionIndex];

  const submitAnswer = () => {
    if (!selectedOption || !currentQuestion || showFeedback) {
      return;
    }

    const isCorrect = selectedOption === currentQuestion.answer;

    if (isCorrect) {
      setScore((value) => value + 1);
    }

    setAnswerResult(isCorrect ? 'correct' : 'wrong');
    setShowFeedback(true);
  };

  const continueQuiz = () => {
    const nextIndex = currentQuestionIndex + 1;
    const isLastQuestion = nextIndex >= quiz.length;

    if (isLastQuestion) {
      setFinished(true);
    } else {
      setCurrentQuestionIndex(nextIndex);
      setSelectedOption('');
      setShowFeedback(false);
      setAnswerResult(null);
    }
  };

  const restartQuiz = () => {
    setStarted(false);
    setQuiz(null);
    setSelectedOption('');
    setCurrentQuestionIndex(0);
    setScore(0);
    setFinished(false);
    setShowFeedback(false);
    setAnswerResult(null);
  };

  return (
    <div className="app-shell">
      <header>
        <h1>Quiz App</h1>
        <p>Load the quiz and answer questions one by one.</p>
      </header>

      {!started ? (
        <section className="start-panel">
          <div className="platform-picker">
            <label htmlFor="platform">Choose platform</label>
            <select
              id="platform"
              value={platform}
              onChange={(event) => setPlatform(event.target.value)}
            >
              {platformLabels.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <p className="platform-description">{getPlatformDescription(platform)}</p>
          </div>

          <button className="primary-button" onClick={loadQuiz}>
            Start Quiz for {platformLabels.find((item) => item.id === platform)?.label}
          </button>
        </section>
      ) : (
        <section className="quiz-panel">
          <div className="quiz-header">
            <div>
              <h2>{finished ? 'Quiz Complete' : 'Question'} </h2>
              {!finished && (
                <p className="progress-text">
                  Question {currentQuestionIndex + 1} of {quiz.length}
                </p>
              )}
            </div>
            <div className="platform-badge">
              {platformLabels.find((item) => item.id === platform)?.label}
            </div>
          </div>

          <p className="platform-description">{getPlatformDescription(platform)}</p>

          {showConfetti && (
            <div className="confetti-container">
              {Array.from({ length: 20 }).map((_, index) => {
                const left = 10 + Math.random() * 80;
                const delay = Math.random() * 0.5;
                const rotation = Math.floor(Math.random() * 320);
                const colors = ['#22c55e', '#fb7185', '#facc15', '#38bdf8', '#f97316'];
                const color = colors[index % colors.length];
                return (
                  <span
                    key={index}
                    className="confetti-piece"
                    style={{
                      left: `${left}%`,
                      background: color,
                      transform: `rotate(${rotation}deg)`,
                      animationDelay: `${delay}s`
                    }}
                  />
                );
              })}
            </div>
          )}

          {finished ? (
            <div className="summary-card">
              <p className="summary-title">Quiz Complete</p>
              <p className="summary-text">
                You answered <strong>{score}</strong> out of <strong>{quiz.length}</strong> questions correctly.
              </p>
              <p className="summary-text">
                Final score: <strong>{Math.round((score / quiz.length) * 100)}%</strong>
              </p>
              <button className="primary-button" onClick={restartQuiz}>
                Restart Quiz
              </button>
            </div>
          ) : (
            <>
              <div className="question-card">
                <p className="question-text">{currentQuestion.question}</p>
              </div>

              <div className="options-grid">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`option-button ${selectedOption === option ? 'selected' : ''} ${
                      showFeedback && option === currentQuestion.answer ? 'correct-answer' : ''
                    } ${showFeedback && selectedOption === option && selectedOption !== currentQuestion.answer ? 'wrong-answer' : ''}`}
                    onClick={() => !showFeedback && setSelectedOption(option)}
                    disabled={showFeedback}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {showFeedback && (
                <div className={`feedback-message ${answerResult}`}>
                  {answerResult === 'correct' ? (
                    <>
                      <strong>Correct!</strong> Nice job.
                    </>
                  ) : (
                    <>
                      <strong>Wrong.</strong> The correct answer is {currentQuestion.answer}.
                    </>
                  )}
                </div>
              )}

              {!showFeedback ? (
                <button
                  className="primary-button"
                  onClick={submitAnswer}
                  disabled={!selectedOption}
                >
                  {currentQuestionIndex === quiz.length - 1 ? 'Submit and Finish' : 'Submit Answer'}
                </button>
              ) : (
                <button className="primary-button" onClick={continueQuiz}>
                  {currentQuestionIndex === quiz.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </button>
              )}
            </>
          )}
        </section>
      )}
    </div>
  );
}

export default App;
