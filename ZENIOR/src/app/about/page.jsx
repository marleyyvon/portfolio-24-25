"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  const sections = [
    {
      title: "About Zenior",
      description: (
        <>
          <p>
            Zenior is a comprehensive platform designed to empower rising
            juniors in the School of Engineering as they prepare for their
            senior design projects. Our goal is to streamline project planning
            and foster collaboration between students and faculty.
          </p>
          <h3 className="text-lg font-semibold text-black mt-4 mb-2">
            What Zenior Offers
          </h3>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              Tools to explore, organize, and track senior design project ideas.
            </li>
            <li>
              A bridge between students and faculty, enabling seamless
              collaboration on research topics and project opportunities.
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Platform Features",
      description: (
        <>
          <h3 className="text-lg font-semibold text-black mb-2">
            Key Features
          </h3>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              <strong>Project Planning and Exploration:</strong> Discover and organize
              senior design projects.
            </li>
            <li>
              <strong>Faculty Collaboration:</strong> Faculty can submit research topics and
              project ideas to connect with students.
            </li>
            <li>
              <strong>Resource Management:</strong> Access tools and research papers.
            </li>
            <li>
              <strong>Search and Discover:</strong> Easily browse available projects and
              opportunities.
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Development",
      description: (
        <>
          <p>
            Zenior is proudly developed by a team of engineering students as
            part of the SCU Senior Design Project coursework. The platform
            embodies the spirit of innovation and collaboration encouraged by
            the School of Engineering.
          </p>
          <h3 className="text-lg font-semibold text-black mt-4 mb-2">
            GitHub Repository
          </h3>
          <p className="text-gray-700">
            Explore the project’s codebase and development progress on our{" "}
            <a
              href="https://github.com/CSEN-SCU/csen-174-f24-project-zenior"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9e1b32] underline hover:text-black"
            >
              GitHub Repository
            </a>
            .
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="container mx-auto text-gray-800">
      <Carousel className="w-full max-w-sm mx-auto">
        <CarouselContent>
          {sections.map((section, index) => (
            <CarouselItem key={index}>
              <Card className="border shadow-md max-w-sm mx-auto">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-[#9e1b32] mb-4">
                    {section.title}
                  </h2>
                  <div className="text-lg text-gray-700">{section.description}</div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
