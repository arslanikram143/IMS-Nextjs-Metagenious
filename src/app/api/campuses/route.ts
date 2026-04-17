import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    // Build where clause for search
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { code: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get campuses with related data
    const [campuses, total] = await Promise.all([
      prisma.campus.findMany({
        where,
        include: {
          institution: {
            select: {
              name: true,
            },
          },
          principal: {
            select: {
              name: true,
            },
        },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.campus.count({ where }),
    ]);

    return NextResponse.json({
      campuses,
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
    const { name, code, city, address, institutionId } = body;
    if (!name || !code || !city || !address || !institutionId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if campus code already exists
    const existingCampus = await prisma.campus.findUnique({
      where: { code },
    });

    if (existingCampus) {
      return NextResponse.json(
        { error: "Campus code already exists" },
        { status: 400 }
      );
    }

    // Create campus
    const campus = await prisma.campus.create({
      data: {
        name,
        code,
        city,
        address,
        phone: body.phone || null,
        email: body.email || null,
        institutionId,
        principalId: body.principalId || null,
      },
      include: {
        institution: {
          select: {
            name: true,
          },
        },
        principal: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(campus, { status: 201 });
  } catch (error) {
    console.error("Error creating campus:", error);
    return NextResponse.json(
      { error: "Failed to create campus" },
      { status: 500 }
    );
  }
}