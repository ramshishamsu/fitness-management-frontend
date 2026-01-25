import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { Star, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import UserLayout from "../../components/common/UserLayout";

const UserRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newRating, setNewRating] = useState({
    trainerId: "",
    rating: 5,
    comment: ""
  });
  const [newFeedback, setNewFeedback] = useState({
    trainerId: "",
    service: "",
    rating: 5,
    comment: ""
  });
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load ratings and feedback
  useEffect(() => {
    loadRatingsAndFeedback();
  }, []);

  const loadRatingsAndFeedback = async () => {
    try {
      const [ratingsRes, feedbackRes] = await Promise.all([
        axiosInstance.get("/ratings/my"),
        axiosInstance.get("/ratings/feedback")
      ]);
      
      setRatings(ratingsRes.data);
      setFeedback(feedbackRes.data);
      console.log("✅ Ratings loaded:", ratingsRes.data);
      console.log("✅ Feedback loaded:", feedbackRes.data);
    } catch (err) {
      console.error("Failed to load ratings:", err);
      setError("Failed to load ratings and feedback");
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async () => {
    if (!newRating.trainerId || !newRating.comment.trim()) return;

    setSubmitting(true);
    try {
      const res = await axiosInstance.post("/ratings", newRating);
      setRatings([res.data, ...ratings]);
      setNewRating({ trainerId: "", rating: 5, comment: "" });
      setShowRatingForm(false);
      console.log("✅ Rating submitted:", res.data);
    } catch (err) {
      console.error("Failed to submit rating:", err);
      setError("Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  const submitFeedback = async () => {
    if (!newFeedback.trainerId || !newFeedback.service || !newFeedback.comment.trim()) return;

    setSubmitting(true);
    try {
            const res = await axiosInstance.post("/ratings", newFeedback);
      setFeedback([res.data, ...feedback]);
      setNewFeedback({ trainerId: "", service: "", rating: 5, comment: "" });
      setShowFeedbackForm(false);
      console.log("✅ Feedback submitted:", res.data);
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      setError("Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? "text-yellow-400 fill-current" : "text-gray-600"}
      />
    ));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-white">Ratings & Feedback</h1>
          <p className="text-neutral-400">Rate trainers and provide feedback on services</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-neutral-400 mt-4">Loading ratings...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto mb-4 text-red-500" size={48} />
            <h3 className="text-xl font-semibold text-red-400 mb-2">Error</h3>
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Ratings Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Trainer Ratings</h2>
                <button
                  onClick={() => setShowRatingForm(!showRatingForm)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition"
                >
                  {showRatingForm ? "Cancel" : "Rate Trainer"}
                </button>
              </div>

              {showRatingForm && (
                <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700 mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-white">Rate Your Trainer</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Select Trainer</label>
                    <select
                      value={newRating.trainerId}
                      onChange={(e) => setNewRating({...newRating, trainerId: e.target.value})}
                      className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-primary focus:outline-none"
                    >
                      <option value="">Choose a trainer...</option>
                      {/* This should be populated with user's trainers */}
                      <option value="trainer1">Ramshida - Nutrition & Weight Loss</option>
                      <option value="trainer2">Shanif - Yoga & Flexibility</option>
                      <option value="trainer3">Athul - Martial Arts & Self Defense</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating({...newRating, rating: star})}
                          className="p-1"
                        >
                          <Star
                            size={24}
                            className={star <= newRating.rating ? "text-yellow-400 fill-current" : "text-gray-600"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Comment</label>
                    <textarea
                      value={newRating.comment}
                      onChange={(e) => setNewRating({...newRating, comment: e.target.value})}
                      placeholder="Share your experience with this trainer..."
                      className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-primary focus:outline-none h-24 resize-none"
                    />
                  </div>

                  <button
                    onClick={submitRating}
                    disabled={submitting || !newRating.trainerId || !newRating.comment.trim()}
                    className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {submitting ? "Submitting..." : "Submit Rating"}
                  </button>
                </div>
              )}

              {/* Ratings List */}
              <div className="space-y-4">
                {ratings.length === 0 ? (
                  <p className="text-neutral-500 text-center py-8">
                    No ratings yet. Rate your trainers after sessions!
                  </p>
                ) : (
                  ratings.map((rating) => (
                    <div key={rating._id} className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-white">
                            {rating.trainer?.userId?.name || 'Trainer'}
                          </h4>
                          <p className="text-sm text-neutral-400">
                            {rating.trainer?.specialization || 'Fitness Trainer'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {renderStars(rating.rating)}
                          <span className="text-sm text-neutral-400 ml-1">
                            {rating.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <p className="text-neutral-300 text-sm mb-2">"{rating.comment}"</p>
                      <p className="text-xs text-neutral-500">
                        {formatDate(rating.createdAt)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Feedback Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Service Feedback</h2>
                <button
                  onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition"
                >
                  {showFeedbackForm ? "Cancel" : "Give Feedback"}
                </button>
              </div>

              {showFeedbackForm && (
                <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700 mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-white">Share Your Feedback</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Service Type</label>
                    <select
                      value={newFeedback.service}
                      onChange={(e) => setNewFeedback({...newFeedback, service: e.target.value})}
                      className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-primary focus:outline-none"
                    >
                      <option value="">Select service...</option>
                      <option value="training">Personal Training</option>
                      <option value="nutrition">Nutrition Consultation</option>
                      <option value="workout">Workout Plan</option>
                      <option value="appointment">Appointment Booking</option>
                      <option value="payment">Payment Process</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Trainer</label>
                    <select
                      value={newFeedback.trainerId}
                      onChange={(e) => setNewFeedback({...newFeedback, trainerId: e.target.value})}
                      className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-primary focus:outline-none"
                    >
                      <option value="">Choose a trainer...</option>
                      <option value="trainer1">Ramshida - Nutrition & Weight Loss</option>
                      <option value="trainer2">Shanif - Yoga & Flexibility</option>
                      <option value="trainer3">Athul - Martial Arts & Self Defense</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewFeedback({...newFeedback, rating: star})}
                          className="p-1"
                        >
                          <Star
                            size={24}
                            className={star <= newFeedback.rating ? "text-yellow-400 fill-current" : "text-gray-600"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Feedback</label>
                    <textarea
                      value={newFeedback.comment}
                      onChange={(e) => setNewFeedback({...newFeedback, comment: e.target.value})}
                      placeholder="Share your feedback about our services..."
                      className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-primary focus:outline-none h-24 resize-none"
                    />
                  </div>

                  <button
                    onClick={submitFeedback}
                    disabled={submitting || !newFeedback.trainerId || !newFeedback.service || !newFeedback.comment.trim()}
                    className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {submitting ? "Submitting..." : "Submit Feedback"}
                  </button>
                </div>
              )}

              {/* Feedback List */}
              <div className="space-y-4">
                {feedback.length === 0 ? (
                  <p className="text-neutral-500 text-center py-8">
                    No feedback yet. Share your experience with our services!
                  </p>
                ) : (
                  feedback.map((item) => (
                    <div key={item._id} className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="inline-block px-2 py-1 bg-primary text-white text-xs rounded-full mb-2">
                            {item.service}
                          </span>
                          <h4 className="font-semibold text-white">
                            {item.trainer?.userId?.name || 'General'}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1">
                          {renderStars(item.rating)}
                          <span className="text-sm text-neutral-400 ml-1">
                            {item.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <p className="text-neutral-300 text-sm mb-2">"{item.comment}"</p>
                      <p className="text-xs text-neutral-500">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default UserRatings;
