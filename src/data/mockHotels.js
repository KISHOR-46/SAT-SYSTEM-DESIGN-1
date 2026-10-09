export const mockHotels = [
  {
    hotel_id: 101,
    name: "Grand Palace Hotel",
    location: "Chennai",
    rating: 4.8,
    description: "Luxury hotel in the heart of the city.",
    rooms: [
      { room_id: 201, room_type: "Deluxe", price_per_night: 5000, capacity: 2, availability: 5 },
      { room_id: 202, room_type: "Suite", price_per_night: 12000, capacity: 4, availability: 2 }
    ]
  },
  {
    hotel_id: 102,
    name: "Seaside Resort",
    location: "Goa",
    rating: 4.6,
    description: "Beautiful resort facing the ocean.",
    rooms: [
      { room_id: 203, room_type: "Standard", price_per_night: 3000, capacity: 2, availability: 10 },
      { room_id: 204, room_type: "Ocean View", price_per_night: 6000, capacity: 2, availability: 3 }
    ]
  }
];
