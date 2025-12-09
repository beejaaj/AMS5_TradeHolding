import { RegisterCurrency } from "@/components/register/RegisterCurrency";
import NavBar from "@/components/NavBar";

export default function CreateCurrencyPage() {
    return (
        <div className="min-h-screen bg-[#0B0E11] pt-20">
            <NavBar />
            <RegisterCurrency />
        </div>
    );
}