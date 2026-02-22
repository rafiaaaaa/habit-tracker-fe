import { Button } from "@/components/ui/button";
import { Check, X, Sparkles } from "lucide-react";
import { useCreatePaymentLink } from "../api/createPaymentLink";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      { text: "Up to 5 habits", included: true },
      { text: "Basic analytics", included: true },
      { text: "7-day history", included: true },
      { text: "Daily reminders", included: true },
      { text: "Unlimited habits", included: false },
      { text: "Full analytics", included: false },
      { text: "Export to CSV/PDF", included: false },
      { text: "Advanced charts", included: false },
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For serious habit builders",
    features: [
      { text: "Unlimited habits", included: true },
      { text: "Full analytics", included: true },
      { text: "Unlimited history", included: true },
      { text: "Daily reminders", included: true },
      { text: "Export to CSV/PDF", included: true },
      { text: "Advanced charts", included: true },
      { text: "Priority support", included: true },
      { text: "Early access to features", included: true },
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
];

export function Pricing() {
  const {
    mutate: createPaymentLinkMutation,
    isPending: createPaymentLinkIsLoading,
  } = useCreatePaymentLink();

  const handleCreateSubscription = () => {
    createPaymentLinkMutation(undefined, {
      onSuccess: (data) => {
        console.log(data);
        window.location.href = data.url;
      },
    });
  };
  return (
    <section className="py-24 relative" id="pricing">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade when you're ready for more power.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 ${
                plan.popular ? "gradient-border glow-primary" : "glass"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-success shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground shrink-0" />
                    )}
                    <span
                      className={
                        feature.included ? "" : "text-muted-foreground"
                      }
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? "glow" : "outline"}
                size="lg"
                className="w-full"
                disabled={createPaymentLinkIsLoading}
                onClick={handleCreateSubscription}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
