# Parking Lot Management System

A user-friendly and responsive frontend interface for the **Parking Lot Management** system. This application enables both admin users and public users to interact with the parking system efficiently while seamlessly integrating with backend APIs built with Django.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
    - [Admin Features](#admin-features)
    - [Public Features](#public-features)
3. [Technologies Used](#technologies-used)
4. [Installation and Setup](#installation-and-setup)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)

---

## Project Overview

The **Parking Lot Management** system provides two main roles:

1. **Admin Features:**
   - **View available parking slots** across levels for two-wheelers and four-wheelers.
   - **Lock/Assign a parking space** for a vehicle.
   - **Unlock parking space** when a vehicle checks out, with giving ou the parking fees.
   
2. **Public User Features:**
   - **View available parking slots** per category (two-wheeler or four-wheeler) at various levels.
   - **Pre-book a parking lot** based on a timeslot and category.
   - **Cancel pre-bookings** or handle late checkouts with additional fees.

---

## Features

### Admin Features

- **View Available Slots:** Admins can see the number of available parking slots per category.
- **Assign Parking Lot:** Admins can assign a parking lot by selecting the level and vehicle details.
- **Unlock Parking Lot:** Admins can unlock a parking lot, calculate the fee, and remove the vehicle from the lot.

### Public Features

- **View Parking Availability:** Users can check parking availability based on their vehicle category.
- **Pre-booking and Booking Confirmation:** Users can select a time slot, book an available parking lot, and receive booking details.
- **Cancel Booking:** Users can cancel their bookings using a booking ID or vehicle number.
- **Late Checkout Fee:** The system calculates additional fees for vehicles that overstay their booked timeslot.

---

## Technologies Used

- **Frontend:** React
- **Backend:** Django
- **State Management:** Redux (for React)
- **Styling:** Bootstrap
- **API Requests:** Axios

---

## Installation and Setup

1. **Clone the Repository:**
   ```bash
   git clone https://git.beehyv.com/beehyv/training/2024_batch_3/prashant-singh/parking-lot

## Backend setup

2. **Setup and initialize backend:**
   ```bash  
   cd parking-lot/Django-backend-parking-lot
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python manage.py runserver
## Frontend setup
3. **Setup and initialize frontend:**
   ```bash  
   cd parking-lot/parking-lot
   npm install
   npm run dev
