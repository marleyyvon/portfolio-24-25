import styles from "@/styles/profile.module.css";
import AccountForm from "@/components/AccountForm/Form";
import { user, skill } from "@/lib/server/actions";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const NewUserForm = async () => {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/");
  }
  const users = await user.get({ email: session.user.email });
  const allSkills = await skill.get();
  if (!users[0].new) {
    redirect("/");
  }

  return (
    <main className={styles.container}>
      <div className={styles.leftContainer}>
        <div className={styles.formContainer}>
          <AccountForm
            user={users[0]}
            userUpdate={user.update}
            skills={allSkills}
          />
        </div>
      </div>
    </main>
  );
};

export default NewUserForm;
