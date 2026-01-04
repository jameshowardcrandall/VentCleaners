'use client'
import { motion, AnimatePresence } from 'framer-motion'

interface SuccessModalProps {
  phone: string
  onClose: () => void
}

export default function SuccessModal({ phone, onClose }: SuccessModalProps) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-6xl mb-4">📞</div>
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">
            Thank You!
          </h2>
          <p className="text-lg text-muted-foreground mb-4">
            We'll call you within the next 15 minutes to discuss your dryer vent cleaning service.
          </p>
          <p className="text-lg font-semibold text-foreground mb-6">
            Calling: <span className="text-primary">{phone}</span>
          </p>
          <button
            onClick={onClose}
            className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl transition"
          >
            Close
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
