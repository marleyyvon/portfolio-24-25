"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
} from "@/components/ui/sidebar";

import { PropTypes } from "prop-types";
import { Filter } from "lucide-react";

//grouped filters
const categories = [
  {
    category: "Department",
    type: "checkbox",
    options: [
      { label: "Bioengineering" },
      { label: "Biomedical Engineering and Bioengineering" },
      { label: "Civil, Environmental and Sustainable Engineering" },
      { label: "Civil and Environmental Engineering" },
      { label: "Computer Engineering" },
      { label: "Computer Science and Engineering" },
      { label: "Electrical and Computer Engineering" },
      { label: "General Engineering" },
      { label: "Mechanical Engineering" },
    ],
  },
];

ArchiveSidebar.propTypes = {
  departments: PropTypes.any.isRequired,
  setSelectedItems: PropTypes.any.isRequired,
};

export function ArchiveSidebar(props) {
  const handleCheckboxChange = (label) => {
    //if label is unchecked, add it to the array
    props.setSelectedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  };

  const resetFilters = () => {
    props.setSelectedItems([]);
  };

  return (
    <Sidebar variant="floating" collapsible="none">
      <SidebarHeader />
      <SidebarContent>
        <div className="p-4">
          <div className="flex flex-row items-center">
            <h2 className="pr-4 text-lg font-semibold">Filter</h2>
            <Filter size="15" />
          </div>

          <button onClick={resetFilters} className="pb-4">
            <span className="text-xs underline text-[#b30738]">
              Reset Filters
            </span>
          </button>
          {categories.map((category) => (
            <SidebarGroup key={category.category} className="p-1 mb-6">
              <h3 className="mb-2 text-sm font-medium">{category.category}</h3>
              <ul>
                {category.options.map((option) => (
                  <li key={option.label} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`checkbox-${option.label}`}
                      checked={props.departments.includes(option.label)}
                      onChange={() => handleCheckboxChange(option.label)}
                      className="mr-2"
                      style={{ accentColor: "#b30738" }}
                    />
                    <label
                      htmlFor={`checkbox-${option.label}`}
                      className="text-xs"
                    >
                      {option.label}
                    </label>
                  </li>
                ))}
              </ul>
            </SidebarGroup>
          ))}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
