import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { getAvailableResources } from '../utils/availabilityEngine';

export default function CRDashboard() {
  const [activeTab, setActiveTab] = useState('tt'); // 'tt' or 'book'
  const { user, timetables, activeBookings, bookSlot, cancelBooking, days, periods } = useAppContext();
  
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0]);
  const [bookingPurpose, setBookingPurpose] = useState('');

  // 1. Get current CR's personal timetable
  const myData = timetables.find(t => t.programme === user.programme);
  const myTimetable = myData ? myData.schedule : [];

  const getTimetableEntries = (day, period) => {
    return myTimetable.filter(t => t.day === day && t.period === period);
  };

  // 2. Compute Availability Logic via External Utility
  const resourceStatuses = getAvailableResources(selectedDay, selectedPeriod, activeBookings);

  const handleBookSlot = (roomId) => {
    if (!bookingPurpose) {
      alert("Please enter a purpose for booking.");
      return;
    }
    const success = bookSlot(roomId, selectedDay, selectedPeriod, bookingPurpose);
    if (success) setBookingPurpose('');
  };

  const currentBookings = activeBookings.filter(b => b.bookedBy === user.username);

  return (
    <div className="space-y-6">
      <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 rounded-t-xl shadow-sm flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Class Representative Dashboard</h3>
          <p className="mt-1 text-sm text-gray-500">
            {user.programme} Scheduler
          </p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
           <button
             onClick={() => setActiveTab('tt')}
             className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'tt' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
           >
             Personal Timetable
           </button>
           <button
             onClick={() => setActiveTab('book')}
             className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'book' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
           >
             Availability Checker
           </button>
        </div>
      </div>

      {activeTab === 'tt' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border-x">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-r">Day / Period</th>
                  {periods.map(p => (
                    <th key={p} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r min-w-[120px]">
                      P{p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {days.map(day => (
                  <tr key={day} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 border-r bg-gray-50">{day}</td>
                    {periods.map(period => {
                      const entries = getTimetableEntries(day, period);
                      return (
                         <td key={`${day}-${period}`} className="px-3 py-4 border-r text-center align-top min-w-[140px]">
                           {entries.length > 0 ? (
                              <div className="flex flex-col gap-3 min-h-[6rem]">
                                {entries.map((entry, idx) => {
                                  // Assign styles dynamically based on room type
                                  const isLab = entry.type === 'LAB';
                                  const cardBg = isLab ? 'bg-emerald-50 border-emerald-100' : 'bg-blue-50 border-blue-100';
                                  const badgeBg = isLab ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-blue-100 text-blue-800 border-blue-200';
                                  const nameColor = isLab ? 'text-emerald-900' : 'text-blue-900';
                                  const pillColor = isLab ? 'text-emerald-700 border-emerald-100' : 'text-blue-700 border-blue-100';
                                  
                                  return (
                                    <div key={idx} className={`border rounded-lg p-3 flex flex-col justify-center items-center gap-1.5 shadow-sm transition-transform hover:-translate-y-0.5 ${cardBg}`}>
                                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${badgeBg}`}>
                                        {isLab ? 'LAB' : 'THEORY'}
                                      </span>
                                      <span className={`font-bold text-sm leading-tight text-center ${nameColor}`}>
                                        {entry.course}
                                      </span>
                                      <span className={`bg-white px-2.5 py-1 rounded font-bold border text-xs shadow-sm w-fit ${pillColor}`}>
                                        {entry.resource}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                           ) : (
                              <div className="text-gray-300 text-xs italic flex items-center justify-center min-h-[6rem]">- Free -</div>
                           )}
                         </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'book' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
               <h4 className="text-md font-medium text-gray-900 mb-4 border-b pb-2">Availability Query</h4>
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700">Day</label>
                   <select 
                     value={selectedDay}
                     onChange={(e) => setSelectedDay(e.target.value)}
                     className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border bg-slate-50"
                   >
                     {days.map(d => <option key={d} value={d}>{d}</option>)}
                   </select>
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700">Period</label>
                   <select 
                     value={selectedPeriod}
                     onChange={(e) => setSelectedPeriod(Number(e.target.value))}
                     className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border bg-slate-50"
                   >
                     {periods.map(p => <option key={p} value={p}>Period {p}</option>)}
                   </select>
                 </div>

                 <div className="pt-2">
                   <label className="block text-sm font-medium text-gray-700">Booking Purpose</label>
                   <input
                     type="text"
                     value={bookingPurpose}
                     onChange={(e) => setBookingPurpose(e.target.value)}
                     placeholder="e.g., Extra class, Club meet"
                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                   />
                 </div>
               </div>
             </div>

             {currentBookings.length > 0 && (
               <div className="bg-indigo-50 rounded-xl shadow-sm border border-indigo-100 p-5">
                 <h4 className="text-md font-medium text-indigo-900 mb-3">Your Active Bookings</h4>
                 <ul className="space-y-3">
                   {currentBookings.map(b => {
                     const secs = b.expiresAt ? Math.max(0, Math.floor((b.expiresAt - Date.now()) / 1000)) : 'N/A';
                     return (
                       <li key={b.id} className="bg-white p-3 rounded-lg border border-indigo-100 shadow-sm relative overflow-hidden">
                         <p className="text-sm font-bold text-gray-900">{b.roomId} <span className="text-xs font-normal text-gray-500 ml-2">({b.purpose})</span></p>
                         <p className="text-xs text-gray-600 mt-1">{b.day}, Period {b.period}</p>
                         <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded uppercase">
                              Expires: {secs}{secs !== 'N/A' ? 's' : ''}
                            </span>
                            <button onClick={() => cancelBooking(b.id)} className="text-[10px] text-red-500 hover:text-red-700 underline">Cancel</button>
                         </div>
                       </li>
                     );
                   })}
                 </ul>
               </div>
             )}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 min-h-[500px]">
              <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center justify-between border-b pb-2">
                <span>Rooms Status</span>
                <div className="flex gap-3 text-xs font-medium">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400"></span> Free</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Booked</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400"></span> Occupied</span>
                </div>
              </h4>

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                 {resourceStatuses.map(resObj => {
                   const { id, resourceType, status, details } = resObj;
                   
                   let statusStyles = "";
                   let label = "";
                   let isActionable = false;

                   if (status === 'occupied') {
                     statusStyles = "border border-red-200 bg-red-50 opacity-60";
                     label = `Class: ${details.course} (${details.programme})`;
                   } else if (status === 'booked') {
                     statusStyles = "border border-amber-200 bg-amber-50 cursor-not-allowed";
                     label = `Temp Booked: ${details.purpose}`;
                   } else {
                     statusStyles = "border border-green-200 bg-green-50 shadow-sm hover:border-green-400 hover:shadow transition-all group";
                     label = "Available for booking";
                     isActionable = true;
                   }

                   const isLabType = resourceType === 'LAB';
                   const hoverStyle = isActionable ? (status === 'free' ? 'hover:-translate-y-1 hover:shadow-md cursor-pointer' : '') : '';

                   return (
                     <div key={id} className={`p-4 rounded-xl flex flex-col justify-between h-32 transition-all duration-300 group ${statusStyles} ${hoverStyle}`}>
                        <div className="flex justify-between items-start mb-2">
                           <h5 className="font-bold text-gray-900 text-lg flex flex-col gap-1 items-start">
                              {id} 
                              <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${isLabType ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                                {isLabType ? 'LAB' : 'ROOM'}
                              </span>
                           </h5>
                        </div>
                        
                        <div className="flex flex-col gap-2 mt-auto">
                           <span className="text-[11px] font-medium leading-tight line-clamp-2" title={label}>{label}</span>
                           {isActionable && (
                             <button
                               onClick={() => handleBookSlot(id)}
                               className="bg-green-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-green-700 shadow-sm transition-all opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                             >
                               Book Now
                             </button>
                           )}
                        </div>
                     </div>
                   );
                 })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
