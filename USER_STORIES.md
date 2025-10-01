# Auzo App - User Stories & Success Criteria

## Document Purpose
This document provides developer-oriented user stories and detailed success criteria for the Auzo vehicle service application. It covers functionality for customers, drivers, and administrators, organized by screen and feature area.

---

# 1. CUSTOMER USER STORIES

## 1.1 Authentication & Onboarding

### Story 1.1.1: Landing Page
**Story Points:** 2

**As a** new user
**I want** to see the app's value proposition and authentication options
**So that** I can decide to sign up or log in

**Success Criteria:**
- Display app branding and tagline: "Your car, serviced with ease"
- Show two prominent CTAs: "Sign up" and "Log in"
- "Sign up" button navigates to `/user-signup`
- "Log in" button navigates to `/user-signup?flow=login`
- No authentication required to view this page
- Page is accessible at root path `/`

---

### Story 1.1.2: User Signup - Phone Entry
**Story Points:** 5 (Flutter: 3, Backend: 2)

**As a** new user
**I want** to sign up using my phone number, Apple ID, or Google account
**So that** I can create an account quickly

**Success Criteria:**
- Phone number input field with auto-formatting to `(XXX) XXX-XXXX`
- Validate phone number is 10 digits before enabling Continue button
- "Continue with Apple" button opens Apple ID authentication modal
- "Continue with Google" button opens Google account selection modal
- Apple authentication shows pre-filled email (john.doe@icloud.com) with Touch ID/Password options
- Google authentication shows account selection (John Doe or "Use another account")
- For login flow (`?flow=login`), page title changes to "Welcome Back"
- Display consent text: "By proceeding, you consent to get calls, WhatsApp or SMS messages..."
- Phone signup navigates to `/user-signup/verify?phone={phone}&flow={flow}`
- Social login (successful auth) navigates to `/user-signup/terms?provider={apple|google}` for signup
- Social login (successful auth) navigates to `/home` for login flow

**Validation Rules:**
- Phone: Must be exactly 10 digits, auto-formatted with parentheses and dashes
- Error message: "Phone number is required" if empty
- Strip all non-numeric characters before submission

**Data Flow:**
- Phone number stored in query parameter for verification page
- Social auth provider stored in query parameter for terms page

---

### Story 1.1.3: User Signup - Phone Verification
**Story Points:** 3 (Flutter: 2, Backend: 1)

**As a** user signing up with phone
**I want** to enter a verification code sent to my phone
**So that** I can verify my phone number ownership

**Success Criteria:**
- Display phone number from query parameter
- Show 6-digit code input fields
- Auto-advance between input fields as digits are entered
- Submit button enabled when all 6 digits are entered
- After successful verification, navigate to `/user-signup/details?flow={flow}`
- Show "Resend code" option after 30 seconds
- For login flow, skip details page and go directly to `/home` after verification

**Validation Rules:**
- Code must be exactly 6 digits
- Show error message for invalid codes
- Allow code resend after timeout period

---

### Story 1.1.4: User Signup - User Details
**Story Points:** 2

**As a** new user (phone signup only)
**I want** to provide my first name, last name, and email
**So that** I can complete my profile

**Success Criteria:**
- Display fields for: First Name (required), Last Name (required), Email (optional)
- Continue button navigates to `/user-signup/terms`
- All data saved to user profile in database
- Skip this screen for social login flows (data already obtained)

**Validation Rules:**
- First name: Required, minimum 1 character
- Last name: Required, minimum 1 character
- Email: Optional, but if provided must be valid email format

---

### Story 1.1.5: User Signup - Terms & Conditions
**Story Points:** 2

**As a** new user
**I want** to review and accept terms and conditions
**So that** I can complete account creation

**Success Criteria:**
- Display scrollable terms of service content
- Show checkbox: "I agree to the Terms of Service and Privacy Policy"
- Continue button disabled until checkbox is checked
- After accepting terms, navigate to `/home`
- Store acceptance timestamp in user profile

**Validation Rules:**
- User must check the terms checkbox to proceed
- Terms acceptance is immutable (cannot unchecked once account created)

---

## 1.2 Home Dashboard

### Story 1.2.1: Home - Default Vehicle Selector
**Story Points:** 3

**As a** customer
**I want** to select a default vehicle from my garage
**So that** service bookings pre-fill with this vehicle

**Success Criteria:**
- Display dropdown/selector showing all vehicles in garage
- Format: "{year} {make} {model} ({color})"
- Selected vehicle stored in session/state
- If no vehicles exist, show "Add vehicle" CTA linking to `/garage/add-vehicle/year`
- Selected vehicle persists across page navigation within session
- Default vehicle used for "Deliver Vehicle" service links

**Data Flow:**
- Vehicle list loaded from `vehicleStorage.getVehicles()`
- Selected vehicle stored in component state
- Selected vehicle passed to service flows via query parameters

---

### Story 1.2.2: Home - Latest Order Display
**Story Points:** 3

**As a** customer
**I want** to see my most recent order status
**So that** I can quickly check its progress

**Success Criteria:**
- Display latest order if any exists (from `transactionStorage.getTransactions()`)
- Show order status badge with appropriate variant (outline/secondary/default/destructive)
- Display destination location with MapPin icon
- Display date and time with Clock icon
- Clicking card navigates to `/order/{orderId}` or `/activity/{transactionId}`
- For completed one-way orders, show "Order Pickup" button
- "Order Pickup" button initiates return trip booking with reversed locations
- Refresh order data every 2 seconds while page is active
- Auto-refresh when window regains focus
- Listen for localStorage changes to sync across tabs

**Status Display Logic:**
- Scheduled: Outline badge
- Finding Driver: Secondary badge
- Driver On Way: Secondary badge
- Car In Transit: Secondary badge
- Car Delivered: Default badge
- Cancelled: Destructive badge

**Order Pickup Flow:**
- Store `isOrderPickup: true` in sessionStorage
- Store pickup details: `{vehicleId, destination: original pickup, pickupLocation: original destination}`
- Clear `hasShownAddOnPopup` flag
- Navigate to `/one-way-service` to show add-on services popup

---

### Story 1.2.3: Home - Service Grid
**Story Points:** 5

**As a** customer
**I want** to browse available services
**So that** I can select the service I need

**Success Criteria:**
- Display 4x3 grid of service tiles (10 services total)
- Each tile shows icon and service name
- Services displayed:
  1. Quick Lube → `/service-explanation?service=quick%20lube`
  2. Car Wash → `/service-explanation?service=car%20wash`
  3. Fuel Fill → `/service-explanation?service=fuel%20fill`
  4. Dealer Service Center → `/service-explanation?service=dealer%20service%20center`
  5. Tire & Wheel Service → `/service-explanation?service=tire%20%26%20wheel%20service`
  6. Brake & Muffler Service → `/service-explanation?service=brake%20%26%20muffler%20service`
  7. Transmission Service → `/service-explanation?service=transmission%20service`
  8. Body & Glass Service → `/service-explanation?service=body%20%26%20glass%20service`
  9. General Repair Service → `/service-explanation?service=general%20repair%20service`
  10. Deliver Vehicle → `/deliver?pickup=now&vehicleId={selectedVehicleId}`
- Tile hover state changes background to gray-50
- All tiles are clickable and navigate to appropriate flow

**Data Flow:**
- "Deliver Vehicle" appends selected vehicle ID to URL
- Service type stored in sessionStorage when service selected
- Service parameter passed through navigation flow

---

### Story 1.2.4: Home - Promotions Section
**Story Points:** 3 (Flutter: 2, Backend: 1)

**As a** customer
**I want** to see promotional offers
**So that** I can take advantage of special deals

**Success Criteria:**
- Display promotional card with image placeholder
- Show Oil Stop promotion: "$10 off Oil Change"
- Display promotion details: "Oilstop", "33-Points Service", "Round Trip Auzo Service Included"
- Clicking promotion card sets promotional flags in sessionStorage:
  - `isPromotionalOilChange: true`
  - `promotionalDiscount: 10`
- Navigate to `/service-explanation?service=quick%20lube&promotional=true`
- Card has hover state (gray-50 background)

**Data Flow:**
- Promotional flag carried through booking flow
- Discount applied at service location selection (filters to Oil Stop only)
- Promotional pricing shown in booking confirmation

---

## 1.3 Service Explanation

### Story 1.3.1: Service Explanation Page
**Story Points:** 3

**As a** customer
**I want** to understand what a service includes
**So that** I can make an informed decision before booking

**Success Criteria:**
- Display service name from query parameter, formatted with title case
- Show service type-specific explanation text:
  - **Full-service (Quick Lube, Car Wash, Fuel Fill)**: "Order an Auzo driver for a full service {service}. An Auzo driver will pick up your vehicle, complete your service, and return it back to your specified location. Up-front pricing included! Note that you will receive a price quote when you order so that you know how much everything will cost up front."
  - **One-way service (Dealer, Tire, Brake, Transmission, Body, General Repair)**: "Order an Auzo driver for your {service}. An Auzo driver will pick up your vehicle and deliver it to your specified location. Note: If an appointment is required, be sure to set that up in advance. For your convenience, once your vehicle's service is completed, order another Auzo driver to bring it home."
- Include safety notice: "Please ensure your vehicle is safe to drive before ordering service."
- "Request driver" button determines routing based on service type:
  - Full-service → `/full-service?service={service}&fromExplanation=true`
  - One-way → `/one-way-service?service={service}&fromExplanation=true`
  - Default → `/deliver?service={service}&fromExplanation=true`
- Back button returns to `/home`

**Service Type Detection:**
- **Full-service**: Contains "quick lube", "car wash", or "fuel fill"
- **One-way**: Contains "dealer", "tire", "brake", "transmission", "body", "general", or "service center"
- **Default**: Deliver flow

**Data Flow:**
- Service parameter preserved through navigation
- `fromExplanation: true` flag clears any cached destination data

---

## 1.4 Service Location Selection

### Story 1.4.1: Full-Service Location Selection (Round Trip)
**Story Points:** 8 (Flutter: 6, Backend: 2)

**As a** customer booking a full-service
**I want** to select an Auzo Service location
**So that** my vehicle can be serviced with round-trip delivery

**Success Criteria:**
- Display service title from query parameter (e.g., "Quick Lube Service")
- Show "Schedule a service" button to select date/time (optional)
- Display selected date/time if previously chosen, with edit and cancel (X) buttons
- Show route visualization: From → To → Back to (three stops with connecting lines)
- From: "Current location" (green dot)
- To: Service location (blue MapPin) with search input
- Back to: "Current location" (green dot)
- Display filtered service locations based on service type:
  - **Quick Lube**: Oil Stop, Jiffy Lube, Valvoline, Take 5 locations
  - **Car Wash**: Sparkle, Shine & Polish locations
  - **Fuel Fill**: Shell, Chevron locations
- For promotional oil change, filter to Oil Stop locations only
- Each location card shows:
  - "Auzo Service" badge (blue)
  - "$10 off Oil Change" badge for Oil Stop (green) if promotional
  - Business name
  - Address and city
  - Distance from current location
- Search bar filters locations by business name, address, or city
- Clicking location selects it and stores in sessionStorage
- After selection, navigate based on time selection state:
  - If time selected → `/select-vehicle?pickup=later`
  - If time not selected → `/choose-time?from=full-service&service={service}`
  - If pickup now → `/select-vehicle`

**Validation Rules:**
- Search query filters real-time as user types
- Show "No service locations found" if no matches
- All displayed locations must have `hasAuzoService: true`

**Data Flow:**
- Store `selectedDestination` in sessionStorage
- Store `serviceType` in sessionStorage
- Store `isRoundTrip: true` in sessionStorage
- Preserve service parameter through navigation

---

### Story 1.4.2: One-Way Service Location Selection
**Story Points:** 8 (Flutter: 6, Backend: 2)

**As a** customer booking a one-way service
**I want** to select a service center destination
**So that** my vehicle can be delivered there

**Success Criteria:**
- Display service title from query parameter (e.g., "Dealer Service Center")
- Show "Schedule a service" button to select date/time (optional)
- Display selected date/time if previously chosen, with edit and cancel (X) buttons
- Show route visualization: From → To (two stops with connecting line only)
- From: "Current location" (green dot)
- To: Service location (blue MapPin with magnifying glass) with search input
- Display service-specific locations based on keywords:
  - **Dealer**: Honda, Toyota, Ford, Chevrolet, Nissan, BMW, Mercedes, Audi, Mazda, VW, Lexus, Acura, Infiniti, Cadillac, Lincoln, Volvo, Subaru, Hyundai dealerships
  - **Tire**: Discount Tire, America's Tire, Les Schwab, Costco Tire, NTB, Big O, Firestone, Goodyear, Tire Barn, Pep Boys, Wheel Works, Mavis locations
  - **Brake**: Midas, Jiffy Lube Brake locations
  - **Transmission**: AAMCO, Mr. Transmission locations
  - **Body**: Maaco, Joe's Body Shop locations
  - **General**: AutoZone Pro, Pep Boys locations
- Each location card shows appropriate icon (Car, CircleDot, Gauge, Settings, PaintBucket, Wrench)
- Search bar filters locations by business name, address, or city
- Clicking location selects it and stores in sessionStorage
- Show "Order Pickup" add-on popup if `isOrderPickup: true` flag set
- After selection (and optional add-on), navigate based on time:
  - If time selected → `/select-vehicle?pickup=later`
  - If time not selected → `/choose-time?from=one-way-service&service={service}`
  - If pickup now → `/select-vehicle`

**Add-On Services Popup:**
- Shown automatically for order pickup scenarios
- Options: Car Wash (with tiers), Fuel Fill (with gas types)
- User can skip or select add-ons
- Selected add-ons stored in sessionStorage (`selectedCarWash`, `selectedFuelFill`)
- Add-ons only available for one-way services, not round trips

**Validation Rules:**
- Search query filters real-time
- Show "No service locations found" if no matches
- Location icons match service type

**Data Flow:**
- Store `selectedDestination` in sessionStorage
- Store `serviceType` in sessionStorage
- Store `isRoundTrip: false` and `isOneWayService: true` in sessionStorage
- Store add-on selections if applicable
- Preserve service parameter through navigation

---

### Story 1.4.3: Deliver Vehicle Location Selection
**Story Points:** 5

**As a** customer
**I want** to deliver my vehicle to any location
**So that** I can drop it off where needed

**Success Criteria:**
- Display title: "Deliver your car..."
- Show "Later" button to schedule (optional)
- Display selected date/time if previously chosen
- Show route visualization: From → To (two stops only)
- From: "Current location" (green dot)
- To: Destination (blue MapPin with magnifying glass) with search input
- Display recent destinations (mock data with business names and addresses)
- Filter destinations to exclude those with `hasAuzoService: true`
- Each location card shows:
  - MapPin icon in gray circle
  - Business name or address
  - Full address
  - Last visited timestamp
  - Distance
- Search bar filters locations
- Clicking location selects it and stores in sessionStorage
- After selection, navigate based on time:
  - If time selected → `/select-vehicle?pickup=later`
  - If time not selected → `/choose-time?from=deliver`
  - If pickup now → `/select-vehicle`

**Validation Rules:**
- Search query filters real-time
- Show "No destinations found" if no matches
- Do not show Auzo Service locations in this flow

**Data Flow:**
- Store `selectedDestination` in sessionStorage
- Store `isRoundTrip: false` in sessionStorage
- No service type stored (pure delivery)

---

## 1.5 Time Scheduling

### Story 1.5.1: Choose Date and Time
**Story Points:** 5

**As a** customer
**I want** to schedule my service for a specific date and time
**So that** I can plan around my schedule

**Success Criteria:**
- Display page title: "Choose Date and Time"
- Show calendar component for date selection
- Disable dates in the past (before today)
- Show time slot grid (morning and afternoon slots)
- Time slots: 8:00 AM - 5:30 PM in 30-minute increments
- Selected date highlighted in blue
- Selected time slot highlighted with filled background
- Continue button disabled until both date and time selected
- Format date as "Weekday, Month Day" (e.g., "Mon, Jan 15")
- Store formatted date and selected time in sessionStorage
- After confirmation, navigate back to referring page based on `from` parameter:
  - `from=full-service` → `/full-service?service={service}`
  - `from=one-way-service` → `/one-way-service?service={service}`
  - `from=deliver` → `/deliver`
- Back button returns to same referring page

**Validation Rules:**
- Date must be today or future
- Time must be selected from available slots
- Both date and time required to proceed

**Data Flow:**
- Store `selectedDate` in sessionStorage (formatted string)
- Store `selectedTime` in sessionStorage (e.g., "9:00 AM")
- Date and time displayed on location selection pages
- Date and time used in booking confirmation

---

## 1.6 Vehicle Selection

### Story 1.6.1: Select Vehicle for Service
**Story Points:** 3

**As a** customer
**I want** to select which vehicle needs service
**So that** the driver knows which car to pick up

**Success Criteria:**
- Display page title: "Select Vehicle"
- Load vehicles from `vehicleStorage.getVehicles()`
- Display each vehicle as a card with:
  - Vehicle image placeholder (colored rectangle based on vehicle color)
  - Year, Make, Model, Color
  - "Default" badge if marked as default vehicle
- If no vehicles exist, show "Add Vehicle" card linking to `/garage/add-vehicle/year`
- Clicking vehicle card stores vehicle data in sessionStorage and navigates based on service type:
  - Round trip (Auzo Service) → `/select-service-options?service={service}`
  - One-way or deliver → `/confirm-booking`
- Back button returns to previous location selection page

**Validation Rules:**
- At least one vehicle must exist or be added to proceed
- Selected vehicle must have all required fields (year, make, model)

**Data Flow:**
- Store `selectedVehicle` (full object) in sessionStorage
- Vehicle data used in booking confirmation and passed to driver
- Vehicle selection required for all booking flows

---

## 1.7 Service Options Selection (Round Trip Only)

### Story 1.7.1: Select Service Package
**Story Points:** 5 (Flutter: 3, Backend: 2)

**As a** customer booking a round-trip service
**I want** to select a service package
**So that** I know what work will be performed and the cost

**Success Criteria:**
- Display page title: "{Service} Options" (e.g., "Quick Lube Options")
- Show service categories from mock data based on service type:
  - **Quick Lube**: Oil change packages (Conventional, Semi-Synthetic, Full Synthetic, High Mileage)
  - **Car Wash**: Wash packages (Basic, Deluxe, Premium)
  - **Fuel Fill**: Fuel types (Regular Unleaded, Mid-Grade, Premium, Diesel)
- Each option card displays:
  - Option name
  - Price or price per unit (e.g., "$4.50/gallon")
  - Description/features
  - Checkmark icon if selected
- Clicking option card selects it (single selection only)
- Selected option highlighted with blue border
- Continue button disabled until option selected
- Store selected option in sessionStorage
- Navigate to `/confirm-booking` after selection
- Back button returns to `/select-vehicle`

**Validation Rules:**
- Exactly one option must be selected
- Price display format varies by service type:
  - Fixed price services: "$XX.XX"
  - Variable price (fuel): "$X.XX/gallon"

**Data Flow:**
- Store `selectedServiceCategory` in sessionStorage
- Store `selectedServiceOption` (full object with name, price, description) in sessionStorage
- Service option displayed in booking confirmation
- Price added to total cost calculation

---

## 1.8 Booking Confirmation

### Story 1.8.1: Confirm Booking Details
**Story Points:** 8 (Flutter: 5, Backend: 3)

**As a** customer
**I want** to review all booking details before confirming
**So that** I can verify everything is correct

**Success Criteria:**
- Display page title: "Confirm Round Trip" (if round trip) or "Confirm Booking" (if one-way)
- Show "Auzo Service" indicator for round trips
- Display route information card:
  - **Round trip**: From (current location) → To (service location with "Auzo Service" badge) → Back to (current location)
  - **One-way**: From (current/service location) → To (destination)
  - Show connecting lines between stops
