import bcrypt from "bcryptjs";

const password = "Vtop@2026";

const hash = await bcrypt.hash(password, 10);

console.log("");
console.log("=================================");
console.log("Password:");
console.log(password);
console.log("");
console.log("Bcrypt Hash:");
console.log(hash);
console.log("=================================");