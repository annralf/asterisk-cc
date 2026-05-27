import { SimpleLayout } from "@/src/layouts/simple";

type Props = {
    children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
    return <SimpleLayout>{children}</SimpleLayout>;
};

export default Layout;