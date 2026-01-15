import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { Plus, Trash2, Calendar, User } from "lucide-react";
import { useTheme } from "../../context/ThemeContext.jsx";

const SimpleNutritionManager = () => {
  const [searchParams] = useSearchParams();
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  // Simple enum-based nutrition form
  const [nutritionForm, setNutritionForm] = useState({
    clientId: "",
    date: new Date().toISOString().split("T")[0],
    meals: [
      {
        type: "breakfast",
        foods: [
          {
            name: "Oatmeal",
            quantity: 100,
            unit: "grams",
            calories: 150,
            protein: 5,
            carbs: 27,
            fat: 3
          }
        ]
      },
      {
        type: "lunch",
        foods: [
          {
            name: "Grilled Chicken",
            quantity: 150,
            unit: "grams",
            calories: 250,
            protein: 46,
            carbs: 0,
            fat: 5
          },
          {
            name: "Brown Rice",
            quantity: 150,
            unit: "grams",
            calories: 165,
            protein: 4,
            carbs: 34,
            fat: 1
          }
        ]
      },
      {
        type: "dinner",
        foods: [
          {
            name: "Salmon",
            quantity: 200,
            unit: "grams",
            calories: 416,
            protein: 40,
            carbs: 0,
            fat: 28
          },
          {
            name: "Steamed Broccoli",
            quantity: 100,
            unit: "grams",
            calories: 35,
            protein: 3,
            carbs: 7,
            fat: 0
          }
        ]
      }
    ],
    waterIntake: 2.5,
    notes: "Balanced nutrition plan"
  });

  useEffect(() => {
    fetchClients();
    
    // Handle userId from URL parameter
    const userId = searchParams.get("userId");
    if (userId) {
      setSelectedClient(userId);
      setNutritionForm(prev => ({ ...prev, clientId: userId }));
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedClient) {
      fetchClientNutrition();
    }
  }, [selectedClient]);

  const fetchClients = async () => {
    try {
      const response = await axiosInstance.get("/trainers/clients");
      setClients(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setLoading(false);
    }
  };

  const fetchClientNutrition = async () => {
    try {
      const response = await axiosInstance.get(`/nutrition/client/${selectedClient}`);
      setNutritionLogs(response.data);
    } catch (error) {
      console.error("Error fetching client nutrition:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Simple submission - just send the form data
      await axiosInstance.post("/nutrition/client", nutritionForm);
      
      // Reset form
      setNutritionForm({
        clientId: "",
        date: new Date().toISOString().split("T")[0],
        meals: [
          {
            type: "breakfast",
            foods: [
              {
                name: "Oatmeal",
                quantity: 100,
                unit: "grams",
                calories: 150,
                protein: 5,
                carbs: 27,
                fat: 3
              }
            ]
          },
          {
            type: "lunch",
            foods: [
              {
                name: "Grilled Chicken",
                quantity: 150,
                unit: "grams",
                calories: 250,
                protein: 46,
                carbs: 0,
                fat: 5
              }
            ]
          },
          {
            type: "dinner",
            foods: [
              {
                name: "Salmon",
                quantity: 200,
                unit: "grams",
                calories: 416,
                protein: 40,
                carbs: 0,
                fat: 28
          },
          {
            name: "Steamed Broccoli",
            quantity: 100,
                unit: "grams",
                calories: 35,
                protein: 3,
                carbs: 7,
                fat: 0
          }
        ]
      ],
      waterIntake: 2.5,
      notes: "Balanced nutrition plan"
      });
      
      // Fetch updated nutrition logs
      await fetchClientNutrition();
      
      alert("Nutrition plan created successfully!");
    } catch (error) {
      console.error("Error creating nutrition plan:", error);
      alert("Error creating nutrition plan");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? "bg-neutral-950 text-white" : "bg-gray-50 text-gray-900"}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className={`${isDark ? "bg-neutral-950 text-white" : "bg-gray-50 text-gray-900"} min-h-screen p-6`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 ${isDark ? "text-white" : "text-gray-900"}`}>
          Simple Nutrition Manager
        </h1>
        <p className={`mb-8 ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
          Create basic nutrition plans for clients with predefined meal templates
        </p>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Client Selection Form */}
          <div className={`${isDark ? "bg-neutral-900 border-neutral-800" : "bg-white border-gray-200"} rounded-xl p-6`}>
            <h2 className={`text-xl font-semibold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
              Select Client & Date
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-neutral-300" : "text-gray-700"}`}>
                  Client
                </label>
                <select
                  value={nutritionForm.clientId}
                  onChange={(e) => setNutritionForm(prev => ({ ...prev, clientId: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border ${isDark ? "bg-neutral-800 border-neutral-700 text-white" : "bg-white border-gray-300 text-gray-900"} focus:ring-2 focus:ring-emerald-500`}
                  required
                >
                  <option value="">Select a client...</option>
                  {clients.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-neutral-300" : "text-gray-700"}`}>
                  Date
                </label>
                <input
                  type="date"
                  value={nutritionForm.date}
                  onChange={(e) => setNutritionForm(prev => ({ ...prev, date: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border ${isDark ? "bg-neutral-800 border-neutral-700 text-white" : "bg-white border-gray-300 text-gray-900"} focus:ring-2 focus:ring-emerald-500`}
                  required
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !nutritionForm.clientId}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                loading || !nutritionForm.clientId
                  ? "bg-gray-400 cursor-not-allowed"
                  : isDark
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
            >
              {loading ? "Creating..." : "Create Nutrition Plan"}
            </button>
          </div>

          {/* Nutrition Display */}
          <div className={`${isDark ? "bg-neutral-900 border-neutral-800" : "bg-white border-gray-200"} rounded-xl p-6`}>
            <h2 className={`text-xl font-semibold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
              Current Nutrition Plans
            </h2>
            
            {nutritionLogs.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className={`w-16 h-16 ${isDark ? "text-neutral-600" : "text-gray-400"} mx-auto mb-4`} />
                <p className={`${isDark ? "text-neutral-400" : "text-gray-500"}`}>
                  No nutrition plans found for this client
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {nutritionLogs.map((log, index) => (
                  <div key={log._id} className={`${isDark ? "bg-neutral-800 border-neutral-700" : "bg-gray-100 border-gray-200"} rounded-lg p-4`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className={`text-lg font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                          {new Date(log.date).toLocaleDateString()}
                        </h3>
                        <p className={`text-sm ${isDark ? "text-emerald-400" : "text-emerald-600"} mb-2`}>
                          Water: {log.waterIntake || 0}L • {log.notes || "No notes"}
                        </p>
                      </div>
                      </div>
                      <div className="text-right">
                        <button
                          className={`text-sm ${isDark ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-700"}`}
                          title="Delete nutrition plan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {log.meals?.map((meal, mealIndex) => (
                        <div key={mealIndex} className={`${isDark ? "bg-neutral-700" : "bg-gray-50"} rounded-lg p-3`}>
                          <div className="flex justify-between items-center mb-2">
                            <h4 className={`font-medium capitalize ${isDark ? "text-white" : "text-gray-900"}`}>
                              {meal.type}
                            </h4>
                            <span className={`text-sm ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                              {meal.foods?.reduce((sum, food) => sum + food.calories, 0)} cal
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {meal.foods?.map((food, foodIndex) => (
                            <div key={foodIndex} className={`flex justify-between items-center ${isDark ? "bg-neutral-800" : "bg-gray-100"} rounded p-2`}>
                              <div>
                                <span className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                                  {food.name}
                                </span>
                                <span className={`text-sm ${isDark ? "text-neutral-400" : "text-gray-500"}`}>
                                  {food.quantity} {food.unit}
                                </span>
                              </div>
                              <div className={`text-sm ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                                {food.calories} cal
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleNutritionManager;
