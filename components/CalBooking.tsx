"use client";
import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function CalBooking() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "dryerventcleaning" });
      cal("floatingButton", {
        calLink: "ventcleaners/dryerventcleaning",
        config: { layout: "month_view" },
        buttonPosition: "bottom-right",
        buttonText: "Book A Cleaning",
      });
      cal("ui", {
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return null; // This component doesn't render anything visible, just initializes Cal.com
}
