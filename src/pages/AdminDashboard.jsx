import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ROOMS, LABS } from '../data/mockData';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('bookings');
  const { activeBookings, timetables } = useAppContext();

  const tabs = [
    { id: 'bookings', name: 'Active Bookings' },
    { id: 'timetable', name: 'Global Timetable Viewer' },
    { id: 'rooms', name: 'All Resources' },
  ];

  // Flatten timetable for easy viewing
  const globalSchedule = timetables.flatMap(prog => 
    (prog.schedule || []).map(slot => ({ ...slot, programme: prog.programme }))
  );

  // Use fixed resources from mockData instead of dynamic generation
  const allResources = [...ROOMS, ...LABS];

  return (
    <div className="space-y-6">
      <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 rounded-t-xl shadow-sm">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Admin Dashboard</h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage system data and view all activity across all programmes.
        </p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
        {activeTab === 'bookings' && (
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Current Transient Bookings</h4>
            {activeBookings.length === 0 ? (
              <p className="text-gray-500 text-sm">No active volatile bookings at the moment.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day & Period</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booked By</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Left</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activeBookings.map((bk) => {
                      const secondsLeft = bk.expiresAt ? Math.max(0, Math.floor((bk.expiresAt - Date.now()) / 1000)) : 'N/A';
                      return (
                        <tr key={bk.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{bk.roomId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bk.day}, P{bk.period}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bk.bookedBy} ({bk.programme})</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bk.purpose}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
                              {secondsLeft}{secondsLeft !== 'N/A' ? 's' : ''}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'timetable' && (
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Parsed Fixed Timetable Slots</h4>
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto w-full border rounded">
                <table className="min-w-full divide-y divide-gray-200 relative">
                  <thead className="bg-gray-50 sticky top-0 shadow-sm">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Programme</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {globalSchedule.map((t, idx) => (
                       <tr key={`${t.programme}-${t.day}-${t.period}-${idx}`} className="hover:bg-slate-50">
                          <td className="px-6 py-3 whitespace-nowrap text-xs text-gray-900 font-medium">{t.programme}</td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 font-bold">{t.day}</td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">P{t.period}</td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">{t.course}</td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm text-indigo-600 font-bold">{t.resource}</td>
                       </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">All Detected Resources</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {allResources.map(res => (
                <div key={res} className="bg-slate-50 border border-slate-200 rounded p-4 text-center font-bold text-slate-700 shadow-sm hover:shadow transition-all">
                  {res}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
