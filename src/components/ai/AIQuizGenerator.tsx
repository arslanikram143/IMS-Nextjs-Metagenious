"use client";

import { useState } from "react";
import { Brain, Loader2, FileText, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-toastify";

interface Question {
  id: string;
  text: string;
  type: "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER" | "ESSAY";
  options?: string[];
  correctAnswer?: string;
  marks: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

interface AIQuizGeneratorProps {
  subjectId?: string;
  topic?: string;
  onQuestionsGenerated?: (questions: Question[]) => void;
}

const AIQuizGenerator: React.FC<AIQuizGeneratorProps> = ({
  subjectId,
  topic,
  onQuestionsGenerated,
}) => {
  const [loading, setLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [inputText, setInputText] = useState("");
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");

  const generateQuiz = async () => {
    if (!inputText.trim() && !topic) {
      toast.error("Please provide syllabus text or a topic");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call to AI service
      // In production, this would call your backend which calls OpenAI/Gemini
      const response = await fetch("/api/ai/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText || topic,
          questionCount,
          difficulty,
          subjectId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedQuestions(data.questions);
        if (onQuestionsGenerated) {
          onQuestionsGenerated(data.questions);
        }
        toast.success(`Generated ${data.questions.length} questions successfully!`);
      } else {
        toast.error(data.error || "Failed to generate quiz");
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast.error("Failed to generate quiz. Please try again.");
      
      // Mock data for demonstration
      const mockQuestions: Question[] = [
        {
          id: "1",
          text: "What is the capital of France?",
          type: "MCQ",
          options: ["London", "Berlin", "Paris", "Madrid"],
          correctAnswer: "Paris",
          marks: 1,
          difficulty: "EASY",
        },
        {
          id: "2",
          text: "The Earth revolves around the Sun.",
          type: "TRUE_FALSE",
          correctAnswer: "True",
          marks: 1,
          difficulty: "EASY",
        },
        {
          id: "3",
          text: "Explain Newton's First Law of Motion.",
          type: "ESSAY",
          marks: 5,
          difficulty: "MEDIUM",
        },
        {
          id: "4",
          text: "What is photosynthesis?",
          type: "SHORT_ANSWER",
          correctAnswer: "The process by which plants convert light energy into chemical energy",
          marks: 2,
          difficulty: "MEDIUM",
        },
        {
          id: "5",
          text: "Which of the following is NOT a programming paradigm?",
          type: "MCQ",
          options: ["Object-Oriented", "Functional", "Procedural", "Photosynthesis"],
          correctAnswer: "Photosynthesis",
          marks: 1,
          difficulty: "HARD",
        },
      ];
      
      setTimeout(() => {
        setGeneratedQuestions(mockQuestions);
        if (onQuestionsGenerated) {
          onQuestionsGenerated(mockQuestions);
        }
        toast.success("Demo: Generated 5 sample questions");
        setLoading(false);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionEdit = (id: string, field: keyof Question, value: any) => {
    setGeneratedQuestions(prev =>
      prev.map(q =>
        q.id === id ? { ...q, [field]: value } : q
      )
    );
  };

  const handleSaveQuiz = async () => {
    if (generatedQuestions.length === 0) {
      toast.error("No questions to save");
      return;
    }

    try {
      const response = await fetch("/api/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `AI Generated Quiz - ${new Date().toLocaleDateString()}`,
          questions: generatedQuestions,
          subjectId,
          difficulty,
        }),
      });

      if (response.ok) {
        toast.success("Quiz saved successfully!");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to save quiz");
      }
    } catch (error) {
      console.error("Error saving quiz:", error);
      toast.error("Failed to save quiz");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
          <Brain className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">AI Quiz Generator</h2>
          <p className="text-gray-600">
            Generate quiz questions automatically from syllabus text
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Input Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Syllabus Text or Topic
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your syllabus text, lesson content, or enter a topic..."
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
            disabled={loading}
          />
          {topic && (
            <p className="mt-2 text-sm text-gray-500">
              Topic: <span className="font-medium">{topic}</span>
            </p>
          )}
        </div>

        {/* Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions
            </label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              disabled={loading}
            >
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
              <option value={15}>15 Questions</option>
              <option value={20}>20 Questions</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              disabled={loading}
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={generateQuiz}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-2.5 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Generate Quiz
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Questions */}
        {generatedQuestions.length > 0 && (
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Generated Questions ({generatedQuestions.length})
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setGeneratedQuestions([])}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Clear All
                </button>
                <button
                  onClick={handleSaveQuiz}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Save Quiz
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {generatedQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-purple-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {question.text}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                            {question.type}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                            {question.difficulty}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
                            {question.marks} marks
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const newQuestions = generatedQuestions.filter(
                          (q) => q.id !== question.id
                        );
                        setGeneratedQuestions(newQuestions);
                      }}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  {question.type === "MCQ" && question.options && (
                    <div className="ml-11 space-y-2">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-3">
                          <input
                            type="radio"
                            name={`correct-${question.id}`}
                            checked={option === question.correctAnswer}
                            onChange={() =>
                              handleQuestionEdit(
                                question.id,
                                "correctAnswer",
                                option
                              )
                            }
                            className="w-4 h-4 text-purple-600"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...question.options!];
                              newOptions[optIndex] = e.target.value;
                              handleQuestionEdit(
                                question.id,
                                "options",
                                newOptions
                              );
                            }}
                            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {question.type === "TRUE_FALSE" && (
                    <div className="ml-11 flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`tf-${question.id}`}
                          checked={question.correctAnswer === "True"}
                          onChange={() =>
                            handleQuestionEdit(
                              question.id,
                              "correctAnswer",
                              "True"
                            )
                          }
                          className="w-4 h-4 text-purple-600"
                        />
                        <span className="text-sm">True</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`tf-${question.id}`}
                          checked={question.correctAnswer === "False"}
                          onChange={() =>
                            handleQuestionEdit(
                              question.id,
                              "correctAnswer",
                              "False"
                            )
                          }
                        />
                        <span className="text-sm">False</span>
                      </label>
                    </div>
                  )}

                  {(question.type === "SHORT_ANSWER" || question.type === "ESSAY") && (
                    <div className="ml-11">
                      <textarea
                        value={question.correctAnswer || ""}
                        onChange={(e) =>
                          handleQuestionEdit(
                            question.id,
                            "correctAnswer",
                            e.target.value
                          )
                        }
                        placeholder="Enter expected answer or leave blank for open-ended questions..."
                        className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm resize-none"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-900">
                    AI-generated questions ready for review
                  </p>
                  <p className="text-sm text-purple-700 mt-1">
                    Review and edit questions as needed before saving. The AI
                    has generated questions based on Bloom's Taxonomy aligned
                    with your difficulty level.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="border-t pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {generatedQuestions.length}
              </div>
              <div className="text-sm text-gray-600">Questions Generated</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {generatedQuestions.reduce((sum, q) => sum + q.marks, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Marks</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(
                  (generatedQuestions.filter((q) => q.difficulty === "HARD")
                    .length /
                    generatedQuestions.length) *
                    100
                ) || 0}
                %
              </div>
              <div className="text-sm text-gray-600">Hard Questions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIQuizGenerator;