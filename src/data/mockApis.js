export const mockApis = [
  {
    id: 1,
    method: "GET",
    endpoint: "/api/hotels?location=Chennai",
    purpose: "Search hotels.",
    exampleRequest: "GET /api/hotels?location=Chennai HTTP/1.1",
    exampleResponse: JSON.stringify([{ hotel_id: 101, name: "Grand Palace Hotel", location: "Chennai" }], null, 2),
    expectedStatusCodes: "200 OK",
    service: "Hotel Search Service"
  },
  {
    id: 2,
    method: "GET",
    endpoint: "/api/hotels/201/rooms",
    purpose: "Check room availability.",
    exampleRequest: "GET /api/hotels/201/rooms HTTP/1.1",
    exampleResponse: JSON.stringify([{ room_id: 201, room_type: "Deluxe", availability: 5 }], null, 2),
    expectedStatusCodes: "200 OK, 404 Not Found",
    service: "Inventory Service"
  },
  {
    id: 3,
    method: "POST",
    endpoint: "/api/bookings",
    purpose: "Create a booking.",
    exampleRequest: JSON.stringify({ user_id: "u_789", room_id: 201, check_in: "2026-10-10", check_out: "2026-10-12" }, null, 2),
    exampleResponse: JSON.stringify({ booking_id: 5001, status: "Pending" }, null, 2),
    expectedStatusCodes: "201 Created, 400 Bad Request, 409 Conflict",
    service: "Booking Service"
  },
  {
    id: 4,
    method: "POST",
    endpoint: "/api/payments",
    purpose: "Process a payment.",
    exampleRequest: JSON.stringify({ booking_id: 5001, amount: 10000, payment_method: "credit_card" }, null, 2),
    exampleResponse: JSON.stringify({ payment_id: "pay_xyz", status: "Success" }, null, 2),
    expectedStatusCodes: "200 OK, 400 Bad Request",
    service: "Payment Service"
  },
  {
    id: 5,
    method: "GET",
    endpoint: "/api/bookings/5001",
    purpose: "Retrieve booking status.",
    exampleRequest: "GET /api/bookings/5001 HTTP/1.1",
    exampleResponse: JSON.stringify({ booking_id: 5001, status: "Confirmed" }, null, 2),
    expectedStatusCodes: "200 OK, 404 Not Found",
    service: "Booking Service"
  },
  {
    id: 6,
    method: "DELETE",
    endpoint: "/api/bookings/5001",
    purpose: "Cancel a booking.",
    exampleRequest: "DELETE /api/bookings/5001 HTTP/1.1",
    exampleResponse: JSON.stringify({ message: "Booking 5001 cancelled successfully." }, null, 2),
    expectedStatusCodes: "200 OK, 404 Not Found",
    service: "Booking Service"
  }
];
