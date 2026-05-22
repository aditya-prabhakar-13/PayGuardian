import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.payguardian.app",
  appName: "Pay Guardian",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
};

export default config;
