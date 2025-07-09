"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

const Checklist = () => {
  // Checklist items
  const [items, setItems] = React.useState([
    { label: "Project Title Approved?", checked: false },
    { label: "Project Description Approved?", checked: false },
    { label: "Team Members Finalized?", checked: false },
    { label: "Advisor Secured?", checked: false },
  ]);

  React.useEffect(() => {
    const storedItems = localStorage.getItem("zenior-checklist-items");
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  // Calculate progress
  const completedCount = items.filter((item) => item.checked).length;
  const progress = (completedCount / items.length) * 100;

  // Toggle between unchecked and checked
  const handleToggle = (index) => {
    const updatedItems = [...items];
    updatedItems[index].checked = !updatedItems[index].checked;
    localStorage.setItem(
      "zenior-checklist-items",
      JSON.stringify(updatedItems),
    );
    setItems(updatedItems);
  };

  return (
    <div className="border-solid hidden sm:block border-4 bg-gray-40 border-spacing-10 max-w-xs p-6 m-6">
      <h1 className="text-lg font-bold">Progress</h1>
      <div className="mt-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <Checkbox
              checked={item.checked}
              onCheckedChange={() => handleToggle(index)}
              id={`checkbox-${index}`}
            />
            <label htmlFor={`checkbox-${index}`} className="text-sm">
              {item.label}
            </label>
          </div>
        ))}
      </div>
      <div className="mt-4 w-full h-4 bg-gray-200 rounded-lg overflow-hidden">
        {/* progress bar from shadcn was being weird so changed it */}
        <div
          style={{ width: `${progress}%` }}
          className="h-full bg-black transition-width duration-300 ease-in-out"
        ></div>
      </div>
      <span className="text-sm">{progress.toFixed(0)}%</span>
    </div>
  );
};

export { Checklist };
