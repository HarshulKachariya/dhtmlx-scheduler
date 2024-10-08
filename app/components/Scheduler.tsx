// live

import React, { useEffect, useRef } from "react";
import "dhtmlx-scheduler/codebase/dhtmlxscheduler.css";
import "../assets/scheduler.css";
import { events } from "../lib/data";

const Scheduler: React.FC = () => {
  const schedulerContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadScheduler = async () => {
      const scheduler: any = (await import("dhtmlx-scheduler")).default;

      if (schedulerContainer.current) {
        scheduler.config.lightbox.sections = [
          {
            name: "description",
            height: 130,
            map_to: "text",
            type: "textarea",
            focus: true,
          },
          { name: "time", height: 72, type: "time", map_to: "auto" },
        ];

        scheduler.attachEvent("onEventAdded", (id, ev) => {
          console.log("New event added:", ev);

          scheduler.updateEvent("create", id, ev.text);
        });

        scheduler.attachEvent("onEventChanged", (id, ev) => {
          console.log("Event updated:", ev);
          scheduler.updateEvent("update", id, ev.text);
        });

        scheduler.attachEvent("onLightbox", (id) => {
          const ev = scheduler.getEvent(id);
          if (!ev.text) {
            ev.text = "New Event";
          }
        });

        scheduler.attachEvent("onEventSave", (id, ev, is_new) => {
          if (!ev.text) {
            scheduler.alertPopup("Event text is required");
            return false;
          }
          return true;
        });

        scheduler.attachEvent("onLightboxCancel", (id) => {
          if (scheduler._new_event) {
            scheduler.deleteEvent(id);
          }
        });

        // Load initial events

        // Export functionality
        scheduler.plugins({ export_api: true });

        const exportScheduler = (type: string) => {
          const format = (
            document.getElementById("format") as HTMLSelectElement
          ).value;
          const orient = (
            document.getElementById("orient") as HTMLSelectElement
          ).value;
          const zoom = (document.getElementById("zoom") as HTMLSelectElement)
            .value;

          if (type === "pdf") {
            scheduler.exportToPDF({
              format,
              orientation: orient,
              zoom: Number(zoom),
            });
          } else {
            scheduler.exportToPNG({
              format,
              orientation: orient,
              zoom: Number(zoom),
            });
          }
        };

        document
          .querySelector(".controls [name='pdf']")
          ?.addEventListener("click", () => exportScheduler("pdf"));
        document
          .querySelector(".controls [name='png']")
          ?.addEventListener("click", () => exportScheduler("png"));

        scheduler.init(schedulerContainer.current, new Date(), "week");

        scheduler.parse(events, "json");
        console.log("events ==========>>>>>>>>>>>>>", events);
      }
    };

    loadScheduler();

    return () => {
      import("dhtmlx-scheduler").then((module) => module.default.clearAll());
    };
  }, []);

  return (
    <div>
      <div className="sch_control controls">
        <div className="controls_options">
          <div className="controls_row">
            <label htmlFor="format">Format</label>
            <select id="format" className="bg-gray-200">
              <option>A5</option>
              <option selected>A4</option>
              <option>A3</option>
              <option>A2</option>
              <option>A1</option>
              <option>A0</option>
            </select>
          </div>
          <div className="controls_row">
            <label htmlFor="orient">Orientation</label>
            <select id="orient" className="bg-gray-200">
              <option>portrait</option>
              <option>landscape</option>
            </select>
          </div>
          <div className="controls_row">
            <label htmlFor="zoom">Zoom</label>
            <select id="zoom" className="bg-gray-200">
              <option>0.5</option>
              <option>0.75</option>
              <option selected>1</option>
              <option>1.5</option>
              <option>2</option>
            </select>
          </div>
        </div>
        <div className="controls_buttons export-btn">
          <input
            type="button"
            value="Export to PDF"
            name="pdf"
            className="bg-[#537cfa] text-white hover:bg-[#4269e0] cursor-pointer rounded-md"
          />
          <input
            type="button"
            value="Export to PNG"
            name="png"
            className="bg-[#537cfa] text-white hover:bg-[#4269e0] cursor-pointer rounded-md"
          />
        </div>
      </div>
      <div
        ref={schedulerContainer}
        className="dhx_cal_container"
        style={{ width: "100%", height: "100vh" }}
      ></div>
    </div>
  );
};

export default Scheduler;
