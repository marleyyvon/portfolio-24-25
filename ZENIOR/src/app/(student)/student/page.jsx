import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const StudentHome = () => (
  <div className="p-6 bg-gray-100 rounded-lg shadow-md">
    <h1 className="text-3xl font-bold mb-4">Student Portal</h1>
    <h2 className="text-3x1 font-bold mb-4">Welcome to Zenior!</h2>
    <p> Find Senior Design proposals, join a Senior Design team, 
        find an advisor, and keep on track with Senior Design. 
    </p>

    <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

    <h3 className="text-3x1 font-bold mb-4"> GET STARTED: </h3>
    <p> 
        Click on your avatar in the right-hand corner, and head over to <b>My Profile </b>  
        to fill in your major, minor, and skills. 
    </p>
    <p>   
        This helps other students and advisors 
        in seeing whether your skills could align with a project!
    </p>

    <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

    <h3 className="text-3x1 font-bold mb-4"> Navigating Zenior: </h3>
     <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="italic">My Team</AccordionTrigger>
        <AccordionContent className="pl-5 mb-2">
          Found under your avatar, it provides an overview for your Senior Design! 
          Under this tab you can find: 
          <ul className="list-disc pl-10">
            <li className="mb-2"> <b> Group Requests </b> which show all projects you've requested to join
            and the status of each request.</li>
            <li className="mb-2"> <b> New Requests </b> which show all team member requests on your proposed project.</li>
            <li className="mb-2"> <b> Shortcuts</b> to the proposal project form, project proposals, past projects, and faculty advisors. </li>
            <li className="mb-2"> <b> Editable Project Proposal Form(s)</b> that populate if you submit a project proposal form. </li>
            <li className="mb-2"> <b> A Progress Checklist</b> that includes the main tasks that need to be completed 
                      to confirm your Senior Design Project.</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2"> 
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
      <AccordionItem value="item-3"> 
        <AccordionTrigger className="italic"> Directory </AccordionTrigger>
        <AccordionContent className="pl-5">
          This tab features: 
          <ul className="list-disc pl-10">
            <li> <b> Advisors: </b>a list of all the advisors with information about their research interests, expertise areas, and the projects they are advising</li>
            <li> <b> Filters: </b> filter by department, whether they have a project proposal, and alphebatically by last name</li>
          </ul>
        </AccordionContent>
      </AccordionItem>  
      <AccordionItem value="item-4"> 
        <AccordionTrigger className="italic"> Archive </AccordionTrigger>
        <AccordionContent className="pl-5">
          This tab features: 
          <ul className="list-disc pl-10">
            <li> <b> Past Senior Design Theses: </b>a list of relevant theses to help students see past ideas</li>          
          </ul>
        </AccordionContent>
      </AccordionItem>     
    </Accordion>
  </div>
);

export default StudentHome;
