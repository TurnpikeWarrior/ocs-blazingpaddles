import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// GET - Fetch user by email
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      console.error('Error fetching user:', error);
      return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
    
    // Transform snake_case to camelCase
    const user = {
      id: data.id,
      email: data.email,
      name: data.name,
      credits: data.credits,
      role: data.role,
    };
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// POST - Create or update user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Transform camelCase to snake_case for database
    const dbData = {
      id: body.id,
      email: body.email,
      name: body.name,
      credits: body.credits,
      role: body.role,
    };
    
    const { data, error } = await supabase
      .from('users')
      .upsert([dbData], { onConflict: 'id' })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating/updating user:', error);
      return NextResponse.json({ error: 'Failed to create/update user' }, { status: 500 });
    }
    
    // Transform snake_case to camelCase
    const user = {
      id: data.id,
      email: data.email,
      name: data.name,
      credits: data.credits,
      role: data.role,
    };
    
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error creating/updating user:', error);
    return NextResponse.json({ error: 'Failed to create/update user' }, { status: 500 });
  }
}

