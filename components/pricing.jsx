"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Heart, Sparkles, Zap } from "lucide-react"

export function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      description: "Perfect for getting started with your personal growth journey",
      features: [
        "5 journal entries per month",
        "Basic mood tracking",
        "Simple analytics",
        "Community access",
        "Mobile app access",
      ],
      limitations: ["Limited AI insights", "Basic export options", "Standard support"],
      buttonText: "Get Started Free",
      buttonVariant: "outline",
      popular: false,
    },
    {
      name: "Pro",
      price: "₹299",
      period: "per month",
      description: "Unlock your full potential with advanced features and unlimited access",
      features: [
        "Unlimited journal entries",
        "Advanced mood & energy tracking",
        "Detailed analytics & insights",
        "AI-powered personal insights",
        "Goal tracking & achievements",
        "Premium community features",
        "Export to PDF & other formats",
        "Priority customer support",
        "Advanced charts & visualizations",
        "Custom tags & categories",
      ],
      buttonText: "Start Pro Trial",
      buttonVariant: "default",
      popular: true,
      savings: "Save ₹588 annually",
    },
    {
      name: "Premium",
      price: "₹499",
      period: "per month",
      description: "For serious growth enthusiasts who want the ultimate experience",
      features: [
        "Everything in Pro",
        "1-on-1 coaching sessions (2/month)",
        "Personalized growth plans",
        "Advanced AI recommendations",
        "Integration with fitness apps",
        "Custom habit tracking",
        "White-label journaling",
        "API access for developers",
        "Advanced data analytics",
        "24/7 premium support",
        "Early access to new features",
      ],
      buttonText: "Go Premium",
      buttonVariant: "default",
      popular: false,
      savings: "Save ₹998 annually",
    },
  ]

  return (
    <div className="py-16 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-emerald-600" />
            <h2 className="text-3xl font-bold font-poppins bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Choose Your Growth Plan
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start your personal transformation journey with plans designed for every stage of growth
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={plan.name}
              className={`relative bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                plan.popular ? "ring-2 ring-emerald-500 ring-offset-2" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-1">
                    <Crown className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-poppins">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">/{plan.period}</span>
                </div>
                {plan.savings && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 mt-2">
                    {plan.savings}
                  </Badge>
                )}
                <CardDescription className="mt-4">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <Button
                  className={`w-full ${
                    plan.buttonVariant === "default"
                      ? "bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                      : ""
                  }`}
                  variant={plan.buttonVariant}
                  size="lg"
                >
                  {plan.buttonText}
                </Button>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    What's included:
                  </h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.limitations && (
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-700 text-sm mb-2">Limitations:</h4>
                    <ul className="space-y-1">
                      {plan.limitations.map((limitation, limitIndex) => (
                        <li key={limitIndex} className="text-xs text-gray-500">
                          • {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-12 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-lg">
              <Sparkles className="w-6 h-6 text-emerald-600" />
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">7-Day Free Trial</h4>
                <p className="text-sm text-gray-600">Try Pro features risk-free</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-lg">
              <Zap className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Cancel Anytime</h4>
                <p className="text-sm text-gray-600">No long-term commitments</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-lg">
              <Heart className="w-6 h-6 text-purple-600" />
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Money-Back Guarantee</h4>
                <p className="text-sm text-gray-600">30-day satisfaction guarantee</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-white/60 backdrop-blur-sm rounded-lg max-w-2xl mx-auto">
            <h3 className="font-semibold text-gray-900 mb-2">🇮🇳 Made for India</h3>
            <p className="text-sm text-gray-600">
              Pricing designed for Indian users. All payments processed securely in INR. UPI, Credit/Debit cards, and
              Net Banking accepted.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
