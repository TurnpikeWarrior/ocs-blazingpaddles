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

// PUT - Update a class (for enrollment changes)
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const body = await request.json();
    const classId = params.id;
    
    // Transform camelCase to snake_case for database
    const dbData = transformClassToSnakeCase(body);
    
    const { data, error } = await supabase
      .from('classes')
      .update(dbData)
      .eq('id', classId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating class:', error);
      return NextResponse.json({ error: 'Failed to update class' }, { status: 500 });
    }
    
    // Transform back to camelCase
    const transformedData = transformClassToCamelCase(data);
    return NextResponse.json(transformedData);
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
    const classId = params.id;
    
    // First, delete all bookings for this class (using snake_case column name)
    const { error: bookingsError } = await supabase
      .from('bookings')
      .delete()
      .eq('class_id', classId);
    
    if (bookingsError) {
      console.error('Error deleting class bookings:', bookingsError);
      return NextResponse.json({ error: 'Failed to delete class bookings' }, { status: 500 });
    }
    
    // Then delete the class
    const { error: classError } = await supabase
      .from('classes')
      .delete()
      .eq('id', classId);
    
    if (classError) {
      console.error('Error deleting class:', classError);
      return NextResponse.json({ error: 'Failed to delete class' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting class:', error);
    return NextResponse.json({ error: 'Failed to delete class' }, { status: 500 });
  }
}

