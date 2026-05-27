import { UserEditView } from "@/src/components/users/view-edit";

type Props = {
    params: { id: string };
};
const UserEditPage = ({ params }: Props) => {
    const { id } = params;
    return <UserEditView id={id} />;
};

export default UserEditPage;