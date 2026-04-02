import React from 'react';
import { CircleCheck as CheckCircle, Clock, TrendingUp } from 'lucide-react';

const TierSelection = ({ selectedTier, onSelectTier }) => {
  const tiers = [
    {
      id: 1,
      name: "Solopreneur Automation Sprint",
      price: "$150",
      target: "Solopreneurs & Freelancers",
      turnaround: "48-72 hours",
      features: [
        "Quick Process Audit",
        "3-5 No-Code Solutions",
        "n8n/Zapier Workflows",
        "ROI Calculator",
        "12-Page Action Plan"
      ]
    },
    {
      id: 2,
      name: "Small Business Growth Pack",
      price: "$375",
      target: "Small Businesses (5-25 employees)",
      turnaround: "5-7 days",
      features: [
        "Full Process Mapping",
        "8-12 Automation Solutions",
        "MCDA Scoring",
        "Integration Roadmap",
        "20-Page Strategic Report"
      ]
    },
    {
      id: 3,
      name: "SMB Transformation Suite",
      price: "$750",
      target: "Medium Businesses (25-100 employees)",
      turnaround: "10-14 days",
      features: [
        "Complete MCDA Analysis",
        "Advanced AI Solutions",
        "Compliance Assessment",
        "Custom Implementation Plan",
        "35-Page Executive Report"
      ],
      popular: true
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Choose Your Audit Tier
        </h1>
        <p className="text-lg text-slate-600">
          Select the service level that matches your business needs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`relative bg-white rounded-lg border-2 transition-all cursor-pointer ${
              selectedTier === tier.id
                ? 'border-yellow-500 shadow-xl scale-105'
                : 'border-slate-200 hover:border-yellow-300 hover:shadow-lg'
            }`}
            onClick={() => onSelectTier(tier.id)}
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
            )}

            <div className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {tier.name}
                </h3>
                <div className="text-4xl font-bold text-yellow-600 mb-2">
                  {tier.price}
                </div>
                <p className="text-sm text-slate-600">{tier.target}</p>
              </div>

              <div className="flex items-center justify-center gap-2 mb-6 text-slate-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{tier.turnaround}</span>
              </div>

              <div className="space-y-3 mb-6">
                {tier.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  selectedTier === tier.id
                    ? 'bg-yellow-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-yellow-50'
                }`}
              >
                {selectedTier === tier.id ? 'Selected' : 'Select Tier'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedTier && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-800 px-6 py-3 rounded-lg">
            <TrendingUp className="w-5 h-5" />
            <span className="font-semibold">
              Tier {selectedTier} selected - Continue to client discovery
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TierSelection;
