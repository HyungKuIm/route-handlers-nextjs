import { redirect } from "next/navigation";
import { comments } from "../data";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }>}
) {
    const { id } = await params;
    if (parseInt(id) > comments.length) {
        redirect("/comments");
    }
    const comment = comments.find(
        (comment) => comment.id === parseInt(id)
    );
    return Response.json(comment);
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }>}
) {
    const { id } = await params;
    const body = await request.json();
    const { text } = body;

    const index = comments.findIndex(
        (comment) => comment.id === parseInt(id)
    );
    comments[index].text = text;
    return Response.json(comments[index]);
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }>}
) {
    const { id } = await params;

    const index = comments.findIndex(
        (comment) => comment.id === parseInt(id)
    );
    
    const deletedComment = comments[index];
    comments.splice(index, 1);
    return Response.json(deletedComment);
}