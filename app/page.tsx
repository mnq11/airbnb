import ClientOnly from "./components/ClientOnly";
import HomeWithPagination from './HomeWithPagination';
import { IListingsParams } from "@/app/actions/getListings";

interface HomeProps {
    searchParams: IListingsParams;
}

const Home: React.FC<HomeProps> = ({ searchParams }) => {
    return (
        <ClientOnly>
            <HomeWithPagination searchParams={searchParams} />
        </ClientOnly>
    );
};

export default Home;
