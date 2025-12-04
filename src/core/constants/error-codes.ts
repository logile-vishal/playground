export const SERVER_ERROR_CODES = {
  "TM-1001": {
    code: "TM-1001",
    reason:
      "Wrong date format, email without @, phone number with letters, etc.",
  },
  "TM-1002": {
    code: "TM-1002",
    reason: "User submits a form without filling in mandatory fields.",
  },
  "TM-1003": {
    code: "TM-1003",
    reason: "Missing Content-Type: application/json or authorization headers.",
  },
  "TM-1004": {
    code: "TM-1004",
    reason: "Frontend sends improperly structured JSON",
  },
  "TM-1005": {
    code: "TM-1005",
    reason: "Entering text where a number is expected, or vice versa.",
  },
  "TM-1006": {
    code: "TM-1006",
    reason:
      "Password and confirm password don’t match, or start/end dates are inconsistent.",
  },
  "TM-1007": {
    code: "TM-1007",
    reason:
      "Users disable JavaScript or manipulate the DOM to bypass validation.",
  },
  "TM-1008": {
    code: "TM-1008",
    reason: "Malicious input like <script> tags or SQL-like strings.",
  },
  "TM-1009": {
    code: "TM-1009",
    reason:
      "Special characters not properly encoded before sending to backend.",
  },
  "TM-1010": {
    code: "TM-1010",
    reason: "Unsupported file types, oversized files, or corrupted files.",
  },

  "TM-2001": {
    code: "TM-2001",
    reason:
      "Jackson fails to convert JSON to Java objects due to format issues.",
  },
  "TM-2002": {
    code: "TM-2002",
    reason:
      "Invalid tokens, missing credentials, or unauthorized access attempts.",
  },
  "TM-2003": {
    code: "TM-2003",
    reason:
      "Input passes validation but violates business rules (e.g.,  past date task creation).",
  },
  "TM-2004": {
    code: "TM-2004",
    reason: "Too many requests in a short time from the frontend.",
  },

  "TM-3001": {
    code: "TM-3001",
    reason: "Incorrect DB URL, username, or password.",
  },
  "TM-3002": {
    code: "TM-3002",
    reason: "Spring Boot can't find the driver class for the database.",
  },
  "TM-3003": {
    code: "TM-3003",
    reason: "Causes issues in query generation or schema creation.",
  },
  "TM-3004": {
    code: "TM-3004",
    reason: "DB server is down or network issues prevent connection.",
  },
  "TM-3005": {
    code: "TM-3005",
    reason: "TableNotFoundException, ColumnNotFoundException.",
  },
  "TM-3006": {
    code: "TM-3006",
    reason:
      "Mapping a String to an INT column, causing DataIntegrityViolationException.",
  },
  "TM-3007": {
    code: "TM-3007",
    reason: "JPA requires an @Id field for entity management.",
  },
};
