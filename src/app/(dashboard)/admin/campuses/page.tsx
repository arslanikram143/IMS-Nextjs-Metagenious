"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Search, Filter, Edit, Trash2, Eye, Building2 } from "lucide-react";
import { toast } from "react-toastify";

interface Campus {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  principal: {
    name: string;
  } | null;
  institution: {
    name: string;
  };
  createdAt: string;
}

const CampusesPage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    if (isLoaded && user?.publicMetadata.role !== "admin") {
      router.push("/admin");
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    fetchCampuses();
  }, [page, search]);

  const fetchCampuses = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
        search: search,
      });

      const response = await fetch(`/api/campuses?${queryParams}`);
      const data = await response.json();
      
      if (response.ok) {
        setCampuses(data.campuses);
        setTotal(data.total);
      } else {
        toast.error(data.error || "Failed to fetch campuses");
      }
    } catch (error) {
      toast.error("Failed to fetch campuses");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campus? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/campuses/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Campus deleted successfully");
        fetchCampuses();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete campus");
      }
    } catch (error) {
      toast.error("Failed to delete campus");
      console.error(error);
    }
  };

  const handleEdit = (campus: Campus) => {
    setSelectedCampus(campus);
    setIsModalOpen(true);
  };

  const handleView = (id: string) => {
    router.push(`/admin/campuses/${id}`);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCampus(null);
  };

  const handleModalSubmit = async (formData: any) => {
    try {
      const url = selectedCampus 
        ? `/api/campuses/${selectedCampus.id}`
        : "/api/campuses";
      
      const method = selectedCampus ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(
          selectedCampus 
            ? "Campus updated successfully" 
            : "Campus created successfully"
        );
        handleModalClose();
        fetchCampuses();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to save campus");
      }
    } catch (error) {
      toast.error("Failed to save campus");
      console.error(error);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", search);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campuses</h1>
          <p className="text-gray-600">Manage all campuses across institutions</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Add Campus
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <form
            onSubmit={handleSearchSubmit}
            className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2"
          >
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search campuses by name, code, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-[300px] p-2 bg-transparent outline-none"
            />
          </form>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button 
              onClick={fetchCampuses}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Search className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading campuses...</p>
          </div>
        ) : campuses.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No campuses found</h3>
            <p className="text-gray-600 mt-1">Add your first campus to get started</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Add Campus
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 text-sm border-b">
                    <th className="pb-3 font-medium">Campus</th>
                    <th className="pb-3 font-medium">Institution</th>
                    <th className="pb-3 font-medium">Location</th>
                    <th className="pb-3 font-medium">Contact</th>
                    <th className="pb-3 font-medium">Principal</th>
                    <th className="pb-3 font-medium">Created</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campuses.map((campus) => (
                    <tr key={campus.id} className="border-b hover:bg-gray-50">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{campus.name}</div>
                            <div className="text-sm text-gray-500">Code: {campus.code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">{campus.institution.name}</td>
                      <td className="py-4">
                        <div>
                          <div>{campus.city}</div>
                          <div className="text-sm text-gray-500 truncate max-w-[200px]">{campus.address}</div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div>
                          <div>{campus.phone || "N/A"}</div>
                          <div className="text-sm text-gray-500">{campus.email || "N/A"}</div>
                        </div>
                      </td>
                      <td className="py-4">{campus.principal?.name || "Not assigned"}</td>
                      <td className="py-4">{new Date(campus.createdAt).toLocaleDateString()}</td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleView(campus.id)}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(campus)}
                            className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(campus.id)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, total)} of {total} campuses
              </div>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 border rounded-lg ${
                        page === pageNum
                          ? "bg-blue-600 text-white border-blue-600"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && <span className="px-2 py-2">...</span>}
                <button
                  disabled={page >= totalPages}
                  onClick={() => handlePageChange(page + 1)}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Simple Modal for Campus Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedCampus ? "Edit Campus" : "Add New Campus"}
              </h2>
              <p className="text-gray-600 mt-1">
                {selectedCampus ? "Update campus information" : "Create a new campus for your institution"}
              </p>
            </div>
            <div className="p-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const data = Object.fromEntries(formData.entries());
                  handleModalSubmit(data);
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Campus Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={selectedCampus?.name || ""}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Enter campus name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Campus Code *
                    </label>
                    <input
                      type="text"
                      name="code"
                      defaultValue={selectedCampus?.code || ""}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="e.g., CAMP-001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      defaultValue={selectedCampus?.city || ""}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      defaultValue={selectedCampus?.phone || ""}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    defaultValue={selectedCampus?.address || ""}
                    required
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter full address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={selectedCampus?.email || ""}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter email address"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {selectedCampus ? "Update Campus" : "Create Campus"}
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

export default CampusesPage;