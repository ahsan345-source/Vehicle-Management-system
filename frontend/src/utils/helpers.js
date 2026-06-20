// Formats a number as PKR currency, e.g. 1500 -> "Rs. 1,500"
export const formatPrice = (amount) => `Rs. ${Number(amount).toLocaleString('en-PK')}`;

// Formats a YYYY-MM-DD string into something more readable, e.g. "Jun 19, 2026"
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Returns the next 14 days (excluding today, since same-day booking
// is usually not realistic for a workshop) as YYYY-MM-DD strings,
// for use in the date picker.
export const getUpcomingDates = (days = 14) => {
  const dates = [];
  for (let i = 1; i <= days; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

// Fixed set of one-hour workshop time slots offered for booking.
export const TIME_SLOTS = [
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '01:00 PM - 02:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM',
];

export const VEHICLE_TYPES = ['Car', 'SUV', 'Bike', 'Truck', 'Van'];

// Maps a booking status to the CSS badge class that styles it.
export const statusBadgeClass = (status) => `badge badge-${status.toLowerCase()}`;
