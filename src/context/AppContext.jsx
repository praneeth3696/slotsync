import React, { createContext, useState, useEffect, useContext } from 'react';
import { timetables, days, periods, defaultUsers, initialBookings } from '../data/mockData';
import { attemptBooking } from '../utils/bookingManager';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [activeBookings, setActiveBookings] = useState(initialBookings);
  
  const login = (username) => {
    const foundUser = defaultUsers.find(u => u.username === username);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  useEffect(() => {
    // Cleanup mechanism using useEffect + setInterval
    const interval = setInterval(() => {
      const now = Date.now();
      setActiveBookings(current => {
        // Remove expired bookings automatically (only if changes exist)
        const activeOnly = current.filter(booking => booking.expiresAt > now);
        if (activeOnly.length !== current.length) {
          return activeOnly;
        }
        return current;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const bookSlot = (roomId, day, period, purpose) => {
    if (!user || user.role !== 'cr') return false;
    
    // Delegated to booking manager logic to prevent collisions
    const response = attemptBooking(roomId, day, period, purpose, user, activeBookings, timetables);
    
    if (!response.success) {
      // Alert the user about the block
      alert(response.error);
      return false;
    }
    
    setActiveBookings([...activeBookings, response.booking]);
    return true;
  };

  const cancelBooking = (id) => {
    setActiveBookings(activeBookings.filter(b => b.id !== id));
  };

  return (
    <AppContext.Provider value={{
      user, login, logout, 
      activeBookings, bookSlot, cancelBooking,
      timetables, days, periods
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
