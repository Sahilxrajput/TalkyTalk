import React, { useEffect, useState } from "react";
import "remixicon/fonts/remixicon.css";
import "../assets/style/LandingPage.css";

const BatteryStatus = () => {
  const [battery, setBattery] = useState({
    level: 1,
    charging: false,
  });

  useEffect(() => {
    const updateBatteryInfo = (batteryManager) => {
      setBattery({
        level: batteryManager.level,
        charging: batteryManager.charging,
      });

      batteryManager.addEventListener("levelchange", () =>
        setBattery((prev) => ({ ...prev, level: batteryManager.level }))
      );

      batteryManager.addEventListener("chargingchange", () =>
        setBattery((prev) => ({ ...prev, charging: batteryManager.charging }))
      );
    };

    navigator.getBattery().then((batteryManager) => {
      updateBatteryInfo(batteryManager);
    });
  }, []);

  const batteryPercent = (battery.level * 100).toFixed(0);

  return (
      <div
        className={`h-full flex items-center justify-center transition-all duration-500 ${
          battery.level > 0.2 ? "bg-green-500" : "bg-red-500", battery.charging ? "bg-green-500" : "bg-yellow-500"
        }` 
    }
        style={{ width: `${batteryPercent}%` }}
      >
        <div className="flex items-center gap-2 ">
          {battery.charging && (
            <i className="ri-battery-charge-line text-xl"></i>
          )}
          {battery.level < 0.2 && !battery.charging && (
            <i className="ri-battery-charge-line text-red-700 text-xl"></i>
          )}
          {batteryPercent}%
        </div>
      </div>
  );
};

export default BatteryStatus;
