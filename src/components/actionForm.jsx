import React from 'react';

export default function EmployeeForm({ handleInputChange, formData }) {
  return (
    <form>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Root Caused
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="rootcaused"
          type="text"
          placeholder="Rootcaused"
          value={formData.rootcaused}
          onChange={handleInputChange}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Countermeasure
        </label>
        <textarea
          id="countermeasure"
          rows="4"
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Write your thoughts here..."
          value={formData.countermeasure}
          onChange={handleInputChange}
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Improvement
        </label>
        <textarea
          id="improvement"
          rows="4"
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Write your thoughts here..."
          value={formData.improvement}
          onChange={handleInputChange}
        ></textarea>
      </div>
    </form>
  );
}
