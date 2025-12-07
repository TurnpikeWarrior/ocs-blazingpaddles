import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

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

// PUT - Update a class (for enrollment changes)
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const body = await request.json();
    const db = await readDatabase();
    const classId = params.id;
    
    const classIndex = db.classes.findIndex((c: any) => c.id === classId);
    if (classIndex === -1) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }
    
    db.classes[classIndex] = { ...db.classes[classIndex], ...body };
    await writeDatabase(db);
    
    return NextResponse.json(db.classes[classIndex]);
  } catch (error) {
    console.error('Error updating class:', error);
    return NextResponse.json({ error: 'Failed to update class' }, { status: 500 });
  }
}

// DELETE - Remove a class
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const db = await readDatabase();
    const classId = params.id;
    
    const classIndex = db.classes.findIndex((c: any) => c.id === classId);
    if (classIndex === -1) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }
    
    // Also remove all bookings for this class
    db.bookings = db.bookings.filter((b: any) => b.classId !== classId);
    db.classes.splice(classIndex, 1);
    await writeDatabase(db);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting class:', error);
    return NextResponse.json({ error: 'Failed to delete class' }, { status: 500 });
  }
}

