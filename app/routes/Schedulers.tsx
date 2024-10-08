import React, { useEffect, useRef, useState } from "react";
import "dhtmlx-scheduler/codebase/dhtmlxscheduler.css";
import "../assets/scheduler.css";
import { events } from "../lib/data"; // Assuming events are imported from this file

const Scheduler: React.FC = () => {
  const schedulerContainer = useRef<HTMLDivElement>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    const loadMapsScript = () => {
      if ((window as any).google && (window as any).google.maps) {
        setMapsLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBVpjUB1Fvop_OWa9OzefIs7LP5gAisWq4`;
      script.async = true;
      script.defer = true;

      script.onload = () => setMapsLoaded(true);
      script.onerror = (e) => console.error("Error loading Google Maps:", e);

      document.head.appendChild(script);
    };

    loadMapsScript();
  }, []);

  // Initialize the scheduler when maps are loaded
  useEffect(() => {
    if (!mapsLoaded) return;

    const loadScheduler = async () => {
      const scheduler: any = (await import("dhtmlx-scheduler")).default;
      if (schedulerContainer.current) {
        scheduler.config.header = [
          "day",
          "week",
          "month",
          "employee",
          "map", // Enable map view
          "date",
          "prev",
          "today",
          "next",
        ];

        // Define how event data is displayed on the map
        scheduler.templates.event_text = (start: Date, end: Date, ev: any) => {
          return `<b>${ev.text}</b><br/>Location: ${ev.event_location}`;
        };

        // Directly resolve the location from the event's lat/lng values
        scheduler.config.map_resolve_event_location = function (event: any) {
          return new Promise((resolve) => {
            resolve({ lat: event.lat, lng: event.lng });
          });
        };

        scheduler.plugins({
          map_view: true,
          quick_info: true,
        });

        scheduler.config.map_start = new Date(1747, 1, 1);
        scheduler.config.map_end = new Date(9999, 12, 31);
        scheduler.locale.labels.map_tab = "Map";
        scheduler.config.map_view = true;
        scheduler.locale.labels.section_location = "Location";

        scheduler.config.map_resolve_event_location = true;
        scheduler.config.map_view_provider = "googleMap";

        scheduler.config.map_settings = {
          initial_position: {
            lat: 39.3833, // Sykesville, MD (example)
            lng: -76.9835,
          },
          initial_zoom: 2, // A zoom level that shows multiple continents
          zoom_after_resolve: 10, // Zoom level after location resolve
        };

        // Show all events on the map, not limited by date
      }
      // Initialize the scheduler in map view
      scheduler.init(schedulerContainer.current, new Date(), "map");

      // Load event data
      scheduler.parse(events, "json");

      console.log("Scheduler initialized with events:", events);
    };

    loadScheduler();

    // Clean up the scheduler on component unmount
    return () => {
      import("dhtmlx-scheduler").then((module: any) =>
        module.default.clearAll()
      );
    };
  }, [mapsLoaded]);

  return (
    <div>
      <div
        ref={schedulerContainer}
        className="dhx_cal_container min-h-[100vh] min-w-[90%]"
      >
        <div className="dhx_cal_navline">
          <div className="dhx_cal_tab" data-tab="map_tab"></div>
        </div>
        <div className="dhx_cal_data"></div>
      </div>
    </div>
  );
};

export default Scheduler;
