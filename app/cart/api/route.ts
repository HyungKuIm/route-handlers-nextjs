import { type NextRequest } from "next/server";
import { cartFetch } from "./spring";

export async function GET(request: NextRequest) {
    return cartFetch(request, '/cart');
}
