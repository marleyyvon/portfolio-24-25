import AuthGuard from "@/components/AuthGuard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";

const SuperAdminPage = () => {
  return (
    <AuthGuard requiredRole="super_admin">
      <main className="items-start bg-gray-100">
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center">Super Admin Dashboard</h1>
          <Accordion type="single" collapsible>
            <AccordionItem value="documentation">
              <AccordionTrigger className="italic">Documentation</AccordionTrigger>
              <AccordionContent className="pl-5">
                <Accordion type="single" collapsible>
                  <AccordionItem value="getting-started">
                    <AccordionTrigger className="italic">Getting Started</AccordionTrigger>
                    <AccordionContent className="pl-5">
                    Coming soon.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="information">
                    <AccordionTrigger className="italic">Information</AccordionTrigger>
                    <AccordionContent className="pl-5">
                    Coming soon.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="troubleshooting">
                    <AccordionTrigger className="italic">Troubleshooting</AccordionTrigger>
                    <AccordionContent className="pl-5">
                    Coming soon.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="resources">
                    <AccordionTrigger className="italic">Resources</AccordionTrigger>
                    <AccordionContent className="pl-5">
                      Coming soon.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="actions">
              <AccordionTrigger className="italic">Actions</AccordionTrigger>
              <AccordionContent className="pl-5">
                <Accordion type="single" collapsible>
                  <AccordionItem value="manage-admins">
                    <AccordionTrigger className="italic">Manage Admins</AccordionTrigger>
                    <AccordionContent className="pl-5">
                      Coming soon.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="manage-users">
                    <AccordionTrigger className="italic">Manage Users</AccordionTrigger>
                    <AccordionContent className="pl-5">
                      Coming soon.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="manage-content">
                    <AccordionTrigger className="italic">Manage Content</AccordionTrigger>
                    <AccordionContent className="pl-5">
                      Coming soon.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="statistics">
              <AccordionTrigger className="italic">Statistics</AccordionTrigger>
              <AccordionContent className="pl-5">
                View detailed reports and analytics for the entire system.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="logs">
              <AccordionTrigger className="italic">Logs</AccordionTrigger>
              <AccordionContent className="pl-5">
                System Logs
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="settings">
              <AccordionTrigger className="italic">Settings and Configuration</AccordionTrigger>
              <AccordionContent className="pl-5">
                <Accordion type="single" collapsible>
                  <AccordionItem value="application-settings">
                    <AccordionTrigger className="italic">Application Settings</AccordionTrigger>
                    <AccordionContent className="pl-5">
                      Manage application-specific settings and preferences.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="configurations">
                    <AccordionTrigger className="italic">Configurations</AccordionTrigger>
                    <AccordionContent className="pl-5">
                      Configure system-wide parameters and rules.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="software">
                    <AccordionTrigger className="italic">Software</AccordionTrigger>
                    <AccordionContent className="pl-5">
                      Renew your organizations auto subscriptiion here!
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="help">
              <AccordionTrigger className="italic">Help</AccordionTrigger>
              <AccordionContent className="pl-5">
                <Accordion type="single" collapsible>
                  <AccordionItem value="faq">
                    <AccordionTrigger className="italic">FAQ</AccordionTrigger>
                    <AccordionContent className="pl-5">
                      Coming soon.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="contact">
                    <AccordionTrigger className="italic">Contact</AccordionTrigger>
                    <AccordionContent className="pl-5">
                      <a
                        href="https://github.com/CSEN-SCU/csen-174-f24-project-zenior"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:text-[#9e1b32] hover:border-[#9e1b32] transition-colors"
                        >
                          <FaGithub className="text-xl" />
                        </Button>
                      </a>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
    </AuthGuard>
  );
};

export default SuperAdminPage;