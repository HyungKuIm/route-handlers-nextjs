import { type NextRequest } from "next/server";
import { cartFetch } from "../../spring";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ dogId: string }> }
) {
    const { dogId } = await params;

    return cartFetch(request, `/cart/items/${dogId}`, { method: 'DELETE' });
}