- Display vehicle card: "{year} {make} {model} ({color})"
- Display pickup time: Formatted date/time or "ASAP"
- Display cost breakdown card:
  - Delivery Fee: $14.90 (always)
  - Service cost (if applicable): From selected service option
  - Car Wash add-on (if selected): Price from add-on
  - Fuel Fill add-on (if selected): "TBD" (calculated at fill-up)
  - Total: Sum of applicable costs
  - Note for fuel: "* Fuel cost will be calculated based on gallons filled..."
- Display payment method section:
  - Show all user credit cards
  - Display last 4 digits, brand, expiration date
  - Highlight default card
  - Show "Add Card" button linking to `/wallet/add-card`
  - Allow card selection (radio button style)
  - Allow setting different card as default
  - Allow card deletion (with confirmation)
- Display key handoff section:
  - Checkbox: "I'll meet the driver"
  - Checkbox: "Other" with required text area for instructions
  - Exactly one option must be selected
  - If "Other" selected, text area is required
- "Order Auzo Driver" button disabled until:
  - Payment method selected
  - Key handoff method selected
  - If "Other", handoff instructions provided
- On confirmation, navigate based on scheduling:
  - If scheduled → `/booking-scheduled`
  - If ASAP → `/driver-requested`
- Back button navigates based on booking type:
  - Round trip with service option → `/select-service-options`
  - Otherwise → `/select-vehicle`

**Validation Rules:**
- Payment method required
- Key handoff method required
- If "Other" handoff selected, instructions text required (non-empty)
- All sessionStorage data must be present (vehicle, destination, etc.)

**Error Handling:**
- Alert if no payment method selected: "Please add and select a credit card to continue."
- Alert if no key handoff selected: "Please select how you will hand off the keys."
- Alert if "Other" selected but no instructions: "Please provide instructions for key handoff."

**Data Flow:**
- Read all data from sessionStorage:
  - `selectedVehicle`
  - `selectedDestination`
  - `pickupLocation` (default or from order pickup)
  - `selectedDate`, `selectedTime`
  - `isRoundTrip`
  - `selectedServiceOption` (if round trip)
  - `selectedCarWash`, `selectedFuelFill` (if one-way)
- Store `selectedCardId`, `keyHandoffMethod`, `driverNotes` before navigation
- Order pickup scenario uses URL parameters instead of sessionStorage

---

### Story 1.8.2: Driver Requested (ASAP Bookings)
**Story Points:** 3 (Flutter: 2, Backend: 1)

**As a** customer
**I want** to see that my driver request is being processed
**So that** I know the system is finding a driver

**Success Criteria:**
- Display animated "Finding driver" state
- Show pickup location
- Show vehicle information
- Display estimated pickup time (e.g., "Pickup in 15-20 minutes")
- Automatically create order in database/storage
- Order created with status: `FINDING_DRIVER`
- Display "Cancel" button (red, destructive style)
- After short delay (for demo), automatically transition to:
  - If created orderId exists → `/order/{orderId}`
  - Else → `/activity/{transactionId}`
- Store transaction in `transactionStorage` with:
  - Unique transaction ID
  - Order ID (if created)
  - Vehicle information
  - Destination
  - Pickup location
  - Timestamp
  - Status: `FINDING_DRIVER`
  - Round trip flag
  - Service details (if applicable)

**Data Flow:**
- Create transaction record from sessionStorage data
- Store transaction with `transactionStorage.saveTransaction()`
- Link transaction to order via orderId
- Transaction visible in activity history and garage

---

### Story 1.8.3: Booking Scheduled
**Story Points:** 2

**As a** customer
**I want** confirmation that my scheduled service was booked
**So that** I know it's in the system

**Success Criteria:**
- Display success checkmark icon
- Show confirmation message: "Your service has been scheduled"
- Display scheduled date and time
- Display vehicle information
- Display destination/service location
- Show "View Details" button → `/order/{orderId}` or `/activity/{transactionId}`
- Show "Back to Home" button → `/home`
- Create order with status: `SCHEDULED`
- Store scheduled date and time with order

**Data Flow:**
- Create order/transaction record from sessionStorage data
- Set status to `SCHEDULED`
- Store `scheduledDate` and `scheduledTime` fields
- Clear sessionStorage booking data after order created

---

## 1.9 Order Tracking & Management

### Story 1.9.1: Order Status Page
**Story Points:** 8 (Flutter: 6, Backend: 2)

**As a** customer
**I want** to track my order status in real-time
**So that** I know where my vehicle is and what's happening

**Success Criteria:**
- Load order by orderId from database
- Display map placeholder with status badge
- Status badge is clickable to advance status (for demo purposes)
- Show appropriate status message based on current status:
  - Scheduled: "Your service is scheduled and will begin at the selected time"
  - Finding Driver: "We're finding the perfect driver for your vehicle"
  - Driver On Way: "Your driver is on the way" + "ETA: 12 minutes"
  - Car In Transit: "Your vehicle is being transported to the destination"
  - Car At Service: "Your vehicle is being serviced" (round trip only)
  - Driver Returning: "Your driver is bringing your vehicle back" (round trip only)
  - Car Delivered: "Your vehicle has been delivered successfully!"
  - Cancelled: "This order has been cancelled"
- Show driver information card when status >= Driver On Way:
  - Driver photo placeholder
  - Driver name (from order or mock: "John Smith")
  - Driver phone (from order or mock: "(555) 123-4567")
- Show rating/tip section when status = Car Delivered:
  - If not rated: Show driver rating (4.9) and "Rate or Tip" button → `/order/{orderId}/rate`
  - If rated: Show submitted rating (stars), tip amount, rated date
- Display "Order Progress" section with status checkpoints:
  - **Round trip**: Finding Driver → Driver On Way → Car At Service → Driver Returning → Car Delivered
  - **One-way**: Finding Driver → Driver On Way → Car In Transit → Car Delivered
  - Show checkmark for completed steps
  - Highlight current step
  - Gray out future steps
- Display "Order Details" card:
  - **Round trip layout**: From (current) → To (service location with "Auzo Service" badge) → Back to (current)
  - **One-way layout**: Pickup Location → Destination
  - Vehicle information
  - Notes (if any)
- Display order number (last 6 characters of orderId, uppercase)
- Show action buttons based on status:
  - If Scheduled: "Reschedule" and "Cancel Service" buttons
  - If Finding Driver: "Cancel Service" button
  - If Delivered (one-way): "Order Pickup" button
  - Always: "Back to Home" button
- "Reschedule" opens calendar dialog to select new date/time
- "Cancel Service" opens confirmation dialog
- "Order Pickup" initiates return trip (same flow as home page Order Pickup)
- Poll for order updates or use real-time listeners

**Status Badge Variants:**
- Scheduled: Outline
- Finding Driver: Secondary
- Driver On Way: Default
- Car In Transit: Default
- Car At Service: Secondary
- Driver Returning: Default
- Car Delivered: Outline
- Cancelled: Destructive

**Validation Rules:**
- Order must exist in database
- Show error page if order not found
- Status transitions follow valid progression

**Data Flow:**
- Load order from `/api/orders` or order service
- Update UI when order status changes
- Sync transaction status in localStorage when order updates
- Driver information from order.driverInfo
- VIN and mileage data captured by driver displayed here

---

### Story 1.9.2: Cancel Order
**Story Points:** 3 (Flutter: 2, Backend: 1)

**As a** customer
**I want** to cancel my service
**So that** I can make changes or don't need it anymore

**Success Criteria:**
- Show confirmation dialog: "Are you sure you want to cancel this service?"
- Warning text: "This action cannot be undone and you'll need to create a new order if you change your mind."
- Two buttons: "Keep Service" (cancel dialog) and "Cancel Service" (confirm cancellation)
- On confirmation:
  - Update order status to `CANCELLED`
  - Update transaction status in localStorage
  - Reload order page to show cancelled state
- Cancellation only allowed when status is Scheduled or Finding Driver
- Button not shown for other statuses

**Validation Rules:**
- Can only cancel if status <= Finding Driver
- Cannot cancel if driver is already en route or service started

**Data Flow:**
- Call `cancelOrder(orderId)` service function
- Update order status in database
- Sync transaction status: `transactionStorage.updateTransactionStatus(transactionId, OrderStatus.CANCELLED)`

---

### Story 1.9.3: Reschedule Order
**Story Points:** 3 (Flutter: 2, Backend: 1)

**As a** customer
**I want** to change my scheduled service time
**So that** I can adjust to schedule changes

**Success Criteria:**
- Show calendar and time selection dialog
- Display current scheduled date and time
- Calendar disables past dates
- Time slots same as booking flow (8 AM - 5:30 PM, 30-min increments)
- Require both new date and new time to be selected
- "Confirm Reschedule" button disabled until both selected
- On confirmation:
  - Update order's `scheduledDate` and `scheduledTime`
  - Keep order status as `SCHEDULED`
  - Close dialog and reload order page
- "Cancel" button closes dialog without changes
- Rescheduling only available when status is Scheduled

**Validation Rules:**
- Can only reschedule if status = Scheduled
- New date must be today or future
- Must select both date and time

**Data Flow:**
- Call `rescheduleOrder(orderId, newDate, newTime)` service function
- Update order fields in database
- Reload order to show new schedule

---

### Story 1.9.4: Rate Driver and Add Tip
**Story Points:** 5 (Flutter: 3, Backend: 2)

**As a** customer
**I want** to rate my driver and optionally add a tip
**So that** I can provide feedback and show appreciation

**Success Criteria:**
- Display page title: "Rate Your Driver"
- Show driver name
- Display 5-star rating selector (tap stars to rate 1-5)
- Show tip options: $0 (No Tip), $5, $10, $15, $20, Custom
- Custom tip opens input for manual entry
- Display optional feedback text area
- "Submit Rating" button disabled until rating selected (tip optional)
- On submission:
  - Store rating (1-5) in order.driverInfo.rating
  - Store tip amount in order.driverInfo.tip
  - Store rated timestamp in order.driverInfo.ratedAt
  - Store feedback text if provided
  - Navigate back to order page
