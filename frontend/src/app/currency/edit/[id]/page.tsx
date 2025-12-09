import { EditCurrency } from "@/components/currencys/EditCurrency";
import NavBar from "@/components/NavBar";

export default function EditCurrencyPage({ params }: { params: { id: string } }) {
    return (
        <div className="min-h-screen bg-[#0B0E11] pt-20">
            <NavBar />
            <EditCurrency id={params.id} />
        </div>
    );
}