import React, { useEffect, useRef } from "react";
import "dhtmlx-scheduler/codebase/dhtmlxscheduler.css";
import "../assets/scheduler.css";

const Scheduler: React.FC = () => {
  const schedulerContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadScheduler = async () => {
      const scheduler: any = (await import("dhtmlx-scheduler")).default;

      if (schedulerContainer.current) {
        scheduler.init(schedulerContainer.current, new Date(), "week");

        scheduler.parse(
          [
            {
              id: 1,
              classname: "blue",
              start_date: "2024-08-15 02:00",
              end_date: "2024-08-15 10:20",
              text: "Product Strategy Hike",
            },
            {
              id: 2,
              classname: "blue",
              start_date: "2024-08-15 12:00",
              end_date: "2024-08-15 16:00",
              text: "Agile Meditation and Release",
            },
            {
              id: 3,
              classname: "violet",
              start_date: "2024-08-16 06:00",
              end_date: "2024-08-16 11:00",
              text: "Tranquil Tea Time",
            },
            {
              id: 4,
              classname: "green",
              start_date: "2024-08-16 11:30",
              end_date: "2024-08-16 19:00",
              text: "Sprint Review and Retreat",
            },
            {
              id: 5,
              classname: "violet",
              start_date: "2024-08-17 01:00",
              end_date: "2024-08-17 03:00",
              text: "Kayaking Workshop",
            },
            {
              id: 6,
              classname: "yellow",
              start_date: "2024-08-17 06:00",
              end_date: "2024-08-17 08:00",
              text: "Stakeholder Sunset Yoga Session",
            },
            {
              id: 7,
              classname: "green",
              start_date: "2024-08-17 07:00",
              end_date: "2024-08-17 12:00",
              text: "Roadmap Alignment Walk",
            },
            {
              id: 8,
              classname: "violet",
              start_date: "2024-08-17 13:00",
              end_date: "2024-08-17 18:00",
              text: "Mindful Team Building",
            },
            {
              id: 9,
              classname: "blue",
              start_date: "2024-08-18 01:00",
              end_date: "2024-08-18 18:00",
              text: "Cross-Functional Expedition",
            },
            {
              id: 10,
              classname: "yellow",
              start_date: "2024-08-18 14:00",
              end_date: "2024-08-18 20:00",
              text: "User Feedback Picnic",
            },
            {
              id: 11,
              classname: "blue",
              start_date: "2024-08-19 03:00",
              end_date: "2024-08-19 08:00",
              text: "Demo and Showcase",
            },
            {
              id: 12,
              classname: "yellow",
              start_date: "2024-08-19 11:00",
              end_date: "2024-08-19 17:00",
              text: "Quality Assurance Spa Day",
            },
            {
              id: 13,
              classname: "violet",
              start_date: "2024-08-20 01:00",
              end_date: "2024-08-20 03:00",
              text: "Motion Cycling Adventure",
            },
            {
              id: 14,
              classname: "blue",
              start_date: "2024-08-20 10:00",
              end_date: "2024-08-20 16:00",
              text: "Competitor Analysis Beach Day",
            },
            {
              id: 15,
              classname: "blue",
              start_date: "2024-08-21 02:00",
              end_date: "2024-08-21 06:00",
              text: "Creativity Painting Retreat",
            },
          ],
          "json"
        );

        // Custom form

        scheduler.templates.lightbox_header = (
          start: any,
          end: any,
          event: any
        ) => {
          return "Crew Schedule";
        };

        scheduler.form_blocks["my_form"] = {
          render: function (sns: any) {
            console.log("sns", sns);
            return `<div class="dhx_cal_ltext" style="height: 400px;">
              <div class="form-group">
                <label for="project">Project *</label>
                <select id="project" name="project">
                  <option value="">Select Project</option>
                  <option value="1">Project 1</option>
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
          set_value: function (node: any, value: any, ev: any) {
            console.log("Setting form values:", ev);
            node.querySelector("#project").value = value.project || "";
            node.querySelector("#location").value = value.location || "";
            node.querySelector("#description").value = value.description || "";
            node.querySelector("#selectAll").checked = value.selectAll || false;
            node.querySelector("#linkTasks").checked = value.linkTasks || false;
          },
          get_value: function (node: any, ev: any) {
            ev.project = node.querySelector("#project").value || "";
            ev.location = node.querySelector("#location").value || "";
            ev.description = node.querySelector("#description").value || "";
            ev.selectAll = node.querySelector("#selectAll").checked || false;
            ev.linkTasks = node.querySelector("#linkTasks").checked || false;
            ev.text = ev.project || "Unnamed Event";

            return {
              project: ev.project,
              location: ev.location,
              description: ev.description,
              selectAll: ev.selectAll,
              linkTasks: ev.linkTasks,
              text: ev.text,
            };
          },
        };

        scheduler.config.lightbox.sections = [
          {
            name: "",
            map_to: "my_form",
            type: "my_form",
            focus: true,
          },
          { name: "time", height: 72, type: "time", map_to: "auto" },
        ];

        scheduler.attachEvent("onEventAdded", (id: any, ev: any) => {
          console.log("New event added:", ev);
          console.log("New event added:", id);
          scheduler.updateEvent(id);
        });

        scheduler.attachEvent("onEventChanged", (id: any, ev: any) => {
          console.log("Event updated:", ev);
          scheduler.updateEvent(id);
        });

        function exportScheduler(type: any) {
          var format = document?.getElementById("format")?.value;
          var orient = document?.getElementById("orient")?.value;
          var zoom = document?.getElementById("zoom")?.value;

          if (type == "pdf")
            scheduler.exportToPDF({
              format: format,
              orientation: orient,
              zoom: zoom,
            });
          else
            scheduler.exportToPNG({
              format: format,
              orientation: orient,
              zoom: zoom,
            });
        }

        scheduler.plugins({
          export_api: true,
        });

        scheduler.event(
          document.querySelector(".controls [name='pdf']"),
          "click",
          function () {
            exportScheduler("pdf");
          }
        );
        scheduler.event(
          document.querySelector(".controls [name='png']"),
          "click",
          function () {
            exportScheduler("png");
          }
        );
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
      <div ref={schedulerContainer} className="min-h-[78vh] min-w-[90%] "></div>
      <div className="add_event_button" data-tooltip="Create new event">
        <span></span>
      </div>
    </div>
  );
};

export default Scheduler;
