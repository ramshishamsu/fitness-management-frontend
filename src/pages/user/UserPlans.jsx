import { useEffect, useState } from "react";
import { Search, DollarSign, Check, CreditCard, Clock, Star } from 'lucide-react';
import axios from '../../api/axios';
import { useNavigate } from "react-router-dom";

const UserPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/plans');
      setPlans(response.data.plans);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchasePlan = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    if (!selectedPlan) return;
    
    try {
      const response = await axios.post('/payments/create-session', {
        planId: selectedPlan._id,
        planName: selectedPlan.name,
        amount: selectedPlan.price
      });

      if (response.data.sessionUrl) {
        window.location.href = response.data.sessionUrl;
      }
    } catch (error) {
      console.error('Error creating payment session:', error);
    }
  };

  const filteredPlans = plans.filter(plan => 
    plan.isActive && (
      plan.name.toLowerCase().includes(search.toLowerCase()) ||
      plan.description.toLowerCase().includes(search.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Plans</h1>
          <p className="text-gray-600">Choose the perfect plan for your fitness journey</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search plans..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No plans found</p>
            </div>
          ) : (
            filteredPlans.map((plan) => (
              <div key={plan._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Popular
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="flex items-center mb-6">
                    <DollarSign className="h-6 w-6 text-green-600 mr-2" />
                    <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500 ml-2">/{plan.duration} days</span>
                  </div>

                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-3" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePurchasePlan(plan)}
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Purchase Plan
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {showPaymentModal && selectedPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Confirm Purchase</h2>
                <p className="text-gray-600 mb-4">You're about to purchase the {selectedPlan.name} plan</p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-medium">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{selectedPlan.duration} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total:</span>
                    <span className="text-2xl font-bold text-green-600">${selectedPlan.price}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handlePayment}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Payment
                </button>
                <button
                  onClick={() => {setShowPaymentModal(false); setSelectedPlan(null);}}
                  className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPlans;
