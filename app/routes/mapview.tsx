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
        console.log(lat, lng);
        scheduler.addEvent(newEvent); // Add the event to the scheduler
        scheduler.showLightbox(newEvent?.id); // Optionally, show a lightbox for custom input
        return true; // Indicates event handling is done
      });

      // Load the script of google map
      await new Promise<void>((resolve) => {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAOXA_S8oo49DSr9CduSTDFjLSE7rO1KqU`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        script.onload = () => resolve();
      });

      // Scheduler initialization
      if (schedulerContainer.current) {
        scheduler.init(schedulerContainer.current, new Date(), "month");
        scheduler.parse(events, "json");

        // display diffrent colors of event
        scheduler.templates.event_class = function (
          start: any,
          end: any,
          ev: any
        ) {
          return ev.classname || "";
        };

        // Scheduler Header
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

        // Load the event data
        scheduler.parse(mapEvents, "json");

        // Ensure the custom form block is defined before being used in lightbox sections
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

        // custom css
        const customCSS = `.dhx_cal_ltext .form-group {
  margin-bottom: 10px;
}

.dhx_cal_ltext label {
  display: block;
  margin-bottom: 5px;
}

.dhx_cal_ltext input[type="text"],
.dhx_cal_ltext select,
.dhx_cal_ltext textarea {
  width: 100%;
  padding: 5px;
  color: #000;
}

.dhx_cal_ltext .hint {
  font-size: 0.8em;
  color: #666;
}

.add_event_button {
  position: absolute;
  width: 55px;
  height: 55px;
  background: #ff5722;
  border-radius: 50px;
  bottom: 40px;
  right: 55px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.3);
  z-index: 5;
  cursor: pointer;
}
.add_event_button:after {
  background: #000;
  border-radius: 2px;
  color: #fff;
  content: attr(data-tooltip);
  margin: 16px 0 0 -137px;
  opacity: 0;
  padding: 4px 9px;
  position: absolute;
  visibility: visible;
  font-family: "Roboto";
  font-size: 14px;
  visibility: hidden;
  transition: all 0.5s ease-in-out;
}
.add_event_button:hover {
  background: #ff774c;
}
.add_event_button:hover:after {
  opacity: 0.55;
  visibility: visible;
}
.add_event_button span:before {
  content: "";
  background: #fff;
  height: 16px;
  width: 2px;
  position: absolute;
  left: 26px;
  top: 20px;
}
.add_event_button span:after {
  content: "";
  height: 2px;
  width: 16px;
  background: #fff;
  position: absolute;
  left: 19px;
  top: 27px;
}
.controls {
  padding-bottom: 10px;
}

.controls,
.controls_row {
  display: flex;
}

.controls_options {
  flex-basis: 500px;
  padding-bottom: 14px;
}

.controls_buttons {
  padding-top: 8px;
  text-align: left;
}

.controls input,
.controls select {
  padding: 5px 20px;
  margin: 7px 15px 0 0;
  width: 180px;
}
.controls label {
  width: 184px;
  text-align: right;
  padding: 4px 20px 0 0;
  line-height: 32px;
  display: block;
}

.export-btn {
  @apply space-x-3 !important;
}

/* ==== Custom Colors======= */
.violet {
  --dhx-scheduler-event-background: linear-gradient(
    180deg,
    #d071ef 0%,
    #ee71d5 100%
  );
}

.green {
  --dhx-scheduler-event-background: linear-gradient(
    180deg,
    #12d979 0%,
    #1ecdeb 100%
  );
}

.yellow {
  --dhx-scheduler-event-background: linear-gradient(
    180deg,
    #ffb725 0%,
    #ffbb25 31.25%,
    #faea27 100%
  );
}

/* Toogle mode */

.controls {
  flex: 0 0;
  display: flex;
}

.controls {
  background: var(--dhx-scheduler-container-background);
  color: var(--dhx-scheduler-container-color);
  --toggle-background: #000;
  --toggle-foreground: #fff;
}

.padding_selector {
  margin-left: auto;
  margin-right: auto;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
}

.styled_checkbox {
  display: inline-block;
  position: relative;
  cursor: pointer;
}

.styled_checkbox input {
  visibility: hidden;
  width: 0px;
  height: 0px;
  position: absolute;
  top: 0;
}

.styled_checkbox {
  background-color: var(--toggle-background);
  border: 2px solid var(--toggle-background);
  border-radius: 20px;
  width: 45px;
  height: 25px;
  box-sizing: border-box;
}

.styled_checkbox_button {
  position: absolute;
  transition: all 300ms;
  left: 0;
  transform: translateX(0);
  background: var(--toggle-foreground);
  border-radius: 20px;
  height: 100%;
  width: 20px;
}

.styled_checkbox input:checked + .styled_checkbox_button {
  left: 100%;
  transform: translateX(-100%);
}

.dhx_scale_hour {
  background-color: #fffacd !important;
}

.dhx_scale_holder_now {
  background-color: #fffacd !important;
}

.dhx_cal_container .dhx_selected_cell {
  background-color: #fffacd !important; /* Lemon Chiffon color */

  /* Ensure the text color is readable */
}

.dhx_cal_month_cell + .dhx_now {
  background-color: #fffacd !important;
}

`;

        // Export pdf and png

        function exportScheduler(type: string) {
          const format =
            (document.getElementById("format") as HTMLSelectElement)?.value ||
            "A4";
          const orient =
            (document.getElementById("orient") as HTMLSelectElement)?.value ||
            "portrait";
          const zoom =
            (document.getElementById("zoom") as HTMLSelectElement)?.value ||
            "1";

          const exportOptions = {
            format: format,
            orientation: orient,
            zoom: Number(zoom),
            header: `
                <link rel='stylesheet' href='dhtmlx-scheduler/codebase/dhtmlxscheduler.css' type='text/css'>
                <style>${customCSS}</style>
              `,
          };

          if (type === "pdf") scheduler.exportToPDF(exportOptions);
          else scheduler.exportToPNG(exportOptions);
        }

        const pdfButton = document.querySelector(".controls [name='pdf']");
        const pngButton = document.querySelector(".controls [name='png']");

        if (pdfButton) {
          pdfButton.addEventListener("click", () => exportScheduler("pdf"));
        }
        if (pngButton) {
          pngButton.addEventListener("click", () => exportScheduler("png"));
        }

        // Map View in Scheduler

        scheduler.locale.labels.map_tab = "Map";
        scheduler.locale.labels.section_location = "Location";

        scheduler.config.map_view_provider = "googleMap";

        scheduler.config.map_settings = {
          initial_position: {
            lat: 48.724,
            lng: 8.215,
          },
          error_position: {
            lat: 15,
            lng: 15,
          },
          initial_zoom: 1,
          zoom_after_resolve: 15,
          info_window_max_width: 300,
          resolve_user_location: true,
          resolve_event_location: true,
          view_provider: "googleMap",
        };

        // updating dates to display on before view change

        scheduler.attachEvent("onMapClick", function (lat: any, lng: any) {
          const newEvent = {
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

        // scheduler.init((events), new Date(2024, 5, 11), "map");

        // Scheduler map view API key
        scheduler.config.map_settings.accessToken =
          "AIzaSyAOXA_S8oo49DSr9CduSTDFjLSE7rO1KqU";
        // "AIzaSyBVpjUB1Fvop_OWa9OzefIs7LP5gAisWq4"; // developer purpose only
        // "AIzaSyAOXA_S8oo49DSr9CduSTDFjLSE7rO1KqU"; live api key
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
      <div className="controls w-full justify-center items-center flex gap-4">
        <div className="controls_buttons export-btn">
          <input
            type="button"
            value="Export to PDF"
            name="pdf"
            className="bg-[#537cfa] text-white hover:bg-[#4269e0] cursor-pointer "
          />
          <input
            type="button"
            value="Export to PNG"
            name="png"
            className="bg-[#537cfa] text-white hover:bg-[#4269e0] cursor-pointer "
          />
        </div>
        <label className="flex items-center gap-3">
          <div className="flex gap-2 items-center">
            Light
            <div className="styled_checkbox">
              <input
                name="padding-toggle"
                type="checkbox"
                onChange={() => setToggle(!toggle)}
              />
              <div className="styled_checkbox_button"></div>
            </div>{" "}
            Dark
          </div>
        </label>
      </div>
      <div
        ref={schedulerContainer}
        className="min-h-[93vh] min-w-[90%] dhx_cal_container"
      >
        <div className="dhx_cal_navline">
          <div className="dhx_cal_tab" data-tab="map"></div>
        </div>
      </div>
    </div>
  );
};

export default Scheduler;