- Order page shows submitted rating instead of "Rate or Tip" button

**Validation Rules:**
- Rating (1-5 stars) required
- Tip is optional (can be $0)
- Custom tip must be numeric, >= 0
- Feedback text is optional

**Data Flow:**
- Update order.driverInfo fields in database
- Rating displayed on order page after submission
- Tip processed for payment to driver

---

## 1.10 Garage Management

### Story 1.10.1: View Garage
**Story Points:** 3

**As a** customer
**I want** to see all my vehicles
**So that** I can manage them and see their service history

**Success Criteria:**
- Display page title: "My Garage"
- Load vehicles from `vehicleStorage.getVehicles()`
- For each vehicle, display:
  - Vehicle card (colored rectangle, year/make/model/color)
  - "Default" badge if applicable
  - Clickable card navigates to `/garage/vehicle/{id}`
- Below each vehicle, show "Recent Activity" section with up to 3 latest transactions
- Each transaction card shows:
  - Status badge
  - Destination (MapPin icon)
  - Date and time (Clock icon)
  - Clickable → `/activity/{transactionId}`
- If no vehicles exist, show empty state:
  - Car icon
  - "No vehicles added yet"
  - "Add Your First Vehicle" button → `/garage/add-vehicle/year`
- If vehicles exist, show "Add" button in header
- Remove duplicate transactions on load (`transactionStorage.removeDuplicateTransactions()`)

**Data Flow:**
- Load vehicles: `vehicleStorage.getVehicles()`
- Load transactions: `transactionStorage.getTransactions()`
- Filter transactions by vehicle.id to show per-vehicle history
- Transaction status uses OrderStatusLabels for display

---

### Story 1.10.2: Add Vehicle - Multi-Step Flow
**Story Points:** 8 (Flutter: 5, Backend: 3)

**As a** customer
**I want** to add a vehicle to my garage
**So that** I can book services for it

**Success Criteria:**

**Step 1 - Year (`/garage/add-vehicle/year`):**
- Display: "Select Year"
- Show list of years from current year back to 1990
- Clicking year stores in sessionStorage and navigates to `/garage/add-vehicle/make?year={year}`

**Step 2 - Make (`/garage/add-vehicle/make`):**
- Display: "Select Make"
- Show list of vehicle makes (e.g., Toyota, Honda, Ford, Chevrolet, etc.)
- Clicking make stores in sessionStorage and navigates to `/garage/add-vehicle/model?year={year}&make={make}`

**Step 3 - Model (`/garage/add-vehicle/model`):**
- Display: "Select Model"
- Show list of models for the selected make
- Clicking model stores in sessionStorage and navigates to `/garage/add-vehicle/color?year={year}&make={make}&model={model}`

**Step 4 - Color (`/garage/add-vehicle/color`):**
- Display: "Select Color"
- Show color options: Black, White, Silver, Gray, Red, Blue, Green, etc.
- Clicking color completes vehicle addition
- Generate unique vehicle ID
- Save vehicle to storage: `vehicleStorage.addVehicle(vehicle)`
- If this is the first vehicle, mark as default
- Navigate to `/garage` after successful save

**Validation Rules:**
- All fields required (year, make, model, color)
- Year must be valid (1990 - current year)
- Navigation enforces sequential steps via query parameters

**Data Flow:**
- Each step stores data in sessionStorage
- Final step compiles all data and saves to `vehicleStorage`
- Vehicle object: `{id, year, make, model, color, isDefault?, createdAt}`
- New vehicle appears immediately in garage list

---

### Story 1.10.3: View Vehicle Details
**Story Points:** 2

**As a** customer
**I want** to see detailed information about a specific vehicle
**So that** I can view its service history and edit it

**Success Criteria:**
- Display vehicle information:
  - Year, Make, Model, Color
  - Image placeholder (colored based on vehicle color)
  - VIN (if captured by driver)
  - Latest mileage (if captured by driver)
  - License plate (if provided)
- Show "Set as Default" button if not already default
- Show "Edit Vehicle" button → Edit flow (if implemented)
- Show "Delete Vehicle" button with confirmation dialog
- Display full transaction history for this vehicle:
  - All transactions filtered by vehicle ID
  - Each transaction card clickable → `/activity/{transactionId}`
  - Show status, destination, date/time
- Back button returns to `/garage`

**Validation Rules:**
- Cannot delete vehicle if it's the only one (require at least one)
- Cannot delete default vehicle unless another is set as default first

**Data Flow:**
- Load vehicle by ID from `vehicleStorage`
- VIN and mileage populated by driver during pickup task
- Transaction history from `transactionStorage.getTransactions()` filtered by vehicle ID

---

## 1.11 Payment & Wallet

### Story 1.11.1: View Wallet
**Story Points:** 3

**As a** customer
**I want** to see all my saved payment methods
**So that** I can manage them

**Success Criteria:**
- Display page title: "Wallet"
- Subtitle: "Manage your payment methods and cards"
- Load credit cards from Firebase/service
- For each card, display:
  - Card brand (Visa, Mastercard, Amex, Discover)
  - Last 4 digits: "•••• {last4}"
  - Expiration date: "{mm}/{yy}"
  - "Default" badge if isDefault = true
  - Three-dot menu with options:
    - "Set as Default" (if not already default)
    - "Remove Card" (with confirmation)
- Show "Add Card" button → `/wallet/add-card`
- Automatically ensure only one card is marked as default
- Sort cards: default first, then by creation date (newest first)
- Back button returns to `/account`

**Validation Rules:**
- Must have at least one card for bookings
- Only one card can be marked as default
- Prevent deleting last remaining card if orders exist

**Data Flow:**
- Load cards from user ID via `getActiveCreditCards(userId)`
- Set default via `setDefaultCreditCard(userId, cardId)`
- Delete via `deleteCreditCard(userId, cardId)`

---

### Story 1.11.2: Add Credit Card
**Story Points:** 5 (Flutter: 3, Backend: 2)

**As a** customer
**I want** to add a new payment method
**So that** I can pay for services

**Success Criteria:**
- Display page title: "Add Credit Card"
- Form fields:
  - Card number (16 digits, auto-formatted with spaces every 4 digits)
  - Cardholder name (text)
  - Expiration month (dropdown: 01-12)
  - Expiration year (dropdown: current year + 15 years)
  - CVV (3-4 digits, password field)
  - Billing zip code (5 digits)
  - "Set as default payment method" checkbox
- "Add Card" button disabled until all fields valid
- On submission:
  - Validate card via Stripe or payment processor
  - Save tokenized card data to database
  - If "set as default" checked, mark as default
  - Navigate back to `/wallet`
- Show error messages for invalid card data
- Back button returns to `/wallet`

**Validation Rules:**
- Card number: 13-19 digits (varies by brand)
- Expiration: Must be future date
- CVV: 3 digits (4 for Amex)
- Zip: 5 digits
- All fields required

**Data Flow:**
- Tokenize card via payment processor API
- Store encrypted/tokenized card data, never raw card number
- Save card object: `{userId, last4, brand, expiryMonth, expiryYear, isDefault, createdAt, token}`

---

## 1.12 Account Management

### Story 1.12.1: Account Settings Hub
**Story Points:** 2

**As a** customer
**I want** to access all account settings
**So that** I can manage my account

**Success Criteria:**
- Display page title: "Account"
- Subtitle: "Manage your account settings and preferences"
- Navigation cards:
  - Wallet → `/wallet`
  - Activity → `/activity`
  - Manage Users → `/account/manage-users`
  - Drivers → `/drivers`
  - Profile Settings → `/account/profile`
  - Support → `/account/support`
  - Notifications (placeholder, no navigation)
- Each card shows right chevron icon
- Cards have hover state (gray-50)
- No authentication shown yet (placeholder for future)

---

### Story 1.12.2: Activity History
**Story Points:** 5

**As a** customer
**I want** to see all my past orders
**So that** I can review my service history

**Success Criteria:**
- Display page title: "Activity"
- Show filter dropdown if account has members (Owner role):
  - Options: "All Users", "{Owner Name} (Owner)", "{Member Names} (Member)"
  - Filter orders by selected user
- Load orders from API or service
- Display each order as a card:
  - Status badge with appropriate color
  - "Billed to You" or "Credit Card" badge (for owners viewing member orders)
  - Pickup location (MapPin icon)
  - Vehicle info (Car icon)
  - Date and time (Clock icon)
  - Member name (UserIcon) if owner viewing member orders
  - Clickable → `/activity/{orderId}`
- If no orders, show empty state:
  - List icon
  - "No Past Activity"
  - Message: "Orders from your members will appear here" (Owner) or "Your completed services will appear here" (Member)
- Back button returns to `/account`
- Clear any legacy transaction data from localStorage on mount

**Data Flow:**
- Load orders filtered by owner ID and optional member ID
- Orders from `/api/orders?ownerId={id}&filterByMember={memberId}`
- Display billing info for owner to see member payment methods

---

### Story 1.12.3: Manage Users (Account Holder Only)
**Story Points:** 5 (Flutter: 3, Backend: 2)

**As an** account owner
**I want** to manage sub-users on my account
**So that** family members can book services

**Success Criteria:**
- Display page title: "Manage Users"
- Show current account owner information
- List all members with status badges (Active, Pending, Inactive)
- Show "Invite User" button → `/invite`
- Each member card shows:
  - Name, phone number, role
  - Status badge
  - Edit and Remove options (three-dot menu)
- Member invites sent via SMS/email
- Pending invites show "Resend Invite" option
- Removing member requires confirmation
- Member access levels control booking permissions and payment method assignment

**Validation Rules:**
- Only account owner can manage users
- Cannot remove owner
- Must have at least one active user

**Data Flow:**
- Load users from user management service
- Create invitation records for new members
- Update user status and permissions

---

