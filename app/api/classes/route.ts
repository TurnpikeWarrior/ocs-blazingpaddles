import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { Class } from '@/app/types';

// Helper function to transform snake_case to camelCase
function transformClassToCamelCase(data: any): Class {
  return {
    id: data.id,
    name: data.name,
    date: data.date,
    time: data.time,
    maxCapacity: data.max_capacity,
    creditCost: data.credit_cost,
    enrolledCount: data.enrolled_count || 0,
  };
}

// Helper function to transform camelCase to snake_case
function transformClassToSnakeCase(data: any): any {
  return {
    id: data.id,
    name: data.name,
    date: data.date,
    time: data.time,
    max_capacity: data.maxCapacity,
    credit_cost: data.creditCost,
  };
}

// GET - Fetch all classes
export async function GET() {
  try {
    // Fetch all classes
    const { data: classes, error: classesError } = await supabase
      .from('classes')
      .select('*');
    
    if (classesError) {
      console.error('Error fetching classes:', classesError);
      return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
    }
    
    // Fetch all class bookings to calculate enrollment (using snake_case column name)
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('class_id')
      .eq('type', 'class')
      .not('class_id', 'is', null);
    
    if (bookingsError) {
      console.error('Error fetching bookings for enrollment:', bookingsError);
      return NextResponse.json({ error: 'Failed to fetch enrollment data' }, { status: 500 });
    }
    
    // Calculate enrolledCount for each class
    const classesWithEnrollment = (classes || []).map((cls: any) => {
      const enrolledCount = (bookings || []).filter(
        (b: any) => b.class_id === cls.id
      ).length;
      
      const transformedClass = transformClassToCamelCase(cls);
      return {
        ...transformedClass,
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
    
    // Transform camelCase to snake_case for database
    const dbData = transformClassToSnakeCase(body);
    
    const { data, error } = await supabase
      .from('classes')
      .insert([dbData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating class:', error);
      return NextResponse.json({ error: 'Failed to create class' }, { status: 500 });
    }
    
    // Transform back to camelCase
    const transformedData = transformClassToCamelCase(data);
    return NextResponse.json(transformedData, { status: 201 });
  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json({ error: 'Failed to create class' }, { status: 500 });
  }
}

