import React, { useState } from 'react';
import { CheckCircle, Clock, CreditCard, Shield, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import Footer from '../components/Footer';

const Billing = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [faqs, setFaqs] = useState({
    faq1: false,
    faq2: false,
    faq3: false,
    faq4: false
  });

  const toggleFAQ = (key) => {
    setFaqs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Calculate prices based on billing period
  const getPriceDisplay = (monthlyPrice) => {
    // Ensure that monthlyPrice is a valid number
    if (typeof monthlyPrice !== 'number' || isNaN(monthlyPrice) || monthlyPrice === undefined) {
      console.error("Invalid monthly price:", monthlyPrice);
      return {
        main: "0.00", // Default value when invalid
        period: "/month",
        savings: ""
      };
    }
  
    // Logic for yearly price
    if (billingPeriod === 'yearly') {
      const yearlyPrice = (monthlyPrice * 10).toFixed(2); // 2 months free
      return {
        main: yearlyPrice,
        period: '/year',
        savings: '(Save 16%)'
      };
    }
  
    // Logic for monthly price
    return {
      main: monthlyPrice.toFixed(2),
      period: '/month',
      savings: ''
    };
  };
  

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      monthlyPrice: 29,
      description: 'Perfect for individuals and small businesses',
      features: [
        'Up to 100 attendees per event',
        '3 events per month',
        'Basic analytics',
        'Email support',
        'Zoom integration'
      ],
      icon: <Clock className="w-6 h-6 text-blue-500" />
    },
    {
      id: 'pro',
      name: 'Pro',
      monthlyPrice: 79,
      description: 'Ideal for growing companies and organizations',
      features: [
        'Up to 500 attendees per event',
        'Unlimited events',
        'Advanced analytics',
        'Priority support',
        'Zoom & YouTube Live integration',
        'Custom branding',
        'Multiple hosts'
      ],
      icon: <Zap className="w-6 h-6 text-blue-600" />
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyPrice: 199,
      description: 'For large events and corporate needs',
      features: [
        'Up to 10,000 attendees per event',
        'Unlimited everything',
        'Dedicated account manager',
        'SSO integration',
        'API access',
        'Custom development',
        '24/7 phone & email support',
        'On-demand training'
      ],
      icon: <Shield className="w-6 h-6 text-blue-700" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
    
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Choose the Right Plan for Your Events</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From intimate webinars to large-scale virtual conferences, we have pricing plans to suit your needs.
          </p>
          
          {/* Billing Period Toggle */}
          <div className="mt-8 inline-flex items-center p-1 bg-gray-100 rounded-lg">
            <button 
              className={`px-6 py-2 rounded-md ${billingPeriod === 'monthly' ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`}
              onClick={() => setBillingPeriod('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`px-6 py-2 rounded-md ${billingPeriod === 'yearly' ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`}
              onClick={() => setBillingPeriod('yearly')}
            >
              Yearly
            </button>
          </div>
          {billingPeriod === 'yearly' && (
            <div className="mt-2 text-sm text-blue-600 font-medium">Save up to 16% with annual billing</div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const price = getPriceDisplay(plan.monthlyPrice);
            const isSelected = selectedPlan === plan.id;
            
            return (
              <div 
                key={plan.id} 
                className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 ${
                  isSelected ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-102'
                }`}
              >
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    {plan.icon}
                    <h3 className="text-2xl font-bold text-gray-800 ml-2">{plan.name}</h3>
                  </div>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">${price.main}</span>
                    <span className="text-gray-500">{price.period}</span>
                    {price.savings && <span className="ml-2 text-green-600 text-sm font-medium">{price.savings}</span>}
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <button 
                    className={`w-full py-3 px-4 rounded-lg font-medium ${
                      isSelected 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {isSelected ? 'Selected Plan' : 'Select Plan'}
                  </button>
                </div>
                <div className="bg-gray-50 p-6">
                  <p className="font-medium text-gray-800 mb-4">Features include:</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment Section */}
        <div className="max-w-3xl mx-auto mt-20 bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Purchase</h2>
          
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Selected Plan</h3>
            <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg">
              <div>
                <p className="font-medium">{plans.find(p => p.id === selectedPlan)?.name} Plan</p>
                <p className="text-gray-600">
                  ${getPriceDisplay(plans.find(p => p.id === selectedPlan)?.monthlyPrice).main}
                  {getPriceDisplay().period}
                </p>
              </div>
              <button className="text-blue-600 hover:text-blue-800 font-medium">Change</button>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Payment Method</h3>
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-6">
                <CreditCard className="w-5 h-5 text-gray-600 mr-2" />
                <span className="font-medium">Credit or Debit Card</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Card Number</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Expiration Date</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">CVC</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="123"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Name on Card</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="John Doe"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Billing Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-2">Country</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-2">Address</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Street Address"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">City</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Postal Code</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Postal Code"
                />
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6 mt-8">
            <div className="flex justify-between font-medium text-lg mb-4">
              <span>Total</span>
              <span>${getPriceDisplay(plans.find(p => p.id === selectedPlan)?.monthlyPrice).main}</span>
            </div>
            <button className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">
              Complete Purchase
            </button>
            <p className="text-center text-gray-500 text-sm mt-4">
              By completing your purchase, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {[
              {
                id: 'faq1',
                question: 'Can I change my plan later?',
                answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.'
              },
              {
                id: 'faq2',
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards (Visa, Mastercard, American Express) as well as PayPal and bank transfers for Enterprise customers.'
              },
              {
                id: 'faq3',
                question: 'Do you offer refunds?',
                answer: 'We offer a 14-day money-back guarantee for all new customers. If you\'re not satisfied with our service within the first 14 days, we\'ll issue a full refund.'
              },
              {
                id: 'faq4',
                question: 'What happens when I reach my attendee limit?',
                answer: 'When you approach your attendee limit, we\'ll notify you with options to upgrade your plan. If you exceed your limit during an event, we won\'t cut off access, but you\'ll need to upgrade before hosting your next event.'
              }
            ].map((faq) => (
              <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <button 
                  className="w-full flex justify-between items-center p-4 text-left font-medium text-gray-800 hover:bg-gray-50"
                  onClick={() => toggleFAQ(faq.id)}
                >
                  {faq.question}
                  {faqs[faq.id] ? 
                    <ChevronUp className="w-5 h-5 text-gray-500" /> : 
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  }
                </button>
                {faqs[faq.id] && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600">Have more questions?</p>
            <button className="text-blue-600 font-medium hover:text-blue-800 mt-2">Contact our support team</button>
          </div>
        </div>
      </div>

      {/* Footer */}
     <Footer />
    </div>
  );
};

export default Billing;