### Story 1.12.4: Profile Settings
**Story Points:** 3 (Flutter: 2, Backend: 1)

**As a** customer
**I want** to update my profile information
**So that** my account details are current

**Success Criteria:**
- Display editable fields:
  - First name
  - Last name
  - Email
  - Phone number (display only, not editable)
- Show "Save Changes" button
- Validate email format
- Display success message after save
- Back button returns to `/account`

**Validation Rules:**
- First name required
- Last name required
- Email must be valid format if provided
- Phone cannot be edited (tied to authentication)

**Data Flow:**
- Load current profile from user service
- Update profile fields in database
- Update localStorage/session cache after save

---

### Story 1.12.5: Support / Help Center
**Story Points:** 3

**As a** customer
**I want** to get help and support
**So that** I can resolve issues or ask questions

**Success Criteria:**
- Display support options:
  - FAQ section with common questions
  - Contact support button → Opens chat or contact form
  - Previous conversations list
- Each conversation clickable → `/account/support/{conversationId}`
- Show "Start New Conversation" button
- Display help articles and guides
- Show contact information (phone, email)

**Data Flow:**
- Load conversations from support system
- Create new conversation records
- Store message history

---

# 2. DRIVER USER STORIES

## 2.1 Driver Application

### Story 2.1.1: Driver Application - Multi-Step Form
**Story Points:** 13 (Flutter: 8, Backend: 5)

**As a** prospective driver
**I want** to submit my application to drive
**So that** I can start earning money

**Success Criteria:**

**Step 1 - Location & Referral:**
- Display: "Earn with Auzo"
- Subtitle: "Start earning extra money on your own schedule"
- Input fields:
  - Zip code (required, 5 digits)
  - Referral code (optional)
- Consent text: "By proceeding, I agree that Auzo or its representatives may contact..."
- Validate zip code format before allowing next
- Store in form state and navigate to step 2

**Step 2 - Age:**
- Display: "What is your age"
- Radio options:
  - "25 years or older"
  - "18-24 years"
- Store selection and navigate to step 3

**Step 3 - Driver's License:**
- Display: "Driver's license"
- Input fields:
  - Driver's license number (required)
  - State issued (required, dropdown of US states)
- Store and navigate to step 4

**Step 4 - Background Check Disclosure:**
- Display: "Background check"
- Show scrollable disclosure text
- "Agree" button to continue to step 5

**Step 5 - SSN & Deposit Info:**
- Display: "Background check"
- Input field: Social security number (formatted as XXX-XX-XXXX)
- Information cards:
  - "How will my SSN be used?" explanation
  - "$20 refundable deposit" explanation (refunded after 5 successful trips)
- Consent text: "By my electronic signature, I hereby authorize..."
- "Agree and acknowledge" button to continue to step 6

**Step 6 - Payment Method:**
- Display: "Payment method"
- Subtitle: "Add your payment method for the $20 refundable deposit"
- Card form fields:
  - Card number (16 digits, formatted with spaces)
  - Cardholder name
  - Expiration month (dropdown)
  - Expiration year (dropdown)
  - CVV (3-4 digits, password field)
- Green info box: "Refundable deposit" explanation
- "Continue to background check" button → `/apply/background-check`
- All fields required to enable button

**Step 7 - Background Check Processing:**
- Display: "Background Check"
- Show processing state with steps:
  - Identity Verification
  - Criminal History Check
  - Driving Record Check
- Mock processing with progress indicators
- On completion, show approval/pending message
- Navigate to driver dashboard or profile completion

**Validation Rules:**
- Zip: Exactly 5 digits
- SSN: Formatted as XXX-XX-XXXX (9 digits total)
- Card number: 13-19 digits depending on card type
- Expiration: Future date only
- CVV: 3-4 digits
- All required fields must be completed to proceed

**Data Flow:**
- Store application data in database with status "pending"
- Create driver profile record
- Process $20 deposit charge
- Submit background check request to third-party service
- Update application status based on background check results
- Application visible in admin panel for review

---

## 2.2 Driver Dashboard

### Story 2.2.1: Driver Home Dashboard
**Story Points:** 3

**As a** driver
**I want** to see my earnings and stats
**So that** I can track my performance

**Success Criteria:**
- Display: "Driver Dashboard"
- Welcome message: "Welcome Back!"
- Description: "Toggle your status using the button below to start accepting rides."
- Stats cards:
  - Today's Earnings: $75.58
  - Trips Today: 3
- Navigation cards:
  - Earnings → `/drive/earnings`
  - Public Profile → `/drive/public-profile`
  - Payouts → `/drive/payouts`
- Bottom navigation shows "Online/Offline" toggle
- Numbers update in real-time as jobs complete
- Background service monitors for new job notifications

**Data Flow:**
- Load earnings and trip count from driver service
- Calculate daily totals
- Update stats after each completed job

---

### Story 2.2.2: Earnings History
**Story Points:** 5

**As a** driver
**I want** to see my earnings history
**So that** I can track income over time

**Success Criteria:**
- Display: "Earnings"
- Show time period selector (Today, Week, Month, All Time)
- Display earnings summary for selected period
- List all completed trips with:
  - Date and time
  - Customer name
  - Service type
  - Earnings amount
  - Trip details link → `/drive/earnings/{id}`
- Show totals for period
- Export option for tax purposes

---

### Story 2.2.3: Trip Details
**Story Points:** 3

**As a** driver
**I want** to see details of a completed trip
**So that** I can review what happened

**Success Criteria:**
- Display trip date and time
- Show customer information
- Display route (pickup → service → delivery)
- Show earnings breakdown:
  - Base fare
  - Time component
  - Distance component
  - Tip (if any)
  - Total earnings
- Display service details (if applicable)
- Show photos/videos captured during trip
- Display vehicle information (VIN, mileage captured)

---

## 2.3 Driver Online - Job Management

### Story 2.3.1: Online Status & Map View
**Story Points:** 5

**As a** driver
**I want** to toggle my online status
**So that** I can control when I receive job requests

**Success Criteria:**
- Display map view with current location (blue arrow icon)
- Show online/offline toggle in driver nav
- When online, driver is visible to matching algorithm
- When offline, driver does not receive new job requests
- Map shows street grid pattern overlay
- Current location marker rotates based on device heading
- Settings and list view buttons accessible from map
- Status persists across app sessions

**Data Flow:**
- Update driver status in real-time database
- Driver location continuously updated while online
- Location used for distance-based job matching

---

### Story 2.3.2: Job Notification & Acceptance
**Story Points:** 8 (Flutter: 5, Backend: 3)

**As a** driver
**I want** to receive and accept job requests
**So that** I can start earning

**Success Criteria:**
- Popup notification appears when job available
- Display job information:
  - Service type (Oil Change, Delivery, etc.)
  - Pickup location
  - Service location (if applicable)
  - Delivery location
  - Estimated earnings
  - Estimated time and distance
  - Vehicle information
  - Round trip vs one-way indicator
- Show timer counting down (e.g., 30 seconds to accept)
- "Accept" button confirms job acceptance
- "Decline" button rejects job
- If not responded within timeout, job offered to next driver
- On acceptance:
  - Popup closes
  - Map shows route to pickup location
  - Directions card appears
  - Bottom navigation shows job details
- After acceptance, driver cannot go offline until job complete

**Validation Rules:**
- Driver must be online to receive jobs
- Only one active job at a time
- Cannot accept if already on active job

**Data Flow:**
- Job matched via algorithm based on driver location, rating, vehicle capacity
- Create order record linking driver to customer
- Update order status to DRIVER_ON_WAY
- Notify customer that driver has been assigned
- Store driver assignment in order.driverInfo

---

## 2.4 Driver Pickup Tasks

### Story 2.4.1: Navigate to Pickup
**Story Points:** 5

**As a** driver
**I want** directions to the pickup location
**So that** I can find the customer's vehicle

**Success Criteria:**
- Display black directions card overlay on map
- Show navigation instructions:
  - Direction arrow icon
  - Turn-by-turn text (e.g., "Head West", "Toward SW Birch St")
  - Distance to next turn (e.g., "0.5 mi")
- Display pickup location information:
  - Address: "2729 De Soto Ave"
  - Customer name with phone icon: "Audra Gussin"
  - Phone number clickable to call
- Show vehicle information:
  - "2025 Cadillac Escalade (Black)"
- Black line on map from current location to destination marker
- Bottom status bar shows:
  - "14 min (4.2 mi)"
  - "En route to pickup"
- Clicking directions card navigates to pickup task view
- Update route as driver moves

**Data Flow:**
- Load pickup location from order
- Calculate route and ETA
- Update customer with driver ETA
- Use device GPS for turn-by-turn navigation

---

### Story 2.4.2: Arrival Notification
**Story Points:** 3 (Flutter: 2, Backend: 1)

**As a** driver
**I want** to notify the customer I've arrived
**So that** they know I'm waiting for them

**Success Criteria:**
- At pickup location, directions card changes to white background
- Display "Pickup vehicle" heading
- Show task checklist with "Arrival" task:
  - Status: "Pending"
  - "Notify" button
- Clicking "Notify" button opens arrival message modal
- Pre-filled message: "I have arrived and will wait for 10 minutes for you to arrive and hand off the keys"
- Driver can edit message text
- "Send" button sends SMS/push notification to customer
- Message includes driver location on map
- After sending, task status changes to "Complete"
- Cannot proceed to other tasks until arrival notification sent

**Validation Rules:**
- Message text required (cannot be empty)
- Driver must be within geofence of pickup location

**Data Flow:**
- Send notification via SMS/push service
- Log notification timestamp in order
- Update order status to indicate driver arrived
- Customer receives notification with driver details

---

### Story 2.4.3: VIN Capture
**Story Points:** 8 (Flutter: 5, Backend: 3)

**As a** driver
**I want** to capture the vehicle's VIN
**So that** we have a record of the correct vehicle

