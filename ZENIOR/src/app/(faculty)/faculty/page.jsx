import AuthGuard from "@/components/AuthGuard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


const FacultyPage = () => {
  return (
    <AuthGuard requiredRole="faculty">
      <div className="p-6 bg-gray-100 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">Faculty Portal</h1>
        <h2 className="text-3x1 font-bold mb-4">Welcome to Zenior!</h2>
        <p>Access your advised projects, advise students, and view Senior Design proposals.</p>

        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

        <h3 className="text-3x1 font-bold mb-4"> GET STARTED: </h3>
        <p> 
            Click on your avatar in the right-hand corner, and head over to <b>My Profile </b>  
            to fill in your department, bio, research interests, and expertise areas. 
        </p>
        <p>   
            This helps students find a relevant advisor for their project!  
        </p>

        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

        <h3 className="text-3x1 font-bold mb-4"> Navigating Zenior: </h3>
        <Accordion type="single" collapsible>
        <AccordionItem value="item-1"> 
        <AccordionTrigger className="italic"> Projects </AccordionTrigger>
          <AccordionContent className="pl-5">
            This tab features: 
            <ul className="list-disc pl-10">
            <li> <b> Project Proposals: </b>a list of all the projects proposed by students and faculty</li>
            <li> <b> A Proposal Form: </b>add your own project proposal to the list</li>
            <li> <b> Filters: </b> filter by department, interdisciplinary, whether the team is open, and whether an advisor is already part of the project</li>
            </ul>
          </AccordionContent>
        </AccordionItem>  
        <AccordionItem value="item-2"> 
        <AccordionTrigger className="italic"> Requests </AccordionTrigger>
          <AccordionContent className="pl-5">
            This tab features: 
            <ul className="list-disc pl-10">
            <li> <b> Project Advisor Requests: </b>a list of all the projects you've been requested to advise for in one place</li>
            <li> <b> Project Overview: </b>each project includes the title and description </li>
            <li> <b> Manage: </b> shows project member names with an option to advise or not advise the project</li>
            </ul>
          </AccordionContent>
        </AccordionItem> 
        </Accordion>
      </div>
    </AuthGuard>
  );
};

export default FacultyPage;
