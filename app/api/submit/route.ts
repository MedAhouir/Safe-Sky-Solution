// app/api/submit/route.ts
import { google } from "googleapis";

type SheetForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SheetForm;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });

    const sheets = google.sheets({
      auth,
      version: "v4",
    });

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "A1:D1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [body.firstName, body.lastName, body.email, body.phone],
        ],
      },
    });

    return new Response(
      JSON.stringify({ data: response.data }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({ message: "Something went wrong" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({ message: "Only POST request allowed" }),
    { status: 405, headers: { "Content-Type": "application/json" } }
  );
}