**Success Criteria:**
- Task shown in checklist: "VIN" - Status: "Pending" - "Photo" button
- Clicking "Photo" button opens VIN capture modal
- Modal displays two-step process:
  - Step 1: "Enter the VIN" - Text input field (17 characters)
  - Step 2: "Take a photo" - Instructions text
  - Instructions: "Locate the VIN plate on the driver's side door jamb. Ensure all 17 characters are clearly visible and in focus."
- "Open Camera" button disabled until VIN entered
- Camera interface opens with:
  - Live camera feed
  - VIN displayed at top
  - Focus frame overlay (rectangular with corner brackets)
  - Instructions: "Position VIN plate in frame"
  - Shutter button at bottom
  - Photo counter showing number captured
- Capture photo → Shows preview with "Use Photo" and "Retake" buttons
- "Use Photo" confirms capture:
  - Photo stored with order
  - VIN text stored in order.vehicleInfo.vin
  - Task status changes to "Complete"
  - Green checkmark shown in checklist
- VIN data syncs to customer's garage for this vehicle

**Validation Rules:**
- VIN must be 17 alphanumeric characters
- Photo required (cannot skip)
- Photo must show VIN plate clearly (manual review if needed)

**Data Flow:**
- Store VIN in order.vehicleInfo.vin
- Upload photo to cloud storage
- Link photo to order record
- Update vehicle record in customer's garage with VIN
- VIN visible to customer in garage and admin in order details

---

### Story 2.4.4: Mileage Capture
**Story Points:** 5 (Flutter: 3, Backend: 2)

**As a** driver
**I want** to capture the vehicle's mileage
**So that** we have a record of starting mileage

**Success Criteria:**
- Task shown in checklist: "Mileage" - Status: "Pending" - "Photo" button
- Clicking "Photo" button opens mileage capture modal
- Modal displays two-step process:
  - Step 1: "Enter the mileage" - Numeric input field
  - Step 2: "Take a photo" - Instructions text
  - Instructions: "Photograph the odometer reading on the dashboard. Make sure all numbers are clear, in focus, and fully visible."
- "Open Camera" button disabled until mileage entered
- Camera interface shows:
  - Live camera feed
  - Large mileage number displayed at top (e.g., "45,234 mi")
  - Focus frame overlay
  - Instructions: "Frame the odometer clearly"
  - Shutter button
- Capture photo → Preview with "Use Photo" and "Retake"
- "Use Photo" confirms:
  - Photo stored
  - Mileage value stored in order.vehicleInfo.mileageStart
  - Task status changes to "Complete"
- Mileage syncs to customer's garage

**Validation Rules:**
- Mileage must be numeric, positive integer
- Reasonable range (0 - 999,999)
- Photo required

**Data Flow:**
- Store mileage in order.vehicleInfo.mileageStart
- Upload photo to cloud storage
- Update vehicle record with latest mileage
- Mileage visible to customer in garage
- Used to calculate service mileage if round trip

---

### Story 2.4.5: Exterior Video Capture
**Story Points:** 8 (Flutter: 5, Backend: 3)

**As a** driver
**I want** to record a video of the vehicle exterior
**So that** we document pre-service condition

**Success Criteria:**
- Task shown in checklist: "Exterior" - Status: "Pending" - "Video" button
- Clicking "Video" button opens video instructions modal
- Instructions modal explains:
  - Stand a few feet back from vehicle
  - Walk slowly around entire exterior
  - Capture all sides: front, both sides, rear
  - Highlight any visible damage or scratches
  - Ensure good lighting
  - Tip: Keep camera steady, move slowly
- "Start Recording" button opens camera interface
- Video capture interface shows:
  - Live camera view
  - "REC" indicator with pulsing red dot when recording
  - Instructions overlay: "Walk slowly around the vehicle exterior"
  - Record button (red circle) to start
  - Stop button (white circle with red square) to stop
- Recording captures 360° walk-around of vehicle
- After stopping, video automatically saved
- Task status changes to "Complete"
- Video stored with order record

**Validation Rules:**
- Video must be at least 15 seconds long
- Maximum video length: 2 minutes
- Video file size limits enforced

**Data Flow:**
- Upload video to cloud storage
- Link video to order record
- Video accessible in admin panel
- Video available to customer if damage dispute arises
- Timestamp recorded for documentation

---

### Story 2.4.6: Complete Pickup & Navigate to Service
**Story Points:** 3

**As a** driver
**I want** to proceed after completing all pickup tasks
**So that** I can continue to the service location

**Success Criteria:**
- Pickup tasks section shows:
  - Arrival: Complete
  - VIN: Complete
  - Mileage: Complete
  - Exterior: Complete
- "Next" section displays service location: "Oilstop Drive Thru Oil Change"
- "Start" button enabled only when all tasks complete
- "Start" button disabled (gray) if any task incomplete
- Clicking "Start" button:
  - Updates order status to CAR_IN_TRANSIT (one-way) or CAR_AT_SERVICE (round trip)
  - Changes directions card to navigation to service location
  - Bottom status shows "En route to service"
- If one-way delivery (no service), navigate directly to delivery location
- Customer receives notification that vehicle picked up

**Validation Rules:**
- All pickup tasks must be completed before proceeding
- Cannot skip or bypass any task
- Tasks must be completed in order: Arrival → VIN → Mileage → Exterior

**Data Flow:**
- Update order status in database
- Notify customer of pickup completion
- Start timer for service duration tracking
- Update driver's current job phase

---

## 2.5 Driver Service Tasks (Round Trip Only)

### Story 2.5.1: Navigate to Service Location
**Story Points:** 2

**As a** driver
**I want** directions to the service location
**So that** I can get the vehicle serviced

**Success Criteria:**
- Display black directions card with navigation
- Show turn-by-turn directions to service location
- Display service location details:
  - Business name: "Oilstop Drive Thru Oil Change"
  - Address: "3045 Bristol St, Costa Mesa"
  - Service type: "Auzo Quick Lube"
- Bottom status bar shows:
  - "6 min (1.8 mi)"
  - "En route to service"
- Map updates route in real-time
- Clicking card navigates to service tasks view
- Customer can track vehicle location on order page

---

### Story 2.5.2: Service Task Checklist
**Story Points:** 8 (Flutter: 5, Backend: 3)

**As a** driver
**I want** to complete service tasks
**So that** I ensure proper service delivery

**Success Criteria:**
- At service location, directions card changes to white background
- Display "Oilstop Drive Thru Oil Change" heading
- Show service details: "Auzo Quick Lube"
- Task checklist displays:

**Task 1: Synthetic Oil**
- Checkbox with label "Synthetic oil"
- Subtitle: "Max $99"
- Status: "Pending" or "Complete"
- Driver checks box to confirm synthetic oil selected
- Max price validation prevents service if exceeded

**Task 2: Payment**
- Label: "Payment"
- Status: "Pending" or "Complete"
- "Pay" button opens virtual payment card modal
- Virtual Stripe card displayed:
  - Card number: •••• •••• •••• 4242
  - Cardholder: AUZO DRIVER
  - Expiration: 12/28
  - Secured by Stripe badge
- Payment details show:
  - Service: Oil Change
  - Amount: $89.99
  - Total: $89.99
- "Pay $89.99" button processes payment
- On successful payment:
  - Green notification: "Payment Complete"
  - Task status changes to "Complete"
  - Modal closes after 3 seconds

**Task 3: Receipt**
- Label: "Receipt"
- Status: "Pending" or "Complete"
- "Photo" button opens camera interface
- Camera captures receipt photo
- Instructions: "Ensure receipt is clearly visible"
- Photo preview with "Use Photo" and "Retake"
- On confirmation, task status changes to "Complete"

**Validation Rules:**
- All three tasks must be completed
- Payment amount must not exceed max price
- Receipt photo must be legible
- Cannot proceed until all tasks complete

**Data Flow:**
- Store synthetic oil confirmation in order
- Process payment via Stripe virtual card
- Upload receipt photo to cloud storage
- Link all data to order record
- Update order.serviceDetails with completion info
- Receipt and service details visible in admin panel

---

### Story 2.5.3: Complete Service & Navigate to Delivery
**Story Points:** 2

**As a** driver
**I want** to proceed after service completion
**So that** I can return the vehicle to the customer

**Success Criteria:**
- Service tasks section shows all complete:
  - Synthetic oil: ✓
  - Payment: ✓
  - Receipt: ✓
- "Next" section displays delivery information:
  - "Deliver Vehicle"
  - Address: "2729 De Soto Ave, Costa Mesa"
- "Start" button enabled when all service tasks complete
- Clicking "Start":
  - Updates order status to DRIVER_RETURNING
  - Changes to navigation to delivery location
  - Bottom status shows "Returning to customer"
  - Customer receives notification service complete, vehicle returning

**Validation Rules:**
- All service tasks must be complete
- Payment must be processed successfully
- Receipt must be captured

**Data Flow:**
- Update order status to DRIVER_RETURNING
- Calculate total service time
- Notify customer of return ETA
- Start return trip tracking

---

## 2.6 Driver Delivery Tasks

### Story 2.6.1: Navigate to Delivery
**Story Points:** 2

**As a** driver
**I want** directions to the delivery location
**So that** I can return the vehicle to the customer

**Success Criteria:**
- Display black directions card with navigation
- Show turn-by-turn directions to delivery location
- Display delivery information:
  - Address: "2729 De Soto Ave, Costa Mesa"
  - Customer name with phone: "Audra Gussin"
- Bottom status bar shows:
  - "6 min (1.8 mi)"
  - "Returning to customer"
- Map updates route in real-time
- Clicking card navigates to delivery tasks view

---

### Story 2.6.2: Delivery Task Checklist
**Story Points:** 5 (Flutter: 3, Backend: 2)

**As a** driver
**I want** to complete delivery verification tasks
**So that** we document vehicle return condition

**Success Criteria:**
- At delivery location, directions card changes to white
- Display "Deliver vehicle" heading
- Task checklist displays:

