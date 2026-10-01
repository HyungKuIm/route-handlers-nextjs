import { type NextRequest } from "next/server";
import { cartFetch } from "../spring";

// body: { dogId, quantity } → Spring CartItemRequest
export async function POST(request: NextRequest) {
    const body = await request.json();

    return cartFetch(request, '/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
}
