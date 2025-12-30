export const indianNames = [
  "Amit Kumar", "Priya Sharma", "Rahul Verma", "Sneha Singh",
  "Ankit Raj", "Neha Gupta", "Rohit Mishra", "Pooja Patel",
  "Vikas Yadav", "Shreya Roy", "Abhishek Tiwari", "Kajal Das",
];

export const reviewComments = {
  veg: [
    "Very tasty and fresh, felt like home food 😋",
    "Paneer was soft and gravy was perfect.",
    "Good portion size and well cooked.",
  ],
  "non-veg": [
    "Chicken was juicy and full of flavour 🔥",
    "Loved the spices, not too oily.",
    "Best non-veg dish I’ve had recently.",
  ],
  briyani: [
    "Rice was aromatic and chicken was tender.",
    "Perfect masala balance, loved it!",
    "Authentic biryani taste, worth the price.",
  ],
  chinese: [
    "Proper street-style Chinese taste.",
    "Chilli chicken was spicy and crispy.",
    "Good quantity and flavourful.",
  ],
  thali: [
    "Complete meal, very satisfying.",
    "Everything was balanced and tasty.",
    "Worth every rupee.",
  ],
};

export const randomRating = () =>
  Math.random() < 0.7 ? 5 : 4; // realistic bias

export const randomPastDate = () => {
  const daysAgo = Math.floor(Math.random() * 30); // last 30 days
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
};
