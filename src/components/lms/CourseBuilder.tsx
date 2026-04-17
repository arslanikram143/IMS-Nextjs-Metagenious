"use client";

import { useState } from "react";
import { Plus, Video, FileText, Link, Trash2, Edit, Eye, MoveVertical, Upload, Save } from "lucide-react";
import { toast } from "react-toastify";

interface Lesson {
  id: string;
  title: string;
  type: "video" | "pdf" | "slide" | "text" | "link" | "quiz";
  contentUrl?: string;
  description?: string;
  durationMin?: number;
  order: number;
}

interface CourseBuilderProps {
  courseId?: string;
  initialLessons?: Lesson[];
  onSave?: (lessons: Lesson[]) => void;
}

const CourseBuilder: React.FC<CourseBuilderProps> = ({
  courseId,
  initialLessons = [],
  onSave,
}) => {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const lessonTypes = [
    { value: "video", label: "Video", icon: Video, color: "bg-red-100 text-red-600" },
    { value: "pdf", label: "PDF", icon: FileText, color: "bg-blue-100 text-blue-600" },
    { value: "slide", label: "Slides", icon: FileText, color: "bg-green-100 text-green-600" },
    { value: "text", label: "Text", icon: FileText, color: "bg-yellow-100 text-yellow-600" },
    { value: "link", label: "Link", icon: Link, color: "bg-purple-100 text-purple-600" },
    { value: "quiz", label: "Quiz", icon: FileText, color: "bg-pink-100 text-pink-600" },
  ];

  const handleAddLesson = () => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: "",
      type: "video",
      description: "",
      order: lessons.length + 1,
    };
    setEditingLesson(newLesson);
    setShowLessonForm(true);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setShowLessonForm(true);
  };

  const handleDeleteLesson = (id: string) => {
    if (confirm("Are you sure you want to delete this lesson?")) {
      setLessons(lessons.filter(lesson => lesson.id !== id));
      toast.success("Lesson deleted");
    }
  };

  const handleSaveLesson = (lessonData: Partial<Lesson>) => {
    if (editingLesson) {
      const updatedLesson = { ...editingLesson, ...lessonData };
      
      if (editingLesson.id.startsWith("temp-")) {
        // New lesson
        setLessons([...lessons, { ...updatedLesson, id: `lesson-${Date.now()}` }]);
      } else {
        // Update existing lesson
        setLessons(lessons.map(l => l.id === editingLesson.id ? updatedLesson : l));
      }
      
      setShowLessonForm(false);
      setEditingLesson(null);
      toast.success("Lesson saved successfully");
    }
  };

  const handleReorder = (dragIndex: number, hoverIndex: number) => {
    const newLessons = [...lessons];
    const draggedLesson = newLessons[dragIndex];
    
    newLessons.splice(dragIndex, 1);
    newLessons.splice(hoverIndex, 0, draggedLesson);
    
    // Update order numbers
    const reorderedLessons = newLessons.map((lesson, index) => ({
      ...lesson,
      order: index + 1,
    }));
    
    setLessons(reorderedLessons);
  };

  const handleUpload = async (file: File, lessonId: string) => {
    setUploading(true);
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const fileUrl = URL.createObjectURL(file);
      setLessons(lessons.map(lesson => 
        lesson.id === lessonId 
          ? { ...lesson, contentUrl: fileUrl }
          : lesson
      ));
      
      toast.success("File uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveCourse = () => {
    if (onSave) {
      onSave(lessons);
    }
    toast.success("Course saved successfully");
  };

  const getLessonIcon = (type: string) => {
    const lessonType = lessonTypes.find(t => t.value === type);
    return lessonType || lessonTypes[0];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Course Builder</h2>
          <p className="text-gray-600">Create and organize your course lessons</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSaveCourse}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700"
          >
            <Save className="w-5 h-5" />
            Save Course
          </button>
          <button
            onClick={handleAddLesson}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Add Lesson
          </button>
        </div>
      </div>

      {/* Lesson List */}
      <div className="space-y-4 mb-8">
        {lessons.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No lessons yet</h3>
            <p className="text-gray-600 mt-1">Add your first lesson to start building your course</p>
            <button
              onClick={handleAddLesson}
              className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Add Lesson
            </button>
          </div>
        ) : (
          lessons
            .sort((a, b) => a.order - b.order)
            .map((lesson, index) => {
              const lessonType = getLessonIcon(lesson.type);
              const Icon = lessonType.icon;
              
              return (
                <div
                  key={lesson.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex flex-col items-center">
                        <button
                          className="text-gray-400 hover:text-gray-600 cursor-move"
                          title="Drag to reorder"
                        >
                          <MoveVertical className="w-5 h-5" />
                        </button>
                        <div className="text-sm font-medium text-gray-900 mt-1">
                          {lesson.order}
                        </div>
                      </div>
                      
                      <div className={`w-12 h-12 rounded-lg ${lessonType.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{lesson.title || "Untitled Lesson"}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {lesson.description || "No description"}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                            {lessonType.label}
                          </span>
                          {lesson.durationMin && (
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                              {lesson.durationMin} min
                            </span>
                          )}
                          {lesson.contentUrl && (
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
                              Content uploaded
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditLesson(lesson)}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => window.open(lesson.contentUrl || "#", "_blank")}
                        disabled={!lesson.contentUrl}
                        className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Upload Section */}
                  {!lesson.contentUrl && (
                    <div className="mt-4 pt-4 border-t">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Content
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="flex-1 cursor-pointer">
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleUpload(file, lesson.id);
                            }}
                            disabled={uploading}
                          />
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <div className="text-sm text-gray-600">
                              {uploading ? "Uploading..." : "Click to upload or drag and drop"}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {lesson.type === "video" && "MP4, MOV, AVI up to 500MB"}
                              {lesson.type === "pdf" && "PDF up to 50MB"}
                              {lesson.type === "slide" && "PPT, PPTX, PDF up to 100MB"}
                              {lesson.type === "text" && "TXT, DOC, DOCX up to 10MB"}
                            </div>
                          </div>
                        </label>
                        <div className="text-sm text-gray-500">
                          <p className="font-medium">Supported formats:</p>
                          <ul className="mt-1 space-y-1">
                            <li>• Video: MP4, MOV, AVI</li>
                            <li>• Documents: PDF, DOC, PPT</li>
                            <li>• Links: YouTube, Vimeo, etc.</li>
                            <li>• Text: Plain text or rich text</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
        )}
      </div>

      {/* Stats */}
      <div className="border-t pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{lessons.length}</div>
            <div className="text-sm text-gray-600">Total Lessons</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {lessons.filter(l => l.contentUrl).length}
            </div>
            <div className="text-sm text-gray-600">Content Uploaded</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {lessons.reduce((sum, lesson) => sum + (lesson.durationMin || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Total Minutes</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {new Set(lessons.map(l => l.type)).size}
            </div>
            <div className="text-sm text-gray-600">Content Types</div>
          </div>
        </div>
      </div>

      {/* Lesson Form Modal */}
      {showLessonForm && editingLesson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {editingLesson.id.startsWith("temp-") ? "Add New Lesson" : "Edit Lesson"}
              </h2>
            </div>
            <div className="p-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const lessonData = {
                    title: formData.get("title") as string,
                    type: formData.get("type") as Lesson["type"],
                    description: formData.get("description") as string,
                    durationMin: parseInt(formData.get("durationMin") as string) || undefined,
                  };
                  handleSaveLesson(lessonData);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lesson Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingLesson.title}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter lesson title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lesson Type *
                  </label>
                  <select
                    name="type"
                    defaultValue={editingLesson.type}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    {lessonTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingLesson.description}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter lesson description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="durationMin"
                    defaultValue={editingLesson.durationMin}
                    min="1"
                    max="300"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="e.g., 45"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLessonForm(false);
                      setEditingLesson(null);
                    }}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Lesson
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseBuilder;