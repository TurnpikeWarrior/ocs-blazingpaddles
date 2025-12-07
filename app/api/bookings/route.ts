import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Booking } from '@/app/types';

const dbPath = path.join(process.cwd(), 'data', 'database.json');

async function readDatabase() {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty database
    return { bookings: [], classes: [] };
  }
}

async function writeDatabase(data: any) {
  // Ensure data directory exists
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
  
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

// GET - Fetch all bookings
export async function GET(request: NextRequest) {
  try {
    const db = await readDatabase();
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (userId) {
      // Filter bookings by user ID
      const userBookings = db.bookings.filter((b: Booking) => b.userId === userId);
      return NextResponse.json(userBookings);
    }
    
    // Return all bookings (for admin view)
    return NextResponse.json(db.bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// POST - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await readDatabase();
    
    const newBooking: Booking = {
      ...body,
      id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    db.bookings.push(newBooking);
    await writeDatabase(db);
    
    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

