"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "Privacy Policy",
      description:
        "Your privacy is a priority. This policy outlines how we handle your data, including collection, usage, and protection, adhering to the standards of our GPLv3 License.",
    },
    {
      title: "Information We Collect",
      description:
        "We collect personal details like your name, email, and usage data to enhance our services. Collected data is used to improve user experience, address technical issues, and maintain platform functionality. Your data is never shared without your consent.",
    },
    {
      title: "Security",
      description:
        "We use industry-standard security practices to safeguard your personal information against unauthorized access, alteration, or destruction.",
    },
    {
      title: "Additional Information",
      description: (
        <>
          <h3 className="text-lg font-semibold text-black mb-2">
            California Privacy Rights
          </h3>
          <p className="text-gray-700">
            In compliance with the California Consumer Privacy Act (CCPA),
            California residents have the right to request access to their
            personal data, delete it, and know whether their information is
            sold or disclosed. Contact us to exercise these rights.
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
                  <div className="text-lg text-gray-700">
                    {section.description}
                  </div>
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
