const ORDERS_KEY = "vtop_xerox_orders";
const DB_NAME = "vtop_xerox_documents";
const STORE_NAME = "documents";

function readOrders() {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]"); }
  catch { return []; }
}

function writeOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveDocument(orderId, file) {
  if (!file) return;
  const db = await openDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(file, orderId);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function getDocument(orderId) {
  const db = await openDb();
  const result = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).get(orderId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return result;
}

export async function deleteDocument(orderId) {
  try {
    const db = await openDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).delete(orderId);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch { /* frontend demo cleanup only */ }
}

export function generatePickupCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function createXeroxOrder({ file, user, pages, copies, printType, paper, sides, pickup, total }) {
  const orderId = `XRX-${Date.now().toString().slice(-8)}`;
  const pickupCode = generatePickupCode();
  const order = {
    id: orderId,
    pickupCode,
    fileName: file.name,
    fileType: file.type || "application/octet-stream",
    fileSize: file.size,
    studentName: user?.name || "Student",
    studentId: user?.username || user?.registerNo || "STUDENT",
    pages: Number(pages),
    copies: Number(copies),
    printType,
    paper,
    sides,
    pickup,
    total,
    status: "submitted",
    createdAt: new Date().toISOString(),
    collectedAt: null
  };

  const orders = readOrders();
  orders.unshift(order);
  writeOrders(orders);
  await saveDocument(orderId, file);
  return order;
}

export function getXeroxOrders() {
  return readOrders();
}

export function getStudentXeroxOrders(studentId) {
  return readOrders().filter(order => order.studentId === studentId);
}

export function getXeroxOrder(orderId) {
  return readOrders().find(order => order.id === orderId) || null;
}

export function updateXeroxOrderStatus(orderId, status) {
  const orders = readOrders();
  const index = orders.findIndex(order => order.id === orderId);
  if (index === -1) return null;
  orders[index] = { ...orders[index], status, ...(status === "collected" ? { collectedAt: new Date().toISOString() } : {}) };
  writeOrders(orders);
  return orders[index];
}

export function verifyPickupCode(orderId, enteredCode) {
  const orders = readOrders();
  const index = orders.findIndex(order => order.id === orderId);
  if (index === -1) return { ok: false, message: "Order not found." };
  const order = orders[index];
  if (order.status === "collected") return { ok: false, message: "This order has already been collected." };
  if (String(order.pickupCode).toUpperCase() !== String(enteredCode).trim().toUpperCase()) {
    return { ok: false, message: "Code does not match. Ask the student to provide the 6-character pickup code." };
  }
  orders[index] = { ...order, status: "collected", collectedAt: new Date().toISOString() };
  writeOrders(orders);
  return { ok: true, order: orders[index] };
}
