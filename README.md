# SlotSync – Frontend System Overview

## 🧠 1. What This System Is

SlotSync is a **real-time classroom and laboratory booking simulator**.

It is NOT just a timetable viewer.

It answers:

> For a given (Day, Period), which resources are:
- Occupied (by timetable)
- Booked (temporarily)
- Free

---

## 🎯 2. Core Idea

At any given:

(Day, Period)

The system dynamically computes availability of:
- Classrooms
- Laboratories

---

## 🏗️ 3. Frontend Architecture

### 🔹 1. Data Layer (`mockData.js`)
Contains:
- Timetables (merged classrooms + labs)
- Rooms list
- Labs list

---

### 🔹 2. State Layer (`AppContext.jsx`)
Acts like a **fake backend**

Stores:
- `user`
- `timetables`
- `activeBookings`

Handles:
- login
- booking
- expiry

---

### 🔹 3. Logic Layer

#### `availabilityEngine.js`
Determines:
- free
- occupied
- booked

#### `bookingManager.js`
Validates:
- booking conflicts
- timetable clashes

---

### 🔹 4. UI Layer

#### `CRDashboard.jsx`
- Personal timetable
- Availability checker
- Booking interface

#### `AdminDashboard.jsx`
- Global overview

---

## 🧠 4. Data Model

### Timetable Structure

```json
{
  "programme": "MSc SOFTWARE SYSTEMS",
  "semester": 4,
  "schedule": [
    {
      "day": "MON",
      "period": 5,
      "course": "23XW45",
      "resource": "M202",
      "type": "ROOM"
    },
    {
      "day": "MON",
      "period": 5,
      "course": "UNIX LAB",
      "resource": "CSL1",
      "type": "LAB"
    }
  ]
}
