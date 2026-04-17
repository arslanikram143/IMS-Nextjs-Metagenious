import { NextRequest, NextResponse } from "next/server";

// Mock data for campuses since the schema hasn't been migrated yet
const mockCampuses = [
  {
    id: "1",
    name: "Main Campus",
    code: "CAMP-001",
    city: "Karachi",
    address: "123 Education Street, Karachi",
    phone: "+92 300 1234567",
    email: "main@institute.edu",
    principal: { name: "Dr. Ahmed Khan" },
    institution: { name: "Metagenious Institute" },
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "North Campus",
    code: "CAMP-002",
    city: "Islamabad",
    address: "456 Learning Avenue, Islamabad",
    phone: "+92 300 2345678",
    email: "north@institute.edu",
    principal: { name: "Prof. Sara Ahmed" },
    institution: { name: "Metagenious Institute" },
    createdAt: "2024-02-20T14:45:00Z",
  },
  {
    id: "3",
    name: "South Campus",
    code: "CAMP-003",
    city: "Lahore",
    address: "789 Knowledge Road, Lahore",
    phone: "+92 300 3456789",
    email: "south@institute.edu",
    principal: { name: "Dr. Ali Raza" },
    institution: { name: "Metagenious Institute" },
    createdAt: "2024-03-10T09:15:00Z",
  },
  {
    id: "4",
    name: "West Campus",
    code: "CAMP-004",
    city: "Peshawar",
    address: "101 Wisdom Lane, Peshawar",
    phone: "+92 300 4567890",
    email: "west@institute.edu",
    principal: null,
    institution: { name: "Metagenious Institute" },
    createdAt: "2024-04-05T11:20:00Z",
  },
  {
    id: "5",
    name: "East Campus",
    code: "CAMP-005",
    city: "Quetta",
    address: "202 Innovation Boulevard, Quetta",
    phone: "+92 300 5678901",
    email: "east@institute.edu",
    principal: { name: "Dr. Fatima Noor" },
    institution: { name: "Metagenious Institute" },
    createdAt: "2024-05-12T16:30:00Z",
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    // Filter campuses based on search
    let filteredCampuses = mockCampuses;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCampuses = mockCampuses.filter(
        (campus) =>
          campus.name.toLowerCase().includes(searchLower) ||
          campus.code.toLowerCase().includes(searchLower) ||
          campus.city.toLowerCase().includes(searchLower) ||
          campus.address.toLowerCase().includes(searchLower)
      );
    }

    // Paginate results
    const total = filteredCampuses.length;
    const paginatedCampuses = filteredCampuses.slice(skip, skip + limit);

    return NextResponse.json({
      campuses: paginatedCampuses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching campuses:", error);
    return NextResponse.json(
      { error: "Failed to fetch campuses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { name, code, city, address } = body;
    if (!name || !code || !city || !address) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if campus code already exists
    const existingCampus = mockCampuses.find(campus => campus.code === code);
    if (existingCampus) {
      return NextResponse.json(
        { error: "Campus code already exists" },
        { status: 400 }
      );
    }

    // Create new campus (mock)
    const newCampus = {
      id: `mock-${Date.now()}`,
      name,
      code,
      city,
      address,
      phone: body.phone || null,
      email: body.email || null,
      principal: body.principalId ? { name: "New Principal" } : null,
      institution: { name: "Metagenious Institute" },
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(newCampus, { status: 201 });
  } catch (error) {
    console.error("Error creating campus:", error);
    return NextResponse.json(
      { error: "Failed to create campus" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: "Campus ID is required" },
        { status: 400 }
      );
    }

    // Find and update campus (mock)
    const campusIndex = mockCampuses.findIndex(campus => campus.id === id);
    if (campusIndex === -1) {
      return NextResponse.json(
        { error: "Campus not found" },
        { status: 404 }
      );
    }

    const updatedCampus = {
      ...mockCampuses[campusIndex],
      ...updateData,
    };

    return NextResponse.json(updatedCampus);
  } catch (error) {
    console.error("Error updating campus:", error);
    return NextResponse.json(
      { error: "Failed to update campus" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json(
        { error: "Campus ID is required" },
        { status: 400 }
      );
    }

    // Check if campus exists (mock)
    const campusExists = mockCampuses.some(campus => campus.id === id);
    if (!campusExists) {
      return NextResponse.json(
        { error: "Campus not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Campus deleted successfully" });
  } catch (error) {
    console.error("Error deleting campus:", error);
    return NextResponse.json(
      { error: "Failed to delete campus" },
      { status: 500 }
    );
  }
}