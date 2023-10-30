export default function parseError(error: any): string {
  let displayMessage: string[] = [];
  try {
    const errorMessage = JSON.parse(error.message);
    errorMessage.forEach((message: { message: string; path: string[] }) => {
      displayMessage.push(message.path.join(", ") + ": " + message.message);
    });
  } catch (e) {
    try {
      displayMessage.push(error.message);
    } catch (f) {
      try {
        displayMessage.push(error.toString());
      } catch (g) {
        displayMessage.push("Unknown Error");
      }
    }
  }
  return displayMessage
    .map((s) => (s.length > 120 ? s.substring(0, 117) + "..." : s))
    .join("\n");
}
