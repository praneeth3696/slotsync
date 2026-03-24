import { timetables, ROOMS, LABS } from '../data/mockData';

/**
 * Computes the availability of all resources for a specific day and period.
 * 
 * @param {string} day - e.g., 'MON', 'TUE'
 * @param {number} period - e.g., 1, 2, 3
 * @param {array} activeBookings - Current transient bookings from state
 * @returns {array} Unified array of resource objects marked with their status
 */
export const getAvailableResources = (day, period, activeBookings) => {
  // 1. Identify occupied resources natively structured in the fixed timetable
  const occupiedByTimetable = new Map();
  
  timetables.forEach((prog) => {
    // Loop over valid arrays only (preventing 'undefined' errors)
    if (prog.schedule && Array.isArray(prog.schedule)) {
      prog.schedule.forEach((slot) => {
        if (slot.day === day && slot.period === period) {
          occupiedByTimetable.set(slot.resource, {
            programme: prog.programme,
            course: slot.course,
            type: slot.type
          });
        }
      });
    }
  });

  // 2. Identify resources occupied by live transient bookings
  const occupiedByTransientBookings = new Map();
  activeBookings.forEach((booking) => {
    if (booking.day === day && booking.period === period) {
      occupiedByTransientBookings.set(booking.roomId, booking);
    }
  });

  // 3. Build unified resources array from fixed constants, tagging type
  const allResourcesMatrix = [
    ...ROOMS.map(r => ({ id: r, resourceType: 'ROOM' })),
    ...LABS.map(l => ({ id: l, resourceType: 'LAB' }))
  ];

  // 4. Calculate statuses
  return allResourcesMatrix.map(resource => {
    if (occupiedByTimetable.has(resource.id)) {
      const details = occupiedByTimetable.get(resource.id);
      return { ...resource, status: 'occupied', details };
    } else if (occupiedByTransientBookings.has(resource.id)) {
      const details = occupiedByTransientBookings.get(resource.id);
      return { ...resource, status: 'booked', details };
    } else {
      return { ...resource, status: 'free', details: null };
    }
  });
};
