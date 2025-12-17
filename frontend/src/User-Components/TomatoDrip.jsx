import { motion } from "framer-motion";

export default function TomatoDrip() {
  return (
    <div className="absolute top-0 left-0 w-full pointer-events-none">
      <svg
        viewBox="0 0 1440 180"
        preserveAspectRatio="none"
        className="w-full h-[120px]"
      >
        {/* MAIN THICK SAUCE */}
        <motion.path
          d="
            M0,0
            H1440
            V95
            C1360,125 1280,60 1200,80
            C1120,100 1060,160 980,120
            C900,80 820,90 740,120
            C660,150 580,110 500,95
            C420,80 340,110 260,120
            C180,130 100,90 0,110
            Z
          "
          fill="#c4161c"   /* rich tomato base */
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />

        {/* SAUCE SHINE (same hue, lighter) */}
        <path
          d="
            M0,0
            H1440
            V55
            C1300,75 1160,25 1000,45
            C840,65 680,25 520,45
            C360,65 200,35 0,50
            Z
          "
          fill="#d93a2f"   /* lighter tomato shine */
          opacity="0.6"
        />

        {/* DRIP DROP (slightly darker, thicker) */}
        <motion.ellipse
          cx="980"
          cy="155"
          rx="16"
          ry="24"
          fill="#a90f14"   /* darker tomato */
          initial={{ scale: 0, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        />

        {/* DROP HIGHLIGHT (warm light reflection) */}
        <ellipse
          cx="986"
          cy="148"
          rx="5"
          ry="9"
          fill="#ffb199"   /* warm glossy highlight */
          opacity="0.75"
        />
      </svg>
    </div>
  );
}
