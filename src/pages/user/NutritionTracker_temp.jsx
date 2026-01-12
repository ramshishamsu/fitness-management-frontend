                ))}
              </div>
            )}
          </div>

          {/* Goals */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Goals</h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300"></div>
                <p>Loading goals...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal._id} className="border rounded-lg p-4 hover:shadow-md">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-lg">{goal.title}</h4>
                        <p className="text-sm text-gray-600">{goal.description}</p>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-medium">{goal.type}</span>
                          <span className="text-sm text-gray-500"> - Target: {goal.targetValue}</span>
                          <span className="text-sm text-gray-500"> ({Math.round(goal.currentProgress || 0)}%)</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Due: {new Date(goal.targetDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Insights */}
          {insights && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Insights</h3>
              
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 p-4 rounded">
                  <h4 className="font-medium text-blue-900">30-Day Analysis</h4>
                  <div className="text-sm text-gray-700">
                    <p><strong>Period:</strong> Last 30 days</p>
                    <p><strong>Average Daily Calories:</strong> {insights.analytics?.avgDailyCalories || 0}</p>
                    <p><strong>Average Daily Protein:</strong> {insights.analytics?.avgDailyProtein || 0}g</p>
                    <p><strong>Average Daily Carbs:</strong> {insights.analytics?.avgDailyCarbs || 0}g</p>
                    <p><strong>Average Daily Fat:</strong> {insights.analytics?.avgDailyFat || 0}g</p>
                  </div>
                </div>

                {insights.recommendations && insights.recommendations.length > 0 && (
                  <div className="bg-yellow-50 border-l-4 p-4 rounded">
                    <h4 className="font-medium text-yellow-900">Recommendations</h4>
                    <div className="space-y-2">
                      {insights.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-2">
                            <span className={`inline-block px-2 py-1 text-xs rounded ${
                              rec.priority === 'high' ? 'bg-red-100 text-white' : 
                              rec.priority === 'medium' ? 'bg-yellow-100 text-white' : 
                              'bg-gray-100 text-white'
                            }`}>
                              {rec.priority}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">{rec.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Meal Modal */}
      {showAddMeal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full z-50">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-bold text-gray-900">Add Meal</h3>
                <button
                  onClick={() => setShowAddMeal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmitMeal} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={mealForm.date}
                    onChange={(e) => handleMealChange('date', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Meal Type</label>
                  <select
                    value={mealForm.meals[0]?.type || 'breakfast'}
                    onChange={(e) => handleMealChange('type', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                    <option value="post_workout">Post Workout</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <h4 className="text-md font-medium text-gray-900">Food Items</h4>
                  {mealForm.meals.map((food, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={food.name}
                        onChange={(e) => handleMealChange('name', e.target.value)}
                        className="flex-1 w-full rounded-md border-gray-300 shadow-sm p-2"
                        placeholder="Food name"
                      />
                      <input
                        type="number"
                        value={food.quantity}
                        onChange={(e) => handleMealChange('quantity', e.target.value)}
                        className="w-20 rounded-md border-gray-300 shadow-sm p-2"
                        placeholder="Quantity"
                        min="0"
                      />
                      <select
                        value={food.unit}
                        onChange={(e) => handleMealChange('unit', e.target.value)}
                        className="w-20 rounded-md border-gray-300 shadow-sm p-2"
                      >
                        <option value="grams">Grams</option>
                        <option value="oz">Ounces</option>
                        <option value="cups">Cups</option>
                        <option value="pieces">Pieces</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemoveFood(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div className="flex-1">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Calories</label>
                        <input
                          type="number"
                          value={food.calories}
                          onChange={(e) => handleMealChange('calories', e.target.value)}
                          className="w-20 rounded-md border-gray-300 shadow-sm p-2"
                          placeholder="Calories"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Protein (g)</label>
                        <input
                          type="number"
                          value={food.protein}
                          onChange={(e) => handleMealChange('protein', e.target.value)}
                          className="w-20 rounded-md border-gray-300 shadow-sm p-2"
                          placeholder="Protein"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Carbs (g)</label>
                        <input
                          type="number"
                          value={food.carbs}
                          onChange={(e) => handleMealChange('carbs', e.target.value)}
                          className="w-20 rounded-md border-gray-300 shadow-sm p-2"
                          placeholder="Carbs"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Fat (g)</label>
                        <input
                          type="number"
                          value={food.fat}
                          onChange={(e) => handleMealChange('fat', e.target.value)}
                          className="w-20 rounded-md border-gray-300 shadow-sm p-2"
                          placeholder="Fat"
                          min="0"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddFood()}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      <FaPlus className="mr-2" />
                      Add Food
                    </button>
                  </div>
                ))}
              </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Logging...' : 'Log Meal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full z-50">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-bold text-gray-900">Set Goal</h3>
                <button
                  onClick={() => setShowAddGoal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmitGoal} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Goal Title</label>
                  <input
                    type="text"
                    value={goalForm.title}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, title: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    placeholder="e.g., Lose 10kg in 3 months"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={goalForm.description}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    placeholder="Describe your goal..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Goal Type</label>
                  <select
                    value={goalForm.type}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, type: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  >
                    <option value="weight_loss">Weight Loss</option>
                    <option value="weight_gain">Weight Gain</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="endurance">Endurance</option>
                    <option value="strength">Strength</option>
                    <option value="flexibility">Flexibility</option>
                    <option value="body_fat_percentage">Body Fat %</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Target Value</label>
                  <input
                    type="number"
                    value={goalForm.targetValue}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, targetValue: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    placeholder="e.g., 70kg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Target Date</label>
                  <input
                    type="date"
                    value={goalForm.targetDate}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, targetDate: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Motivation</label>
                  <select
                    value={goalForm.motivation}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, motivation: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  >
                    <option value="health">Health</option>
                    <option value="appearance">Appearance</option>
                    <option value="performance">Performance</option>
                    <option value="competition">Competition</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Goal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionTracker;
