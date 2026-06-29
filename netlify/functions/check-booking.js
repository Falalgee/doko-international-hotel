const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const data = JSON.parse(event.body);

  if (!data.room_type || !data.checkin || !data.checkout || !data.name || !data.email || !data.phone) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields' })
    };
  }

  // Check for overlapping bookings
  const { data: conflicts, error: checkError } = await supabase
    .from('bookings')
    .select('id')
    .eq('room_type', data.room_type)
    .or(`checkin.lte.${data.checkout},checkout.gte.${data.checkin}`)
    .neq('status', 'cancelled');

  if (checkError) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Database error' }) };
  }

  if (conflicts.length > 0) {
    return {
      statusCode: 409,
      body: JSON.stringify({ error: 'This room is already booked for the selected dates. Please choose other dates.' })
    };
  }

  // Insert the booking
  const { error: insertError } = await supabase
    .from('bookings')
    .insert([
      {
        room_type: data.room_type,
        guest_name: data.name,
        email: data.email,
        phone: data.phone,
        checkin: data.checkin,
        checkout: data.checkout,
        guests: data.guests,
        special_requests: data.special_requests
      }
    ]);

  if (insertError) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to save booking' }) };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, message: 'Booking confirmed' })
  };
};
