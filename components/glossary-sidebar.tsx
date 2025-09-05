"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Search, BookOpen } from "lucide-react"

interface GlossaryTerm {
  term: string
  definition: string
  category: string
}

const FINANCIAL_TERMS: GlossaryTerm[] = [
  {
    term: "APR",
    definition:
      "Annual Percentage Rate - The yearly cost of a loan including interest and fees, expressed as a percentage.",
    category: "Loans",
  },
  {
    term: "Asset",
    definition: "Something of value that you own, such as cash, investments, real estate, or personal property.",
    category: "General",
  },
  {
    term: "Budget",
    definition: "A plan for how you will spend and save your money over a specific period, typically monthly.",
    category: "Budgeting",
  },
  {
    term: "Compound Interest",
    definition:
      "Interest calculated on both the initial principal and previously earned interest, leading to exponential growth over time.",
    category: "Investing",
  },
  {
    term: "Credit Score",
    definition: "A numerical representation of your creditworthiness, typically ranging from 300 to 850.",
    category: "Credit",
  },
  {
    term: "Diversification",
    definition: "Spreading investments across different asset classes to reduce risk.",
    category: "Investing",
  },
  {
    term: "Emergency Fund",
    definition: "Money set aside to cover unexpected expenses, typically 3-6 months of living expenses.",
    category: "Savings",
  },
  {
    term: "ETF",
    definition:
      "Exchange-Traded Fund - A type of investment fund that trades on stock exchanges like individual stocks.",
    category: "Investing",
  },
  {
    term: "FICO Score",
    definition: "A specific type of credit score created by the Fair Isaac Corporation, widely used by lenders.",
    category: "Credit",
  },
  {
    term: "401(k)",
    definition: "An employer-sponsored retirement savings plan that allows employees to contribute pre-tax dollars.",
    category: "Retirement",
  },
  {
    term: "IRA",
    definition: "Individual Retirement Account - A tax-advantaged account for retirement savings.",
    category: "Retirement",
  },
  {
    term: "Liability",
    definition: "Money you owe to others, such as loans, credit card debt, or mortgages.",
    category: "General",
  },
  {
    term: "Liquidity",
    definition: "How quickly and easily an asset can be converted to cash without losing value.",
    category: "Investing",
  },
  {
    term: "Net Worth",
    definition: "Your total assets minus your total liabilities - essentially what you own minus what you owe.",
    category: "General",
  },
  {
    term: "Principal",
    definition: "The original amount of money borrowed in a loan or invested, excluding interest.",
    category: "Loans",
  },
  {
    term: "ROI",
    definition:
      "Return on Investment - A measure of the efficiency of an investment, calculated as gain/loss divided by cost.",
    category: "Investing",
  },
  {
    term: "Roth IRA",
    definition: "A retirement account funded with after-tax dollars, allowing tax-free withdrawals in retirement.",
    category: "Retirement",
  },
  {
    term: "Stock",
    definition: "A share of ownership in a company that can be bought and sold on stock exchanges.",
    category: "Investing",
  },
  {
    term: "Bond",
    definition: "A loan you give to a company or government in exchange for regular interest payments.",
    category: "Investing",
  },
  {
    term: "Mortgage",
    definition: "A loan used to purchase real estate, typically repaid over 15-30 years.",
    category: "Loans",
  },
]

interface GlossarySidebarProps {
  isOpen: boolean
}

export function GlossarySidebar({ isOpen }: GlossarySidebarProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTerms = FINANCIAL_TERMS.filter(
    (item) =>
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!isOpen) return null

  return (
    <div className="w-80 bg-card border border-border rounded-lg shadow-medium">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="h-5 w-5 text-primary" />
          <h3 className="font-serif font-semibold text-foreground">Financial Glossary</h3>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search terms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <ScrollArea className="h-[500px] p-4">
        <div className="space-y-3">
          {filteredTerms.map((item) => (
            <Card key={item.term} className="p-3 hover:bg-accent/50 transition-colors">
              <div className="flex items-start justify-between mb-1">
                <h4 className="font-semibold text-foreground">{item.term}</h4>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{item.category}</span>
              </div>
              <p className="text-sm text-muted-foreground">{item.definition}</p>
            </Card>
          ))}
          {filteredTerms.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No terms found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
