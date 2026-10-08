const REQUESTS_KEY = "vtop_campus_requests";

function readRequests() {
  const storedRequests = localStorage.getItem(REQUESTS_KEY);
  if (!storedRequests) return [];

  try {
    const requests = JSON.parse(storedRequests);
    if (!Array.isArray(requests)) throw new Error("Stored requests are not a list.");
    return requests;
  } catch (error) {
    throw new Error("Unable to load saved requests. Please clear the invalid request data and try again.", { cause: error });
  }
}

function writeRequests(requests) {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
}

export function getStudentRequests(studentId) {
  return readRequests().filter(request => request.studentId === studentId);
}

export function createRequest({ subject, message, user }) {
  const trimmedSubject = subject.trim();
  const trimmedMessage = message.trim();
  if (!trimmedSubject || !trimmedMessage) {
    throw new Error("Enter a subject and query details before submitting.");
  }

  const studentId = user?.username || user?.registerNo || "student";
  const request = {
    id: `REQ-${Date.now()}`,
    studentId,
    studentName: user?.name || "Student",
    subject: trimmedSubject,
    message: trimmedMessage,
    status: "Pending",
    createdAt: new Date().toISOString()
  };

  const requests = readRequests();
  requests.unshift(request);
  writeRequests(requests);
  return request;
}
