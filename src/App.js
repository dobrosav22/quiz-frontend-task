import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuizzesOverviewPage from './components/quizzes-overview/quizzes-overview';
import SolveQuizPage from 'components/solve-quiz/solve-quiz';
import QuizFormPage from 'components/quiz-form/quiz-form';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<QuizzesOverviewPage/>} />
          <Route path="/solve-quiz/:id" element={<SolveQuizPage/>} />
          <Route path="/quiz-form/:id" element={<QuizFormPage/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
