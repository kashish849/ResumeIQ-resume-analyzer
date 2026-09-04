import { motion } from 'framer-motion';

export default function StatCard({ label, value, icon: Icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="card p-5"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{label}</p>
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon size={16} />
          </div>
        )}
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-text">{value}</p>
    </motion.div>
  );
}
