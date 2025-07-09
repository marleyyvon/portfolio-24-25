import AuthGuard from "@/components/AuthGuard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Chart from "./chart";

const AdminPage = () => {
  return (
    <AuthGuard requiredRole="admin">
      <main className="items-start bg-gray-100">
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center">Admin Dashboard</h1>
          <Chart />
          <Accordion type="single" collapsible>
            <AccordionItem value="documentation">
              <AccordionTrigger className="italic">Documentation</AccordionTrigger>
              <AccordionContent className="pl-5">
                <Accordion type="single" collapsible>
                  <AccordionItem value="setup">
                    <AccordionTrigger className="italic">Setup</AccordionTrigger>
                    <AccordionContent className="pl-5">
                      Click on your avatar in the right-hand corner, and head over to <b>My Profile</b> to fill in your information.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="information">
                    <AccordionTrigger className="italic">Information</AccordionTrigger>
                    <AccordionContent className="pl-5">
                      Guides and resources to understand how to use the admin portal effectively.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="actions">
              <AccordionTrigger className="italic">Actions</AccordionTrigger>
              <AccordionContent className="pl-5">
                Perform admin tasks such as managing projects or reviewing user activities.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="projects">
              <AccordionTrigger className="italic">Projects</AccordionTrigger>
              <AccordionContent className="pl-5">
                View, filter, and manage student projects in the system.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="view-logs">
              <AccordionTrigger className="italic">Logs</AccordionTrigger>
              <AccordionContent className="pl-5">
                Review activity logs, including recent project updates and admin actions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="help">
              <AccordionTrigger className="italic">Help</AccordionTrigger>
              <AccordionContent className="pl-5">
                Need assistance? Contact a super admin.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
    </AuthGuard>
  );
};

export default AdminPage;
