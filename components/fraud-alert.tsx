"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertTriangle, Phone, ExternalLink } from "lucide-react"

interface FraudAlertProps {
  isOpen: boolean
  onClose: () => void
}

export function FraudAlert({ isOpen, onClose }: FraudAlertProps) {
  const emergencyContacts = [
    {
      name: "Federal Trade Commission (FTC)",
      phone: "1-877-FTC-HELP (1-877-382-4357)",
      website: "https://reportfraud.ftc.gov",
    },
    {
      name: "FBI Internet Crime Complaint Center",
      phone: "N/A (Online Only)",
      website: "https://www.ic3.gov",
    },
    {
      name: "AARP Fraud Watch Network",
      phone: "1-877-908-3360",
      website: "https://www.aarp.org/money/scams-fraud",
    },
  ]

  const securityTips = [
    "Never share personal information like Social Security numbers, bank account details, or passwords with anyone online or over the phone.",
    "Legitimate financial institutions will never ask for sensitive information via email, text, or unsolicited phone calls.",
    "Be suspicious of urgent requests for money transfers, gift cards, or cryptocurrency payments.",
    "Always verify the identity of anyone requesting financial information by calling the official number of the institution directly.",
    "If an investment opportunity sounds too good to be true, it probably is. Research thoroughly before investing.",
    "Never click on suspicious links or download attachments from unknown sources.",
    "Use strong, unique passwords for all financial accounts and enable two-factor authentication when available.",
    "Regularly monitor your bank and credit card statements for unauthorized transactions.",
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Shield className="h-5 w-5" />
            Security Alert - Potential Fraud Risk Detected
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Your message contains keywords that are commonly associated with financial scams or fraud attempts. Please
              review the security information below to protect yourself.
            </AlertDescription>
          </Alert>

          <Card className="p-4 bg-destructive/5 border-destructive/20">
            <h3 className="font-serif font-semibold text-foreground mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-destructive" />
              Important Security Tips
            </h3>
            <ul className="space-y-2 text-sm">
              {securityTips.map((tip, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-destructive font-semibold mt-0.5">•</span>
                  <span className="text-muted-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-4">
            <h3 className="font-serif font-semibold text-foreground mb-3 flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Emergency Contacts & Resources
            </h3>
            <div className="space-y-3">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="border border-border rounded-lg p-3">
                  <h4 className="font-semibold text-foreground mb-1">{contact.name}</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      <a
                        href={contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {contact.website}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Remember:</strong> FinMate is an AI assistant for educational purposes only. If you believe you
              are a victim of fraud, contact the authorities immediately and your financial institutions.
            </AlertDescription>
          </Alert>

          <div className="flex gap-2 justify-end">
            <Button onClick={onClose} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              I Understand
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
