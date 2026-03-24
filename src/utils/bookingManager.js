/**
 * safely attempt to book a given slot while preventing collisions.
 * 
 * @param {string} roomId - The infrastructure id
 * @param {string} day - Day to book
 * @param {number} period - Period number
 * @param {string} purpose - Purpose text
 * @param {object} user - CR doing the booking
 * @param {array} activeBookings - Current active state bookings
 * @param {array} timetables - Entire academic schedule
 * @returns {object} { success: boolean, booking: object, error: string }
 */
export const attemptBooking = (roomId, day, period, purpose, user, activeBookings, timetables) => {
    // 1. Check transient bookings collision
    const isTransientCollision = activeBookings.some(
      (b) => b.roomId === roomId && b.day === day && b.period === period
    );
  
    if (isTransientCollision) {
      return { success: false, error: "Resource is already booked temporarily for this slot." };
    }

    // 2. Check academic timetable collision
    let isTimetableCollision = false;
    let collidingCourse = "";
    
    timetables.forEach((prog) => {
      if (prog.schedule && Array.isArray(prog.schedule)) {
        prog.schedule.forEach((slot) => {
          if (slot.day === day && slot.period === period && slot.resource === roomId) {
            isTimetableCollision = true;
            collidingCourse = slot.course;
          }
        });
      }
    });

    if (isTimetableCollision) {
      return { success: false, error: `Resource is occupied by an academic session: ${collidingCourse}` };
    }
    
    // Create new booking with proper expiry computation mapped to Date.now()
    const newBooking = {
      id: `b${Date.now()}`,
      roomId,
      day,
      period,
      bookedBy: user.username,
      programme: user.programme, // Log CR's originating department
      purpose,
      status: 'active',
      expiresAt: Date.now() + 600000, // Adjusted properly to 10 minutes (600,000 ms) instead of 30sec
      createdAt: Date.now()
    };
  
    return { success: true, booking: newBooking };
  };
