import { Header } from "@/components/common/Header";
import { EditCurrency } from "@/components/currencys/EditCurrency";

type EditCurrencyPageProps = {
    params: { id: string };
};

export default function Page({ params }: EditCurrencyPageProps) {
    return (
        <div>
            <Header />
            <EditCurrency params={params} />
        </div>
    );
}
