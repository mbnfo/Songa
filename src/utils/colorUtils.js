

// ✅ Simple palette to cycle through
const palette = [
  "#4363d8", // Blue
  "#e6194b", // Red
  "#ffe119", // Yellow
  "#46f0f0", // Cyan
  "#f58231", // Orange
  "#911eb4", // Purple
  "#008080", // Teal
  "#800000", // Maroon
  "#808000", // Olive
  "#000075", // Navy
];

// ✅ Load existing assignments from localStorage
let driverColorMap = JSON.parse(localStorage.getItem("driverColorMap")) || {};

// ✅ Function to get color for a driver name
export function getDriverColor(name) {
  if (!name) return "#999999"; // fallback
    let driverColorMap = JSON.parse(localStorage.getItem("driverColorMap")) || {};
  if (driverColorMap[name]) return driverColorMap[name];

  const palette = [
    "#4363d8", "#e6194b", "#ffe119", "#46f0f0",
    "#f58231", "#911eb4", "#008080", "#800000",
    "#808000", "#000075"
  ];



  // Assign next color from palette
  const color = palette[Object.keys(driverColorMap).length % palette.length];
  driverColorMap[name] = color;

  // ✅ Save updated map to localStorage
  localStorage.setItem("driverColorMap", JSON.stringify(driverColorMap));

  return color;
}

// ✅ Optional: clear all assignments (call manually if needed)
export function resetDriverColors() {
  driverColorMap = {};
  localStorage.removeItem("driverColorMap");
}