**Task 1: Vehicle Image**
- Label: "Vehicle Image"
- Status: "Pending" or "Complete"
- "Photo" button opens camera
- Instructions: "Capture vehicle exterior condition. This documents the vehicle state at delivery."
- Photo captures overall vehicle appearance
- Preview with "Use Photo" / "Retake"
- On confirmation, task completes

**Task 2: Mileage**
- Label: "Mileage"
- Status: "Pending" or "Complete"
- "Photo" button opens mileage capture (same as pickup)
- Enter final mileage number
- Capture odometer photo
- Stores in order.vehicleInfo.mileageEnd
- Calculates trip mileage: mileageEnd - mileageStart

**Task 3: Delivered Keys**
- Label: "Delivered Keys"
- Status: "Pending" or "Complete"
- "Done" button to confirm keys handed off
- Toggles status to "Complete"
- "Undo" button if clicked by mistake

**Validation Rules:**
- All three tasks required
- Final mileage must be >= starting mileage
- Keys confirmation cannot be undone after job completion

**Data Flow:**
- Store delivery vehicle photo
- Store final mileage in order.vehicleInfo.mileageEnd
- Calculate and store mileage driven: order.vehicleInfo.mileageDriven = mileageEnd - mileageStart
- Log keys delivery confirmation with timestamp
- All data syncs to customer garage and admin panel

---

### Story 2.6.3: Complete Job
**Story Points:** 5 (Flutter: 3, Backend: 2)

**As a** driver
**I want** to finish the job and see my earnings
**So that** I know I completed it successfully

**Success Criteria:**
- Delivery tasks section shows all complete:
  - Vehicle Image: ✓
  - Mileage: ✓
  - Delivered Keys: ✓
- "Complete Job" button enabled when all tasks done
- Clicking "Complete Job":
  - Updates order status to CAR_DELIVERED
  - Displays job completion modal
  - Shows earnings summary:
    - Large green amount: "$25.33"
    - Label: "Amount earned"
    - Trip summary section with:
      - Service: "Oil Change"
      - Vehicle: "2025 Cadillac Escalade"
      - Total Time: "46 mins"
      - Total Distance: "4.2 miles"
      - Customer: "Audra Gussin"
      - Total Earned: "$25.33" (bold)
  - "Close" button dismisses modal
  - Returns to map view (online, ready for next job)
  - Driver can toggle offline if desired

**Validation Rules:**
- All delivery tasks must be complete
- Cannot complete job prematurely
- Job completion is final (cannot undo)

**Data Flow:**
- Update order status to CAR_DELIVERED
- Calculate final earnings:
  - Base fare + time component + distance component + tip (if any)
- Store completion timestamp
- Update driver's daily/weekly earnings totals
- Add earnings to driver's payout balance
- Notify customer of delivery completion
- Mark job complete in driver's trip history
- Update vehicle mileage in customer's garage
- All photos/videos/data finalized and accessible in admin

---

# 3. ADMIN USER STORIES

## 3.1 Admin Dashboard

### Story 3.1.1: Admin Dashboard Overview
**Story Points:** 5 (Flutter: 3, Backend: 2)

**As an** admin
**I want** to see an overview of the system
**So that** I can monitor operations

**Success Criteria:**
- Display page title: "Admin Panel"
- Show current admin role badge (Support or Advanced Ops)
- Display "Switch Role" button to toggle between Support and Advanced Ops
- Show stats overview cards:
  - Total Customers: count
  - Active Drivers: count
- Navigation cards with counts:
  - Customers → `/admin/customers` (show total count)
  - Drivers → `/admin/drivers` (show total count)
  - Applications → `/admin/applications` (show pending count)
  - Promotions → `/admin/promotions` (show total count)
- Each card shows icon, title, description, count badge, chevron
- Role info card explains current permissions:
  - Support: "View-only access. Switch to Advanced Ops for full management capabilities."
  - Advanced Ops: "Full access to all admin features and management tools."
- Back button returns to `/home`

**Role Permissions:**
- **Support**: Read-only access to customers, drivers, orders, applications
- **Advanced Ops**: Full CRUD access to all resources

**Data Flow:**
- Load counts from `adminStorage.getCustomers()`, `adminStorage.getDrivers()`, etc.
- Admin role stored in localStorage: `adminStorage.getAdminRole()`, `adminStorage.setAdminRole()`
- Role persists across sessions

---

## 3.2 Customer Management

### Story 3.2.1: View Customers
**Story Points:** 3

**As an** admin
**I want** to see all customers
**So that** I can manage accounts

**Success Criteria:**
- Display page title: "Customers"
- Show search bar to filter customers
- List all customer accounts with:
  - Customer name
  - Phone number
  - Email
  - Join date
  - Number of vehicles
  - Number of orders
  - Account status (Active, Inactive, Suspended)
- Clicking customer row navigates to `/admin/customers/{id}`
- Search filters by name, phone, or email
- Sort options: Name, Join Date, Orders
- Pagination if customer list is long
- Back button returns to `/admin`

---

### Story 3.2.2: View Customer Details
**Story Points:** 3 (Flutter: 2, Backend: 1)

**As an** admin
**I want** to see detailed customer information
**So that** I can assist with support issues

**Success Criteria:**
- Display customer information:
  - Name, phone, email
  - Join date, account status
  - List of vehicles with VIN and mileage data
  - Payment methods on file (masked)
- Show order history for customer:
  - All orders with status, date, amount
  - Clickable to view order details
- Display account members (if applicable)
- Show activity log:
  - Login history
  - Account changes
  - Support tickets
- Advanced Ops only: Edit and suspend buttons
- Support: View-only access

**Data Flow:**
- Load customer by ID
- Load vehicles from garage
- Load orders filtered by customer ID
- All captured VIN/mileage data from driver visible here

---

## 3.3 Driver Management

### Story 3.3.1: View Drivers
**Story Points:** 3

**As an** admin
**I want** to see all drivers
**So that** I can monitor driver fleet

**Success Criteria:**
- Display page title: "Drivers"
- Show search bar to filter drivers
- List all driver accounts with:
  - Driver name
  - Phone number
  - Status (Online, Offline, On Job)
  - Rating (average)
  - Total trips completed
  - Total earnings
  - Join date
  - Background check status
- Clicking driver row navigates to `/admin/drivers/{id}`
- Search filters by name or phone
- Sort options: Name, Rating, Trips, Earnings
- Filter by status: All, Online, Offline, On Job
- Back button returns to `/admin`

---

### Story 3.3.2: View Driver Details
**Story Points:** 5 (Flutter: 3, Backend: 2)

**As an** admin
**I want** to see detailed driver information
**So that** I can manage driver accounts

**Success Criteria:**
- Display driver information:
  - Name, phone, email
  - Driver's license number and state
  - Background check status and date
  - Vehicle information (if applicable)
  - Current status (Online/Offline/On Job)
  - Rating and reviews
- Show earnings summary:
  - Total earnings
  - Earnings this week/month
  - Average earnings per trip
  - Pending payouts
- Display trip history:
  - All completed trips
  - Trip details: date, customer, service, earnings, rating
  - Access to captured photos/videos/data from each trip
- Show all captured data from trips:
  - VINs captured
  - Mileage records
  - Photos and videos
  - Service receipts
  - Payment records
- Advanced Ops only: Deactivate, suspend, adjust earnings
- Support: View-only access

**Data Flow:**
- Load driver by ID
- Load all trips/orders where driver assigned
- Aggregate earnings and stats
- Display all media and data captured during jobs
- Background check status from third-party integration

---

## 3.4 Application Management

### Story 3.4.1: View Driver Applications
**Story Points:** 3

**As an** admin
**I want** to review pending driver applications
**So that** I can approve or reject applicants

**Success Criteria:**
- Display page title: "Applications"
- Show filter: All, Pending, Approved, Rejected
- Default filter: Pending
- List applications with:
  - Applicant name
  - Phone number
  - Application date
  - Status (Pending, Under Review, Approved, Rejected)
  - Background check status
- Clicking application navigates to `/admin/applications/{id}`
- Show pending count badge
- Back button returns to `/admin`

---

### Story 3.4.2: Review Application Details
**Story Points:** 8 (Flutter: 4, Backend: 4)

**As an** admin
**I want** to review complete application details
**So that** I can make approval decisions

**Success Criteria:**
- Display all application data:
  - Personal information (name, phone, email)
  - Location (zip code)
  - Age bracket
  - Driver's license (number, state)
  - Background check results:
    - Identity verification status
    - Criminal history check status
    - Driving record check status
  - Referral code (if used)
  - Application date
  - Current status
- Show background check detailed report (if available)
- Show deposit payment status
- Advanced Ops only: Approve, Reject, Request More Info buttons
- Approve button:
  - Updates status to "Approved"
  - Sends approval notification to applicant
  - Creates driver account
  - Refund timeline information sent
- Reject button:
  - Requires reason for rejection
  - Updates status to "Rejected"
  - Sends rejection notification
  - Processes deposit refund
- Support: View-only, can add notes

**Data Flow:**
- Load application by ID
- Display background check results from third-party service
- Update application status in database
- Trigger notifications via email/SMS service
- Create driver profile if approved

---

## 3.5 Promotions Management

### Story 3.5.1: View Promotions
**Story Points:** 3

**As an** admin
**I want** to see all active promotions
**So that** I can manage marketing offers

**Success Criteria:**
- Display page title: "Promotions"
- List all promotions with:
  - Promotion name
  - Discount amount or type
  - Service category
  - Partner/provider (e.g., "Oil Stop")
  - Start date
  - End date
  - Status (Active, Scheduled, Expired)
  - Usage count
- Advanced Ops only: Create, Edit, Delete buttons
- Support: View-only
- Back button returns to `/admin`

---

### Story 3.5.2: Create/Edit Promotion
**Story Points:** 8 (Flutter: 5, Backend: 3)

**As an** admin (Advanced Ops)
**I want** to create or edit promotions
**So that** I can offer deals to customers

