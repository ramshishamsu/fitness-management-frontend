import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Download, Check, X, FileText, Shield, AlertCircle } from 'lucide-react';
import axios from '../../api/axios';

const AdminTrainerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrainerDetails();
  }, [id]);

  const fetchTrainerDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/admin/trainers/${id}`);
      setTrainer(response.data);
    } catch (error) {
      console.error('Error fetching trainer details:', error);
      setError(error.response?.data?.message || 'Failed to fetch trainer details');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDocument = async (docId, action) => {
    try {
      await axios.put(`/admin/trainers/${id}/docs/${docId}/verify`, { action });
      // Refresh trainer details
      fetchTrainerDetails();
    } catch (error) {
      console.error('Error verifying document:', error);
      alert(error.response?.data?.message || 'Failed to verify document');
    }
  };

  const getDocumentIcon = (type) => {
    switch (type) {
      case 'id':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'certificate':
        return <Shield className="w-5 h-5 text-green-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getVerificationBadge = (doc) => {
    if (doc.verified) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Check className="w-3 h-3 mr-1" />
          Verified
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    }
  };

  const handleViewDocument = (trainerId, docId) => {
    try {
      // Use backend endpoint to serve document (bypasses Cloudinary auth)
      const documentUrl = `/api/admin/trainers/${trainerId}/docs/${docId}/view`;
      
      console.log('Opening document via backend:', documentUrl);
      
      // Open in new window
      const newWindow = window.open(documentUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
      
      if (newWindow && !newWindow.closed) {
        console.log('Document opened successfully');
        return;
      }
      
      // Fallback: open in same tab
      window.open(documentUrl, '_blank');
    } catch (error) {
      console.error('Error opening document:', error);
      
      // Final fallback: try direct Cloudinary URL
      window.open(`/api/admin/trainers/${trainerId}/docs/${docId}/view`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/admin/users')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Trainer Not Found</h2>
          <p className="text-gray-600">The trainer you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/admin/users')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/users')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </button>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                {trainer.profileImage ? (
                  <img
                    src={trainer.profileImage}
                    alt={trainer.name}
                    className="h-16 w-16 rounded-full object-cover mr-4"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                    <span className="text-gray-500 text-xl font-semibold">
                      {trainer.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{trainer.name}</h1>
                  <p className="text-gray-600">{trainer.email}</p>
                  <p className="text-sm text-gray-500">{trainer.phone}</p>
                </div>
              </div>
              
              <div className="text-right">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  trainer.status === 'approved' 
                    ? 'bg-green-100 text-green-800' 
                    : trainer.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {trainer.status?.charAt(0)?.toUpperCase() + trainer.status?.slice(1)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Specialization</h3>
                <p className="text-lg font-semibold text-gray-900">{trainer.specialization}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Experience</h3>
                <p className="text-lg font-semibold text-gray-900">{trainer.experience} years</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Rating</h3>
                <p className="text-lg font-semibold text-gray-900">⭐ {trainer.rating?.toFixed(1) || '0.0'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Verification Documents</h2>
          
          {trainer.documents && trainer.documents.length > 0 ? (
            <div className="space-y-4">
              {trainer.documents.map((doc, index) => (
                <div key={doc._id || index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getDocumentIcon(doc.type)}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 capitalize">
                          {doc.type === 'id' ? 'ID Document' : 
                           doc.type === 'certificate' ? 'Certificate' : 'Other Document'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                          {doc.verifiedAt && ` • Verified: ${new Date(doc.verifiedAt).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {getVerificationBadge(doc)}
                      
                      <button
                        onClick={() => handleViewDocument(trainer._id, doc._id)}
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Document"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleViewDocument(trainer._id, doc._id)}
                        className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                        title="Download Document"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      
                      {!doc.verified && (
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleVerifyDocument(doc._id, 'approve')}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleVerifyDocument(doc._id, 'reject')}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents</h3>
              <p className="text-gray-500">This trainer hasn't uploaded any verification documents yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTrainerDetails;
