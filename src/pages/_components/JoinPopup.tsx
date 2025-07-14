import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import raysGreen from "../../assets/raysGreen.png"
import QRScanner from '../../components/QRScanner';

interface JoinPopupProps {
  onClose: () => void;
}

export default function JoinPopup({ onClose }: JoinPopupProps) {
  const [queueId, setQueueId] = useState<string>('');
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleJoinQueue = () => {
    if (queueId.trim()) {
      navigate(`/join/${queueId}`);
    } else if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleScanQR = () => {
    setShowScanner(true);
    // No need for alert anymore as we're using the actual QR scanner component
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 animate-fade-in"
      onClick={handleOverlayClick}
    >
      <div className="relative bg-white border-8 border-b-0 border-primary w-full max-w-lg rounded-t-2xl p-6 animate-slide-up">
      <div className='absolute top-0 left-1/2 -translate-y-full -translate-x-1/2 w-60 mx-auto'>
        <img className='w-full object-cover' src={raysGreen} alt="rays" />
      </div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold sr-only">Join a Queue</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 ml-auto"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {showScanner ? (
          <QRScanner setShowScanner={setShowScanner} />
        ) : (
          <>
            <div className="mb-4">
              <label htmlFor="queueId" className="sr-only block text-sm font-medium text-gray-700 mb-2">
                Enter Queue ID
              </label>
              <input
                type="text"
                id="queueId"
                ref={inputRef}
                value={queueId}
                onChange={(e) => setQueueId(e.target.value)}
                placeholder="Enter Queue ID"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <button
              onClick={handleJoinQueue}
              className="w-full bg-primary py-3 rounded-full font-medium mb-3 mt-8"
            >
              Join Queue
            </button>
            
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-3 text-gray-500 text-sm">OR</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>
            
            <button
              onClick={handleScanQR}
              className="w-full bg-primary text-gray-800 py-3 rounded-full font-medium flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Scan QR Code
            </button>
          </>
        )}
      </div>
    </div>
  );
}

