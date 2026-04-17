"use client";

import { useState } from "react";
import { Upload, FileText, Calendar, Clock, CheckCircle, AlertCircle, Download, Eye, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  totalMarks: number;
  status: "pending" | "submitted" | "graded" | "late";
  submittedAt?: string;
  marks?: number;
  feedback?: string;
  fileUrl?: string;
}

interface AssignmentPortalProps {
  studentId?: string;
  courseId?: string;
  assignments?: Assignment[];
}

const AssignmentPortal: React.FC<AssignmentPortalProps> = ({
  studentId,
  courseId,
  assignments: initialAssignments = [],
}) => {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [uploading, setUploading] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  const handleFileUpload = async (file: File, assignmentId: string) => {
    if (!file) return;

    setUploading(true);
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));

      const fileUrl = URL.createObjectURL(file);
      
      setAssignments(assignments.map(assignment => 
        assignment.id === assignmentId 
          ? { 
              ...assignment, 
              status: "submitted",
              submittedAt: new Date().toISOString(),
              fileUrl 
            }
          : assignment
      ));
      
      toast.success("Assignment submitted successfully!");
      setShowSubmissionForm(false);
    } catch (error) {
      toast.error("Failed to submit assignment");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteSubmission = (assignmentId: string) => {
    if (confirm("Are you sure you want to delete this submission?")) {
      setAssignments(assignments.map(assignment => 
        assignment.id === assignmentId 
          ? { 
              ...assignment, 
              status: "pending",
              submittedAt: undefined,
              fileUrl: undefined,
              marks: undefined,
              feedback: undefined
            }
          : assignment
      ));
      toast.success("Submission deleted");
    }
  };

  const getStatusColor = (status: Assignment["status"]) => {
    switch (status) {
      case "submitted": return "bg-blue-100 text-blue-600";
      case "graded": return "bg-green-100 text-green-600";
      case "late": return "bg-red-100 text-red-600";
      default: return "bg-yellow-100 text-yellow-600";
    }
  };

  const getStatusIcon = (status: Assignment["status"]) => {
    switch (status) {
      case "submitted": return <Clock className="w-4 h-4" />;
      case "graded": return <CheckCircle className="w-4 h-4" />;
      case "late": return <AlertCircle className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTimeLeft = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffMs = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`;
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    return `Due in ${diffDays} days`;
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Assignment Portal</h2>
          <p className="text-gray-600">Submit and track your assignments</p>
        </div>
        <div className="text-sm text-gray-600">
          {assignments.filter(a => a.status === "graded").length} graded •{" "}
          {assignments.filter(a => a.status === "pending").length} pending
        </div>
      </div>

      {/* Assignment List */}
      <div className="space-y-4">
        {assignments.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
            <FileText className="w-16 h-16 text-gray1-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No assignments</h3>
            <p className="text-gray-600 mt-1">You don't have any assignments at the moment</p>
          </div>
        ) : (
          assignments.map((assignment) => {
            const isDue = isOverdue(assignment.dueDate);
            const timeLeft = formatTimeLeft(assignment.dueDate);
            
            return (
              <div
                key={assignment.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg ${getStatusColor(assignment.status)} flex items-center justify-center`}>
                        {getStatusIcon(assignment.status)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(assignment.status)}`}>
                            {assignment.status.toUpperCase()}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                            {assignment.totalMarks} marks
                          </span>
                          {assignment.marks !== undefined && (
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
                              Scored: {assignment.marks}/{assignment.totalMarks}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {assignment.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {formatDate(assignment.dueDate)}</span>
                      </div>
                      <div className={`flex items-center gap-1 ${isDue ? "text-red-600" : "text-gray-600"}`}>
                        <Clock className="w-4 h-4" />
                        <span>{timeLeft}</span>
                      </div>
                      {assignment.submittedAt && (
                        <div className="flex items-center gap-1 text-blue-600">
                          <Clock className="w-4 h-4" />
                          <span>Submitted: {formatDate(assignment.submittedAt)}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Feedback Section */}
                    {assignment.feedback && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          Teacher Feedback
                        </div>
                        <div className="text-sm text-gray-700">
                          {assignment.feedback}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {assignment.fileUrl && (
                      <>
                        <button
                          onClick={() => window.open(assignment.fileUrl, "_blank")}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                          title="View Submission"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => window.open(assignment.fileUrl, "_blank")}
                          className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {assignment.status === "pending" && (
                      <button
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setShowSubmissionForm(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Submit
                      </button>
                    )}
                    {(assignment.status === "submitted" || assignment.status === "graded") && (
                      <button
                        onClick={() => handleDeleteSubmission(assignment.id)}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                        title="Delete Submission"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Submission Form Modal */}
      {showSubmissionForm && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                Submit Assignment: {selectedAssignment.title}
              </h2>
              <p className="text-gray-600 mt-1">
                Due: {formatDate(selectedAssignment.dueDate)} • {formatTimeLeft(selectedAssignment.dueDate)}
              </p>
            </div>
            <div className="p-6">
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Submission Guidelines</h4>
                    <ul className="mt-2 text-sm text-blue-700 space-y-1">
                      <li>• File size limit: 50MB</li>
                      <li>• Accepted formats: PDF, DOC, DOCX, PPT, ZIP</li>
                      <li>• Name your file: StudentID_AssignmentName</li>
                      <li>• Late submissions will be marked accordingly</li>
                      <li>• You can resubmit before the deadline</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload File *
                  </label>
                  <label className="block cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, selectedAssignment.id);
                      }}
                      disabled={uploading}
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                      {uploading ? (
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
                          <div className="text-lg font-medium text-gray-900">Uploading...</div>
                          <div className="text-sm text-gray-600 mt-1">Please wait</div>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <div className="text-lg font-medium text-gray-900">
                            Click to upload or drag and drop
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            PDF, DOC, DOCX, PPT, ZIP up to 50MB
                          </div>
                        </>
                      )}
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Add any notes about your submission..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSubmissionForm(false);
                      setSelectedAssignment(null);
                    }}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Handle text-only submission
                      toast.info("Please upload a file to submit");
                    }}
                    className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    disabled={uploading}
                  >
                    Submit as Text
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 pt-6 border-t">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {assignments.length}
            </div>
            <div className="text-sm text-gray-600">Total Assignments</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {assignments.filter(a => a.status === "graded").length}
            </div>
            <div className="text-sm text-gray-600">Graded</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {assignments.filter(a => a.status === "pending").length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {assignments.filter(a => isOverdue(a.dueDate)).length}
            </div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentPortal;