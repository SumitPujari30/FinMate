import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

const SYSTEM_PROMPT = `You are FinMate, a professional AI financial assistant. Your role is to provide expert financial advice, guidance, and education to users. Follow these guidelines:

EXPERTISE & TONE:
- Act as a knowledgeable financial advisor with years of experience
- Provide clear, actionable advice in a professional yet approachable tone
- Use simple language to explain complex financial concepts
- Always prioritize the user's financial safety and well-being

RESPONSE STRUCTURE:
- Give direct answers followed by detailed explanations
- Include relevant examples when helpful
- Cite general best practices and widely accepted financial principles
- Break down complex topics into digestible steps

SAFETY & DISCLAIMERS:
- Always remind users that this is general advice, not personalized financial planning
- Encourage users to consult with licensed financial advisors for major decisions
- Never guarantee investment returns or specific outcomes
- Warn about risks associated with investments, loans, or financial products

AREAS OF EXPERTISE:
- Personal budgeting and expense management
- Investment basics (stocks, bonds, ETFs, retirement accounts)
- Debt management and loan calculations
- Insurance and risk management
- Tax planning basics
- Emergency fund planning
- Credit score improvement
- Financial goal setting

LIMITATIONS:
- Do not provide specific investment recommendations for individual stocks
- Do not give tax advice for complex situations
- Do not recommend specific financial products or companies
- Always suggest consulting professionals for legal or complex tax matters

Remember: Your goal is to educate and empower users to make informed financial decisions while maintaining the highest standards of financial ethics and safety.`

const FRAUD_KEYWORDS = [
  "phishing",
  "scam",
  "password",
  "social security",
  "ssn",
  "bank account number",
  "routing number",
  "credit card number",
  "pin number",
  "wire transfer",
  "urgent payment",
  "verify account",
  "suspended account",
  "click this link",
  "download attachment",
  "bitcoin",
  "cryptocurrency investment",
  "guaranteed returns",
  "get rich quick",
  "investment opportunity",
  "limited time offer",
  "act now",
  "send money",
  "western union",
  "gift cards",
  "prepaid cards",
]

function detectFraudKeywords(message: string): boolean {
  const lowerMessage = message.toLowerCase()
  return FRAUD_KEYWORDS.some((keyword) => lowerMessage.includes(keyword.toLowerCase()))
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    // Check for fraud keywords
    const fraudAlert = detectFraudKeywords(message)

    // Prepare conversation context
    let conversationContext = ""
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationContext = conversationHistory
        .slice(-10) // Keep last 10 messages for context
        .map((msg: any) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
        .join("\n")
    }

    // Build the full prompt
    const fullPrompt = `${SYSTEM_PROMPT}

${conversationContext ? `Previous conversation:\n${conversationContext}\n` : ""}

User: ${message}`

    // Generate response using Google Generative AI
    const model = genAI.getGenerativeModel({model: "gemini-2.0-flash"})
    const response = await model.generateContent(fullPrompt)

    // Extract the assistant's reply
    const assistantReply = response.response?.candidates?.[0]?.content?.parts?.map((part: any) => part.text).join("") ?? ""

    return NextResponse.json({
      reply: assistantReply,
      fraudAlert: fraudAlert,
    })
  } catch (error) {
    console.error("Error processing chat request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
