import { getPostViewCount } from "@/app/utils/stat_tracking_utils";
import { NextResponse, NextRequest } from "next/server";

type Params = Promise<{ id: string }>;

export async function GET(request: NextRequest, { params }: { params: Params }) {
    const { id } = await params;
    const viewCount = await getPostViewCount(id);
    if (viewCount) {
        return NextResponse.json({ status: 200, message: "View count retrieved successfully", payload: { viewCount } });
    } else {
        return NextResponse.json({ status: 404, message: "Post not found" }, { status: 404 });
    }
}