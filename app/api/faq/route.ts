import { NextResponse } from "next/server";
import Fuse from "fuse.js";
import { faqs } from "@/data/faqs";

const options = {
  keys: ["question", "category"],
  threshold: 0.4,
};

const fuse = new Fuse(faqs, options);

export async function POST(req: Request) {
  const { question } = await req.json();

  const result = fuse.search(question);

  if (result.length > 0) {
    const matched = result[0].item;
    return NextResponse.json({
      answer: `[${matched.category}] ${matched.answer}`,
    });
  }

  return NextResponse.json({
    answer:
      "I'm sorry, I couldn’t find an answer to that. Please contact support@mrsac-isms.in for help.",
  });
}
