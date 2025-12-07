# Supabase Setup Instructions

This application is now configured to use Supabase as the database. Follow these steps to set up your database:

## 1. Create Tables in Supabase

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql` into the SQL Editor
4. Run the SQL script to create all necessary tables

## 2. Environment Variables

Make sure your `.env.local` file contains:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
```

## 3. Initial Data Setup

After creating the tables, you'll need to insert initial user data. You can do this through the Supabase dashboard:

### Insert Sample Users

```sql
INSERT INTO users (id, email, name, credits, role) VALUES
('1', 'member@blazinpaddles.com', 'Alex Johnson', 15, 'member'),
('2', 'admin@blazinpaddles.com', 'Admin User', 999, 'admin');
```

## 4. Column Name Mapping

The application uses camelCase (e.g., `userId`, `creditCost`) while Supabase uses snake_case (e.g., `user_id`, `credit_cost`). The API routes automatically handle this transformation.

## 5. Row Level Security (RLS)

The schema includes basic RLS policies that allow all operations. For production, you should:

1. Implement proper authentication using Supabase Auth
2. Create more restrictive RLS policies based on user roles
3. Add password hashing for user authentication

## 6. Testing

After setup:
1. Start your development server: `npm run dev`
2. Try logging in with:
   - Email: `member@blazinpaddles.com`
   - Password: `password`
   - Or
   - Email: `admin@blazinpaddles.com`
   - Password: `password`

## Notes

- The current authentication is simplified (password check against 'password'). For production, implement proper authentication with Supabase Auth.
- All data is now persisted in Supabase instead of local JSON files.
- The `data/database.json` file is no longer used but kept for reference.

