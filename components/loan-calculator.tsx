"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calculator, DollarSign } from "lucide-react"

interface LoanCalculatorProps {
  trigger?: React.ReactNode
}

export function LoanCalculator({ trigger }: LoanCalculatorProps) {
  const [loanAmount, setLoanAmount] = useState("")
  const [interestRate, setInterestRate] = useState("")
  const [loanTerm, setLoanTerm] = useState("")
  const [emi, setEmi] = useState<number | null>(null)
  const [totalPayment, setTotalPayment] = useState<number | null>(null)
  const [totalInterest, setTotalInterest] = useState<number | null>(null)

  const calculateEMI = () => {
    const principal = Number.parseFloat(loanAmount)
    const rate = Number.parseFloat(interestRate) / 100 / 12 // Monthly interest rate
    const time = Number.parseFloat(loanTerm) * 12 // Total months

    if (principal <= 0 || rate < 0 || time <= 0) {
      alert("Please enter valid positive numbers")
      return
    }

    if (rate === 0) {
      // If interest rate is 0, EMI is simply principal divided by time
      const monthlyPayment = principal / time
      setEmi(monthlyPayment)
      setTotalPayment(principal)
      setTotalInterest(0)
    } else {
      // Standard EMI calculation formula
      const emiValue = (principal * rate * Math.pow(1 + rate, time)) / (Math.pow(1 + rate, time) - 1)
      const totalPaymentValue = emiValue * time
      const totalInterestValue = totalPaymentValue - principal

      setEmi(emiValue)
      setTotalPayment(totalPaymentValue)
      setTotalInterest(totalInterestValue)
    }
  }

  const resetCalculator = () => {
    setLoanAmount("")
    setInterestRate("")
    setLoanTerm("")
    setEmi(null)
    setTotalPayment(null)
    setTotalInterest(null)
  }

  const defaultTrigger = (
    <Button variant="outline" className="flex items-center gap-2 bg-transparent">
      <Calculator className="h-4 w-4" />
      Loan Calculator
    </Button>
  )

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Loan EMI Calculator
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="loan-amount">Loan Amount ($)</Label>
              <Input
                id="loan-amount"
                type="number"
                placeholder="e.g., 250000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="interest-rate">Annual Interest Rate (%)</Label>
              <Input
                id="interest-rate"
                type="number"
                step="0.01"
                placeholder="e.g., 6.5"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="loan-term">Loan Term (Years)</Label>
              <Input
                id="loan-term"
                type="number"
                placeholder="e.g., 30"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={calculateEMI} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              Calculate EMI
            </Button>
            <Button onClick={resetCalculator} variant="outline">
              Reset
            </Button>
          </div>

          {emi !== null && (
            <Card className="p-4 bg-accent/50">
              <h4 className="font-serif font-semibold text-foreground mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Calculation Results
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly EMI:</span>
                  <span className="font-semibold text-foreground">${emi.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Payment:</span>
                  <span className="font-semibold text-foreground">${totalPayment?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Interest:</span>
                  <span className="font-semibold text-foreground">${totalInterest?.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          )}

          <div className="text-xs text-muted-foreground">
            <p>
              <strong>Note:</strong> This calculator provides estimates for educational purposes. Consult with a
              financial advisor for personalized advice.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
