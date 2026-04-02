import React, { createContext, useState, useEffect, useContext } from 'react';
import { days, periods } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [activeBookings, setActiveBookings] = useState([]);
  const [timetables, setTimetables] = useState([]);
  
  const BASE_URL = 'http://localhost:5001/api';

  const login = async (username) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setTimetables([]);
  };

  // Fetch timetables when user logs in
  useEffect(() => {
    if (user && user.role === 'cr') {
      fetch(`${BASE_URL}/timetable?programme=${encodeURIComponent(user.programme)}`)
        .then(res => res.json())
        .then(data => setTimetables(data))
        .catch(err => console.error('Error fetching timetable:', err));
    }
  }, [user]);

  // Polling for active bookings globally regardless of who is active
  useEffect(() => {
    const fetchBookings = () => {
      fetch(`${BASE_URL}/bookings`)
        .then(res => res.json())
        .then(data => setActiveBookings(data))
        .catch(err => console.error('Error fetching bookings:', err));
    };

    fetchBookings(); // initial fetch
    const interval = setInterval(fetchBookings, 3000); // Poll every 3 seconds for near real-time updates
    return () => clearInterval(interval);
  }, []);

  const bookSlot = async (roomId, day, period, purpose) => {
    if (!user || user.role !== 'cr') return false;
    
    try {
      const res = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          day,
          period,
          bookedBy: user.username,
          programme: user.programme,
          purpose
        })
      });
      
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to book slot');
        return false;
      }
      
      setActiveBookings(current => [...current, data.booking]);
      return true;
    } catch (err) {
      console.error('Booking error:', err);
      alert('Network error occurred while booking');
      return false;
    }
  };

  const cancelBooking = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/bookings/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setActiveBookings(activeBookings.filter(b => b.id !== id));
      }
    } catch (err) {
      console.error('Cancel booking error:', err);
    }
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);
