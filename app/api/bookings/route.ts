import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { Booking } from '@/app/types';

// Helper function to transform snake_case to camelCase
function transformBookingToCamelCase(data: any): Booking {
  return {
    id: data.id,
    userId: data.user_id,
    date: data.date,
    time: data.time,
    type: data.type,
    name: data.name,
    creditCost: data.credit_cost,
    courtNumber: data.court_number,
    classId: data.class_id,
  };
}

// Helper function to transform camelCase to snake_case
function transformBookingToSnakeCase(data: any): any {
  return {
    id: data.id,
    user_id: data.userId,
    date: data.date,
    time: data.time,
    type: data.type,
    name: data.name,
    credit_cost: data.creditCost,
    court_number: data.courtNumber,
    class_id: data.classId,
  };
}

// GET - Fetch all bookings
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    
    let query = supabase.from('bookings').select('*');
    
    if (userId) {
      // Filter bookings by user ID (using snake_case column name)
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching bookings:', error);
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }
    
    // Transform all bookings to camelCase
    const transformedData = (data || []).map(transformBookingToCamelCase);
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// POST - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Transform camelCase to snake_case for database
    const dbData = transformBookingToSnakeCase(body);
    
    const { data, error } = await supabase
      .from('bookings')
      .insert([dbData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating booking:', error);
      return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }
    
    // Transform back to camelCase
    const transformedData = transformBookingToCamelCase(data);
    return NextResponse.json(transformedData, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

