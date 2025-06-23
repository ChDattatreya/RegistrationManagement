import React from 'react';
import { Calendar, Clock, MapPin, Users, DollarSign, User } from 'lucide-react';
import { Exam } from '../types';

interface ExamCardProps {
  exam: Exam;
  onRegister: (examId: string) => void;
  isRegistered?: boolean;
  isAuthenticated: boolean;
}

export const ExamCard: React.FC<ExamCardProps> = ({ 
  exam, 
  onRegister, 
  isRegistered = false,
  isAuthenticated 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const availableSpots = exam.capacity - exam.enrolled;
  const isAlmostFull = availableSpots <= 10;
  const isFull = availableSpots <= 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold mb-2">{exam.name}</h3>
            <p className="text-blue-100 font-medium text-lg">{exam.code}</p>
          </div>
          <div className="text-right">
            <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1 text-sm font-semibold">
              ${exam.fee}
            </div>
          </div>
        </div>
        <p className="text-blue-50 text-sm leading-relaxed">{exam.description}</p>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Exam Details */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center space-x-3 text-gray-600">
            <Calendar className="h-5 w-5 text-blue-500" />
            <span className="font-medium">{formatDate(exam.date)}</span>
          </div>
          
          <div className="flex items-center space-x-3 text-gray-600">
            <Clock className="h-5 w-5 text-green-500" />
            <span className="font-medium">{formatTime(exam.time)} ({exam.duration} minutes)</span>
          </div>
          
          <div className="flex items-center space-x-3 text-gray-600">
            <MapPin className="h-5 w-5 text-red-500" />
            <span className="font-medium">{exam.location}</span>
          </div>
          
          <div className="flex items-center space-x-3 text-gray-600">
            <User className="h-5 w-5 text-purple-500" />
            <span className="font-medium">{exam.instructor}</span>
          </div>
        </div>

        {/* Prerequisites */}
        {exam.prerequisites && exam.prerequisites.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Prerequisites:</h4>
            <div className="flex flex-wrap gap-2">
              {exam.prerequisites.map((prereq, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full"
                >
                  {prereq}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Capacity */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Capacity</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {exam.enrolled}/{exam.capacity}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                isFull 
                  ? 'bg-red-500' 
                  : isAlmostFull 
                    ? 'bg-yellow-500' 
                    : 'bg-green-500'
              }`}
              style={{ width: `${(exam.enrolled / exam.capacity) * 100}%` }}
            ></div>
          </div>
          
          <div className="mt-2 text-xs text-gray-600">
            {isFull ? (
              <span className="text-red-600 font-medium">Exam is full</span>
            ) : isAlmostFull ? (
              <span className="text-yellow-600 font-medium">Only {availableSpots} spots left!</span>
            ) : (
              <span className="text-green-600 font-medium">{availableSpots} spots available</span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onRegister(exam.id)}
          disabled={isFull || !isAuthenticated}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-center transition-all duration-300 ${
            isRegistered
              ? 'bg-green-100 text-green-700 border-2 border-green-200'
              : isFull
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : !isAuthenticated
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
          }`}
        >
          {isRegistered 
            ? '✓ Registered' 
            : isFull 
              ? 'Exam Full' 
              : !isAuthenticated
                ? 'Sign In to Register'
                : 'Register Now'
          }
        </button>
      </div>
    </div>
  );
};