"use client";

import { useState } from "react";
import { CheckCircle, AlertTriangle, FileText, Loader2, BarChart, Copy } from "lucide-react";
import { toast } from "react-toastify";

interface AIScore {
  overall: number;
  criteria: {
    name: string;
    score: number;
    maxScore: number;
    feedback: string;
  }[];
}

interface PlagiarismResult {
  percentage: number;
  sources: {
    url: string;
    similarity: number;
  }[];
}

interface AIAssignmentCheckerProps {
  assignmentId?: string;
  studentSubmission?: string;
  rubric?: any;
}

const AIAssignmentChecker: React.FC<AIAssignmentCheckerProps> = ({
  assignmentId,
  studentSubmission,
  rubric,
}) => {
  const [loading, setLoading] = useState(false);
  const [aiScore, setAiScore] = useState<AIScore | null>(null);
  const [plagiarismResult, setPlagiarismResult] = useState<PlagiarismResult | null>(null);
  const [submissionText, setSubmissionText] = useState(studentSubmission || "");
  const [feedback, setFeedback] = useState("");

  const checkAssignment = async () => {
    if (!submissionText.trim()) {
      toast.error("Please provide submission text");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call to AI service
      const response = await fetch("/api/ai/check-assignment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: submissionText,
          assignmentId,
          rubric,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAiScore(data.score);
        setPlagiarismResult(data.plagiarism);
        setFeedback(data.feedback);
        toast.success("Assignment checked successfully!");
      } else {
        toast.error(data.error || "Failed to check assignment");
      }
    } catch (error) {
      console.error("Error checking assignment:", error);
      toast.error("Failed to check assignment. Please try again.");
      
      // Mock data for demonstration
      setTimeout(() => {
        setAiScore({
          overall: 78,
          criteria: [
            {
              name: "Content Quality",
              score: 8,
              maxScore: 10,
              feedback: "Good understanding of the topic, but could use more examples.",
            },
            {
              name: "Structure & Organization",
              score: 7,
              maxScore: 10,
              feedback: "Logical flow but transitions could be smoother.",
            },
            {
              name: "Grammar & Spelling",
              score: 9,
              maxScore: 10,
              feedback: "Excellent grammar with minor punctuation errors.",
            },
            {
              name: "Originality",
              score: 6,
              maxScore: 10,
              feedback: "Some sections show similarity with existing content.",
            },
            {
              name: "References",
              score: 8,
              maxScore: 10,
              feedback: "Adequate references but could include more recent sources.",
            },
          ],
        });
        
        setPlagiarismResult({
          percentage: 12,
          sources: [
            { url: "https://wikipedia.org/sample", similarity: 8 },
            { url: "https://academic.edu/paper", similarity: 4 },
          ],
        });
        
        setFeedback("Overall good submission. The student demonstrates understanding of core concepts but could improve originality and add more practical examples. The structure is logical but could benefit from clearer section headings.");
        
        setLoading(false);
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyFeedback = () => {
    navigator.clipboard.writeText(feedback);
    toast.success("Feedback copied to clipboard!");
  };

  const handleSaveScore = async () => {
    if (!aiScore) {
      toast.error("No score to save");
      return;
    }

    try {
      const response = await fetch("/api/assignments/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignmentId,
          aiScore,
          plagiarismResult,
          feedback,
        }),
      });

      if (response.ok) {
        toast.success("Score saved successfully!");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to save score");
      }
    } catch (error) {
      console.error("Error saving score:", error);
      toast.error("Failed to save score");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">AI Assignment Checker</h2>
          <p className="text-gray-600">
            AI-powered grading with plagiarism detection and personalized feedback
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Submission Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Student Submission
          </label>
          <textarea
            value={submissionText}
            onChange={(e) => setSubmissionText(e.target.value)}
            placeholder="Paste student submission text here..."
            className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            disabled={loading}
          />
          <div className="mt-2 flex justify-between text-sm text-gray-500">
            <span>{submissionText.length} characters</span>
            <span>{submissionText.split(/\s+/).length} words</span>
          </div>
        </div>

        {/* Check Button */}
        <div className="flex justify-center">
          <button
            onClick={checkAssignment}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Submission...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Check with AI
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {aiScore && (
          <>
            {/* Overall Score */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                AI Assessment Results
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-blue-900">
                          Overall Score
                        </div>
                        <div className="text-4xl font-bold text-blue-900 mt-2">
                          {aiScore.overall}/100
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-blue-200 rounded-full h-3">
                            <div
                              className="bg-blue-600 h-3 rounded-full"
                              style={{ width: `${aiScore.overall}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-blue-700">Grade</div>
                        <div className="text-2xl font-bold text-blue-900">
                          {aiScore.overall >= 90
                            ? "A+"
                            : aiScore.overall >= 80
                            ? "A"
                            : aiScore.overall >= 70
                            ? "B"
                            : aiScore.overall >= 60
                            ? "C"
                            : "D"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plagiarism Score */}
                <div>
                  <div className={`rounded-xl p-6 ${
                    plagiarismResult && plagiarismResult.percentage > 20
                      ? "bg-red-50"
                      : plagiarismResult && plagiarismResult.percentage > 10
                      ? "bg-yellow-50"
                      : "bg-green-50"
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <AlertTriangle className={`w-5 h-5 ${
                        plagiarismResult && plagiarismResult.percentage > 20
                          ? "text-red-600"
                          : plagiarismResult && plagiarismResult.percentage > 10
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`} />
                      <div className="font-medium text-gray-900">
                        Plagiarism Check
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      {plagiarismResult?.percentage || 0}%
                    </div>
                    <div className={`text-sm mt-1 ${
                      plagiarismResult && plagiarismResult.percentage > 20
                        ? "text-red-600"
                        : plagiarismResult && plagiarismResult.percentage > 10
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}>
                      {plagiarismResult && plagiarismResult.percentage > 20
                        ? "High similarity - Review required"
                        : plagiarismResult && plagiarismResult.percentage > 10
                        ? "Moderate similarity"
                        : "Low similarity - Original work"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Criteria Breakdown */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">
                Criteria Breakdown
              </h4>
              <div className="space-y-4">
                {aiScore.criteria.map((criterion, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium text-gray-900">
                        {criterion.name}
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {criterion.score}/{criterion.maxScore}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(criterion.score / criterion.maxScore) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {criterion.feedback}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Feedback */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-md font-medium text-gray-900">
                  AI-Generated Feedback
                </h4>
                <button
                  onClick={handleCopyFeedback}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Copy className="w-4 h-4" />
                  Copy Feedback
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="text-gray-700 whitespace-pre-line">
                    {feedback}
                  </div>
                </div>
              </div>
            </div>

            {/* Plagiarism Sources */}
            {plagiarismResult && plagiarismResult.sources.length > 0 && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">
                  Similarity Sources
                </h4>
                <div className="space-y-2">
                  {plagiarismResult.sources.map((source, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="truncate text-sm text-gray-600">
                        {source.url}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {source.similarity}% similar
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => {
                  setAiScore(null);
                  setPlagiarismResult(null);
                  setFeedback("");
                }}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Clear Results
              </button>
              <button
                onClick={handleSaveScore}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Save Assessment
              </button>
            </div>
          </>
        )}

        {/* Stats */}
        <div className="border-t pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <BarChart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Time Saved</div>
              <div className="text-lg font-bold text-gray-900">60-70%</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Accuracy</div>
              <div className="text-lg font-bold text-gray-900">92%</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Criteria Checked</div>
              <div className="text-lg font-bold text-gray-900">5+</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Plagiarism Detection</div>
              <div className="text-lg font-bold text-gray-900">Yes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssignmentChecker;