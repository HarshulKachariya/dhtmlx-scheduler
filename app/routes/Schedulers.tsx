import React, { useEffect, useRef } from "react";
import "dhtmlx-scheduler/codebase/dhtmlxscheduler.css";
import "../assets/scheduler.css";
import { events } from "../lib/data";

const Scheduler: React.FC = () => {
  const schedulerContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // initialize the Scheduler
    const loadScheduler = async () => {
      const scheduler: any = (await import("dhtmlx-scheduler")).default;

      // if have a current ref then load the scheduler
      if (schedulerContainer.current) {
        scheduler.init(schedulerContainer.current, new Date(), "week");
        scheduler.load(events);

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
          "export",
          "date",
          "prev",
          "today",
          "next",
        ];

        // Load the event data
        scheduler.parse(events, "json");

        // Ensure the custom form block is defined before being used in lightbox sections
        scheduler.form_blocks["crew_schedule"] = {
          render: function (sns: any) {
            return `<div class="dhx_cal_ltext" style="height: 400px;">
              <div class="form-group">
                <label for="project">Project *</label>
                <select id="project" name="project">
                  <option value="1" defaultValue>Project 1</option>
                  <option value="2">Project 2</option>
                  <option value="3">Project 3</option>
                  <option value="4">Project 4</option>
                  <option value="5">Project 5</option>
                </select>
              </div>
              <div class="form-group">
                <label for="location">Location</label>
                <input type="text" id="location" name="location">
              </div>
              <div class="form-group">
                <label for="description">Description</label>
                <textarea id="description" name="description"></textarea>
              </div>
              <div class="form-group">
                <label>
                  <input type="checkbox" id="selectAll" name="selectAll">
                  Select All
                </label>
              </div>
              <div class="form-group">
                <label>
                  <input type="checkbox" id="linkTasks" name="linkTasks">
                  Link Tasks
                </label>
                <p class="hint">When tasks are linked, changing the task for one employee will apply the same change to the other linked employees. Unlink a task if individual changes are necessary.</p>
              </div>
            </div>`;
          },
          set_value: function (node: HTMLElement, value: any, ev: any) {
            node.querySelector<HTMLSelectElement>("#project")!.value =
              value?.project || "1"; // Default to "1" if no project is set
            node.querySelector<HTMLInputElement>("#location")!.value =
              value?.location || "";
            node.querySelector<HTMLTextAreaElement>("#description")!.value =
              value?.description || "";
            node.querySelector<HTMLInputElement>("#selectAll")!.checked =
              value?.selectAll || false;
            node.querySelector<HTMLInputElement>("#linkTasks")!.checked =
              value?.linkTasks || false;
          },
          get_value: function (node: HTMLElement, ev: any) {
            const project =
              node.querySelector<HTMLSelectElement>("#project")!.value || "1";
            const location =
              node.querySelector<HTMLInputElement>("#location")!.value;
            const description =
              node.querySelector<HTMLTextAreaElement>("#description")!.value;
            const selectAll =
              node.querySelector<HTMLInputElement>("#selectAll")!.checked;
            const linkTasks =
              node.querySelector<HTMLInputElement>("#linkTasks")!.checked;

            const text = `Project ${project} - ${location || "No Location"}`;
            return {
              project,
              location,
              description,
              selectAll,
              linkTasks,
              text,
            };
          },
        };

        // Custom form - mapping sections to event properties
        scheduler.config.lightbox.sections = [
          {
            name: "Crew Schedule",
            map_to: "crew_schedule", // Map to the correct form block name
            type: "crew_schedule",
            focus: true,
          },
          { name: "time", height: 72, type: "time", map_to: "auto" },
        ];

        scheduler.templates.lightbox_header = (start: Date, end: Date) => {
          return `${start} - ${end} Crew Schedule`;
        };

        scheduler.attachEvent("onEventAdded", (id: string, ev: any) => {
          document
            .querySelector(".add_event_button")
            ?.addEventListener("click", () => {
              console.log("click new event form");
              scheduler.addEventNow(id, ev.text);
              scheduler.showLightbox(id);
            });
          console.log("New event added:", ev);
          scheduler.updateEvent(id);
        });

        scheduler.attachEvent("onEventChanged", (id: string, ev: any) => {
          scheduler.addEventNow();
          console.log("Event updated:", ev);
          scheduler.updateEvent(id);
        });

        // show custome message or buttons
        const add_event_button = document.querySelector(".add_event_button");
        add_event_button?.addEventListener("click", () =>
          scheduler.message({
            type: "sucess",
            text: "Click on addd button.",
          })
        );

        scheduler.attachEvent("onLightbox", function (id: string) {
          const saveButton = document.querySelector(".dhx_save_btn_set");
          if (saveButton) {
            saveButton.textContent = "Save";
          }
          saveButton?.addEventListener("click", () => scheduler.addEvent(id));
        });

        scheduler.attachEvent("onLightboxCancel", function (id: string) {
          if (id && scheduler._new_event) {
            scheduler.deleteEvent(id);
          }
          return true;
        });

        scheduler.plugins({
          quick_info: true,
        });

        scheduler.attachEvent(
          "onEventSave",
          function (id: any, ev: any, is_new: any) {
            if (!ev.project) {
              scheduler.message({
                type: "error",
                text: "Please select a project.",
              });
              return false;
            }
            ev.text = `${ev?.project} - ${ev?.location || "No Location"}`;
            return true;
          }
        );

        // Export pdf and png
        scheduler.plugins({
          export_api: true,
        });

        function exportScheduler(type: string) {
          const format = (
            document.getElementById("format") as HTMLSelectElement
          )?.value;
          const orient = (
            document.getElementById("orient") as HTMLSelectElement
          )?.value;
          const zoom = (document.getElementById("zoom") as HTMLSelectElement)
            ?.value;

          if (type === "pdf")
            scheduler.exportToPDF({
              format: format,
              orientation: orient,
              zoom: Number(zoom),
            });
          else
            scheduler.exportToPNG({
              format: format,
              orientation: orient,
              zoom: Number(zoom),
            });
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

        // scheduler.plugins({
        //   map_view: true,
        // });

        // scheduler.locale.labels.map_tab = "Map";
        // scheduler.locale.labels.section_location = "Location";

        // scheduler.config.map_view_provider = "googleMap";

        // scheduler.config.map_settings = {
        //   initial_position: {
        //     lat: 48.724,
        //     lng: 8.215,
        //   },
        //   error_position: {
        //     lat: 15,
        //     lng: 15,
        //   },
        //   initial_zoom: 1,
        //   zoom_after_resolve: 15,
        //   info_window_max_width: 300,
        //   resolve_user_location: true,
        //   resolve_event_location: true,
        //   view_provider: "googleMap",
        // };

        // // updating dates to display on before view change

        // scheduler.attachEvent(
        //   "onBeforeViewChange",
        //   function (
        //     old_mode: any,
        //     old_date: any,
        //     new_mode: any,
        //     new_date: any
        //   ) {
        //     scheduler.config.map_start = scheduler.date.month_start(
        //       new Date((new_date || old_date).valueOf())
        //     );
        //     scheduler.config.map_end = scheduler.date.add(
        //       scheduler.config.map_start,
        //       1,
        //       "month"
        //     );
        //     return true;
        //   }
        // );

        // // scheduler.init((events), new Date(2024, 5, 11), "map");

        // // Scheduler map view API key
        // scheduler.config.map_settings.accessToken =
        //   "AIzaSyBVpjUB1Fvop_OWa9OzefIs7LP5gAisWq4"; // developer purpose only
        // // "AIzaSyAOXA_S8oo49DSr9CduSTDFjLSE7rO1KqU"; live api key
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
      <div ref={schedulerContainer} className="min-h-[78vh] min-w-[90%] ">
        <div className="dhx_cal_navline">
          <div className="dhx_cal_tab" data-tab="map"></div>
        </div>
      </div>
      <div className="add_event_button" data-tooltip="Create new event">
        <span></span>
      </div>
    </div>
  );
};

export default Scheduler;
