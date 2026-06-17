import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  linkTo?: string;
}

const PromotionModal: React.FC<PromotionModalProps> = ({ isOpen, onClose, imageUrl }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay mờ phía sau */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Nội dung Banner */}
          <motion.div 
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            className="relative z-10 max-w-[500px] w-full"
          >
            {/* Nút đóng chuyên nghiệp */}
            <button 
              onClick={onClose}
              title="đóng"
              className="absolute -top-4 -right-4 bg-white text-black p-2 rounded-full shadow-lg hover:bg-red-600 hover:text-white transition-all z-20"
            >
              <X size={20} />
            </button>

            {/* Hình ảnh Banner */}
            <div className="rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.1)] border border-white/10">
              <img 
                src={imageUrl} 
                alt="Promotion" 
                className="w-full h-auto object-cover cursor-pointer hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PromotionModal;