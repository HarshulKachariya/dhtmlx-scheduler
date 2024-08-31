import React from "react";

const CustomEventForm = ({ event, onSave, onCancel }) => {
  const [formData, setFormData] = React.useState({
    project: "",
    location: "",
    description: "",
    selectAll: false,
    linkTasks: false,
    startTime: "08:00",
    startDate: "",
    endTime: "15:00",
    endDate: "",
  });

  React.useEffect(() => {
    if (event) {
      const startDate = new Date(event.start_date);
      const endDate = new Date(event.end_date);
      setFormData({
        project: event.project || "",
        location: event.location || "",
        description: event.description || "",
        selectAll: event.selectAll || false,
        linkTasks: event.linkTasks || false,
        startTime: startDate.toTimeString().slice(0, 5),
        startDate: startDate.toISOString().slice(0, 10),
        endTime: endDate.toTimeString().slice(0, 5),
        endDate: endDate.toISOString().slice(0, 10),
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Project *
        </label>
        <select
          name="project"
          value={formData.project}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="">Select Project</option>
          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
            <option key={num} value={num}>
              Project {num}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        ></textarea>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="selectAll"
          checked={formData.selectAll}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-900">Select All</label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="linkTasks"
          checked={formData.linkTasks}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-900">Link Tasks</label>
      </div>

      <p className="text-xs text-gray-500">
        When tasks are linked, changing the task for one employee will apply the
        same change to the other linked employees. Unlink a task if individual
        changes are necessary.
      </p>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Time Period
        </label>
        <div className="flex space-x-2 mt-1">
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2"
          />
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2"
          />
          <span className="self-center">to</span>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2"
          />
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>

      {/* <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Save
        </button>
      </div> */}
    </form>
  );
};

export default CustomEventForm;
