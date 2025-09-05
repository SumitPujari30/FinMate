import { ChatInterface } from "@/components/chat-interface"
import { ThemeToggle } from "@/components/theme-toggle"
import { Bot, TrendingUp, Shield, Calculator } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-serif font-semibold text-foreground">FinMate</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6 text-balance">
            Your Intelligent Financial Companion
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Get expert financial advice, calculate loans, explore financial terms, and make informed decisions with our
            AI-powered assistant.
          </p>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-serif font-semibold text-foreground mb-2">Expert Advice</h3>
              <p className="text-sm text-muted-foreground">
                Get personalized financial guidance powered by advanced AI
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
              <Calculator className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-serif font-semibold text-foreground mb-2">Financial Tools</h3>
              <p className="text-sm text-muted-foreground">Access loan calculators and financial planning utilities</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
              <Shield className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-serif font-semibold text-foreground mb-2">Fraud Protection</h3>
              <p className="text-sm text-muted-foreground">Built-in security alerts and fraud detection features</p>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Interface */}
      <ChatInterface />
    </div>
  )
}
