import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Video, Mic, MicOff, VideoOff, Phone } from 'lucide-react';

const VideoChatPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Start video stream when the page loads
  useEffect(() => {
    const startVideo = async () => {
      setIsVideoLoading(true);
      setErrorMessage(null);
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Your browser does not support camera and microphone access.');
        }

        console.log('Requesting camera and microphone access...');
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user',
          },
          audio: true,
        });
        console.log('Media stream acquired:', mediaStream);
        setStream(mediaStream);

        // Assign stream to local video
        if (localVideoRef.current) {
          console.log('Assigning stream to local video element');
          localVideoRef.current.srcObject = mediaStream;
          localVideoRef.current.onloadedmetadata = () => {
            console.log('Local video metadata loaded, attempting to play...');
            localVideoRef.current
              ?.play()
              .then(() => {
                console.log('Local video is playing');
              })
              .catch((err) => {
                console.error('Error playing local video:', err);
                setErrorMessage('Failed to play local video. Please try again.');
              });
          };
          localVideoRef.current.onerror = () => {
            console.error('Local video element error');
            setErrorMessage('Error loading local video stream. Please try again.');
          };
        }
      } catch (error: any) {
        console.error('Error in startVideo:', error);
        let errorMsg = 'Failed to access camera and microphone. Please check your permissions and ensure you are using HTTPS or localhost.';
        if (error.name === 'NotAllowedError') {
          errorMsg = 'Camera and microphone access denied. Please allow access in your browser settings.';
        } else if (error.name === 'NotFoundError') {
          errorMsg = 'No camera or microphone found. Please ensure your device has a camera and microphone.';
        }
        setErrorMessage(errorMsg);
      } finally {
        console.log('Setting isVideoLoading to false');
        setIsVideoLoading(false);
      }
    };
    startVideo();

    // Cleanup on unmount
    return () => {
      if (stream) {
        console.log('Stopping media stream on unmount');
        stream.getTracks().forEach((track) => {
          track.stop();
          console.log(`${track.kind} track stopped`);
        });
        setStream(null);
      }
      // Clear video elements
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    };
  }, []); // Removed stream dependency to prevent re-running unnecessarily

  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
        console.log(`Camera ${videoTrack.enabled ? 'enabled' : 'disabled'}`);
      }
    }
  };

  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
        console.log(`Microphone ${audioTrack.enabled ? 'enabled' : 'disabled'}`);
      }
    }
  };

  const endCall = () => {
    if (stream) {
      // Turn off camera and microphone
      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = false;
        setIsCameraOn(false);
        console.log('Camera disabled on end call');
      }
      if (audioTrack) {
        audioTrack.enabled = false;
        setIsMicOn(false);
        console.log('Microphone disabled on end call');
      }

      // Stop all tracks
      stream.getTracks().forEach((track) => {
        track.stop();
        console.log(`${track.kind} track stopped on end call`);
      });
      setStream(null);

      // Clear video elements
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    }

    // Add a slight delay to ensure the browser releases the camera
    setTimeout(() => {
      navigate('/virtual-rooms');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Video Section */}
      <div className="flex-grow relative flex flex-col items-center justify-center">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Video Chat - Virtual Room {roomId}
        </h1>
        {errorMessage ? (
          <div className="text-center">
            <p className="text-red-500 dark:text-red-400 mb-4">{errorMessage}</p>
            <button
              onClick={() => navigate('/virtual-rooms')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
            >
              Return to Virtual Rooms
            </button>
          </div>
        ) : isVideoLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center space-x-4 p-4">
            {/* Remote Video (Main) */}
            <div className="relative w-3/4 h-auto bg-black rounded-lg flex items-center justify-center">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-auto bg-black rounded-lg object-cover"
              />
              {/* Placeholder message for remote video */}
              {!remoteVideoRef.current?.srcObject && (
                <p className="absolute text-white text-lg">Waiting for the other participant...</p>
              )}
            </div>
            {/* Local Video (Overlay) */}
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              className="absolute bottom-4 right-4 w-1/4 max-w-[200px] h-auto bg-black rounded-lg object-cover border-2 border-white"
            />
          </div>
        )}
      </div>

      {/* Control Buttons (Show only if no error) */}
      {!errorMessage && !isVideoLoading && (
        <div className="flex justify-center space-x-4 p-4 bg-white dark:bg-gray-800 shadow-lg">
          <button
            onClick={toggleCamera}
            className={`p-4 rounded-full text-white transition-all duration-300 ${
              isCameraOn ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            title={isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
          >
            {isCameraOn ? <VideoOff size={24} /> : <Video size={24} />}
          </button>
          <button
            onClick={toggleMic}
            className={`p-4 rounded-full text-white transition-all duration-300 ${
              isMicOn ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {isMicOn ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          <button
            onClick={endCall}
            className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-300"
            title="End Call"
          >
            <Phone size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoChatPage;