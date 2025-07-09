"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
} from "@/components/ui/sidebar";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { Filter } from "lucide-react";
import { ArrowDownAZ } from "lucide-react";
import { ArrowDownZA } from "lucide-react";

//grouped filters
const categories = [
  {
    category: "Department",
    type: "checkbox",
    options: [
      { id: 1, label: "Bioengineering" },
      { id: 2, label: "Civil, Environmental and Sustainable Engineering" },
      { id: 3, label: "Computer Science and Engineering" },
      { id: 4, label: "Electrical and Computer Engineering" },
      { id: 5, label: "General Engineering" },
      { id: 6, label: "Mechanical Engineering" },
    ],
  },
  {
    category: "Has Project Proposal?",
    type: "radio",
    options: [
      { id: 7, label: "Yes" },
      { id: 8, label: "No" },
    ],
  },
  {
    category: "Sort by Last Name",
    type: "radio",
    options: [
      { id: 9, label: <ArrowDownAZ /> },
      { id: 10, label: <ArrowDownZA /> },
    ],
  },
];

export function DirectorySidebar() {
  /*state initialization: 
    initialize selectedItems as an empty array which will store the IDs of selection options
    setSelectedItems updates selectedItems array */
  const [selectedItems, setSelectedItems] = useState([]);
  const [radioSelections, setRadioSelections] = useState({
    "Has Project Proposal?": null,
  });

  const handleCheckboxChange = (id) => {
    //if id is unchecked, add it to the array
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleRadioChange = (category, id) => {
    setRadioSelections((prev) => ({ ...prev, [category]: id }));
  };

  const resetFilters = () => {
    setSelectedItems([]);
    setRadioSelections({
      "Has Project Proposal?": null,
      "Sort by Last Name": null,
    });
  };

  return (
    <Sidebar variant="floating" collapsible="none">
      <SidebarHeader />
      <SidebarContent>
        <div className="p-4">
          <div className="flex flex-row items-center">
            <h2 className="font-semibold text-lg pr-4">Filter</h2>
            <Filter size="15" />
          </div>

          <button onClick={resetFilters} className="pb-4">
            <span className="text-xs underline text-[#b30738]">
              Reset Filters
            </span>
          </button>
          {categories.map((category) => (
            <SidebarGroup key={category.category} className="mb-6 p-1">
              <h3 className="font-medium text-sm mb-2">{category.category}</h3>
              {category.type === "checkbox" ? (
                <ul>
                  {category.options.map((option) => (
                    <li key={option.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`checkbox-${option.id}`}
                        checked={selectedItems.includes(option.id)}
                        onChange={() => handleCheckboxChange(option.id)}
                        className="mr-2"
                        style={{ accentColor: "#b30738" }}
                      />
                      <label
                        htmlFor={`checkbox-${option.id}`}
                        className="text-xs"
                      >
                        {option.label}
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <RadioGroup
                  value={radioSelections[category.category]}
                  onValueChange={(id) =>
                    handleRadioChange(category.category, id)
                  }
                  className="flex space-x-4"
                >
                  {category.options.map((option) => (
                    <li key={option.id} className="flex items-center mb-2">
                      <RadioGroupItem
                        id={`radio-${option.id}`}
                        value={option.id}
                        checked={
                          radioSelections[category.category] === option.id
                        }
                        className="mr-2 ring-2 ring-slate-950"
                        style={{ transform: "scale(0.5)" }}
                      />

                      <label htmlFor={`radio-${option.id}`} className="text-xs">
                        {option.label}
                      </label>
                    </li>
                  ))}
                </RadioGroup>
              )}
            </SidebarGroup>
          ))}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