**Success Criteria:**
- Display form fields:
  - Promotion name
  - Description
  - Discount type (Percentage, Fixed Amount, Free Service)
  - Discount value
  - Service category (Quick Lube, Car Wash, etc.)
  - Specific provider/partner (optional)
  - Location restriction (optional)
  - Start date
  - End date
  - Max usage per customer
  - Total max usage
  - Promotional code (optional)
- Save button creates/updates promotion
- Promotion immediately available in customer app if active
- Filter service locations by promotion criteria
- Track usage analytics

**Validation Rules:**
- All required fields must be filled
- End date must be after start date
- Discount value must be positive
- If partner-specific, must select valid partner

**Data Flow:**
- Store promotion in `adminStorage.addPromotion()`
- Promotion visible in home page promotions section
- Filter service locations by promotion.provider
- Apply discount at booking confirmation
- Track usage count and enforce limits

---

## 3.6 Admin Data Access & Integration

### Story 3.6.1: Order Data Visibility
**Story Points:** 5 (Flutter: 3, Backend: 2)

**As an** admin
**I want** to access all order data
**So that** I can troubleshoot and analyze operations

**Success Criteria:**
- Access all order records via admin dashboard
- View complete order details including:
  - Customer information
  - Driver information
  - Vehicle details (year, make, model, color, VIN, mileage)
  - Service details (type, options selected, costs)
  - Route information (pickup, service, delivery locations)
  - Photos captured (VIN, mileage, receipt, vehicle condition)
  - Videos captured (exterior walk-around)
  - Timestamps for all status changes
  - Payment information (amounts, methods, transaction IDs)
  - Driver notes and customer feedback
  - Rating and tip data
- Search and filter orders by:
  - Customer name/phone
  - Driver name/phone
  - Date range
  - Status
  - Service type
  - Vehicle VIN
- Export order data for reporting
- Access media files (photos/videos) associated with orders

**Data Flow:**
- All driver-captured data (VIN, mileage, photos, videos) stored in order record
- VIN and mileage sync to customer's garage vehicle record
- Media files stored in cloud storage, linked to order
- Admin dashboard aggregates data from orders, customers, drivers collections
- Real-time updates when orders change status

---

### Story 3.6.2: Driver Performance Analytics
**Story Points:** 5 (Flutter: 3, Backend: 2)

**As an** admin
**I want** to view driver performance metrics
**So that** I can identify top performers and issues

**Success Criteria:**
- Display driver analytics dashboard:
  - Acceptance rate (jobs accepted / jobs offered)
  - Completion rate (jobs completed / jobs started)
  - Average rating
  - On-time performance
  - Average time per job type
  - Photos/videos compliance (% of jobs with all required media)
  - Payment accuracy (successful payments / attempted payments)
  - Customer feedback summary
- Filter by date range
- Compare drivers side-by-side
- Identify drivers needing coaching or recognition
- Export reports for management review

---

### Story 3.6.3: Customer Data Synchronization
**Story Points:** 3 (Backend: 2, Tech Lead: 1)

**As an** admin
**I want** to ensure data captured by drivers updates customer records
**So that** customers see accurate vehicle information

**Success Criteria:**
- When driver captures VIN at pickup:
  - VIN stored in order.vehicleInfo.vin
  - VIN also updated in customer's garage vehicle record
  - Customer can view VIN in garage vehicle details
- When driver captures mileage:
  - Starting mileage stored in order.vehicleInfo.mileageStart
  - Ending mileage stored in order.vehicleInfo.mileageEnd
  - Latest mileage updated in customer's garage vehicle record
  - Mileage history tracked per vehicle
- Photos and videos:
  - Stored with order, linked to customer and vehicle
  - Accessible to customer on request
  - Available in admin panel for dispute resolution
- All data changes logged with timestamps for audit trail

**Data Flow:**
- Driver captures data → Stored in order record → Synced to customer's garage → Visible in admin panel
- Real-time or near-real-time synchronization
- Data integrity maintained across all systems
- Audit log tracks all data updates with source (driver ID, timestamp, order ID)

---

# APPENDICES

## A. Order Status Flow

### One-Way Service Status Progression:
1. SCHEDULED (if scheduled) or FINDING_DRIVER (if ASAP)
2. DRIVER_ON_WAY
3. CAR_IN_TRANSIT
4. CAR_DELIVERED
5. CANCELLED (terminal state, can occur during SCHEDULED or FINDING_DRIVER only)

### Round-Trip Service Status Progression:
1. SCHEDULED (if scheduled) or FINDING_DRIVER (if ASAP)
2. DRIVER_ON_WAY
3. CAR_AT_SERVICE
4. DRIVER_RETURNING
5. CAR_DELIVERED
6. CANCELLED (terminal state, can occur during SCHEDULED or FINDING_DRIVER only)

## B. Data Models

### Vehicle Object
```typescript
{
  id: string;
  year: string;
  make: string;
  model: string;
  color: string;
  vin?: string; // Populated by driver during pickup
  latestMileage?: number; // Updated by driver at pickup/delivery
  isDefault?: boolean;
  licensePlate?: string;
  createdAt: Date;
}
```

### Order Object
```typescript
{
  id: string;
  customerId: string;
  driverId?: string;
  vehicleInfo: {
    id: string;
    year: string;
    make: string;
    model: string;
    color: string;
    vin?: string; // Captured by driver
    mileageStart?: number; // Captured by driver
    mileageEnd?: number; // Captured by driver
    mileageDriven?: number; // Calculated
    licensePlate?: string;
  };
  pickupLocation: string;
  dropoffLocation: string;
  serviceLocation?: string;
  isRoundTrip: boolean;
  serviceType?: string;
  serviceDetails?: {
    category: string;
    option: string;
    price: number;
  };
  addOns?: {
    carWash?: {name: string; price: number};
    fuelFill?: {name: string; pricePerGallon: number};
  };
  status: OrderStatus;
  scheduledDate?: string;
  scheduledTime?: string;
  deliveryFee: number;
  serviceCost?: number;
  totalCost: number;
  paymentMethodId: string;
  keyHandoffMethod: 'meet' | 'other';
  driverNotes?: string;
  driverInfo?: {
    id: string;
    name: string;
    phone: string;
    rating: number;
    tip?: number;
    ratedAt?: Date;
  };
  photos?: {
    vinPhoto?: string;
    mileageStartPhoto?: string;
    mileageEndPhoto?: string;
    receiptPhoto?: string;
    vehicleDeliveryPhoto?: string;
  };
  videos?: {
    exteriorVideo?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}
```

### Transaction Object (LocalStorage)
```typescript
{
  id: string;
  orderId?: string;
  vehicle: Vehicle;
  destination: string;
  pickupLocation: string;
  timestamp: string;
  status: OrderStatus;
  isRoundTrip: boolean;
}
```

## C. SessionStorage Keys

Booking flow uses these sessionStorage keys:
- `selectedVehicle`: Vehicle object
- `selectedDestination`: String
- `selectedDate`: Formatted date string
- `selectedTime`: Time string (e.g., "9:00 AM")
- `serviceType`: Service category
- `selectedServiceType`: Specific service from URL
- `selectedServiceCategory`: Service category
- `selectedServiceOption`: Service option object
- `selectedCarWash`: Car wash add-on object
- `selectedFuelFill`: Fuel fill add-on object
- `isRoundTrip`: 'true' | 'false' string
- `isOneWayService`: 'true' | 'false' string
- `isOrderPickup`: 'true' | 'false' string
- `isPromotionalOilChange`: 'true' | 'false' string
- `promotionalDiscount`: Discount amount string
- `selectedCardId`: Payment method ID
- `keyHandoffMethod`: 'meet' | 'other'
- `driverNotes`: String
- `orderPickupDetails`: JSON string with vehicleId, destination, pickupLocation

## D. Testing Checklist

### Customer Flow Testing:
- [ ] Complete signup with phone verification
- [ ] Complete signup with Apple ID
- [ ] Complete signup with Google
- [ ] Login with existing account
- [ ] Book one-way service (ASAP)
- [ ] Book one-way service (scheduled)
- [ ] Book round-trip service with service option selection
- [ ] Book with promotional offer
- [ ] Cancel scheduled order
- [ ] Reschedule order
- [ ] Rate driver and add tip
- [ ] Order pickup after delivery
- [ ] Add vehicle to garage (all steps)
- [ ] View vehicle with VIN/mileage from driver
- [ ] Add credit card
- [ ] Set default credit card
- [ ] Delete credit card
- [ ] View activity history
- [ ] Invite and manage users

### Driver Flow Testing:
- [ ] Complete application (all 6 steps)
- [ ] Toggle online/offline status
- [ ] Receive and accept job notification
- [ ] Navigate to pickup
- [ ] Send arrival notification
- [ ] Capture VIN with photo
- [ ] Capture mileage with photo
- [ ] Record exterior video
- [ ] Complete pickup tasks
- [ ] Navigate to service location
- [ ] Complete service tasks (synthetic oil, payment, receipt)
- [ ] Navigate to delivery
- [ ] Capture delivery vehicle photo
- [ ] Capture final mileage
- [ ] Confirm keys delivered
- [ ] Complete job and view earnings
- [ ] View earnings history
- [ ] View trip details

### Admin Flow Testing:
- [ ] Switch between Support and Advanced Ops roles
- [ ] View customer list and details
- [ ] View driver list and details
- [ ] View driver-captured data (VIN, mileage, photos, videos)
- [ ] Review pending applications
- [ ] Approve driver application
- [ ] Reject driver application
- [ ] Create promotion
- [ ] Edit promotion
- [ ] View order with all captured data
- [ ] Export reports

### Data Sync Testing:
- [ ] Verify VIN captured by driver appears in customer garage
- [ ] Verify mileage captured by driver appears in customer garage
- [ ] Verify order status updates reflect in home page
- [ ] Verify transaction in garage matches order status
- [ ] Verify promotional pricing applied correctly
- [ ] Verify add-on services included in order
- [ ] Verify payment processed correctly
- [ ] Verify driver earnings calculated correctly

---

## Document Version
Version: 1.0
Last Updated: 2025-01-XX
Status: Draft for Flutter Implementation

