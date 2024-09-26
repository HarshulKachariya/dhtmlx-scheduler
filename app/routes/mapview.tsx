import React, { useEffect, useRef, useState } from "react";
import "dhtmlx-scheduler/codebase/dhtmlxscheduler.css";
import "../assets/scheduler.css";
import { events, mapEvents } from "../lib/data"; // Import event data

const Scheduler: React.FC = () => {
  const [toggle, setToggle] = useState<boolean>(false);
  const schedulerContainer = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   async function maplib() {}

  //   maplib();
  // }, []);

  useEffect(() => {
    const loadScheduler = async () => {
      const scheduler: any = (await import("dhtmlx-scheduler")).default;

      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBVpjUB1Fvop_OWa9OzefIs7LP5gAisWq4&libraries=places`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        script.onload = () => resolve();
        script.onerror = (e) => reject(e);
      });

      // Load Google Maps API first
      scheduler.parse(mapEvents, "json");

      // Set scheduler skin based on toggle state
      scheduler.skin = toggle ? "dark" : "flat";

      // Scheduler configuration
      scheduler.locale.labels.section_location = "Location";
      scheduler.locale.labels.map_tab = "Map";
      scheduler.config.map_view = true;

      scheduler.config.map_view_provider = "googleMap";
      scheduler.config.map_settings = {
        initial_position: {
          lat: 48.724,
          lng: 8.215,
        },
        error_position: {
          lat: 0,
          lng: 0,
        },
        initial_zoom: 1,
        resolve_user_location: true,
        resolve_event_location: true,
        zoom_after_resolve: 15,
        view_provider: "googleMap",
      };

      scheduler.templates.event_text = function (
        start: any,
        end: any,
        event: any
      ) {
        return event.text + " (" + event.lat + ", " + event.lng + ")";
      };

      scheduler.config.map_settings.resolve_event_location = true; // Ensure this is true

      // Event: On clicking the map
      scheduler.attachEvent("onMapClick", function (lat: number, lng: number) {
        console.log("Clicked at lat: ", lat, " lng: ", lng);
        const newEvent = {
          id: new Date().getTime(),
          start_date: new Date(),
          end_date: new Date(new Date().getTime() + 60 * 60 * 1000),
          text: "New Event",
          event_location: { lat, lng },
        };
        scheduler.addEvent(newEvent);
        console.log("new event", newEvent);
        scheduler.showLightbox(newEvent?.id);
        return true;
      });

      // Scheduler initialization
      if (schedulerContainer.current) {
        scheduler.init(schedulerContainer.current, new Date(), "month");

        // Load the map events data

        // Load scheduler plugins
        scheduler.plugins({
          map_view: true,
          quick_info: true,
          export_api: true,
        });

        // Lightbox configuration
        scheduler.config.lightbox.sections = [
          {
            name: "description",
            height: 50,
            map_to: "text",
            type: "textarea",
            focus: true,
          },
          {
            name: "location",
            height: 43,
            map_to: "event_location",
            type: "textarea",
          },
          { name: "time", height: 72, type: "time", map_to: "auto" },
        ];

        // Header config
        scheduler.config.header = [
          "day",
          "week",
          "month",
          "map",
          "date",
          "prev",
          "today",
          "next",
        ];

        // Template to assign different CSS classes for events
        scheduler.templates.event_class = function (
          start: any,
          end: any,
          ev: any
        ) {
          return ev.classname || "";
        };
      }
    };

    loadScheduler();

    return () => {
      import("dhtmlx-scheduler").then((module: any) =>
        module.default.clearAll()
      );
    };
  }, [toggle]);

  return (
    <>
      <div
        ref={schedulerContainer}
        className="min-h-[93vh] min-w-[90%] dhx_cal_container"
      >
        <div className="dhx_cal_navline">
          <div className="dhx_cal_tab" data-tab="map"></div>
        </div>
      </div>
    </>
  );
};

export default Scheduler;
