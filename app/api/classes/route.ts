import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Class } from '@/app/types';

const dbPath = path.join(process.cwd(), 'data', 'database.json');

async function readDatabase() {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { bookings: [], classes: [] };
  }
}

async function writeDatabase(data: any) {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
  
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

// GET - Fetch all classes
export async function GET() {
  try {
    const db = await readDatabase();
    
    // Calculate enrolledCount from bookings for each class
    const classesWithEnrollment = db.classes.map((cls: Class) => {
      const enrolledCount = db.bookings.filter(
        (b: any) => b.classId === cls.id && b.type === 'class'
      ).length;
      
      return {
        ...cls,
        enrolledCount,
      };
    });
    
    return NextResponse.json(classesWithEnrollment);
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
  }
}

// POST - Create a new class
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await readDatabase();
    
    const newClass: Class = {
      ...body,
      id: `class-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      enrolledCount: body.enrolledCount || 0,
    };
    
    db.classes.push(newClass);
    await writeDatabase(db);
    
    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json({ error: 'Failed to create class' }, { status: 500 });
  }
}

