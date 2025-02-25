"use client"

import * as React from "react"

/**
 * This hook returns true if the current device is a mobile device.
 * We define mobile as a device with a screen width less than 768px.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Check on mount
    checkIsMobile()

    // Check on resize
    window.addEventListener("resize", checkIsMobile)

    // Clean up
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  return isMobile
} 