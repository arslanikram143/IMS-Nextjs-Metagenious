import { NextRequest, NextResponse } from "next/server";

// Mock data for campuses
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
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const campus = mockCampuses.find(c => c.id === id);
    
    if (!campus) {
      return NextResponse.json(
        { error: "Campus not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(campus);
  } catch (error) {
    console.error("Error fetching campus:", error);
    return NextResponse.json(
      { error: "Failed to fetch campus" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const campusIndex = mockCampuses.findIndex(c => c.id === id);
    
    if (campusIndex === -1) {
      return NextResponse.json(
        { error: "Campus not found" },
        { status: 404 }
      );
    }

    // Update campus (in a real app, this would update the database)
    const updatedCampus = {
      ...mockCampuses[campusIndex],
      ...body,
      id, // Ensure ID doesn't change
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const campusIndex = mockCampuses.findIndex(c => c.id === id);
    
    if (campusIndex === -1) {
      return NextResponse.json(
        { error: "Campus not found" },
        { status: 404 }
      );
    }

    // In a real app, this would delete from database
    return NextResponse.json({ 
      success: true, 
      message: "Campus deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting campus:", error);
    return NextResponse.json(
      { error: "Failed to delete campus" },
      { status: 500 }
    );
  }
}